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

export async function getinfonegocio(body) {
  return makeRequest("http://localhost:3001/get-info-negocio", body);
}

export async function getnegocios1(body) {
  return makeRequest("http://localhost:3001/getnegocios-1", body);
}

export async function getcategoriasnegocios(body) {
  return makeRequest("http://localhost:3001/getcategoriasnegocios", body);
}

export async function setnegocio(body) {
  return makeRequest("http://localhost:3001/setnegocio", body);
}

export async function getcategoriasnegociosapp(body) {
  return makeRequest("http://localhost:3001/getcategoriasnegociosapp", body);
}

export async function getallnegocios(body) {
  return makeRequest("http://localhost:3001/getallnegocios", body);
}

export async function getnegociosusercategoria(body) {
  return makeRequest("http://localhost:3001/getnegociosusercategoria", body);
}

export async function delnegocio(body) {
  return makeRequest("http://localhost:3001/delnegocio", body);
}
