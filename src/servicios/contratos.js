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

export async function getcontratoclientes(body) {
  return makeRequest("http://localhost:3001/getcontratoclientes", body);
}

export async function getdisponibilidad(body) {
  return makeRequest("http://localhost:3001/getdisponibilidad", body);
}

export async function setcontrato(body) {
  return makeRequest("http://localhost:3001/setcontrato", body);
}
export async function registraws(body) {
  return makeRequest("http://localhost:3001/registraws", body);
}
