/* eslint-disable @typescript-eslint/no-explicit-any */

let authToken: string | null = localStorage.getItem("token");

export function setAuthToken(token?: string) {
  authToken = token ?? null;
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

function getBaseURL() {
  const route = (localStorage.getItem("route") ?? "127.0.0.1").trim();
  const door = (localStorage.getItem("door") ?? "8085").trim();
  return `http://${route}:${door}`;
}

async function handleRequest(
  method: string,
  url: string,
  payload?: any,
  init?: RequestInit
) {
  const base = getBaseURL();
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=UTF-8",
    Accept: "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(
    `${base.replace(/\/$/, "")}/${url.replace(/^\//, "")}`,
    {
      method,
      body: payload != null ? JSON.stringify(payload) : null,
      headers,
      keepalive: true,
      signal: init?.signal,
      cache: init?.cache,
      credentials: init?.credentials,
    }
  );

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return {
    data,
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
  };
}

export const Api = {
  get: (url: string, init?: RequestInit) =>
    handleRequest("GET", url, undefined, init),
  post: (url: string, p?: any, init?: RequestInit) =>
    handleRequest("POST", url, p, init),
  patch: (url: string, p?: any, init?: RequestInit) =>
    handleRequest("PATCH", url, p, init),
  delete: (url: string, init?: RequestInit) =>
    handleRequest("DELETE", url, undefined, init),
  setAuthToken,
};
