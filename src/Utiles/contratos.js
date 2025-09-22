import {  isValid} from "./Utiles";
import { getcontratoclientes, setcontrato, getcontratos, } from "../servicios/contratos";
import supabase from "./connection";

async function getContratoClientes(){
    let datos;
    if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL") {
      datos = await getcontratoclientes({});
      datos = await datos.json();
      return datos;
    } else {
      const { error, data } = await supabase
        .from("tablausuarios")
        .select("*")
        .order("nombre", { ascending: true })
        .eq("activo", true);
      return data;
    }
  }
  
  async function setContratoCM(user, producto, fechat, hora, cantidad, lng, lat){
    let datos;
    if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL") {
      datos = await setcontrato({user, producto, fechat, hora, cantidad, lng, lat});
      datos = await datos.json();
      return datos;
    } else {
      const { error } = await supabase
        .from("tablamovimientos")
        .insert({ idmovimiento: 1, iduser: user, idproducto: producto, fecha: fechat, hora: hora, cantidad, latdestino: lat, lngdestino: lng});
        if (isValid(error) === false) {
           const { data, error } = await supabase
             .from("tablamovimientos")
             .select("*")
             .order("id", { ascending: false })
             .limit(1);
          if (isValid(error)===false) return data
          else return [];
       }
  }
  }
  
  function crearVistaContratosCliente(user, estado, producto){
    let mestado=Number(estado)===9?"":" and (tablamovimientos.estado=" + estado + ")"
    return "create or replace view public.getcontratoscliente as SELECT tablamovimientos.estado as idestado, tablacatproductos.idproducto, tablausuarios.iduser as idnegocio, tablausuarios.nombre as negocio," +
        "tablamovimientos.id as contrato, fecha, tablacatproductos.nick as corto, tablacatproductos.nick as largo,tablamovimientos.latorigen, tablamovimientos.lngorigen, tablamovimientos.cantidad, tablamovimientos.id as id" +
        " FROM tablausuarios, tablamovimientos, tablacatproductos, tablacategorias where (tablamovimientos.iduser=tablausuarios.iduser)  and (tablamovimientos.idproducto=tablacatproductos.idproducto)" +
        " and (tablacatproductos.categorianegocio=tablacategorias.categorianegocio) and (tablamovimientos.iduser='" + user + "') and (tablacatproductos.idproducto=" + producto + ")" + mestado ;
  
  }
  
  function crearVistaContratosDueño(user, estado, producto){
    let mestado=Number(estado)===9?"":" and (tablamovimientos.estado=" + estado + ")"
    return "create or replace view public.getcontratosdueño as select tablamovimientos.estado as idestado, tablacatproductos.idproducto, tablausuarios.iduser as idnegocio," +
          "tablausuarios.nombre as negocio, tablacategorias.nick as categoria,tablamovimientos.id as contrato, fecha, tablacatproductos.nick as corto, tablacatproductos.nick" +
          " as largo, domicilio, tablamovimientos.latorigen, tablamovimientos.lngorigen, tablamovimientos.cantidad, tablamovimientos.id as id from tablamovimientos, tablacatproductos," +
          " tablausuarios, tablacategorias where (tablamovimientos.idproducto=tablacatproductos.idproducto) and (tablacatproductos.iduser='" + user + "') " +
          " and (tablacatproductos.categorianegocio=tablacategorias.categorianegocio) and (tablausuarios.iduser=tablamovimientos.iduser) and (tablacatproductos.idproducto=" + producto + ")" + mestado;
  }
  
  function crearVistaContratosAdmin(estado, producto){
    let mestado=Number(estado)===9?"":" and (tablamovimientos.estado=" + estado + ")"
    return "create or replace view public.getcontratosadmin as select tablamovimientos.estado as idestado, tablacatproductos.idproducto, tablausuarios.iduser as idnegocio," +
          "tablausuarios.nombre as negocio, tablamovimientos.id as contrato, fecha, tablacatproductos.nick as corto, tablamovimientos.id as id, " +
          "tablacatproductos.desc as largo, domicilio, tablamovimientos.latorigen, tablamovimientos.lngorigen, tablamovimientos.cantidad from tablamovimientos, tablacatproductos, tablausuarios" +
          " where (tablamovimientos.idproducto=tablacatproductos.idproducto) and (tablamovimientos.iduser=tablausuarios.iduser) and (tablacatproductos.idproducto=" + producto + ")" + mestado;
  }
  
  async function getContratos(user, tipouser, estado, producto){
    let datos;
    if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL") {
      datos = await getcontratos({user, tipouser, estado, producto});
      datos = await datos.json();
      return datos;
    } else {
      if (Number(tipouser) === 0) {
        let sql = crearVistaContratosCliente(user, estado, producto)
        let {error:err}=await supabase.rpc("exec_sql", { query: sql });
        if (isValid(err)===false || err.length>0){
        const { data } = await supabase.from("getcontratoscliente").select("*");
        return data;
        }
        else return ([]);
      }
  
      if (tipouser === 1 || tipouser === 2) {
        let sql = crearVistaContratosDueño(user, estado, producto)
        let {error:err}=await supabase.rpc("exec_sql", { query: sql });
        if (isValid(err)===false || err.length>0){
        const { data } = await supabase.from("getcontratosdueño").select("*");
        return data;
        }
        else return ([]);
        }
    
      if (tipouser === 9 || tipouser === 3) {
        let sql = crearVistaContratosAdmin(estado, producto)
        let {error:err}=await supabase.rpc("exec_sql", { query: sql });
        if (isValid(err)===false || err.length>0){
        const { data } = await supabase.from("getcontratosadmin").select("*");
        return data;
        }
        else return ([]);
      }
    }
  }
  
  async function setEstadoContrato(estado, id){
    const { error } = await supabase
    .from("tablamovimientos")
    .update({ estado: estado })
    .eq("id", id);
    return error;
    
  }
   
  export {
    getContratoClientes,
    getContratos,
  };
  
  export {
    setContratoCM,
    setEstadoContrato,
  };
    