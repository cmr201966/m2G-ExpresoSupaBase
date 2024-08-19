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

export async function getNaturalezas(body) {
  return makeRequest("http://localhost:3001/getnaturaleza", body);
}

export async function getparesgpsnaturaleza(body) {
  return makeRequest("http://localhost:3001/get-pares-gps-naturaleza", body);
}

export async function getParesGpsNaturalezaNew(body) {
  return makeRequest("http://localhost:3001/get-pares-gps-naturaleza-new", body);
}

export async function getnaturalezaproducto(body) {
  return makeRequest("http://localhost:3001/getnaturaleza-producto", body);
}
