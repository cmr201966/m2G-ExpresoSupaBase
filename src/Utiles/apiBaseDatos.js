import {  isValid, uploadBase64Image} from "./Utiles";
import { getCategoriasNew } from "../servicios/home";
import { getCategoriasNegocios } from "../servicios/catalogos";
import { getAplicaciones, setAplicaciones } from "../servicios/aplicaciones";
import { login } from "../servicios/login";
import { getprovincias, getmunicipios } from "../servicios/catalogos";
import { getdatosiduser, setregistrarse } from "../servicios/registrarse";
import { getinfoproducto } from "../servicios/productos";
import { getParesGpsNaturalezaNew } from "../servicios/naturalezas";
import { getinfonegocio } from "../servicios/negocios";
import { getparesgpscategoria, delAnuncio } from "../servicios/catalogos";
import {getproductos, setMovimientosNew, updateOcupado,getProductoNew,} from "../servicios/productos";
import { setCategoriasNegocios, delCategoria } from "../servicios/catalogos";
import { getcategoriasnegociosapp } from "../servicios/negocios";
import {
  getproductoscategoria,
  setproducto,
  delproducto,
} from "../servicios/productos";
import { getusuarios } from "../servicios/registrarse";
import { setconfig, getconfig } from "../servicios/config";
import supabase from "./connection";

async function getanunciosCM() {
  let datos;
  if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL") {
    datos = await getAplicaciones({});
    datos = await datos.json();
    return datos;
  } else {
    const { data } = await supabase
      .from("tablaanuncios")
      .select("*")
      .order("orden", { ascending: true })
      .eq("activo", true);
    return data;
  }
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
    condicion + " and (app=true) order by destodo"
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
  insertar,
  contenidofoto,
  isBase64ToBlob
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
      .insert({ desc: desc, link: link, accion: accion, nick: nick, activo: true, anuncio: true, app: true });
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
      .update({ desc: desc, link: link, accion: accion, nick: nick })
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

async function loginCM(param1, param2) {
  let result = [];
  let err = undefined;
  if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
    result = await login({ user: param1, password: param2 });
    result = await result.json();
    err = result.error;
    return err, result;
  } else {
    const { data, error } = await supabase
      .from("tablausuarios")
      .select("*")
      .eq("iduser", param1.toLowerCase())
      .eq("pw", param2.toLowerCase())
      .eq("activo", true);
    err = error;
    result = data;
    return err, result;
  }
}

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

async function getdatosuserCM(user) {
  let result = [];
  if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
    result = await getdatosiduser({ user });
    result = await result.json();
    return result;
  } else {
    const { data } = await supabase
      .from("tablausuarios")
      .select("*")
      .eq("iduser", user)
      .eq("activo", true)
      .order("nombre", { ascending: true });
    result = data;
    return result;
  }
}
async function setregistrarseCM(
  user,
  nombre,
  password,
  celular,
  provincia,
  municipio,
  contenidofoto,
  modifica,
  plan,
  lat,
  lng,
  isBase64ToBlob,
  datos,
  otrosDatos
) {
  let response = [];
  let err;
  if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
    response = await setregistrarse({
      user,
      nombre,
      password,
      celular,
      provincia: provincia,
      municipio: municipio,
      contenidofoto,
      modifica,
      plan,
      lat,
      lng,
    });
    response = await response.json();
    err = response.error;
    return err;
  } else {
    if (modifica === false) {
      const activo=sessionStorage.getItem("tipouser")==="3"?true:false;
      const gpssn=1;
      const { error } = await supabase.from("tablausuarios").insert({
        iduser: user,
        nombre: nombre,
        pw: password,
        celular: celular,
        provincia: provincia,
        municipio: municipio,
        tipouser: plan,
        latitud: lat,
        longitud: lng,
        activo: activo,
        datos: datos,
        otrosdatos: otrosDatos,
        gpssn: gpssn,
      });
      err = error;
      if (isValid(error) === false) {
        const { error, data } = await supabase
          .from("tablausuarios")
          .select("*")
          .order("id", { ascending: false })
          .limit(1);
        if (isValid(error) === false) {
          err = await uploadBase64Image(
            contenidofoto,
            "galerias",
            "usuarios/" + data[0].iduser + "/" + data[0].iduser + ".jpg",
            isBase64ToBlob, "tablausuarios", "iduser", data[0].iduser
          );
        }
      }
      return err;
    } else {
      const { error } = await supabase
        .from("tablausuarios")
        .update({
          nombre: nombre,
          pw: password,
          celular: celular,
          provincia: provincia,
          municipio: municipio,
          tipouser: plan,
          latitud: lat,
          longitud: lng,
          datos: datos,
          otrosdatos: otrosDatos,
        })
        .eq("iduser", user);
      err = error;
      if (isValid(error) === false) {
        err = uploadBase64Image(
          contenidofoto,
          "galerias",
          "usuarios/" + user + "/" + user + ".jpg",
          isBase64ToBlob, "tablausuarios", "iduser", user
        );
      }
      return err;
    }
  }
}

async function getAplicacionesCM() {
  let result = [];
  if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
    result = await getAplicaciones({});
    result = await result.json();
  } else {
    const { data} = await supabase
      .from("tablaanuncios")
      .select("*")
      .eq("activo", true)
    result = data;
  }
  return result;
}

async function setAplicacionesCM(
  id,
  user,
  nick,
  desc,
  tooltip,
  categoria,
  agregarsn,
  contenidofoto,
  isBase64ToBlob,
  contenidofotomovil,
  isBase64ToBlobMovil,
) {
  let err = "";
  if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
    let result = await setAplicaciones({
      id,
      iduser: user,
      nick,
      desc,
      tooltip,
      categoria,
      agregarsn,
      contenidofoto,
    });
    result = await result.json();
    err = result.error;
  } else {
    if (agregarsn === true) {
      let activo=sessionStorage.getItem("tipouser")==='3'?true:false;
      const { error } = await supabase.from("tablaanuncios").insert({
        idapp: nick,
        iduser: user,
        desc: desc,
        idcategoria: categoria,
        tooltip: tooltip,
        activo: activo,
      });
      if (isValid(error) === true) err = error;
      else {
        const { data, error } = await supabase
          .from("tablaanuncios")
          .select("*")
          .order("id", { ascending: false })
          .limit(1);
        if (isValid(error) === false && contenidofoto!=="") {          
            await uploadBase64Image(
            contenidofoto,
            "galerias",
            "aplicaciones/" + data[0].id + "/" + data[0].id + ".jpg",
            isBase64ToBlob, "tablaanuncios","id",data[0].id
            );
            err = error;
        }
        if (isValid(error) === false && contenidofotomovil!=="") {          
          await uploadBase64Image(
          contenidofotomovil,
          "galerias",
          "aplicaciones/" + data[0].id + "/" + data[0].id + "-movil.jpg",
          isBase64ToBlobMovil, "tablaanuncios","id",data[0].id
          );
          err = error;
      }
    }
    } else {
      const { data, error } = await supabase
        .from("tablaanuncios")
        .update({
          idapp: nick,
          iduser: user,
          desc: desc,
          idcategoria: categoria,
          tooltip,
        })
        .eq("id", id);
        if (isValid(error) === false && contenidofoto!=="") { 
          uploadBase64Image(
          contenidofoto,
          "galerias",
          "aplicaciones/" + id + "/" + id + ".jpg", 
          isBase64ToBlob, "tablaanuncios","id", id
        );
      }
      if (isValid(error) === false && contenidofotomovil!=="") {          
        await uploadBase64Image(
        contenidofotomovil,
        "galerias",
        "aplicaciones/" + id + "/" + id + "-movil.jpg",
        isBase64ToBlobMovil, "tablaanuncios","id", id
        );
        err = error;
    }
      err = error;
    }
  }
  return err;
}

async function creaBucketCM(bucket) {
  const { data } = await supabase.storage.listBuckets();
  const bucketExists = data.some((bucket) => bucket.name === bucket);
  if (bucketExists === false) {
    await supabase.storage.createBucket(bucket);
  }
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

async function getInfoNegocioCM(idnegocio) {
  let result = [];
  if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
    result = await getinfonegocio({ idnegocio });
    result = await result.json();
  } else {
    const { data } = await supabase
      .from("getinfonegocio")
      .select("*")
      .eq("idnegocio", idnegocio);
    result = data;
  }
  return result;
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

async function setMovimientosNewCM(
  idmovimiento,
  idproducto,
  latOrigen,
  latDestino,
  lngOrigen,
  lngDestino,
  precio,
  kms,
  user
) {
  if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
    await setMovimientosNew({
      idmovimiento,
      idproducto,
      latOrigen,
      latDestino,
      lngOrigen,
      lngDestino,
      precio,
      kms,
      user,
    });
  } else {
    // SUPABASE
    // Busca que dinero tiene el user en su billetera
    const { data } = await supabase
      .from("getbilleteracup")
      .select("*")
      .eq("idproducto", idproducto);
    let pagado = 0;
    if (data[0].billeteracup >= data[0].costodomicilio) pagado = 1;
    // Conforma fecha y hora del viaje
    const fechaNow = new Date();
    const fecha =
      fechaNow.getFullYear() +
      "-" +
      (fechaNow.getMonth() + 1) +
      "-" +
      fechaNow.getDate();
    const hora = fechaNow.getHours() + ":" + fechaNow.getMinutes();
    await supabase.from("tablamovimientos").insert({
      idmovimiento,
      idproducto,
      precio,
      kms,
      fecha,
      hora,
      latOrigen,
      latDestino,
      lngOrigen,
      lngDestino,
      pagado,
      user,
    });
    if (pagado === 1) {
      // Rebaja del dinero que tenga el costo del domicilio
      await supabase
        .from("tablamovimientos")
        .update({
          billeteraCUP: supabase.raw("billeteraCUP - ?", [
            data[0].costodomicilio,
          ]),
        })
        .eq("iduser", user);
    }
  }
}

async function updateOcupadoCM(idproducto, ocupado) {
  if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
    await updateOcupado({ idproducto, ocupado });
  } else {
    await supabase
      .from("tablacatproductos")
      .update({ ocupado: ocupado })
      .eq("idproducto", idproducto);
  }
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
    await supabase.rpc("exec_sql", { query: sql });
    const { data } = await supabase.from("getparesgpscategoria").select("*");
    resultgps = data;
  }
  return resultgps;
}
async function CreaTablaBaseDatos(){
  //ESTRUCTURAS
  const sqlProvincias = "create table public.tablacatprovincias (provincia bigint generated by default as identity not null, desc text not null, latitud double precision null default '0'::double precision, longitud double precision null default '0'::double precision, zoom real null default '0'::real, constraint tablaprovincias_pkey primary key (provincia)) tablespace pg_default;"
  const sqlMunicipios = 'create table public.tablacatmunicipios (provincia smallint not null, municipio smallint not null, "desc" text null,latitud double precision null,longitud double precision null,constraint tablacatmunicipios_pkey primary key (provincia, municipio),constraint tablacatmunicipios_provincia_fkey foreign key (provincia) references tablacatprovincias (provincia) on update cascade on delete restrict) tablespace pg_default;'
  const sqlUsuarios="create table public.tablausuariosPrueba (nombre text null default ''::text, tipouser smallint not null, pw text null, celular text null default ''::text, provincia smallint null, municipio smallint null, latitud double precision null, longitud double precision null, iduser text not null, billeteracup real null, gpssn double precision null, activo boolean null default false, id smallint generated by default as identity not null, idsb text null default ''::text, datos text null default ''::text, otrosdatos text null default ''::text, nophoto smallint null default '0'::smallint, constraint tablausuarios_usuariospkey primary key (iduser)) tablespace pg_default;"
  const sqlConfig = "create table public.tablaconfigPrueba (provincia smallint not null, municipio smallint not null, idapp text null default ''::text, constraint tablaconfigprueba_pkey primary key (provincia, municipio)) tablespace pg_default;"
  const sqlMovimientos = "create table public.tablamovimientos (id bigint generated by default as identity not null,idmovimiento smallint not null,idproducto smallint null,fecha date null,precio real null,kms real null,hora time without time zone null,\latOrigen\ double precision null,\"lngOrigen\" real null,\"latDestino\" real null,\"lngDestino\" real null,pagado smallint null,iduser text null,constraint tablamovimientos_pkey primary key (id),constraint tablamovimientos_idmovimiento_fkey foreign key (idmovimiento) references tablacatmovimientos (idmovimiento) on update cascade on delete restrict) tablespace pg_default;"
  const sqlChat = "create table public.tablachat (idmsg bigint generated by default as identity not null, \"userOut\" text not null,\"userIn\" text null,\"desc\" text null,constraint tablachat_pkey primary key (idmsg)) tablespace pg_default;"
  const sqlmovimientos = "create table public.tablacatmovimientos (idmovimiento bigint generated by default as identity not null,descripcion text not null,constraint tablacatmovimientos_pkey primary key (idmovimiento)) tablespace pg_default;"
  const sqlcategorias = "create table public.tablacategorias (\"desc\" text null default ''::text,destodo smallint null default '9999'::smallint,link text null default ''::text,accion text null default ''::text,categorianegocio integer generated by default as identity not null,nick text null default ''::text,idsb text null default ''::text,activo boolean null default false,anuncio boolean null default true,app boolean null default true,estado text null default ''::text,constraint tablacategorias_pkey primary key (categorianegocio)) tablespace pg_default;"
  const sqlanuncios = "create table public.tablaanuncios (id bigint generated by default as identity not null,idapp text null default ''::text,iduser text null,idcategoria smallint null,\"desc\" text null,tooltip text null,activo boolean null default false,orden smallint null default '0'::smallint,idsb text null default ''::text,nophoto smallint null default '0'::smallint,link text null default ''::text,constraint tablaaplicaciones_pkey primary key (id),constraint tablaAnuncios_iduser_fkey foreign key (iduser) references tablausuarios (iduser) on update cascade on delete restrict,constraint tablaanuncios_idcategoria_fkey foreign key (idcategoria) references tablacategorias (categorianegocio) on update cascade on delete restrict) tablespace pg_default;"
  const sqlacreditar="create table public.tablaacreditacion (idacredita bigint generated by default as identity not null,cuentaorigen text not null,phoneorigen text null,importe smallint null,transaccion text null,iduser text null,constraint tablaacreditacion_pkey primary key (idacredita),constraint tablaacreditacion_iduser_fkey foreign key (iduser) references tablausuarios (iduser) on update cascade on delete restrict) tablespace pg_default;"
  const sqlgetproductonew="create or replace view public.getproductonew as select tablacatproductos.idproducto, tablacatproductos.marca, tablacatproductos.color, tablacatproductos.modelo as chapa, tablausuarios.celular, tablacatproductos.nick from tablacatproductos, tablausuarios where tablacatproductos.iduser = tablausuarios.iduser and tablacatproductos.activo = true and tablausuarios.activo = true;"
  const sqlgetparesgpsproducto="create or replace view public.getparesgpsproducto as select tablacatproductos.idproducto, tablacatproductos.latitud, tablacatproductos.longitud, tablacatproductos.ocupado, tablacatproductos.\"desc\" as nombre, tablacatproductos.distanciamax, tablacatproductos.sciudad from tablacatproductos where tablacatproductos.latitud <> 0::double precision and tablacatproductos.longitud <> 0::double precision;"
  const sqlgetparesgpscategoria ="create or replace view public.getparesgpscategoria as select tablausuarios.celular, tablacatproductos.latitud, tablacatproductos.longitud, tablacatproductos.ocupado, tablacatproductos.idproducto, tablacatproductos.\"desc\" as nombre, tablacatproductos.tarifa, tablacatproductos.costodomicilio, tablacatproductos.domicilio, tablacatproductos.distanciamax, tablacatproductos.sciudad, tablacatproductos.nick from tablacatproductos, tablausuarios where tablacatproductos.ocupado = 0 and tablacatproductos.iduser = tablausuarios.iduser and tablacatproductos.activo = true and tablausuarios.activo = true and tablacatproductos.categorianegocio = 51;"
  const sqlgetinfoproducto ="create or replace view public.getinfoproducto as select distinct tablacatproductos.idproducto, tablacatproductos.nick as producto, tablausuarios.nombre as negocio, tablausuarios.iduser as idnegocio,tablacatproductos.precio, tablacatproductos.ocupado, tablacatproductos.latitud, tablacatproductos.longitud, tablacatproductos.gpssn, tablacatproductos.tarifa, tablacatproductos.domicilio, tablacatproductos.costodomicilio, tablacatproductos.color, tablacatproductos.marca, tablacatproductos.modelo as chapa, tablausuarios.celular, tablacategorias.accion, tablacatproductos.idsb from tablacatproductos, tablausuarios, tablacategorias where tablacatproductos.iduser = tablausuarios.iduser and tablausuarios.activo = true and tablacatproductos.activo = true and tablacatproductos.categorianegocio = tablacategorias.categorianegocio;"
  const sqlgetinfonegocio="create or replace view public.getinfonegocio as select tablausuarios.iduser as idnegocio, tablausuarios.nombre as negocio, tablausuarios.celular, tablausuarios.nombre, tablacatprovincias.\"desc\" as provincia, tablausuarios.tipouser, tablacatmunicipios.\"desc\" as municipio, tablausuarios.latitud, tablausuarios.longitud, tablausuarios.gpssn, tablausuarios.idsb, tablausuarios.datos, tablausuarios.otrosdatos from tablausuarios, tablacatprovincias, tablacatmunicipios where tablausuarios.provincia = tablacatprovincias.provincia and tablausuarios.provincia = tablacatmunicipios.provincia and tablausuarios.municipio = tablacatmunicipios.municipio and tablausuarios.activo = true;"
  const sqlproductos="create table public.tablacatproductos (idproducto bigint generated by default as identity not null, iduser text not null default ''::text, nick text null default ''::text, \"desc\" text null default ''::text, preciocosto smallint null default '0'::smallint, precio smallint null default '0'::smallint, color text null default ''::text, talla text null default ''::text, marca text null default ''::text, modelo text null default ''::text, ocupado smallint null default '0'::smallint, domicilio smallint null default '0'::smallint, reservar smallint null default '0'::smallint, gpssn smallint null default '0'::smallint, latitud double precision null default '0'::double precision, longitud double precision null default '0'::double precision, cola integer null default 0, tarifa smallint null default '0'::smallint, costodomicilio smallint null default '0'::smallint, cantidad real null, sciudad smallint null, distanciamax smallint null, categorianegocio integer null default 0, activo boolean null default false, imagen boolean null default false, update text null default ''::text, idsb text null default ''::text, nophoto smallint null default '0'::smallint, link text null default ''::text, constraint tablacatproductos_pkey primary key (idproducto), constraint tablacatproductos_categorianegocio_fkey foreign key (categorianegocio) references tablacategorias (categorianegocio) on update cascade on delete restrict, constraint tablacatproductos_iduser_fkey foreign key (iduser) references tablausuarios (iduser) on update cascade on delete restrict) tablespace pg_default;"

  // POLITICAS
  const sqlPoliceConfig= "create policy 'configprueba' on 'public'.'tablaconfigprueba' as PERMISSIVE for ALL to public using (true);"
  const sqlPoliceUsuarios= "create policy 'usuariosprueba' on 'public'.'tablausuariosprueba' as PERMISSIVE for ALL to public using (true);"

  //INSERT
  const sqlInsertProvincias = "INSERT INTO 'public'.'tablacatprovincias' ('provincia', \"desc\", 'latitud', 'longitud', 'zoom') VALUES ('1', 'Pinar del Rio', '22.4049256901199', '-83.6969922759527', '0'), ('2', 'Artemisa', '22.8152137295944', '-82.757826453475', '0'), ('3', 'Mayabeque', '22.964643056655', '-82.1528826900769', '0'), ('4', 'La Habana', '23.1370325338752', '-82.3536985082401', '0'), ('5', 'Matanzas', '23.0435941125689', '-81.5764859361438', '0'), ('6', 'Villa Clara', '22.405310690521', '-79.9587054315577', '0'), ('7', 'Cienfuegos', '22.0655653561128', '-80.4661223514087', '0'), ('8', 'Santi Spiritus', '21.9210518125642', '-79.4088924601421', '0'), ('9', 'Ciego de Avila', '21.8312212843561', '-78.7529032437595', '0'), ('10', 'Camaguey', '21.3755752598362', '-77.916545551687', '0'), ('11', 'Las Tunas', '20.9544083432017', '-76.9530802974038', '0'), ('12', 'Holguin', '20.8744815707728', '-76.2550077633322', '0'), ('13', 'Granma', '20.3696180259046', '-76.6374354771797', '0'), ('14', 'Santiago de Cuba', '20.0174201604909', '-75.8165229155651', '0'), ('15', 'Guantanamo', '20.1383170244923', '-75.1995749840447', '0'), ('16', 'Isla de la Juventud', '21.6664269473949', '-82.839217838734', '0');"
  const sqlInsertMunicipios = "INSERT INTO 'public'.'tablacatmunicipios' ('provincia', 'municipio', \"desc\", 'latitud', 'longitud') VALUES ('1', '1', 'Sandino', '22.0822869559032', '-84.2050223762222'), ('1', '2', 'Mantua', '22.2915045275451', '-84.2821191283475'), ('1', '3', 'Minas de Matahambre', '22.5904069218384', '-83.9437743815312'), ('1', '4', 'Viñales', '22.6159961351068', '-83.7090993263063'), ('1', '5', 'La Palma', '22.7484083600927', '-83.5535799585915'), ('1', '6', 'Los Palacios', '22.5871255655011', '-83.2485602938624'), ('1', '7', 'Consolación del Sur', '22.5038039697759', '-83.5173893695182'), ('1', '8', 'Pinar del Río', '22.4172362385881', '-83.6955324281449'), ('1', '9', 'San Luis', '22.27738554133', '-83.76030098448'), ('1', '10', 'San Juan y Martínez', '22.2812002625766', '-83.837468696218'), ('1', '11', 'Guane', '22.2039149729964', '-84.0848345687023'), ('2', '1', 'Bahía Honda', '22.9027495249302', '-83.1620374614224'), ('2', '2', 'Mariel', '22.9912361182247', '-82.7539458350309'), ('2', '3', 'Guanajay', '22.9283782236913', '-82.6884034334369'), ('2', '4', 'Caimito', '22.9525780306698', '-82.5943712681944'), ('2', '5', 'Bauta', '22.9827111288856', '-82.5469449538202')," +
  " ('2', '6', 'San Antonio de los Baños', '22.8899876726302', '-82.5064797138705'), ('2', '7', 'Guira de Melena', '22.798891961771', '-82.5079751012842'), ('2', '8', 'Alquizar', '22.8052782681711', '-82.5845527746208'), ('2', '9', 'Artemisa', '22.8150763633535', '-82.7586988735792'), ('2', '10', 'Candelaria', '22.7427821069616', '-82.9615341176266'), ('2', '11', 'San Cristóbal', '22.7148701793584', '-83.0481355726065'), ('3', '1', 'Bejucal', '22.9285667701407', '-82.388381295345'), ('3', '2', 'San José de Las Lajas', '22.9615898789825', '-82.1490587757246'), ('3', '3', 'Jaruco', '23.0439406559842', '-82.0100154192889'), ('3', '4', 'Santa Cruz del Norte', '23.1524558715374', '-81.9224713764341'), ('3', '5', 'Madruga', '22.9099370344151', '-81.857012739563'), ('3', '6', 'Nueva Paz', '22.7642804089039', '-81.7573406871027'), ('3', '7', 'San Nicolás', '22.7872020436833', '-81.9195981534378'), ('3', '8', 'Guines', '22.8367212888151', '-82.0275043312975'), ('3', '9', 'Melena del Sur', '22.7882673464521', '-82.152624401802'), ('3', '10', 'Batabanó', '22.7182255511587', '-82.287494958722'), ('3', '11', 'Quivicán', '22.8241068843134', '-82.3552048121238'), ('4', '1', 'Playa', '23.0930847843302', '-82.4543243364022'), " + 
  "('4', '2', 'Plaza de la Revolución', '23.124444', '-82.386111'), ('4', '3', 'Centro Habana', '23.133333', '-82.383333'), ('4', '4', 'Habana Vieja', '23.135944', '-82.358333'), ('4', '5', 'Regla', '23.1268740657445', '-82.3321873525773'), ('4', '6', 'Habana del Este', '23.1727899802232', '-82.2144172442626'), ('4', '7', 'Guanabacoa', '23.1223270196981', '-82.3076006914262'), ('4', '8', 'San Miguel del Padrón', '23.0975089234406', '-82.3276733141427'), ('4', '9', '10 de Octubre', '23.088056', '-82.359722'), ('4', '10', 'Cerro', '23.1155155887538', '-82.375267180637'), ('4', '11', 'Marianao', '23.0745799996304', '-82.4300000886888'), ('4', '12', 'La Lisa', '23.0650632032128', '-82.4496114772402'), ('4', '13', 'Boyeros', '23.0002617613701', '-82.3882498459791'), ('4', '14', 'Arroyo Naranjo', '23.043611', '-82.332778'), ('4', '15', 'Cotorro', '23.0438567579844', '-82.2682084581836'), ('5', '1', 'Matanzas', '23.0461342635799', '-81.5797245910367'), ('5', '2', 'Cárdenas', '23.0386688585669', '-81.2069174272534'), ('5', '3', 'Martí', '22.9483283159933', '-80.9193877798106'), ('5', '4', 'Colón', '22.718229119126', '-80.9063751368588'), ('5', '5', 'Perico', '22.7700795482555', '-81.0196273345668'), " + 
  "('5', '6', 'Jovellanos', '22.8036326464503', '-81.1945656802186'), ('5', '7', 'Pedro Betancourt', '22.7268618459068', '-81.2921360106119'), ('5', '8', 'Limonar', '22.9527980769349', '-81.412250701067'), ('5', '9', 'Unión de Reyes', '22.7962066889096', '-81.5387232421604'), ('5', '10', 'Ciénaga de Zapata', '22.3697277084447', '-81.8741629400945'), ('5', '11', 'Jaguey Grande', '22.5270072715466', '-81.1291307450989'), ('5', '12', 'Calimete', '22.536214500294', '-80.90589107746'), ('5', '13', 'Los Arabos', '22.731973036911', '-80.7200886812927'), ('6', '1', 'Corralillo', '22.9835114861015', '-80.5861124113511'), ('6', '2', 'Quemados de Guines', '22.7888845093155', '-80.2529745968521'), ('6', '3', 'Sagua La Grande', '22.8066909944095', '-80.072625753114'), ('6', '4', 'Encrucijada', '22.6186579721599', '-79.8667726042297'), ('6', '5', 'Camajuaní', '22.4677823341553', '-79.7239694618404'), ('6', '6', 'Caibarién', '22.5223484193846', '-79.4706378298914'), ('6', '7', 'Remedios', '22.4952099249272', '-79.5452692285996'), ('6', '8', 'Placetas', '22.3152111193585', '-79.6535886626491'), ('6', '9', 'Santa Clara', '22.4070970669981', '-79.9657971080553'), ('6', '10', 'Cifuentes', '22.6440073945102', '-80.0461529154428'), " + 
  "('6', '11', 'Santo Domingo', '22.5846363365784', '-80.2431810489113'), ('6', '12', 'Ranchuelo', '22.3758268942698', '-80.1500387091351'), ('6', '13', 'Manicaragua', '22.149917873357', '-79.976454608828'), ('7', '1', 'Aguada de Pasajeros', '22.3833187596562', '-80.8486993741809'), ('7', '2', 'Rodas', '22.3383275169098', '-80.5542860345001'), ('7', '3', 'Palmira', '22.244444', '-80.394444'), ('7', '4', 'Lajas', '22.4157659681689', '-80.2942671746923'), ('7', '5', 'Cruces', '22.3425187795881', '-80.2718614017792'), ('7', '6', 'Cumanayagua', '22.1491395212254', '-80.2029353067612'), ('7', '7', 'Cienfuegos', '22.1453949207173', '-80.4480425246479'), ('7', '8', 'Abreus', '22.2779164200183', '-80.5696490690794'), ('8', '1', 'Yaguajay', '22.3258910917285', '-79.2353906409904'), ('8', '2', 'Jatibonico', '21.9419961047371', '-79.1712513698255'), ('8', '3', 'Taguasco', '22.0025642042677', '-79.2629880195628'), ('8', '4', 'Cabaiguán', '22.0795519817631', '-79.4999715560179'), ('8', '5', 'Fomento', '22.105278', '-79.720278'), ('8', '6', 'Trinidad', '21.8045917099113', '-79.9845950081684'), ('8', '7', 'Sancti Spiritus', '21.9273965241422', '-79.4431648491895'), ('8', '8', 'La Sierpe', '21.7719839021396', '-79.2679461227921'), " + 
  "('9', '1', 'Chambas', '22.19130769617', '-78.9120892270205'), ('9', '2', 'Morón', '22.110833', '-78.627778'), ('9', '3', 'Bolivia', '22.0833093118379', '-78.3402267017623'), ('9', '4', '1ro de Enero', '21.9439593214663', '-78.4295004576523'), ('9', '5', 'Ciro Redondo', '22.0131647652508', '-78.7051485803673'), ('9', '6', 'Florencia', '22.1455133873763', '-78.97422334858'), ('9', '7', 'Majagua', '21.9132505705658', '-79.0008064262062'), ('9', '8', 'Ciego de Avila', '21.8378237304084', '-78.7639316951763'), ('9', '9', 'Venezuela', '21.7376674876055', '-78.793867774798'), ('9', '10', 'Baraguá', '21.6916085389296', '-78.6326988969487'), ('10', '1', 'Carlos Manuel de Céspedes', '21.5748468033276', '-78.2786150140112'), ('10', '2', 'Esmeralda', '21.8495027843292', '-78.1157537870465'), ('10', '3', 'Sierra de Cubitas', '21.7098693106301', '-77.760078935474'), ('10', '4', 'Minas', '21.4864804444016', '-77.604784479461'), ('10', '5', 'Nuevitas', '21.5438769749843', '-77.268655776364'), ('10', '6', 'Guáimaro', '21.0508722741729', '-77.3489784513101'), ('10', '7', 'Sibanicú', '21.2318975691713', '-77.5236293200854'), ('10', '8', 'Camaguey', '21.3658963861763', '-77.9223456355286'), ('10', '9', 'Florida', '21.525608010282', '-78.2257595321704'), " + 
  "('10', '10', 'Vertiente', '21.2563921509563', '-78.1508177392838'), ('10', '11', 'Jimaguayú', '21.241998038851', '-77.8269374453483'), ('10', '12', 'Najasa', '21.0729254288757', '-77.7457850303222'), ('10', '13', 'Santa Cruz del Sur', '20.7185311647873', '-77.9964540672805'), ('11', '1', 'Manatí', '21.3072594741046', '-76.9341947364685'), ('11', '2', 'Puerto Padre', '21.1976470396596', '-76.5977654064888'), ('11', '3', 'Jesús Menéndez', '21.1591314827821', '-76.476417083548'), ('11', '4', 'Majibacoa', '20.8995099465597', '-76.7777030851958'), ('11', '5', 'Las Tunas', '20.9572654290375', '-76.9530864393259'), ('11', '6', 'Jobabo', '20.9028207305087', '-77.2853768040343'), ('11', '7', 'Colombia', '20.9818361162824', '-77.4244660659372'), ('11', '8', 'Amansio Rodríguez', '20.8240126383673', '-77.5785300090217'), ('12', '1', 'Gibara', '21.1101162235771', '-76.127877438194'), ('12', '2', 'Rafael Freyre', '21.0232335614598', '-75.9957573248582'), ('12', '3', 'Banes', '20.95559356704', '-75.7213421463008'), ('12', '4', 'Antillas', '20.8292889834239', '-75.7333183120752'), ('12', '5', 'Báguanos', '20.7482223393538', '-76.0247450971096'), ('12', '6', 'Holguín', '20.8797856635378', '-76.2598417143212'), ('12', '7', 'Calixto García', '20.8627289621445', '-76.6387224246579'), " + 
  "('12', '8', 'Cacocúm', '20.7358211568668', '-76.3260916225293'), ('12', '9', 'Urbano Noris', '20.5959759122799', '-76.134983818069'), ('12', '10', 'Cueto', '20.6421209714953', '-75.9364966300619'), ('12', '11', 'Mayarí', '20.6539268984327', '-75.6775907879464'), ('12', '12', 'Frank País', '20.6645280443595', '-75.2661639021036'), ('12', '13', 'Sagua de Tánamo', '20.5810949234826', '-75.2401635934177'), ('12', '14', 'Moa', '20.652811179495', '-74.9419022964013'), ('13', '1', 'Río Cauto', '20.5564390071833', '-76.918760741937'), ('13', '2', 'Cauto Cristo', '20.5530514876766', '-76.4714728472466'), ('13', '3', 'Jiguaní', '20.3609314843302', '-76.4273464801993'), ('13', '4', 'Bayamo', '20.3628209134522', '-76.6411309981891'), ('13', '5', 'Yara', '20.2679115799203', '-76.9515162526901'), ('13', '6', 'Manzanillo', '20.3369216221683', '-77.1188077059496'), ('13', '7', 'Campechuela', '20.2304016641827', '-77.2822244832913'), ('13', '8', 'Media Luna', '20.1401052146945', '-77.4340681263442'), ('13', '9', 'Niquero', '20.0235049858121', '-77.582651760059'), ('13', '10', 'Pilón', '19.9024136741638', '-77.3174125090455'), ('13', '11', 'Bartolomé Masó', '20.1606990435956', '-76.9472725333336'), ('13', '12', 'Buey Arriba', '20.1706036498702', '-76.7569659188518'), " + 
  " ('13', '13', 'Guisa', '20.2516404994969', '-76.5390508788172'), ('14', '1', 'Contramaestre', '20.3012777771805', '-76.2393929366841'), ('14', '2', 'Mella', '20.3582470968794', '-75.9036912169173'), ('14', '3', 'San Luis', '20.1882437553298', '-75.8499278135448'), ('14', '4', 'II Frente', '20.4146158532612', '-75.5326288045489'), ('14', '5', 'Songo-La Maya', '20.1685531425674', '-75.6457737645023'), ('14', '6', 'Santiago de Cuba', '20.0214771240196', '-75.8294877228033'), ('14', '7', 'Palma Soriano', '20.2111427660328', '-75.9876168244672'), ('14', '8', 'III Frente', '20.1535456890558', '-76.256406720539'), ('14', '9', 'Guamá', '19.9700793913229', '-76.4068634454131'), ('15', '1', 'El Salvador', '20.2149300637379', '-75.228582005083'), ('15', '2', 'Manuel Tames', '20.175479607189', '-75.0568884330355'), ('15', '3', 'Yateras', '19.9907565794806', '-74.9912574958482'), ('15', '4', 'Baracoa', '20.3405636877942', '-74.4969955556968'), ('15', '5', 'Maisi', '20.2462784262081', '-74.1503907324612'), ('15', '6', 'Imias', '20.0677822122823', '-74.631586948136'), ('15', '7', 'San Antonio del Sur', '20.0559518747136', '-74.8082313673228'), ('15', '8', 'Caimanera', '19.9856627876778', '-75.1557615009274'), ('15', '9', 'Guantanamo', '20.1427700238692', '-75.2034996901104'), ('15', '10', 'Niceto Perez', '20.113623816319', '-75.3270592996445'), ('16', '1', 'Isla de la Juventud', '0', '0');"
  const sqlInsertCategorias="INSERT INTO 'public'.'tablacategorias' (\"desc\", 'destodo', 'link', 'accion', 'categorianegocio', 'nick, idsb', 'activo', 'anuncio', 'app', 'estado') VALUES ('Calzados', '9', 'productos', 'Comprar', '1', 'Calzados', '', 'true', 'true', 'false', ''), ('Cafeterías', '9', 'productos', 'Reservar', '2', 'Cafeterías', '', 'true', 'true', 'false', ''), ('Restaurantes', '9', 'productos', 'Reservar', '3', 'Restaurantes', '', 'true', 'true', 'false', ''), ('Conquista la pista de baile !!!', '1', 'productos', 'Reservar', '4', 'Discotecas', 'a35cc04f-a5ba-449c-81c3-7d252f28db2c', 'true', 'true', 'false', ''), ('Bares', '1', 'productos', 'Reservar', '5', 'Bares', '', 'true', 'true', 'false', ''), ('Pizzerias', '9', 'productos', 'Reservar', '6', 'Pizzerias', '', 'true', 'true', 'false', ''), ('Transportes', '0', 'productos', 'Reservar', '7', 'Transportes', '', 'true', 'true', 'false', ''), ('Grupo musicales', '9', 'productos', 'Contratar', '8', 'Musica', '', 'true', 'true', 'false', ''), ('Ediciones Digitales', '9', 'productos', 'Contratar', '9', 'Ediciones Digitales', '', 'true', 'true', 'false', ''), ('Repasadores', '9', 'productos', 'Contratar', '10', 'Repasadores', '', 'true', 'true', 'false', ''), ('TV y accesorios', '9', 'productos', 'Comprar', '11', 'TV y accesorios', '', 'true', 'true', 'false', ''), ('Teléfonos', '9', 'productos', 'Comprar', '12', 'Teléfonos', '', 'true', 'true', 'false', ''), "  + 
  "('Venta de Ropa', '9', 'productos', 'Comprar', '13', 'Venta de Ropa', '', 'true', 'true', 'false', ''), ('Equipos', '5', 'productos', 'Comprar', '14', 'Equipos', '', 'true', 'true', 'false', ''), ('Hoteles', '2', 'productos', 'Reservar', '15', 'Hoteles', '', 'true', 'true', 'false', ''), ('Fabricas/Talleres', '9', 'productos', '', '16', 'Fabricas/Talleres', '', 'true', 'true', 'false', ''), ('Salón de belleza', '9', 'productos', '', '17', 'Salón de belleza', '', 'true', 'true', 'false', ''), ('Venta de garaje', '9', 'productos', 'Comprar', '18', 'Venta de garaje', '', 'true', 'true', 'false', ''), ('Poncheras', '9', 'productos', 'Contratar', '19', 'Poncheras', '', 'true', 'true', 'false', ''), ('Estudios fotográficos', '1', 'productos', 'Ordenar', '20', 'Fotografías', '', 'true', 'true', 'false', ''), ('Panaderias', '9', 'productos', 'Comprar', '21', 'Panaderias', '', 'true', 'true', 'false', ''), ('Desarrollo de Software', '1', 'productos', 'Ordenar', '22', 'Software', '', 'true', 'true', 'false', ''), ('Oferta de Empleos', '1', 'productos', 'Emplearse', '23', 'Empleos', '', 'true', 'true', 'false', ''), ('Promociona tus actividades recreativas', '1', 'productos', 'Reservar', '24', 'Fiestas', '', 'true', 'true', 'false', ''), ('Eventos', '1', 'productos', 'Reservar', '25', 'Eventos', '', 'true', 'true', 'false', ''), (' Baile, música, manualidades, etc', '1', 'productos', 'Matricular', '26', 'Cursos', '', 'true', 'true', 'false', ''), " + 
  "('Permutas', '9', 'productos', 'Permutar', '27', 'Permutas', '', 'true', 'true', 'false', ''), ('Venta de casas', '9', 'productos', 'Comprar', '28', 'Venta de casas', '', 'true', 'true', 'false', ''), ('Carros y Motos', '5', 'productos', 'Comprar', '29', 'Carros y Motos', '', 'true', 'true', 'false', ''), ('Seguridad', '5', 'productos', 'Contratar', '41', 'Seguridad', '', 'true', 'true', 'false', ''), ('Redes', '9', 'productos', 'Contactar', '42', 'Redes', '1416a15d-194d-484f-be12-c100a6df97ab', 'true', 'true', 'false', ''), ('Heladeria', '7', 'productos', 'Reservar', '44', 'Heladeria', '', 'true', 'true', 'false', ''), ('Buscando Empleos', '1', 'productos', 'Interesarse', '45', 'Bolsa de Empleos', '', 'true', 'true', 'false', ''), ('Artesanias', '9', 'productos', 'Comprar', '46', 'Artesanias', '', 'true', 'true', 'false', ''), ('AC autos', '9', 'productos', 'Comprar', '47', 'AC Autos', '8c4d961b-b37d-4b07-b650-82fb139234d3', 'true', 'true', 'false', ''), ('Venta de lenceria', '2', 'productos', 'Comprar', '48', 'Venta de lenceria', '', 'true', 'true', 'false', ''), ('Alquiler de taxis', '0', 'productos', 'Ordenar', '49', 'Taxis', '7676e7ed-cc97-4759-9958-a58590268749', 'true', 'true', 'true', 'Libre/Ocupado'), ('Compra/Venta', '1', 'https://destodo.web.app', 'Comprar', '50', 'Compra/Venta', '70daea24-eef1-4bb3-83b3-631ed2e4194c', 'true', 'true', 'false', ''), ('Moto-Taxi', '0', 'productos', 'Ordenar', '51', 'Moto-Taxi', '6fb95887-2311-4e0a-894e-d9614f76a937', 'true', 'true', 'true', 'Libre/Ocupado'), " + 
  "('Autobus', '0', 'productos', 'Reservar', '52', 'Autobus', '', 'true', 'true', 'true', 'Libre/Ocupado'), ('Camion de pasajeros', '1', 'productos', 'Ordenar', '53', 'Camion de pasajeros', '', 'true', 'true', 'true', 'Libre/Ocupado'), ('Triciclos ', '0', 'productos', 'Ordenar', '54', 'Triciclos ', '', 'true', 'true', 'true', 'Libre/Ocupado'), ('Mensajería, domicilio', '1', 'productos', 'Contratar', '55', 'Mensajería', '', 'true', 'true', 'false', ''), ('Plomero', '9', 'productos', 'Ordenar', '57', 'Plomero', '', 'true', 'true', 'false', ''), ('Habitaciones y Casas', '9999', 'productos', 'Ordenar', '59', 'Alquiler', '828a11d5-1d09-48b0-b7d9-e9a021e6a3b7', 'true', 'true', 'false', ''), ('Diseño gráfico', '9999', 'productos', 'Ordenar', '61', 'Diseño gráfico', '2417f9e5-7075-4c00-bd4d-5f0c7c22f1fc', 'true', 'true', 'false', ''), ('Clubes noctucnos', '9999', 'productos', 'Reserva', '63', 'Clubes', '', 'true', 'true', 'false', ''), ('Estudio de fotos m2G-Fotos', '0', 'https://m2g-fotos-stgo.web.app', 'Reservar', '74', 'm2G-Fotos', 'b0a0576d-b901-4275-b3e5-f37a047d3184', 'true', 'true', 'false', '');";

  // CREA LAS TABLAS
  const error = await ejecutaSql(["sqlUsuarios","sqlConfig", "sqlProvincias"])
  return {error};
}

async function ejecutaSqlItem(item){
  return error = await supabase.rpc("exec_sql", { query: sqlUsuarios });
}

function ejecutaSql(lista){
  let err=";"
  lista.forEach((item) => {
    err = err + "," + ejecutaSqlItem(item);
  });

//  let error2 = await supabase.rpc("exec_sql", { query: sqlPoliceUsuarios });
//  let error4 = await supabase.rpc("exec_sql", { query: sqlPoliceConfig });

}

  // BUCKETS
  async function hacerPublicoElBucket(nombreDelBucket) {
    const { data, error } = await supabase.storage.from(nombreDelBucket).updateBucket(nombreDelBucket, {
      public: true
    });
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
    "tablausuarios.iduser, tarifa, costoDomicilio, domicilio, tablacatproductos.idsb, tablacatproductos.link, tablacategorias.estado FROM tablacatproductos, tablausuarios, " + 
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

async function setCategoriasNegociosCM(
  categorianegocio,
  desc,
  descold,
  link,
  nick,
  accion,
  inserta,
  contenidofoto,
  isBase64ToBlob
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
      inserta,
      contenidofoto,
      isBase64ToBlob
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

async function delAnuncioCM(id) {
  let err = "";
  if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
    const { error } = await delAnuncio({ id });
    err = error;
  } else {
    const { error } = await supabase
      .from("tablaanuncios")
      .delete()
      .eq("id", id);
    err = error;
  }
  return err;
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
    const { data } = await supabase.from("getproductoscategoria").select("*");
    resultproductos = data;
  }
  return resultproductos;
}

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
  latitud,
  longitud,
  sciudad,
  distanciamax,
  isBase64ToBlob,
  imagen
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
        talla,
        color,
        gpssn: gps,
        latitud,
        longitud,
        ocupado,
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
          talla: talla,
          color: color,
          gpssn: gps,
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

async function setActivaUsuarioCM(user) {
  let err="";
  if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
  //  resultusuarios = await setactivausuario({});
//    err = await resultusuarios.json();
  } else {
    const { data, error } = await supabase
      .from("tablausuarios")
      .update({activo: true})
      .eq("iduser", user);
      err=error;
  }
  return err;
}

async function getUsuariosCM(activo) {
  let resultusuarios = [];
  if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
    resultusuarios = await getusuarios({});
    resultusuarios = await resultusuarios.json();
  } else {
    const { data } = await supabase
      .from("tablausuarios")
      .select("*")
      .eq("activo", activo);
    resultusuarios = data;
  }
  return resultusuarios;
}

async function setConfigCM(provincia, municipio) {
  let result;
  let err;
  if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
    result = await setconfig({ provincia, municipio });
    err = result.error;
  } else {
    const { data } = await supabase
      .from("tablaconfig")
      .select('*')
//      .gt("provincia", 0);
    if (isValid(data)!==true)
       await supabase
       .from("tablaconfig")
       .insert({ provincia: provincia, municipio: municipio })
    else  {
       const {error} = await supabase
       .from("tablaconfig")
       .update({ provincia: provincia, municipio: municipio })
       err = error;
    }
  }
  return err;
}

async function getConfigCM() {
  let result;
  if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
    let resultconfig = await getconfig();
    resultconfig = await resultconfig.json();
    result = resultconfig;
  } else {
    const { data } = await supabase.from("tablaconfig").select("*");
    result = data;
  }
  return result;
}

export {
  loginCM,
  creaBucketCM,
  CreaTablaBaseDatos,
  hacerPublicoElBucket,};

export {
  getProvinciasCM,
  getMunicipiosCM,
  getAplicacionesCM,
  getInfoProductoCM,
  getParesGpsProductoCM,
  getInfoNegocioCM,
  getcategoriasnegociosappCM,
  getConfigCM,
  getUsuariosCM,
  getproductoscategoriaCM,
  getparesgpscategoriaCM,
  getProductosCM,
  getProductosNewCM,
  getdatosuserCM,
  getanunciosCM,
  getcategoriasnewCM,
  getCategoriasNegociosCM,
  getProductosActivaCM,
};

export {
  setAplicacionesCM,
  setMovimientosNewCM,
  setProductoCM,
  setConfigCM,
  setregistrarseCM,
  setActivaUsuarioCM,
  setCategoriasNegociosCM,
  setProductosActivaCM,
};
export {
  updateOcupadoCM
};
  
export {
  delProductoCM,
  delCategoriaCM,
  delAnuncioCM
};
