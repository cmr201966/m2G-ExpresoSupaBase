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

export async function getinfoproducto(body) {
  return makeRequest("http://localhost:3001/get-info-producto", body);
}
export async function setMovimientosNew(body) {
  return makeRequest("http://localhost:3001/setmovimiento-new", body);
}

export async function updateOcupado(body) {
  return makeRequest("http://localhost:3001/update-ocupado", body);
}

export async function getproductos(body) {
  return makeRequest("http://localhost:3001/getproductos", body);
}
