/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
async function getInfo() {
  const route: any = await localStorage.getItem("route");
  const door: any = await localStorage.getItem("door");
  return { route, door };
}

export const Api = {
  get: async (url: string) => await handleRequest("GET", url),
  post: async (url: string, payload: any) =>
    await handleRequest("POST", url, payload),
  patch: async (url: string, payload: any) =>
    await handleRequest("PATCH", url, payload),
  delete: async (url: string) => await handleRequest("DELETE", url),
};

async function handleRequest(method: string, url: string, payload?: any) {
  return new Promise<any>(async (resolve, reject) => {
    const { route, door } = await getInfo();

    fetch(`http://${JSON.parse(route)}:${JSON.parse(door)}/${url}`, {
      method: method,
      body: payload ? JSON.stringify(payload) : null,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      keepalive: true,
    })
      .then((response) => response.json())
      .then((json) => resolve(json))
      .catch((err) => reject(err));
  });
}
