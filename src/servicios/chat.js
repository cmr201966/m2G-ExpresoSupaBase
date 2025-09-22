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

export async function getchat(body) {
  return makeRequest("http://localhost:3001/get-chat", body);
}

export async function setchat(body) {
    return makeRequest("http://localhost:3001/set-chat", body);
  }

  
  