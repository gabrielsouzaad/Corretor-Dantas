const TOKEN_KEY = "token";

interface JwtPayload {
  exp?: number;
  role?: string;
  sub?: string;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function parseToken(token: string): JwtPayload | null {
  try {
    const base64 = token
      .split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;

  const payload = parseToken(token);
  if (!payload || typeof payload.exp !== "number") return false;

  return payload.exp * 1000 > Date.now();
}

export function isAdmin(): boolean {
  const token = getToken();
  if (!token || !isAuthenticated()) return false;

  return parseToken(token)?.role === "ADMIN";
}