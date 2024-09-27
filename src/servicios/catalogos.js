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

export async function getprovincias(body) {
  return makeRequest("http://localhost:3001/getprovincias", body);
}

export async function getmunicipios(body) {
    return makeRequest("http://localhost:3001/getmunicipios", body);
}


export async function getparesgpscategoria(body) {
  return makeRequest("http://localhost:3001/get-pares-gps-categoria", body);
}

export async function getusuarios(body) {
  return makeRequest("http://localhost:3001/getusuarios", body);
}
