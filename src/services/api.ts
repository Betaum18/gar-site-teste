const BASE_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string;

export interface Member {
  id: string;
  name: string;
  role: string;
  photo_url: string;
  display_order: number;
  created_at: string;
}

export interface UserEntry {
  id: string;
  member_id: string;
  member_name: string;
  username: string;
  user_type: string;
  created_at: string;
}

export interface Ocorrencia {
  id: string;
  member_id: string;
  member_name: string;
  descricao: string;
  photo_url: string;
  created_at: string;
}

export interface RankingEntry {
  member_id: string;
  member_name: string;
  photo_url: string;
  count: number;
}

async function apiFetch(params: Record<string, string>): Promise<Record<string, unknown>> {
  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  const res  = await fetch(url.toString());
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// ---- MEMBERS ----

export async function getMembers(): Promise<Member[]> {
  const data = await apiFetch({ action: "getMembers" });
  return (data.members as Member[]) ?? [];
}

export async function addMember(
  name: string, role: string, photo_url: string, token: string
): Promise<Member> {
  const data = await apiFetch({ action: "addMember", name, role, photo_url, token });
  return data.member as Member;
}

export async function editMember(
  id: string, name: string, role: string, photo_url: string, token: string
): Promise<void> {
  await apiFetch({ action: "editMember", id, name, role, photo_url, token });
}

export async function deleteMember(id: string, token: string): Promise<void> {
  await apiFetch({ action: "deleteMember", id, token });
}

// ---- USERS ----

export async function getUsers(token: string): Promise<UserEntry[]> {
  const data = await apiFetch({ action: "getUsers", token });
  return (data.users as UserEntry[]) ?? [];
}

export async function addUser(
  token: string, member_id: string, member_name: string, username: string, password: string, user_type: string
): Promise<UserEntry> {
  const data = await apiFetch({ action: "addUser", token, member_id, member_name, username, password, user_type });
  return data.user as UserEntry;
}

export async function editUser(
  token: string, id: string, username: string, password: string, user_type: string
): Promise<void> {
  const params: Record<string, string> = { action: "editUser", token, id, username, user_type };
  if (password) params.password = password;
  await apiFetch(params);
}

export async function deleteUser(token: string, id: string): Promise<void> {
  await apiFetch({ action: "deleteUser", token, id });
}

// ---- AUTH ----

export async function login(
  username: string, password: string
): Promise<{ token: string; expires_at: string; user_type: string; user_id: string; user_name: string }> {
  const data = await apiFetch({ action: "login", username, password });
  return {
    token:      data.token      as string,
    expires_at: data.expires_at as string,
    user_type:  data.user_type  as string,
    user_id:    data.user_id    as string,
    user_name:  data.user_name  as string,
  };
}

export async function logout(token: string): Promise<void> {
  await apiFetch({ action: "logout", token });
}

// ---- OCORRENCIAS ----

export async function addOcorrencia(
  token: string, descricao: string, photo_url: string,
  member_id?: string, member_name?: string
): Promise<Ocorrencia> {
  const params: Record<string, string> = { action: "addOcorrencia", token, descricao, photo_url };
  if (member_id)   params.member_id   = member_id;
  if (member_name) params.member_name = member_name;
  const data = await apiFetch(params);
  return data.ocorrencia as Ocorrencia;
}

export async function getOcorrencias(
  month: number, year: number
): Promise<{ ocorrencias: Ocorrencia[]; ranking: RankingEntry[] }> {
  const data = await apiFetch({ action: "getOcorrencias", month: String(month), year: String(year) });
  return {
    ocorrencias: (data.ocorrencias as Ocorrencia[]) ?? [],
    ranking:     (data.ranking     as RankingEntry[]) ?? [],
  };
}

export async function deleteOcorrencia(token: string, id: string): Promise<void> {
  await apiFetch({ action: "deleteOcorrencia", token, id });
}

// ---- TROCAR SENHA ----

export async function changePassword(
  token: string, current_password: string, new_password: string
): Promise<void> {
  await apiFetch({ action: "changePassword", token, current_password, new_password });
}

// ---- CÓDIGO PENAL ----

export interface PenalEntry {
  ARTIGO: string;
  "CONTRAVENÇÃO": string;
  MULTA: string;
  PENA: string;
  "FIANÇA": string;
}

export async function getPenal(): Promise<PenalEntry[]> {
  const data = await apiFetch({ action: "getPenal" });
  return (data.penal as PenalEntry[]) ?? [];
}
