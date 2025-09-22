import {  isValid} from "./Utiles";
import { getclientes, } from "../servicios/contratos";
import supabase from "./connection";

function crearVistaGetClientesCliente(user, estado){
    return "create or replace view public.getclientescliente as SELECT DISTINCT tablausuarios.iduser, nombre from tablausuarios, tablamovimientos, tablacatproductos" +
    " where (tablamovimientos.iduser='" + user + "') and (tablausuarios.iduser=tablamovimientos.iduser) and (tablamovimientos.idproducto=tablacatproductos.idproducto)" +
    " and (tablamovimientos.estado=" + estado + ")";
  }
  
  function crearVistaGetClientesDueño(user, estado){
    return "create or replace view public.getclientesdueño as SELECT DISTINCT tablausuarios.iduser, nombre from tablausuarios, tablamovimientos, tablacatproductos" +
    " where (tablacatproductos.iduser='" + user + "') and (tablausuarios.iduser=tablamovimientos.iduser) and (tablamovimientos.idproducto=tablacatproductos.idproducto)" +
    " and (tablamovimientos.estado=" + estado + ")";
  }
  
  function crearVistaGetClientesAdmin(estado){
    return "create or replace view public.getclientesadmin as SELECT DISTINCT tablausuarios.iduser, nombre from tablausuarios, tablamovimientos, tablacatproductos" +
           " where (tablausuarios.iduser=tablamovimientos.iduser) and (tablamovimientos.idproducto=tablacatproductos.idproducto) and (tablamovimientos.estado=" + estado + ")";
  }
  
  
  async function getClientesContratos(user, tipouser, estado){
    let datos;
    if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL") {
      datos = await getclientes({user, tipouser, estado});
      datos = await datos.json();
      return datos;
    } else {
      if (tipouser === 9 || tipouser === 3) {
        let sql = crearVistaGetClientesAdmin(estado)
        let {error:err}=await supabase.rpc("exec_sql", { query: sql });
        if (isValid(err)===false || err.length>0){
        const { data } = await supabase.from("getclientesadmin").select("*");
        return data;
        }
        else return ([]);
      }
      if (tipouser === 1 || tipouser === 2) {
        let sql = crearVistaGetClientesDueño(user, estado)
        let {error:err}=await supabase.rpc("exec_sql", { query: sql });
        if (isValid(err)===false || err.length>0){
        const { data } = await supabase.from("getclientesdueño").select("*");
        return data;
        }
        else return ([]);
        }
        if (tipouser === 0) {
          let sql = crearVistaGetClientesCliente(user, estado)
          let {error:err}=await supabase.rpc("exec_sql", { query: sql });
          if (isValid(err)===false || err.length>0){
          const { data } = await supabase.from("getclientescliente").select("*");
          return data;
          }
          else return ([]);
          }
    
    }
  }
  
  export {getClientesContratos,};
  
