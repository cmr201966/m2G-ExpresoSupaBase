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

export async function getgalerias(body) {
  return makeRequest("http://localhost:3001/getgalerias", body);
}

  