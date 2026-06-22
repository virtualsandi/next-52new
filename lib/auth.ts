import Cookies from "js-cookie";

const TOKEN_KEY = "token";
const COOKIE_KEY = "_at_52";


export function getCurrentUser() {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
}

export function getCurrentUserId() {
  const user = getCurrentUser();

  return user?._id || user?.id || null;
}
export function saveAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  Cookies.set(COOKIE_KEY, token, { sameSite: "lax" });
}

export function getAuthToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY) ?? Cookies.get(COOKIE_KEY);
  if (!token || token === "undefined" || token === "null") {
    return null;
  }
  return token;
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
  Cookies.remove(COOKIE_KEY);
}

export function extractLoginToken(responseData: {
  token?: string;
  data?: { token?: string; accessToken?: string };
}): string | null {
  return (
    responseData.data?.token ??
    responseData.data?.accessToken ??
    responseData.token ??
    null
  );
  
}
