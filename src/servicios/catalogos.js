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


export async function getCategoriaText(body) {
  return makeRequest("http://localhost:3001/getCategoriaText", body);
}

export async function getProductoText(body) {
  return makeRequest("http://localhost:3001/getProductoText", body);
}

export async function getCategoriasNegocios(body) {
  return makeRequest("http://localhost:3001/getcategoriasnegocios", body);
}

export async function setCategoriasNegocios(body) {
  return makeRequest("http://localhost:3001/setcategoriasnegocios", body);
}

export async function delCategoria(body) {
  return makeRequest("http://localhost:3001/delcategorianegocio", body);
}

export async function delAnuncio(body) {
  return makeRequest("http://localhost:3001/delAnuncio", body);
}

export async function setuserexpress(body) {
  return makeRequest("http://localhost:3001/setuserexpress", body);
}

export async function getcategorias(body) {
  return makeRequest("http://localhost:3001/getcategorias", body);
}