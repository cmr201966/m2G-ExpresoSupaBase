import {  isValid, uploadBase64Image} from "./Utiles";
import { getinfoproducto } from "../servicios/productos";
import { getParesGpsNaturalezaNew } from "../servicios/naturalezas";
import {getproductos, getProductoNew,} from "../servicios/productos";
import { 
         getdisponibilidad, 
      } from "../servicios/contratos";
import {
  getproductoscategoria,
  setproducto,
  delproducto,
} from "../servicios/productos";
import supabase from "./connection";


async function setProductoCM(
    
  user,
    producto,
    categoria,
    nick,
    contenidofoto,
    desc,
    precio,
    ocupado,
    domicilio,
    agregar,
    marca,
    modelo,
    talla,
    color,
    gps,
    informativo,
    latitud,
    longitud,
    sciudad,
    distanciamax,
    isBase64ToBlob,
  ) {
    let err = "";
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL")
      await setproducto({
        user,
        producto,
        categoria,
        nick,
        desc,
        precio,
        domicilio,
        marca,
        modelo,
        talla,
        color,
        gps,
        informativo,
        latitud,
        longitud,
        ocupado,
        sciudad,
        distanciamax,
        agregar,
        contenidofoto,
      });
    else {
      if (agregar === true) {
        let activo = sessionStorage.getItem("tipouser")==="3"?true:false;
        const { error } = await supabase.from("tablacatproductos").insert({
          iduser: user,
          categorianegocio: categoria,
          nick,
          desc,
          precio,
          domicilio,
          marca,
          modelo,
          cantidad: talla,
          color,
          gpssn: gps,
          info: informativo,
          latitud,
          longitud,
          ocupado: 0,
          distanciamax,
          sciudad,
          activo: activo,
         });
        if (isValid(error) === true && error.length === 0) {
          err = error;
        } else {
          const { data, error } = await supabase
            .from("tablacatproductos")
            .select("*")
            .order("idproducto", { ascending: false })
            .limit(1);
          if (isValid(error) === false) {
            await uploadBase64Image(
              contenidofoto,
              "galerias",
              "productos/" +
                data[0].idproducto +
                "/" +
                data[0].idproducto +
                ".jpg",
              isBase64ToBlob, "tablacatproductos", "idproducto", data[0].idproducto
            );
            err = error;
          }
        }
      } else {
        let distanciamaxT = Number(distanciamax);
        const { error } = await supabase
          .from("tablacatproductos")
          .update({
            iduser: user,
            categorianegocio: categoria,
            nick: nick,
            desc: desc,
            precio: precio,
            domicilio: domicilio,
            marca: marca,
            modelo: modelo,
            cantidad: talla,
            color: color,
            gpssn: gps,
            info: informativo,
            latitud: latitud,
            longitud: longitud,
            ocupado: ocupado,
            distanciamax: distanciamaxT,
            sciudad: sciudad,
          })
          .eq("idproducto", producto);
        if (isValid(error) === false)
          uploadBase64Image(
            contenidofoto,
            "galerias",
            "productos/" + producto + "/" + producto + ".jpg",
            isBase64ToBlob, "tablacatproductos", "idproducto", producto
          );
        err = error;
      }
    }
    return err;
  }
  
  function generaVistaGetProductosCategoria(producto, categoria, user, tipouser) {
    let condicion = "";
    if (isValid(producto) === true) {
      condicion =
        condicion === ""
          ? " where (tablacatproductos.idproducto=" + producto + ")"
          : " and (tablacatproductos.idproducto=" + producto + ")";
    }
    if (isValid(categoria) === true && categoria !== "0") {
      condicion =
        condicion === ""
          ? " where (tablacatproductos.categorianegocio=" + categoria + ")"
          : " and (tablacatproductos.categorianegocio=" + categoria + ")";
    }
    if (isValid(user) === true && tipouser !== "3") {
      condicion =
        condicion === ""
          ? " where (tablacatproductos.iduser='" + user + "')"
          : condicion + " and (tablacatproductos.iduser='" + user + "')";
    }
  
    let sql =
      "CREATE OR REPLACE VIEW getproductoscategoria AS select tablacatproductos.*  from tablacatproductos" +
      condicion;
  
    return sql;
  }
  
  async function getproductoscategoriaCM(user, tipouser, categoria, producto) {
    let resultproductos = [];
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
      resultproductos = await getproductoscategoria({
        user,
        tipouser,
        categoria,
        producto,
      });
      resultproductos = await resultproductos.json();
    } else {
      // Generar VISTA con API en SUPABASE
      let sql = generaVistaGetProductosCategoria(
        producto,
        categoria,
        user,
        tipouser
      );
      await supabase.rpc("exec_sql", { query: sql });
      // Ejecutar VISTA
      const { data, error } = await supabase.from("getproductoscategoria").select("*");
      resultproductos = data;
    }
    return resultproductos;
  }
  
  async function delProductoCM(producto) {
    let err = "";
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
      const error = await delproducto({ producto });
      err = error;
    } else {
      const { error } = await supabase
        .from("tablacatproductos")
        .delete()
        .eq("idproducto", producto);
      err = error;
    }
    return err;
  }
  
  async function GeneraVistaGetProductos(categoria, userAnuncio, buscar) {
    let condicion1 =
      categoria === "0" || isValid(categoria) === false || categoria === ""
        ? ""
        : " and (tablacatproductos.categorianegocio=" + categoria + ")";
    let condicion2 =
      isValid(userAnuncio) === false || userAnuncio === ""
        ? ""
        : " and (tablacatproductos.iduser='" +
          userAnuncio +
          "') and (tablausuarios,activo=true)";
    let condicion3 = "";
    if (isValid(buscar) === true && buscar !== "") {
      let busquedas = buscar.split(" ");
      busquedas.forEach((item) => {
        if (item.toUpperCase().indexOf("PLAZAS") !== -1) {
          let plazas = item.toUpperCase().split("P");
          condicion3 =
            condicion3 + " and (tablacatproductos.talla>=" + plazas[0] + ")";
        } else
          condicion3 =
            condicion3 +
            " and (POSITION('" +
            item.toUpperCase() +
            `' IN UPPER(tablacatproductos."desc"))>0)`;
      });
    }
    let sql =
      "CREATE OR REPLACE VIEW getProductos AS SELECT DISTINCT tablacatproductos.idproducto as idproducto,tablacatproductos.nick as producto, " +
      "tablacatproductos.desc as descripcion, tablausuarios.nombre as negocio, tablausuarios.iduser as idnegocio, ocupado, tipouser, " + 
      "tablausuarios.iduser, tarifa, costoDomicilio, domicilio, tablacatproductos.idsb, tablacatproductos.link, tablacategorias.estado, tablacategorias.info, tablacatproductos.info as isinfo FROM tablacatproductos, tablausuarios, " + 
      "tablacatprovincias, tablacatmunicipios, tablacategorias WHERE (tablacatproductos.iduser=tablausuarios.iduser) and (tablacatprovincias.provincia=tablausuarios.provincia)" +
      " and (tablacatmunicipios.provincia=tablausuarios.provincia) and (tablacatmunicipios.municipio=tablausuarios.municipio) and (tablausuarios.activo=true)" +
      " and (tablacatproductos.activo=true) and (tablacategorias.categorianegocio=tablacatproductos.categorianegocio) " + condicion1 + condicion2 + condicion3;
    return sql;
  }
  
  async function getProductosCM(categoria, userAnuncio, buscar) {
    let result1 = [];
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
      result1 = await getproductos({ categoria, userAnuncio, buscar });
      result1 = await result1.json();
    } else {
      // Generar VISTA con API en SUPABASE
      let sql = await GeneraVistaGetProductos(categoria, userAnuncio, buscar);
      let error = await supabase.rpc("exec_sql", { query: sql });
      // Ejecutar VISTA
      const { data } = await supabase.from("getproductos").select("*");
      result1 = data;
    }
    return result1;
  }
  
  async function getProductosNewCM(idproducto) {
    let resultProduct = [];
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
      resultProduct = await getProductoNew({ idproducto });
      resultProduct = await resultProduct.json();
    } else {
      const { data } = await supabase
        .from("getproductonew")
        .select("*")
        .eq("idproducto", idproducto);
      resultProduct = data;
    }
    return resultProduct;
  }
  
  async function getProductosActivaCM(activo) {
    let resultProduct = [];
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
  //    resultProduct = await getProductoNew({ idproducto });
      //resultProduct = await resultProduct.json();
    } else {
      const { data } = await supabase
        .from("tablacatproductos")
        .select("*")
        .eq("activo", activo);
      resultProduct = data;
    }
    return resultProduct;
  }
  
  async function setProductosActivaCM(idproducto) {
    let resultProduct = [];
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
  //    resultProduct = await getProductoNew({ idproducto });
      //resultProduct = await resultProduct.json();
    } else {
      const { data } = await supabase
        .from("tablacatproductos")
        .update({activo: true})
        .eq("idproducto", idproducto);
      resultProduct = data;
    }
    return resultProduct;
  }
  
  async function getParesGpsProductoCM(categoria, producto) {
    let result = [];
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
      result = await getParesGpsNaturalezaNew({
        categoria: categoria,
        idproducto: producto,
      });
      result = await result.json();
    } else {
      const { data } = await supabase
        .from("getparesgpsproducto")
        .select("*")
        .eq("idproducto", producto);
      result = data;
    }
    return result;
  }
  
  async function getInfoProductoCM(producto) {
    let result = [];
    if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
      result = await getinfoproducto({ idproducto: producto });
      result = await result.json();
    } else {
      const { data, error } = await supabase
        .from("getinfoproducto")
        .select("*")
        .eq("idproducto", producto);
      result = data;
    }
    return result;
  }
  
  async function getDisponibilidad(producto, movimiento){
    let datos;
    if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL") {
      datos = await getdisponibilidad({});
      datos = await datos.json();
      return datos;
    } else {
      let sql = crearVistaReservar(producto, movimiento)
      let {error:err}=await supabase.rpc("exec_sql", { query: sql });
      if (isValid(err)===false || err.length>0){
      const { data } = await supabase.from("getdisponibilidad").select("*");
      return data;
      }
      else return ([]);
    }
  }
  
  function crearVistaProductosCategoriaCliente(user, categoria){
    return "create or replace view public.getproductoscategoriacliente as SELECT distinct tablacatproductos.idproducto, tablacatproductos.nick, tablacatproductos.cantidad from tablamovimientos, tablacatproductos, tablacategorias" +
           " where (tablacategorias.categorianegocio=tablacatproductos.categorianegocio) and (tablacatproductos.idproducto=tablamovimientos.idproducto) and (tablamovimientos.iduser='" + user + "')" +
           " and (tablacatproductos.categorianegocio=" + categoria + ")";
  }
  
  function crearVistaProductosCategoriaDueño(user, categoria){
    return "create or replace view public.getproductoscategoriadueño as SELECT distinct tablacatproductos.idproducto, tablacatproductos.nick, tablacatproductos.cantidad from tablamovimientos, tablacatproductos, tablacategorias" +
           " where (tablacategorias.categorianegocio=tablacatproductos.categorianegocio) and (tablacatproductos.idproducto=tablamovimientos.idproducto) and (tablacatproductos.iduser='" + user + "')" + 
           " and (tablacategorias.categorianegocio='" + categoria + "')";
  }
  
  function crearVistaProductosCategoriaAdmin(categoria){
    return "create or replace view public.getproductoscategoriaadmin as SELECT distinct tablacatproductos.idproducto, tablacatproductos.nick, tablacatproductos.cantidad from tablamovimientos, tablacatproductos, tablacategorias" +
           " where (tablacategorias.categorianegocio=tablacatproductos.categorianegocio) and (tablacatproductos.idproducto=tablamovimientos.idproducto) and (tablacatproductos.categorianegocio=" + 
           categoria + ")";
  }
  
  async function getProductosCategoriaContrato(user, tipouser, categoria ){
    let datos;
    if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL") {
      datos = await getproductoscategoria({user, tipouser, categoria});
      datos = await datos.json();
      return datos;
    } else {
      if (Number(tipouser) === 0) {
        let sql = crearVistaProductosCategoriaCliente(user, categoria)
        let {error:err}=await supabase.rpc("exec_sql", { query: sql });
        if (isValid(err)===false || err.length>0){
        const { data } = await supabase.from("getproductoscategoriacliente").select("*");
        return data;
        }
        else return ([]);
      }
      if (tipouser === 1 || tipouser === 2) {
        let sql = crearVistaProductosCategoriaDueño(user, categoria);
        let {error:err}=await supabase.rpc("exec_sql", { query: sql });
        if (isValid(err)===false || err.length>0){
        const { data } = await supabase.from("getproductoscategoriadueño").select("*");
        return data;
        }
        else return ([]);
        }
    
      if (tipouser === 9 || tipouser === 3) {
        let sql = crearVistaProductosCategoriaAdmin(categoria)
        let {error:err}=await supabase.rpc("exec_sql", { query: sql });
        if (isValid(err)===false || err.length>0){
        const { data } = await supabase.from("getproductoscategoriaadmin").select("*");
        return data;
        }
        else return ([]);
      }
    }
  }
  
  
  export {
    getInfoProductoCM,
    getParesGpsProductoCM,
    getproductoscategoriaCM,
    getProductosCM,
    getProductosNewCM,
    getProductosActivaCM,
    getDisponibilidad,
    getProductosCategoriaContrato,
  };
  
  export {
    setProductoCM,
    setProductosActivaCM,
  };
  
    
  export {
    delProductoCM,
  };
  