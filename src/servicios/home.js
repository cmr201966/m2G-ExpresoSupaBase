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

export async function getapps(body) {
  return makeRequest("http://localhost:3001/getapps", body);
}

export async function getsubapps(body) {
    return makeRequest("http://localhost:3001/getsubapps", body);
  }
  

