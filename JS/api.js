
const API_BASE_URL = "https://v2.api.noroff.dev";
const API_KEY = "3cd18e14-497f-411c-a28e-4aa7b6f9b285";

// === Get current user ===
export function getUsername() {
  const user = localStorage.getItem("currentUser");
  return user;
}

// === Endpoints ===
export const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;
export const REGISTER_ENDPOINT = `${API_BASE_URL}/auth/register`;

export function getBlogEndpoint(username = null) {
  const endpoint = username
    ? `${API_BASE_URL}/blog/posts/${username}`
    : `${API_BASE_URL}/blog/posts`;
  return endpoint;
}


// === Token + Headers ===
export function getToken() {
  const token = localStorage.getItem("token");
  return token;
}

export function authHeaders() {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-Noroff-API-Key": API_KEY,
  };
  return headers;
}


