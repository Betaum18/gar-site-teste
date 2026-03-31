const TOKEN_KEY     = "gar_token";
const EXPIRES_KEY   = "gar_token_expires";
const USER_TYPE_KEY = "gar_user_type";
const USER_ID_KEY   = "gar_user_id";
const USER_NAME_KEY = "gar_user_name";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  const token   = localStorage.getItem(TOKEN_KEY);
  const expires = localStorage.getItem(EXPIRES_KEY);
  if (!token || !expires) return false;
  return new Date(expires) > new Date();
}

export function getUserType(): "admin" | "member" | null {
  if (!isLoggedIn()) return null;
  return localStorage.getItem(USER_TYPE_KEY) as "admin" | "member" | null;
}

export function getUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

export function getUserName(): string | null {
  return localStorage.getItem(USER_NAME_KEY);
}

export function isAdmin(): boolean {
  return isLoggedIn() && getUserType() === "admin";
}

export function saveSession(
  token: string,
  expires_at: string,
  user_type: string,
  user_id: string,
  user_name: string
): void {
  localStorage.setItem(TOKEN_KEY,     token);
  localStorage.setItem(EXPIRES_KEY,   expires_at);
  localStorage.setItem(USER_TYPE_KEY, user_type);
  localStorage.setItem(USER_ID_KEY,   user_id);
  localStorage.setItem(USER_NAME_KEY, user_name);
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_NAME_KEY);
}
