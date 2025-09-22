import {  isValid} from "./Utiles";
import { getinfonegocio } from "../servicios/negocios";
import { 
        getnegocioscontratos,
      } from "../servicios/contratos";
import supabase from "./connection";

async function getInfoNegocioCM(idnegocio) {
    let result = [];
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
      result = await getinfonegocio({ idnegocio });
      result = await result.json();
    } else {
      const { data, error} = await supabase
        .from("getinfonegocio")
        .select("*")
        .eq("idnegocio", idnegocio);
      result = data;
    }
    return result;
  }
  
  function crearVistaNegociosCliente(user){
    return "create or replace view public.getnegocioscliente as SELECT distinct tablausuarios.iduser as idnegocio, tablausuarios.nombre as nick from tablacatproductos, tablamovimientos, tablausuarios" +
           " where (tablacatproductos.iduser=tablausuarios.iduser) and (tablacatproductos.idproducto=tablamovimientos.idproducto) and (tablamovimientos.iduser='" + user + "')"
  }
  
  function crearVistaNegociosDueño(user){
    return "create or replace view public.getnegociosdueño as SELECT distinct tablausuarios.iduser as idnegocio, tablausuarios.nombre as nick from tablamovimientos, tablacatproductos, tablausuarios" +
           " where (tablausuarios.iduser=tablacatproductos.iduser) and (tablacatproductos.idproducto=tablamovimientos.idproducto) and (tablacatproductos.iduser='" + user + "')"
  }
  
  function crearVistaNegociosAdmin(){
    return "create or replace view public.getnegociosadmin as SELECT distinct tablausuarios.iduser as idnegocio, tablausuarios.nombre as nick from tablamovimientos, tablacatproductos, tablausuarios" +
           " where (tablausuarios.iduser=tablacatproductos.iduser) and (tablacatproductos.idproducto=tablamovimientos.idproducto)"
  }
  
  async function getNegociosContratos(user, tipouser ){
    let datos;
    if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL") {
      datos = await getnegocioscontratos({user, tipouser});
      datos = await datos.json();
      return datos;
    } else {
      if (Number(tipouser) === 0) {
        let sql = crearVistaNegociosCliente(user)
        let {error:err}=await supabase.rpc("exec_sql", { query: sql });
        if (isValid(err)===false || err.length>0){
        const { data } = await supabase.from("getnegocioscliente").select("*");
        return data;
        }
        else return ([]);
      }
      if (tipouser === 1 || tipouser === 2) {
        let sql = crearVistaNegociosDueño(user);
        let {error:err}=await supabase.rpc("exec_sql", { query: sql });
        if (isValid(err)===false || err.length>0){
        const { data } = await supabase.from("getnegociosdueño").select("*");
        return data;
        }
        else return ([]);
        }
    
      if (tipouser === 9 || tipouser === 3) {
        let sql = crearVistaNegociosAdmin()
        let {error:err}=await supabase.rpc("exec_sql", { query: sql });
        if (isValid(err)===false || err.length>0){
        const { data } = await supabase.from("getnegociosadmin").select("*");
        return data;
        }
        else return ([]);
      }
    }
  }
 
  export {
    getInfoNegocioCM,
    getNegociosContratos,
  };
  
  
  
  