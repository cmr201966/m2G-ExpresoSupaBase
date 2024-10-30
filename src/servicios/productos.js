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
  console.log("5")
  console.log(body);
  return makeRequest("http://localhost:3001/setmovimiento-new", body);
}

export async function updateOcupado(body) {
  return makeRequest("http://localhost:3001/update-ocupado", body);
}

export async function getproductos(body) {
  return makeRequest("http://localhost:3001/getproductos", body);
}
export async function getproductoscategoria(body) {
  return makeRequest("http://localhost:3001/getproductos-categoria", body);
}
export async function delproducto(body) {
  return makeRequest("http://localhost:3001/delproducto", body);
}
export async function setproducto(body) {
  return makeRequest("http://localhost:3001/setproducto", body);
}
export async function getProductoNew(body) {
  return makeRequest("http://localhost:3001/getProductoNew", body);
}
