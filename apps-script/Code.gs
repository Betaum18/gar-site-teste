/**
 * GAR Site - Google Apps Script API
 *
 * Como implantar:
 * 1. Abra a planilha Google Sheets
 * 2. Clique em Extensões → Apps Script
 * 3. Cole este código e salve
 * 4. Clique em Implantar → Nova implantação
 *    - Tipo: App da Web
 *    - Executar como: Eu
 *    - Quem tem acesso: Qualquer pessoa
 * 5. Copie a URL e adicione ao Vercel como VITE_APPS_SCRIPT_URL
 *
 * Estrutura da planilha (5 abas):
 *   "Membros":     id | name | role | photo_url | display_order | created_at
 *   "Config":      key | value  (username | admin ; password | suasenha)
 *   "Sessions":    token | expires_at | user_type | user_id | user_name
 *   "Usuarios":    id | member_id | member_name | username | password | user_type | created_at
 *   "Ocorrencias": id | member_id | member_name | descricao | photo_url | created_at
 */

var SS = SpreadsheetApp.getActiveSpreadsheet();
var TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 horas

function doGet(e)  { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  var params = e.parameter || {};
  var action = params.action;
  try {
    switch (action) {
      case "getMembers":       return respond(getMembers());
      case "addMember":        return respond(addMember(params));
      case "deleteMember":     return respond(deleteMember(params));
      case "getUsers":         return respond(getUsers(params));
      case "addUser":          return respond(addUser(params));
      case "deleteUser":       return respond(deleteUser(params));
      case "login":            return respond(loginHandler(params));
      case "logout":           return respond(logoutHandler(params));
      case "addOcorrencia":    return respond(addOcorrencia(params));
      case "getOcorrencias":   return respond(getOcorrencias(params));
      case "deleteOcorrencia": return respond(deleteOcorrencia(params));
      default:                 return respond({ error: "Unknown action: " + action });
    }
  } catch (err) {
    return respond({ error: err.message });
  }
}

function respond(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ---- MEMBROS ----

function getMembers() {
  var sheet = SS.getSheetByName("Membros");
  if (sheet.getLastRow() < 2) return { members: [] };
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var members = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    var m = {};
    for (var j = 0; j < headers.length; j++) m[headers[j]] = data[i][j];
    members.push(m);
  }
  members.sort(function (a, b) {
    var od = Number(a.display_order) - Number(b.display_order);
    return od !== 0 ? od : new Date(a.created_at) - new Date(b.created_at);
  });
  return { members: members };
}

function addMember(params) {
  var session = validateToken(params.token);
  if (!session.valid || session.user_type !== "admin") return { error: "Unauthorized" };
  var name      = (params.name      || "").trim();
  var role      = (params.role      || "").trim();
  var photo_url = (params.photo_url || "").trim();
  if (!name || !role) return { error: "name e role são obrigatórios" };
  var sheet = SS.getSheetByName("Membros");
  if (!sheet) return { error: "Aba 'Membros' não encontrada na planilha" };
  var display_order = Math.max(0, sheet.getLastRow() - 1);
  var id  = Utilities.getUuid();
  var now = new Date().toISOString();
  sheet.appendRow([id, name, role, photo_url, display_order, now]);
  return { success: true, member: { id: id, name: name, role: role, photo_url: photo_url, display_order: display_order, created_at: now } };
}

function deleteMember(params) {
  var session = validateToken(params.token);
  if (!session.valid || session.user_type !== "admin") return { error: "Unauthorized" };
  var id = params.id;
  if (!id) return { error: "id é obrigatório" };
  var sheet = SS.getSheetByName("Membros");
  if (!sheet) return { error: "Aba 'Membros' não encontrada na planilha" };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) { sheet.deleteRow(i + 1); return { success: true }; }
  }
  return { error: "Membro não encontrado" };
}

// ---- USUARIOS ----

function getUsers(params) {
  var session = validateToken(params.token);
  if (!session.valid || session.user_type !== "admin") return { error: "Unauthorized" };
  var sheet = SS.getSheetByName("Usuarios");
  if (!sheet || sheet.getLastRow() < 2) return { users: [] };
  var data = sheet.getDataRange().getValues();
  var headers = data[0]; // id | member_id | member_name | username | password | user_type | created_at
  var users = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    var u = {};
    for (var j = 0; j < headers.length; j++) u[headers[j]] = data[i][j];
    delete u.password; // nunca expor senha
    users.push(u);
  }
  return { users: users };
}

function addUser(params) {
  var session = validateToken(params.token);
  if (!session.valid || session.user_type !== "admin") return { error: "Unauthorized" };
  var member_id   = (params.member_id   || "").trim();
  var member_name = (params.member_name || "").trim();
  var username    = (params.username    || "").trim();
  var password    = (params.password    || "").trim();
  if (!member_id || !username || !password) return { error: "member_id, username e password são obrigatórios" };

  var sheet = SS.getSheetByName("Usuarios");
  if (!sheet) return { error: "Aba 'Usuarios' não encontrada na planilha" };
  if (sheet.getLastRow() >= 2) {
    var existing = sheet.getDataRange().getValues();
    for (var i = 1; i < existing.length; i++) {
      if (String(existing[i][3]) === username) return { error: "Username já em uso" };
    }
  }

  var user_type = (params.user_type === "admin") ? "admin" : "member";
  var id  = Utilities.getUuid();
  var now = new Date().toISOString();
  sheet.appendRow([id, member_id, member_name, username, password, user_type, now]);
  return { success: true, user: { id: id, member_id: member_id, member_name: member_name, username: username, user_type: user_type, created_at: now } };
}

function deleteUser(params) {
  var session = validateToken(params.token);
  if (!session.valid || session.user_type !== "admin") return { error: "Unauthorized" };
  var id = params.id;
  if (!id) return { error: "id é obrigatório" };
  var sheet = SS.getSheetByName("Usuarios");
  if (!sheet || sheet.getLastRow() < 2) return { error: "Usuário não encontrado" };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) { sheet.deleteRow(i + 1); return { success: true }; }
  }
  return { error: "Usuário não encontrado" };
}

// ---- OCORRENCIAS ----

function addOcorrencia(params) {
  var session = validateToken(params.token);
  if (!session.valid) return { error: "Unauthorized" };

  var member_id   = session.user_id;
  var member_name = session.user_name;

  // Admin precisa especificar o membro
  if (session.user_type === "admin") {
    member_id   = (params.member_id   || "").trim();
    member_name = (params.member_name || "").trim();
    if (!member_id) return { error: "member_id obrigatório para admin" };
  }

  var descricao = (params.descricao || "").trim();
  var photo_url = (params.photo_url || "").trim();
  if (!descricao) return { error: "descricao é obrigatória" };

  var sheet = SS.getSheetByName("Ocorrencias");
  if (!sheet) return { error: "Aba 'Ocorrencias' não encontrada na planilha" };
  var id  = Utilities.getUuid();
  var now = new Date().toISOString();
  sheet.appendRow([id, member_id, member_name, descricao, photo_url, now]);
  return { success: true, ocorrencia: { id: id, member_id: member_id, member_name: member_name, descricao: descricao, photo_url: photo_url, created_at: now } };
}

function getOcorrencias(params) {
  var sheet = SS.getSheetByName("Ocorrencias");
  if (!sheet || sheet.getLastRow() < 2) return { ocorrencias: [], ranking: [] };

  var month = params.month ? parseInt(params.month) : 0;
  var year  = params.year  ? parseInt(params.year)  : 0;

  var data    = sheet.getDataRange().getValues();
  var headers = data[0]; // id | member_id | member_name | descricao | photo_url | created_at
  var ocorrencias = [];

  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    var o = {};
    for (var j = 0; j < headers.length; j++) o[headers[j]] = data[i][j];
    if (month && year) {
      var rawDate = o.created_at;
      var d = (rawDate instanceof Date) ? rawDate : new Date(String(rawDate));
      if (isNaN(d.getTime())) continue;
      if ((d.getUTCMonth() + 1) !== month || d.getUTCFullYear() !== year) continue;
    }
    ocorrencias.push(o);
  }

  // Contar por membro
  var countMap = {};
  for (var k = 0; k < ocorrencias.length; k++) {
    var oc = ocorrencias[k];
    var key = String(oc.member_id);
    if (!countMap[key]) countMap[key] = { member_id: oc.member_id, member_name: oc.member_name, photo_url: "", count: 0 };
    countMap[key].count++;
  }

  // Enriquecer com foto do membro
  var membrosSheet = SS.getSheetByName("Membros");
  if (membrosSheet && membrosSheet.getLastRow() >= 2) {
    var mData    = membrosSheet.getDataRange().getValues();
    var mHeaders = mData[0];
    for (var mi = 1; mi < mData.length; mi++) {
      var mRow = {};
      for (var mj = 0; mj < mHeaders.length; mj++) mRow[mHeaders[mj]] = mData[mi][mj];
      var mKey = String(mRow.id);
      if (countMap[mKey]) countMap[mKey].photo_url = mRow.photo_url || "";
    }
  }

  // Converter em array e ordenar
  var ranking = [];
  for (var rKey in countMap) { ranking.push(countMap[rKey]); }
  ranking.sort(function (a, b) { return b.count - a.count; });

  return { ocorrencias: ocorrencias, ranking: ranking };
}

function deleteOcorrencia(params) {
  var session = validateToken(params.token);
  if (!session.valid || session.user_type !== "admin") return { error: "Unauthorized" };
  var id = params.id;
  if (!id) return { error: "id é obrigatório" };
  var sheet = SS.getSheetByName("Ocorrencias");
  if (!sheet || sheet.getLastRow() < 2) return { error: "Ocorrência não encontrada" };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) { sheet.deleteRow(i + 1); return { success: true }; }
  }
  return { error: "Ocorrência não encontrada" };
}

// ---- AUTH ----

function loginHandler(params) {
  var username = (params.username || "").trim();
  var password  = (params.password  || "").trim();
  if (!username || !password) return { error: "Credenciais ausentes" };

  // 1. Tentar login de membro
  var uSheet = SS.getSheetByName("Usuarios");
  if (uSheet && uSheet.getLastRow() >= 2) {
    var uData = uSheet.getDataRange().getValues();
    // colunas: id | member_id | member_name | username | password | created_at
    for (var i = 1; i < uData.length; i++) {
      if (String(uData[i][3]) === username && String(uData[i][4]) === password) {
        var uType = String(uData[i][5] || "member");
        return createSession(uType, String(uData[i][1]), String(uData[i][2]));
      }
    }
  }

  // 2. Tentar login de admin
  var config = getConfig();
  if (config.username === username && config.password === password) {
    return createSession("admin", "", "admin");
  }

  return { error: "Credenciais inválidas" };
}

function createSession(user_type, user_id, user_name) {
  var token      = Utilities.getUuid();
  var expires_at = new Date(Date.now() + TOKEN_EXPIRY_MS).toISOString();
  var sheet = SS.getSheetByName("Sessions");
  if (!sheet) return { error: "Aba 'Sessions' não encontrada na planilha" };
  cleanSessions(sheet);
  sheet.appendRow([token, expires_at, user_type, user_id, user_name]);
  return { success: true, token: token, expires_at: expires_at, user_type: user_type, user_id: user_id, user_name: user_name };
}

function logoutHandler(params) {
  var token = params.token;
  if (!token) return { success: true };
  var sheet = SS.getSheetByName("Sessions");
  if (sheet.getLastRow() < 2) return { success: true };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(token)) { sheet.deleteRow(i + 1); break; }
  }
  return { success: true };
}

// Retorna objeto com valid + identidade do usuário
function validateToken(token) {
  var invalid = { valid: false, user_type: "", user_id: "", user_name: "" };
  if (!token) return invalid;
  var sheet = SS.getSheetByName("Sessions");
  if (!sheet || sheet.getLastRow() < 2) return invalid;
  var data = sheet.getDataRange().getValues();
  var now  = new Date();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(token)) {
      if (new Date(data[i][1]) <= now) return invalid;
      return {
        valid:     true,
        user_type: String(data[i][2] || ""),
        user_id:   String(data[i][3] || ""),
        user_name: String(data[i][4] || "")
      };
    }
  }
  return invalid;
}

function cleanSessions(sheet) {
  if (sheet.getLastRow() < 2) return;
  var now  = new Date();
  var data = sheet.getDataRange().getValues();
  for (var i = data.length - 1; i >= 1; i--) {
    if (new Date(data[i][1]) <= now) sheet.deleteRow(i + 1);
  }
}

function getConfig() {
  var sheet = SS.getSheetByName("Config");
  var data  = sheet.getDataRange().getValues();
  var config = {};
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) config[String(data[i][0])] = String(data[i][1]);
  }
  return config;
}
