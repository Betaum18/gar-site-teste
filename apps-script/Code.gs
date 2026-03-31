/**
 * GAR Site - Google Apps Script API
 *
 * Como implantar:
 * 1. Abra a planilha Google Sheets com as abas: Membros, Config, Sessions
 * 2. Clique em Extensões → Apps Script
 * 3. Cole este código e salve
 * 4. Clique em Implantar → Nova implantação
 *    - Tipo: App da Web
 *    - Executar como: Eu
 *    - Quem tem acesso: Qualquer pessoa
 * 5. Copie a URL da implantação e adicione ao Vercel como VITE_APPS_SCRIPT_URL
 *
 * Estrutura da planilha:
 *   Aba "Membros": id | name | role | photo_url | display_order | created_at
 *   Aba "Config":  key | value  (linhas: username | admin ; password_hash | <sha256>)
 *   Aba "Sessions": token | expires_at
 *
 * Para gerar o password_hash, use: https://emn178.github.io/online-tools/sha256.html
 */

var SS = SpreadsheetApp.getActiveSpreadsheet();
var TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 horas

function doGet(e) {
  return handleRequest(e);
}

// Apps Script redireciona POST para GET; aceitar ambos para compatibilidade
function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var params = e.parameter || {};
  var action = params.action;

  try {
    switch (action) {
      case "getMembers":   return respond(getMembers());
      case "addMember":    return respond(addMember(params));
      case "deleteMember": return respond(deleteMember(params));
      case "login":        return respond(loginHandler(params));
      case "logout":       return respond(logoutHandler(params));
      default:             return respond({ error: "Unknown action: " + action });
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
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return { members: [] };

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var members = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;
    var member = {};
    for (var j = 0; j < headers.length; j++) {
      member[headers[j]] = row[j];
    }
    members.push(member);
  }

  members.sort(function (a, b) {
    var od = Number(a.display_order) - Number(b.display_order);
    if (od !== 0) return od;
    return new Date(a.created_at) - new Date(b.created_at);
  });

  return { members: members };
}

function addMember(params) {
  if (!validateToken(params.token)) return { error: "Unauthorized" };

  var name = (params.name || "").trim();
  var role = (params.role || "").trim();
  var photo_url = (params.photo_url || "").trim();

  if (!name || !role) return { error: "name e role são obrigatórios" };

  var sheet = SS.getSheetByName("Membros");
  var display_order = Math.max(0, sheet.getLastRow() - 1);
  var id = Utilities.getUuid();
  var now = new Date().toISOString();

  sheet.appendRow([id, name, role, photo_url, display_order, now]);
  return {
    success: true,
    member: { id: id, name: name, role: role, photo_url: photo_url, display_order: display_order, created_at: now }
  };
}

function deleteMember(params) {
  if (!validateToken(params.token)) return { error: "Unauthorized" };

  var id = params.id;
  if (!id) return { error: "id é obrigatório" };

  var sheet = SS.getSheetByName("Membros");
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { error: "Membro não encontrado" };
}

// ---- AUTH ----

function loginHandler(params) {
  var username = (params.username || "").trim();
  var password_hash = (params.password_hash || "").trim();

  if (!username || !password_hash) return { error: "Credenciais ausentes" };

  var config = getConfig();
  if (config.username !== username || config.password_hash !== password_hash) {
    return { error: "Credenciais inválidas" };
  }

  var token = Utilities.getUuid();
  var expires_at = new Date(Date.now() + TOKEN_EXPIRY_MS).toISOString();

  var sheet = SS.getSheetByName("Sessions");
  cleanSessions(sheet);
  sheet.appendRow([token, expires_at]);

  return { success: true, token: token, expires_at: expires_at };
}

function logoutHandler(params) {
  var token = params.token;
  if (!token) return { success: true };

  var sheet = SS.getSheetByName("Sessions");
  if (sheet.getLastRow() < 2) return { success: true };

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(token)) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
  return { success: true };
}

function validateToken(token) {
  if (!token) return false;
  var sheet = SS.getSheetByName("Sessions");
  if (sheet.getLastRow() < 2) return false;

  var data = sheet.getDataRange().getValues();
  var now = new Date();

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(token)) {
      return new Date(data[i][1]) > now;
    }
  }
  return false;
}

function cleanSessions(sheet) {
  if (sheet.getLastRow() < 2) return;
  var now = new Date();
  var data = sheet.getDataRange().getValues();
  for (var i = data.length - 1; i >= 1; i--) {
    if (new Date(data[i][1]) <= now) sheet.deleteRow(i + 1);
  }
}

function getConfig() {
  var sheet = SS.getSheetByName("Config");
  var data = sheet.getDataRange().getValues();
  var config = {};
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) config[String(data[i][0])] = String(data[i][1]);
  }
  return config;
}
