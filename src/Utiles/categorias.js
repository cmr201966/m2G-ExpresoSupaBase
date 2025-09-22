import {  isValid, uploadBase64Image} from "./Utiles";
import { getCategoriasNew } from "../servicios/home";
import { getCategoriasNegocios } from "../servicios/catalogos";
import { getparesgpscategoria } from "../servicios/catalogos";
import { setCategoriasNegocios, delCategoria, getcategorias } from "../servicios/catalogos";
import { getcategoriasnegociosapp } from "../servicios/negocios";
import supabase from "./connection";

async function getcategoriasnegociosappCM(activo) {
    let resulttnegocios = [];
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
      resulttnegocios = await getcategoriasnegociosapp({});
      resulttnegocios = await resulttnegocios.json();
    } else {
      const { data } = await supabase
        .from("tablacategorias")
        .select("*")
        .eq('activo', activo)
        .eq("app", true)
        .order("nick", { ascending: true });
      resulttnegocios = data;
    }
    return resulttnegocios;
  }
  
  async function setCategoriasNegociosCM(
    categorianegocio,
    desc,
    descold,
    link,
    nick,
    accion,
    orden,
    inserta,
    contenidofoto,
    isBase64ToBlob,
  ) {
    let result = [];
    let err = "";
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
      result = await setCategoriasNegocios({
        categorianegocio,
        desc,
        descold,
        link,
        nick,
        accion,
        orden,
        inserta,
        contenidofoto,
      });
      result = await result.json();
      err = result.error;
    } else {
      err = await CategoriasInsertUpdate(
        categorianegocio,
        desc,
        "productos",
        nick,
        accion,
        orden,
        inserta,
        contenidofoto,
        isBase64ToBlob,
      );
    }
    return err;
  }
  
  async function delCategoriaCM(categorianegocio) {
    let err = "";
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
      const { error } = await delCategoria({ categorianegocio });
      err = error;
    } else {
      const { error } = await supabase
        .from("tablacategorias")
        .delete()
        .eq("id", categorianegocio);
      err = error;
    }
    return err;
  }
  
  function getParesGpsCategoria(categoria, user, userAnuncio) {
    let condicion1 = "";
    let condicion2 = "";
    let condicion3 = "";
    if (isValid(user) === true) {
      condicion1 = " and (tablacatproductos.iduser='" + user + "')";
    }
    if (isValid(userAnuncio) === true) {
      condicion2 = " and (tablacatproductos.iduser='" + userAnuncio + "')";
    }
    if (isValid(categoria) === true) {
      condicion3 = " and (tablacatproductos.categorianegocio=" + categoria + ")";
    }
    return (
      'CREATE OR REPLACE VIEW getparesgpscategoria AS SELECT celular, tablacatproductos.latitud, tablacatproductos.longitud, ocupado, idproducto, tablacatproductos."desc" as nombre,' +
      " tarifa, costodomicilio, domicilio, distanciamax, sciudad , tablacatproductos.nick FROM tablacatproductos, tablausuarios WHERE (ocupado=0) and (tablacatproductos.iduser=tablausuarios.iduser) and " +
      " (tablacatproductos.activo=true) and (tablausuarios.activo=true)" +
      condicion1 +
      condicion2 +
      condicion3
    );
  }
  
  async function getparesgpscategoriaCM(categoria, user, anuncio) {
    let resultgps = [];
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
      resultgps = await getparesgpscategoria({
        categoria: categoria,
        user: user,
        userAnuncio: anuncio,
      });
      resultgps = await resultgps.json();
    } else {
      let sql = getParesGpsCategoria(categoria, user, anuncio);
      let err=await supabase.rpc("exec_sql", { query: sql });
      const { data } = await supabase.from("getparesgpscategoria").select("*");
      resultgps = data;
    }
    return resultgps;
  } 
  
  
  function GeneraVistagetCategoriasNew(user, tipouser) {
    let condicion = "";
    let tablas = "";
    let condicion1="";
    if (isValid(user) === true && (tipouser === "1" || tipouser === "2")) {
      condicion =
        "and (tablacatproductos.iduser='" +
        user +
        "') and (tablausuarios.activo=true)";
        tablas=", tablausuarios";
        condicion1=" and (tablausuarios.iduser=tablacatproductos.iduser)";
  
    }
    return (
  
      "CREATE OR REPLACE VIEW getcategoriasnew  AS select DISTINCT tablacategorias.categorianegocio as idcategoria, " + 
      'tablacategorias."desc" as categoria, tablacategorias.link, destodo, tablacategorias.nick, tablacategorias.idsb from tablacategorias, tablacatproductos' + tablas +
      " where ((tablacategorias.categorianegocio=tablacatproductos.categorianegocio) or (tablacategorias.link LIKE '%https:%')) and (tablacatproductos.activo=true)" + condicion1 +
      condicion + " and (app=true) and (tablacategorias.activo=true) order by destodo"
    );
  }
  
  async function getcategoriasnewCM() {
    let datos;
    if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL") {
      datos = await getCategoriasNew({
        user: sessionStorage.getItem("user"),
        tipouser: sessionStorage.getItem("tipouser"),
      });
      datos = await datos.json();
      return datos;
    } else {
      let sql = GeneraVistagetCategoriasNew(
        sessionStorage.getItem("user"),
        sessionStorage.getItem("tipouser")
      );
      const {error}=await supabase.rpc("exec_sql", { query: sql });
      const { data } = await supabase
        .from("getcategoriasnew")
        .select("*")
        .order("destodo", { ascending: true });
      datos = data;
      return datos;
    }
  }
  
  async function getCategoriasNegociosCM(activo) {
    let datos;
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
      datos = await getCategoriasNegocios({});
      datos = await datos.json();
    } else {
      const { data } = await supabase
        .from("tablacategorias")
        .select("*")
        .eq("activo", activo)
        .order("nick", { ascending: true });
      datos = data;
    }
    return datos;
  }
  
  async function CategoriasInsertUpdate(
    categorianegocio,
    desc,
    link,
    nick,
    accion,
    orden,
    insertar,
    contenidofoto,
    isBase64ToBlob,
  ) {
    let err;
    if (insertar === true) {
      // Ver si ya existe la descripcion
      const { data: datos, error } = await supabase
      .from("tablacategorias")
      .select("*")
      .eq("desc", desc)
      if (isValid(datos)===false || datos.length===0){
        const { error } = await supabase
        .from("tablacategorias")
        .insert({ desc: desc, link: link, accion: accion, nick: nick, activo: true, anuncio: true, app: true, destodo: orden });
        if (isValid(error) === false) {
        const { data, error: err1 } = await supabase
          .from("tablacategorias")
          .select("*")
          .order("categorianegocio", { ascending: false })
          .limit(1);
        err = await uploadBase64Image(
          contenidofoto,
          "galerias",
          "categorias_de_negocios/" + data[0].categorianegocio + "/" + data[0].categorianegocio + ".jpg",
          isBase64ToBlob, "tablacategorias", "categorianegocio", data[0].categorianegocio
        );
        }
      }
      else{
        err="Ya existe..."
      }
      return err;
    } else {
      const { error } = await supabase
        .from("tablacategorias")
        .update({ desc: desc, accion: accion, nick: nick, destodo: orden })
        .eq("categorianegocio", categorianegocio);
        err = error;
      if (isValid(error) === false) {
        err = await uploadBase64Image(
          contenidofoto,
          "galerias",
          "categorias_de_negocios/" +
            categorianegocio +
            "/" +
            categorianegocio +
            ".jpg",
          isBase64ToBlob, "tablacategorias", "categorianegocio", categorianegocio
        );
        err=error;
      } 
    }
    return err;
  }
  
  function crearVistaCategoriasCliente(user, idnegocio){
    return "create or replace view public.getcategoriascliente as SELECT distinct tablacategorias.categorianegocio, tablacategorias.nick from tablamovimientos, tablacatproductos, tablacategorias" +
           " where (tablacategorias.categorianegocio=tablacatproductos.categorianegocio) and (tablacatproductos.idproducto=tablamovimientos.idproducto) and (tablamovimientos.iduser='" + user + "')" +
           " and (tablacatproductos.iduser='" + idnegocio +"')";
  }
  
  function crearVistaCategoriasDueño(user){
    return "create or replace view public.getcategoriasdueño as SELECT distinct tablacategorias.categorianegocio, tablacategorias.nick from tablamovimientos, tablacatproductos, tablacategorias" +
           " where (tablacategorias.categorianegocio=tablacatproductos.categorianegocio) and (tablacatproductos.idproducto=tablamovimientos.idproducto) and (tablacatproductos.iduser='" + user + "')"
  }
  
  function crearVistaCategoriasAdmin(idnegocio){
    return "create or replace view public.getcategoriasadmin as SELECT distinct tablacategorias.categorianegocio, tablacategorias.nick from tablamovimientos, tablacatproductos, tablacategorias" +
           " where (tablacategorias.categorianegocio=tablacatproductos.categorianegocio) and (tablacatproductos.idproducto=tablamovimientos.idproducto) and (tablamovimientos.idproducto=tablacatproductos.idproducto)"+
           " and (tablacatproductos.iduser='" + idnegocio +"')";
  }
  
  async function getCategorias(user, tipouser, idnegocio){
    let datos;
    if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL") {
      datos = await getcategorias({user, tipouser, idnegocio});
      datos = await datos.json();
      return datos;
    } else {
      if (Number(tipouser) === 0) {
        let sql = crearVistaCategoriasCliente(user, idnegocio)
        let {error:err}=await supabase.rpc("exec_sql", { query: sql });
        if (isValid(err)===false || err.length>0){
        const { data } = await supabase.from("getcategoriascliente").select("*");
        return data;
        }
        else return ([]);
      }
  
      if (tipouser === 1 || tipouser === 2) {
        let sql = crearVistaCategoriasDueño(user);
        let {error:err}=await supabase.rpc("exec_sql", { query: sql });
        if (isValid(err)===false || err.length>0){
        const { data } = await supabase.from("getcategoriasdueño").select("*");
        return data;
        }
        else return ([]);
        }
    
      if (tipouser === 9 || tipouser === 3) {
        let sql = crearVistaCategoriasAdmin(idnegocio)
        let {error:err}=await supabase.rpc("exec_sql", { query: sql });
        if (isValid(err)===false || err.length>0){
        const { data } = await supabase.from("getcategoriasadmin").select("*");
        return data;
        }
        else return ([]);
      }
  
    }
  
  }
    
  export {
    getcategoriasnegociosappCM,
    getparesgpscategoriaCM,
    getcategoriasnewCM,
    getCategoriasNegociosCM,
    getCategorias,
  };
  
  export {
    setCategoriasNegociosCM,
  };
  export {
    delCategoriaCM,
  };
  