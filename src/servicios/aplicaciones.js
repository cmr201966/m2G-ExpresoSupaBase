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

export async function getAplicaciones(body) {
  return makeRequest("http://localhost:3001/getaplicaciones", body);
}

export async function setAplicaciones(body) {
  return makeRequest("http://localhost:3001/setaplicacion", body);
}

export async function getNaturalezas(body) {
  return makeRequest("http://localhost:3001/getnaturaleza", body);
}
