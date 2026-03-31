const BASE_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string;

export interface Member {
  id: string;
  name: string;
  role: string;
  photo_url: string;
  display_order: number;
  created_at: string;
}

async function apiFetch(params: Record<string, string>): Promise<Record<string, unknown>> {
  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

export async function getMembers(): Promise<Member[]> {
  const data = await apiFetch({ action: "getMembers" });
  return (data.members as Member[]) ?? [];
}

export async function addMember(
  name: string,
  role: string,
  photo_url: string,
  token: string
): Promise<Member> {
  const data = await apiFetch({ action: "addMember", name, role, photo_url, token });
  return data.member as Member;
}

export async function deleteMember(id: string, token: string): Promise<void> {
  await apiFetch({ action: "deleteMember", id, token });
}

export async function login(
  username: string,
  password: string
): Promise<{ token: string; expires_at: string }> {
  const data = await apiFetch({ action: "login", username, password });
  return { token: data.token as string, expires_at: data.expires_at as string };
}

export async function logout(token: string): Promise<void> {
  await apiFetch({ action: "logout", token });
}
