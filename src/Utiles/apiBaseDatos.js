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
    console.log(error)
    const { data } = await supabase
      .from("getcategoriasnew")
      .select("*")
/*      .order("destodo", { ascending: true });*/
    datos = data;
    console.log(data);
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
    const { data } = await supabase
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
        if (isValid(error) === false) {
          await uploadBase64Image(
            contenidofoto,
            "galerias",
            "aplicaciones/" + data[0].id + "/" + data[0].id + ".jpg",
            isBase64ToBlob, "tablaanuncios","id",data[0].id
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
      if (isValid(error) === false) {
        uploadBase64Image(
          contenidofoto,
          "galerias",
          "aplicaciones/" + id + "/" + id + ".jpg", 
          isBase64ToBlob, "tablaanuncios","id", id
        );
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
  const sqlUsuarios="create table public.tablausuariosPrueba (" + 
    "nombre text null default ''::text, " + 
    "tipouser smallint not null, " +
    "pw text null," +
    "celular text null default ''::text," +
    "provincia smallint null," +
    "municipio smallint null, "+
    "latitud double precision null, "+
    "longitud double precision null, " +
    "iduser text not null, " +
    "billeteracup real null, " +
    "gpssn double precision null, " +
    "activo boolean null default false, " +
    "id smallint generated by default as identity not null, " +
    "idsb text null default ''::text, " +
    "datos text null default ''::text, " +
    "otrosdatos text null default ''::text," +
    "nophoto smallint null default '0'::smallint, " +
    "constraint tablausuarios_usuariospkey primary key (iduser) " +
  ") tablespace pg_default;"

  const sqlConfig = "create table " +
  "public.tablaconfigPrueba ( "+
  "provincia smallint not null, " +
  "municipio smallint not null, " +
  "idapp text null default ''::text, " +
  "constraint tablaconfigprueba_pkey primary key (provincia, municipio) " +
  ") tablespace pg_default;"

   // BUCKETS
   /*
   import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://tu-supabase-url.supabase.co', 'clave-de-servicio');

// Función para hacer un bucket público
async function hacerPublicoElBucket(nombreDelBucket) {
  const { data, error } = await supabase.storage.from(nombreDelBucket).updateBucket(nombreDelBucket, {
    public: true
  });

  if (error) {
    console.error('Error al hacer público el bucket:', error.message);
  } else {
    console.log('Bucket hecho público:', data);
  }
}

// Llama a la función con el nombre del bucket
hacerPublicoElBucket('mi_bucket');
*/
  // POLITICAS
  const sqlPoliceConfig= "create policy 'configprueba' on 'public'.'tablaconfigprueba' as PERMISSIVE for ALL to public using (true);"
  const sqlPoliceUsuarios= "create policy 'usuariosprueba' on 'public'.'tablausuariosprueba' as PERMISSIVE for ALL to public using (true);"

  //INSERT
  const sqlInsertProvincias = "INSERT INTO 'public'.'tablacatprovincias' ('provincia', 'desc', 'latitud', 'longitud', 'zoom') VALUES ('1', 'Pinar del Rio', '22.4049256901199', '-83.6969922759527', '0'), ('2', 'Artemisa', '22.8152137295944', '-82.757826453475', '0'), ('3', 'Mayabeque', '22.964643056655', '-82.1528826900769', '0'), ('4', 'La Habana', '23.1370325338752', '-82.3536985082401', '0'), ('5', 'Matanzas', '23.0435941125689', '-81.5764859361438', '0'), ('6', 'Villa Clara', '22.405310690521', '-79.9587054315577', '0'), ('7', 'Cienfuegos', '22.0655653561128', '-80.4661223514087', '0'), ('8', 'Santi Spiritus', '21.9210518125642', '-79.4088924601421', '0'), ('9', 'Ciego de Avila', '21.8312212843561', '-78.7529032437595', '0'), ('10', 'Camaguey', '21.3755752598362', '-77.916545551687', '0'), ('11', 'Las Tunas', '20.9544083432017', '-76.9530802974038', '0'), ('12', 'Holguin', '20.8744815707728', '-76.2550077633322', '0'), ('13', 'Granma', '20.3696180259046', '-76.6374354771797', '0'), ('14', 'Santiago de Cuba', '20.0174201604909', '-75.8165229155651', '0'), ('15', 'Guantanamo', '20.1383170244923', '-75.1995749840447', '0'), ('16', 'Isla de la Juventud', '21.6664269473949', '-82.839217838734', '0');"

  let error1 = await supabase.rpc("exec_sql", { query: sqlUsuarios });
  let error2 = await supabase.rpc("exec_sql", { query: sqlPoliceUsuarios });
  let error3 = await supabase.rpc("exec_sql", { query: sqlConfig });
  let error4 = await supabase.rpc("exec_sql", { query: sqlPoliceConfig });
  return {error1, error2, error3, error4};
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
  CreaTablaBaseDatos
};

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
