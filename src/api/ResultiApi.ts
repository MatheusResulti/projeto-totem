/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const ResultiApi = {
  get: async (url: string, token: string) =>
    await handleRequest("GET", url, token),
  post: async (url: string, token: string, payload: any) =>
    await handleRequest("POST", url, token, payload),
  patch: async (url: string, payload: any) =>
    await handleRequest("PATCH", url, payload),
  delete: async (url: string, token: string) =>
    await handleRequest("DELETE", url, token),
};

async function handleRequest(
  method: string,
  url: string,
  token?: string,
  payload?: any
) {
  return new Promise<any>(async (resolve, reject) => {
    fetch(`${url}`, {
      method: method,
      body: payload ? JSON.stringify(payload) : null,
      headers: {
        Authorization: `Basic ${token}`,
        "Content-type": "application/json; charset=UTF-8",
      },
      keepalive: true,
    })
      .then((response) => response.json())
      .then((json) => resolve(json))
      .catch((err) => reject(err));
  });
}
