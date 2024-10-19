import config from "../config";

export async function makeRequest(url, body, method = "POST") {
  return await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.destodoToken}`,
    },
    body: JSON.stringify(body), 
  });
}

export async function getdatosiduser(body) {
    return makeRequest("http://localhost:3001/getdatosiduser", body);
}
export async function setregistrarse(body) {
  return makeRequest("http://localhost:3001/setregistrarse", body);
}

export async function getusuarios(body) {
  return makeRequest("http://localhost:3001/getusuarios", body);
}
