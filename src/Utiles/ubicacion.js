import { getprovincias, getmunicipios } from "../servicios/catalogos";
import supabase from "./connection";

async function getProvinciasCM() {
    let resultprovincia = [];
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
      resultprovincia = await getprovincias({});
      resultprovincia = await resultprovincia.json();
    } else {
      const { data } = await supabase
        .from("tablacatprovincias")
        .select("*")
        .order('"desc"', { ascending: true });
      resultprovincia = data;
    }
    return resultprovincia;
  }
  
  async function getMunicipiosCM() {
    let resultmunicipio = [];
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
      resultmunicipio = await getmunicipios({});
      resultmunicipio = await resultmunicipio.json();
    } else {
      const { data } = await supabase
        .from("tablacatmunicipios")
        .select("*")
        .order('"desc"', { ascending: true });
      resultmunicipio = data;
    }
    return resultmunicipio;
  }
  
  
  export {
    getProvinciasCM,
    getMunicipiosCM,
  };
  
