import { getCategoriasNew } from "../servicios/home";
import { getCategoriasNegocios } from "../servicios/catalogos";
import { createClient } from '@supabase/supabase-js'
import { getAplicaciones, setAplicaciones } from "../servicios/aplicaciones";
import { login } from "../servicios/login";
import { getprovincias, getmunicipios  } from "../servicios/catalogos";
import { getdatosiduser, setregistrarse  } from "../servicios/registrarse";
import { getJpgFile  } from "../servicios/imagenes";
import { getFilesInFolder } from "../servicios/fs";
import { getinfoproducto } from "../servicios/productos";
import { getParesGpsNaturalezaNew } from "../servicios/naturalezas";
import { setMovimientosNew, updateOcupado } from "../../servicios/productos";

const supabase = createClient('https://bnubyqvgmrjlxygxapqp.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJudWJ5cXZnbXJqbHh5Z3hhcHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzMDM3NDksImV4cCI6MjA0Mzg3OTc0OX0.3oGjEFdILLMO46DYrAbgWUmVHwP_Z_oH6Oo_j8oEt-c')


  function isValid(state){
    if (state==null || state==='null' || state===undefined || state==='undefined')  return false
    else return true;
  }

  function buscarEnArreglo (arreglo, valor, atributo) {
    let index = -1;
    arreglo.forEach((item, i) => {
      if (Number(item[atributo]) === Number(valor)) {
        index = i;
      }
    });
    return index;
  }

  function buscarEnArregloString(arreglo, valor, atributo) {
    let index = -1;
    arreglo.forEach((item, i) => {
      if (item[atributo].toUpperCase() === valor.toUpperCase()) {
        index = i;
      }
    });
    return index;
  }

  const obtenerImagen = async (bucket, carpeta) => {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .download(carpeta);
      if (isValid(error)===false){
        const url = URL.createObjectURL(data);
        return {error, url};
      }
      else
         return {error: "No existe la imagen", url: ""}
  };

  const cleanBase64String = (base64String) => {
    const index = base64String.indexOf(',');
    return index !== -1 ? base64String.substring(index + 1) : base64String;
  };


  const base64ToBlob = (base64, contentType = '') => {
    const byteCharacters = atob(cleanBase64String(base64));
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    return new Blob(byteArrays, { type: contentType });
  };


  const uploadBase64Image = async (base64String, bucket, carpeta) => {
    const blob = base64ToBlob(base64String, 'image/jpeg');
    const { error } = await supabase.storage
      .from(bucket)
      .upload(carpeta, blob);
      return error
  };  

  async function anuncios(){
    let datos;
    if (sessionStorage.getItem("sgbd").toLocaleUpperCase()==='MYSQL'){
      datos = await getAplicaciones({});
      datos = await datos.json();
      return datos
   }
   else{
    const { data } = await supabase
     .from('tablaAnuncios')
     .select('*')
     .order('desc', { ascending: true })
     return data;  
   }
  }

  async function getcategoriasnew(){
    let datos;
    if (sessionStorage.getItem("sgbd").toLocaleUpperCase()==='MYSQL'){
      datos = await getCategoriasNew({user: sessionStorage.getItem("user"), tipouser: sessionStorage.getItem("tipouser")});
      datos = await datos.json()
      return datos
   }
   else{
     if (isValid(sessionStorage.getItem("user"))===true && isValid(sessionStorage.getItem("tipouser"))===true && sessionStorage.getItem("tipouser")!='3'){
       const { data } = await supabase
       .from('getcategoriasnew')
       .select('*')
       .eq('user', sessionStorage.getItem("user"))
       datos=data;
     }
     else{
       const { data } = await supabase
       .from('getcategoriasnew')
       .select('*')
       .order('categoria', { ascending: true })
       datos=data;
     }
     return datos;
    }

  }
  async function getCategoriasNegociosSB(){
    let datos;
    let err;
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      datos = await getCategoriasNegocios({});
      datos = await datos.json();
      err=datos.error;
   }
   else{
     const { data, error} = await supabase
          .from('tablacategorias')
          .select('*')
          .order('desc', { ascending: true })
    datos=data;
    err=error;
   }
   return (err, datos)

  }

  async function CategoriasInsertUpdate(param1, param2, param3, param4, param5){
    /*param1: insertar, param2: desc, param3: link, param4: categorianegocio, param5: contenido*/
    let err;
    if(param1===true){/*insertar*/
      const { error } = await supabase
      .from('tablaCategorias')
      .insert({ desc: param2, link: param3 }) /* desc y link*/
      if (isValid(error)===false){
         const { data } = await supabase
               .from('tablaCategorias')
               .select('*')
               .order('id', { ascending: false })
               .limit(1);

         err=uploadBase64Image(param5, 'galerias', "categorias_de_negocios/" + data[0].id + "/" + data[0].id + ".jpg")

      }
      return (err);
    }
    else{
      const { error } = await supabase
      .from('tablaCategorias')
      .update({ desc: param2, link: param3 })
      .eq('categorianegocio', param4)
      if (isValid(error)===false)
         err=uploadBase64Image(param5, 'galerias', "categorias_de_negocios/" + param4 + "/" + param4 + ".jpg")
    }
    return err;
  }

  async function loginSB(param1, param2){
    let result=[];
    let err=undefined;
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      result = await login({user: param1, password: param2});
      result = await result.json();
      err=result.error;
      return (err, result);
   }
   else{
     const { data, error } = await supabase
     .from('tablausuarios')
     .select('*')
     .eq('iduser', param1)
     .eq('pw', param2)
     err=error
     result=data
    return (err, result)
   }   

  }

  async function provinciasSB(){
    let resultprovincia=[];
    let err=undefined;
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      resultprovincia = await getprovincias({});
      resultprovincia = await resultprovincia.json();
      err=resultprovincia.error;
      return (err, resultprovincia);
    }
    else{
      const { data, error } = await supabase
      .from('tablacatprovincias')
      .select('*')
      .order('"desc"', { ascending: true })
      resultprovincia= data;
      err=error;
      return (err, resultprovincia)
    }

  }

  async function municipiosSB(){
    let resultmunicipio=[];
    let err=undefined;
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      resultmunicipio = await getmunicipios({});
      resultmunicipio = await resultmunicipio.json();
      err=resultmunicipio.error;
      return (err, resultmunicipio);
    }
    else{
      const { data, error } = await supabase
      .from('tablacatmunicipios')
      .select('*')
      .order('"desc"', { ascending: true })
      resultmunicipio= data;
      err=error;
      return (err, resultmunicipio)
    }

  }

  async function getdatosuser(user){
    let result=[];
    let err;
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
       result = await getdatosiduser({user});
       result = await result.json();
       err=result.error;
       return (err, result);
     }
    else{
      const { data, error } = await supabase
      .from('tablausuarios')
      .select('*')
      .eq('iduser', user)
      .order('nombre', { ascending: true })
      result= data;
      err=error;
      return (err, result)
    }

  }

  async function setregistrarseSB(user, nombre, password, celular, provincia, municipio, contenidofoto, modifica,plan, lat, lng){
    let response=[];
    let err;
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
       response = await setregistrarse({user, nombre, password, celular, provincia:provincia,municipio:municipio, contenidofoto,modifica,plan, lat, lng});
       response = await response.json();
       err=response.error;
       return (err);
    }
    else{
      if (modifica===false){
        const { error } = await supabase
        .from('tablausuarios')
        .insert({ iduser: user, nombre: nombre, pw: password, celular: celular, provincia: provincia, municipio: municipio, tipouser: plan, latitud: lat, longitud: lng })
        .eq('iduser', user)
        err=error;
        if (isValid(error)===false){          
          const {error,  data } = await supabase
          .from('tablausuarios')
          .select('*')
          .order('id', { ascending: false })
          .limit(1);
          if (isValid(error)===false) {
            err= uploadBase64Image(contenidofoto, 'galerias', "usuarios/" + data[0].iduser + "/foto1.jpg");
          }
        }
        return (err);
      }
      else{
      const { error } = await supabase
      .from('tablausuarios')
      .update({ nombre: nombre, pw: password, celular: celular, provincia: provincia, municipio: municipio, tipouser: plan, latitud: lat, longitud: lng })
      .eq('iduser', user)
      err=error;
      if (isValid(error)===false) err= uploadBase64Image(contenidofoto, 'galerias', "usuarios/" + user + "/foto1.jpg")
      return (err);
    }

    }

  }

  async function buscaFoto(foto){
    let resultado = await getJpgFile({ file: foto});
    return resultado;
  }

  async function getAplicacionesSB(){
    let result=[];
    let err;
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      result = await getAplicaciones({});
      result = await result.json(); 
      err=result.error;
    }
    else{
      const { data, error } = await supabase
      .from('tablaAnuncios')
      .select('*')
      result=data;
      err=error;
    }
    return (err, result);

  }

  async function setAplicacionesSB(id, user, nick, desc, tooltip, categoria, agregarsn, contenidofoto){
    let result=[];
    let err="";
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      result = await setAplicaciones({id, iduser: user, nick, desc, tooltip, categoria, agregarsn, contenidofoto});
      result = await result.json();
      err=result.error;
    }
    else{
      if (agregarsn===true){
        const { error } = await supabase
        .from('tablaAnuncios')
        .insert({ idapp: nick, iduser: user, desc, categoria, tooltip })
        if (isValid(error)===false) 
           err=error
        else{
          const { data, error } = await supabase
          .from('tablaAnuncios')
          .select('*')
          .order('id', { ascending: false })
          .limit(1);
          if (isValid(error)===false){
             uploadBase64Image(contenidofoto, 'galerias', "aplicaciones/" + data[0].id + "/" + data[0].id + ".jpg")
             err=error;
          }
        }
      }
      else{
        const { error } = await supabase
        .from('tablaAnuncios')
        .update({ idapp: nick, iduser: user, desc: desc, categoria, tooltip })
        .eq('id', id)
        if (isValid(error)===false) uploadBase64Image(contenidofoto, 'galerias', "aplicaciones/" + id + "/" + id + ".jpg")
        err=error;       
      }
    }
    return (err);
  }


  async function creaBucket(bucket){
    const { data } = await supabase.storage.listBuckets(); 
    const bucketExists = data.some(bucket => bucket.name === bucket);
    if (bucketExists===false){
      await supabase.storage.createBucket(bucket);
    }

  }

  async function getFilesInFolderSB(folder, bucket ){
    let resultFiles=[];
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
       resultFiles = await getFilesInFolder({folder});
       resultFiles = await resultFiles.json()
    }
    else{
      const { data } = await supabase
      .storage
      .from(bucket)
      .list(folder, {
          limit: 1000,
          offset: 0,  
          sortBy: { column: 'name', order: 'asc' } 
      });
      resultFiles=data;
    }
    return resultFiles;

  }

  async function getJpgFileSB(fileMysql, fileSupabase){
    let result=[]
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
       result = await getJpgFile({file: fileMysql});
       result = await result.text();
       return result;
    }
    else{
      return result = await obtenerImagen('galerias', fileSupabase)      
    }
  }

  async function getInfoProducto(producto){
    let result=[];
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
       result = await getinfoproducto({idproducto: producto});
       result = await result.json();
    }
    else{
      const { data } = await supabase
      .from('getInfoProductos')
      .select('*')
      .eq('idproducto', producto)
      result=data;
   }
   return result;
  }

  async function getParesGpsProducto(categoria, producto){
    let result=[];
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
       result = await getParesGpsNaturalezaNew({categoria: categoria,  idproducto: producto});
       result = await result.json();
    }
    else{
      const { data } = await supabase
      .from('getParesGpsProducto')
      .select('*')
      .eq('idproducto', producto)
      result=data;
    }
    return result;

  }

  async function setmovimientosNew(idmovimiento, idproducto, latOrigen, latDestino, lngOrigen, lngDestino, precio, kms, user){
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL')
      await setMovimientosNew({idmovimiento, idproducto, latOrigen, latDestino, lngOrigen, lngDestino, precio, kms, user})
    else{
      await supabase
      .from('tablamovimientos')
      .update({ desc: param2, link: param3 })
      .eq('iduser', user)

    }

  }

  const apiBaseDatos = async (ruta, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11) => {
    switch (ruta) {
      case "anuncios":
        return anuncios();
      case "getcategoriasnew":
        return getcategoriasnew()
      case "getCategoriasNegocios":
        return getCategoriasNegociosSB();
      case "CategoriasInsertUpdate":
        return CategoriasInsertUpdate(param1, param2, param3, param4, param5);
      case "login":
        return await loginSB(param1, param2);
      case "provincias"  :
        return provinciasSB();
      case "municipios"  :
        return municipiosSB();
      case "getdatosuser"  :
        return getdatosuser(param1);
      case "setregistrarse":
        return setregistrarseSB(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11);
      case "getAplicaciones":
        return getAplicacionesSB();
      case "setAplicaciones":
        return setAplicacionesSB(param1, param2, param3, param4, param5, param6, param7, param8)
      case "setmovimientosNew"  :
        return setMovimientosNew();
    }
      
  };  

  export {isValid, buscarEnArreglo, buscarEnArregloString, obtenerImagen, uploadBase64Image, apiBaseDatos, buscaFoto, creaBucket, getFilesInFolderSB, getJpgFileSB, getInfoProducto}
  export {getParesGpsProducto, setmovimientosNew}
