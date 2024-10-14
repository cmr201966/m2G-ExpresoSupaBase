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

export async function setconfig(body) {
  return makeRequest("http://localhost:3001/setconfig", body);
}


export async function getconfig(body) {
  return makeRequest("http://localhost:3001/getconfig", body);
}
