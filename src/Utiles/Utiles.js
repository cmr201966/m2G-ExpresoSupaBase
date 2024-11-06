import { getCategoriasNew } from "../servicios/home";
import { getCategoriasNegocios } from "../servicios/catalogos";
import { getAplicaciones, setAplicaciones } from "../servicios/aplicaciones";
import { login } from "../servicios/login";
import { getprovincias, getmunicipios  } from "../servicios/catalogos";
import { getdatosiduser, setregistrarse  } from "../servicios/registrarse";
import { getJpgFile  } from "../servicios/imagenes";
import { getFilesInFolder } from "../servicios/fs";
import { getinfoproducto } from "../servicios/productos";
import { getParesGpsNaturalezaNew } from "../servicios/naturalezas";
import { getinfonegocio  } from "../servicios/negocios";
import { getparesgpscategoria } from "../servicios/catalogos";
import { getproductos, setMovimientosNew, updateOcupado, getProductoNew } from "../servicios/productos";
import { setCategoriasNegocios, delCategoria } from "../servicios/catalogos";
import { getcategoriasnegociosapp } from "../servicios/negocios";
import { getproductoscategoria,  setproducto,  delproducto,} from "../servicios/productos";
import { getusuarios } from "../servicios/registrarse";
import { setconfig, getconfig  } from "../servicios/config";
import supabase from "./connection";
  
  function borraSessionStorage(items){
    items.forEach(item => {
      sessionStorage.removeItem(item);     
    });
  }

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
    const { data } = await supabase
      .storage
      .from(bucket)
      .download(carpeta);
      let url;
      if (isValid(data)===true){
         url = URL.createObjectURL(data);
         return url;
      }
      else
         return  url;
  };

  const cleanBase64String = (base64String) => {
    const index = base64String.indexOf(',');
    return index !== -1 ? base64String.substring(index + 1) : base64String;
  };

  const base64ToBlob = (base64, contentType = '', isBase64ToBlob) => {
    let byteCharacters;
    if (isBase64ToBlob===true) {
      byteCharacters = base64
    }
      else{
         byteCharacters = atob(cleanBase64String(base64))
        }
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

  async function deleteFileInFolder(bucket, carpeta){
     await supabase.storage
    .from(bucket)
    .remove([carpeta]);

  }
  const uploadBase64Image = async (base64String, bucket, carpeta, isBase64ToBlob) => {
    if (isBase64ToBlob===true) return {}
    deleteFileInFolder(bucket, carpeta);
    const blob = base64ToBlob(base64String, 'image/jpeg', isBase64ToBlob);
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

  function GeneraVistagetCategoriasNew(user, tipouser){
    let condicion="";
    if (isValid(user)===true && (tipouser==='1' || tipouser==='2')) {
       condicion= "and (tablacatproductos.iduser='" + user + "') and (tablausuarios.activo=true)"
    }
    return 'CREATE OR REPLACE VIEW getcategoriasnew  AS select DISTINCT tablacatproductos.categorianegocio as idcategoria, ' +
           'tablaCategorias."desc" as categoria, link from tablaCategorias, tablacatproductos' +
           ' where (tablaCategorias.categorianegocio=tablacatproductos.categorianegocio) and (tablacatproductos.activo=true)' + condicion;
  }

  async function getcategoriasnew(){
    let datos;
    if (sessionStorage.getItem("sgbd").toLocaleUpperCase()==='MYSQL'){
      datos = await getCategoriasNew({user: sessionStorage.getItem("user"), tipouser: sessionStorage.getItem("tipouser")});
      datos = await datos.json()
      return datos
   }
   else{
        let sql=GeneraVistagetCategoriasNew(sessionStorage.getItem("user"), sessionStorage.getItem("tipouser"));
        await supabase.rpc('execute_query', { query: sql});
        const { data } = await supabase
        .from('getcategoriasnew')
        .select('*')
        .order('idcategoria', { ascending: true });
         datos=data;
     return datos;
    }
  }

  async function getCategoriasNegociosSB(){
    let datos;
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      datos = await getCategoriasNegocios({});
      datos = await datos.json();
   }
   else{
     const { data} = await supabase
          .from('tablacategorias')
          .select('*')
          .order('desc', { ascending: true })
    datos=data;
   }
   return  datos;

  }
                                       
  async function CategoriasInsertUpdate(categorianegocio, desc, descold, link, insertar, contenidofoto, isBase64ToBlob){
    let err;
    if(insertar===true){
      const { error } = await supabase
      .from('tablaCategorias')
      .insert({ desc: desc, link: link })
      if (error.length===undefined || error.length===null){
         const { data } = await supabase
               .from('tablaCategorias')
               .select('*')
               .order('id', { ascending: false })
               .limit(1);
         err=uploadBase64Image(contenidofoto, 'galerias', "categorias_de_negocios/" + data[0].id + "/" + data[0].id + ".jpg", isBase64ToBlob)
      }
      return (err);
    }
    else{
      const  {error} = await supabase
      .from('tablaCategorias')
      .update({ desc: desc, link: link })
      .eq('categorianegocio', categorianegocio)
      if (error.length===undefined)
         err=uploadBase64Image(contenidofoto, 'galerias', "categorias_de_negocios/" + categorianegocio + "/" + categorianegocio + ".jpg", isBase64ToBlob)
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
     .eq('activo', true)
     err=error
     result=data
    return (err, result)
   }   

  }

  async function provinciasSB(){
    let resultprovincia=[];
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      resultprovincia = await getprovincias({});
      resultprovincia = await resultprovincia.json();
    }
    else{
      const { data } = await supabase
      .from('tablacatprovincias')
      .select('*')
      .order('"desc"', { ascending: true })
      resultprovincia= data;
    }
    return (resultprovincia);
  }

  async function municipiosSB(){
    let resultmunicipio=[];
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      resultmunicipio = await getmunicipios({});
      resultmunicipio = await resultmunicipio.json();
    }
    else{
      const { data } = await supabase
      .from('tablacatmunicipios')
      .select('*')
      .order('"desc"', { ascending: true })
      resultmunicipio= data;
    }
    return (resultmunicipio)
  }

  async function getdatosuser(user){
    let result=[];
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
       result = await getdatosiduser({user});
       result = await result.json();
       return (result);
     }
    else{
      const { data } = await supabase
      .from('tablausuarios')
      .select('*')
      .eq('iduser', user)
      .eq('activo', true)
      .order('nombre', { ascending: true })
      result= data;
      return (result)
    }
  }
  async function setregistrarseSB(user, nombre, password, celular, provincia, municipio, contenidofoto, modifica,plan, lat, lng, isBase64ToBlob){
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
        err=error;
        if (isValid(error)===false){          
          const {error,  data } = await supabase
          .from('tablausuarios')
          .select('*')
          .order('id', { ascending: false })
          .limit(1);
          if (error.length===undefined || error.length===null) {
            err= uploadBase64Image(contenidofoto, 'galerias', "usuarios/" + data[0].iduser + "/" + data[0].iduser + ".jpg", isBase64ToBlob);
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
      if (error===undefined || error===null){ 
        err= uploadBase64Image(contenidofoto, 'galerias', "usuarios/" + user + "/" + user + ".jpg", isBase64ToBlob);
      }
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
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      result = await getAplicaciones({});
      result = await result.json(); 
    }
    else{
      const { data } = await supabase
      .from('tablaAnuncios')
      .select('*')
      result=data;
    }
    return result;
  }

  async function setAplicacionesSB(id, user, nick, desc, tooltip, categoria, agregarsn, contenidofoto, isBase64ToBlob){
    let err="";
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      let result = await setAplicaciones({id, iduser: user, nick, desc, tooltip, categoria, agregarsn, contenidofoto});
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
             await uploadBase64Image(contenidofoto, 'galerias', "aplicaciones/" + data[0].id + "/" + data[0].id + ".jpg", isBase64ToBlob)
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

  async function getFilesInFolderSB(folderMYSQL, folderSUPABASE, bucket ){
    let resultFiles=[];
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
       resultFiles = await getFilesInFolder({folderMYSQL});
       resultFiles = await resultFiles.json()
    }
    else{
      const { data } = await supabase
      .storage
      .from(bucket)
      .list(folderSUPABASE, {
          limit: 1000,
          offset: 0,  
          sortBy: { column: 'name', order: 'asc' } 
      });
      data.forEach((item) => {
        resultFiles.push(item.name);
      });
    }
    return resultFiles;
  }

  async function getJpgFileSB(fileMysql, fileSupabase){
    let result=[]
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
       result = await getJpgFile({file: fileMysql});
       result = await result.text();
    }
    else{
      result = await obtenerImagen('galerias', fileSupabase);
    }
    return result;
  }

  async function getInfoProducto(producto){
    let result=[];
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
       result = await getinfoproducto({idproducto: producto});
       result = await result.json();
    }
    else{
      const { data } = await supabase
      .from('getinfoproducto')
      .select('*')
      .eq('idproducto', producto)
      result=data;
   }
   return result;
  }

  async function getInfoNegocio(idnegocio){
    let result=[];
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      result = await getinfonegocio({ idnegocio });
      result = await result.json();
        }
    else{
      const { data } = await supabase
      .from('getinfonegocio')
      .select('*')
      .eq('idnegocio', idnegocio)
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
      .from('getparesgpsproducto')
      .select('*')
      .eq('idproducto', producto)
      result=data;
    }
    return result;

  }

  async function setMovimientosNewSB(idmovimiento, idproducto, latOrigen, latDestino, lngOrigen, lngDestino, precio, kms, user){
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      await setMovimientosNew({idmovimiento, idproducto, latOrigen, latDestino, lngOrigen, lngDestino, precio, kms, user})
    }
    else{
      // SUPABASE
      // Busca que dinero tiene el user en su billetera
      const { data } = await supabase
            .from('getbilleteracup')
            .select('*')
            .eq('idproducto', idproducto)
      let pagado=0;
      if (data[0].billeteracup>=data[0].costodomicilio) pagado=1;
      // Conforma fecha y hora del viaje
      const fechaNow= new Date();
      const fecha= fechaNow.getFullYear() + "-" + (fechaNow.getMonth()+1) + "-" + fechaNow.getDate()
      const hora= fechaNow.getHours() + ":" + fechaNow.getMinutes();
      await supabase
           .from('tablamovimientos')
           .insert({ idmovimiento, idproducto, precio, kms, fecha, hora, latOrigen, latDestino, lngOrigen, lngDestino, pagado, user })           
      if (pagado===1){
        // Rebaja del dinero que tenga el costo del domicilio
         await supabase
              .from('tablamovimientos')
              .update({ billeteraCUP: supabase.raw('billeteraCUP - ?', [data[0].costodomicilio]) })
              .eq('iduser', user);
        }       
    }
  }

  async function updateOcupadoSB(idproducto, ocupado){
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      await updateOcupado({idproducto, ocupado})
    }
    else{
      await supabase
      .from('tablaCatProductos')
      .update({ ocupado: ocupado})
      .eq('iduproducto', idproducto);
    }
  }

  async function getparesgpscategoriaSB(categoria, user, anuncio){
    let resultgps=[];
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      resultgps = await getparesgpscategoria({ categoria: categoria, user: user, userAnuncio: anuncio});
      resultgps = await resultgps.json();
        }
    else{
      await supabase
      .from('getparesgpscategoria')
      .select('*')
      .eq('categorianegocio', categoria)
      .eq('iduser', user);
    }
  return resultgps;
  }

  function GeneraVistaGetProductos(categoria, userAnuncio, buscar){
    let condicion1=categoria==='0' || isValid(categoria)===false || categoria===''?"":" and (tablacatproductos.categorianegocio=" + categoria + ")"
    let condicion2=isValid(userAnuncio)===false || userAnuncio===''?"":" and (tablacatproductos.iduser='" + userAnuncio + "') and (tablausuarios,activo=true)";
    let condicion3="";
    if (isValid(buscar)===true && buscar!==''){
       let busquedas=buscar.split(" ");
       busquedas.forEach(item => {
          if (item.toUpperCase().indexOf("PLAZAS")!==-1){
             let plazas=item.toUpperCase().split("P");
             condicion3= condicion3 + " and (tablacatproductos.talla>=" + plazas[0] + ")";
          }
          else
             condicion3= condicion3 + " and (POSITION('" + item.toUpperCase() + `' IN UPPER(tablacatproductos."desc"))>0)`
       });
    }
       let sql= "CREATE OR REPLACE VIEW getProductos AS SELECT DISTINCT tablacatproductos.idproducto as idproducto,tablacatproductos.nick as producto,tablacatproductos.desc as descripcion," +
        " tablausuarios.nombre as negocio, tablausuarios.iduser as idnegocio, ocupado, tipouser, tablausuarios.iduser, tarifa, costoDomicilio, domicilio" +
        " FROM tablacatproductos, tablausuarios, tablacatprovincias,tablacatmunicipios " +
        " WHERE (tablacatproductos.iduser=tablausuarios.iduser) and (tablacatprovincias.provincia=tablausuarios.provincia) and (tablacatmunicipios.provincia=" + 
        "tablausuarios.provincia) and (tablacatmunicipios.municipio=tablausuarios.municipio) and (tablausuarios.activo=true) and (tablausuarios.activo=true)"  + 
         condicion1  + condicion2 + condicion3;
        return sql;
  }

  async function getProductosSB(categoria, userAnuncio, buscar){
    let result1=[];
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      result1 = await getproductos({categoria, userAnuncio, buscar});
      result1 = await result1.json();
          }
    else{
      // Generar VISTA con API en SUPABASE
      let sql=GeneraVistaGetProductos(categoria, userAnuncio, buscar);
      await supabase
      .rpc('execute_query', { query: sql});
      // Ejecutar VISTA
      const { data } = await supabase
      .from('getproductos')
      .select('*')
      result1=data;
  }
    return result1;

  }

  async function getProductosNew(idproducto){
    let resultProduct=[];
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      resultProduct = await getProductoNew({idproducto});
      resultProduct = await resultProduct.json();
          }
    else{
      const { data } =await supabase
      .from('getproductonew')
      .select('*')
      .eq('idproducto', idproducto)
      resultProduct=data;
    }
    return resultProduct;
  }

  async function setCategoriasNegociosSB(categorianegocio, desc, descold, link, inserta, contenidofoto, isBase64ToBlob ){
    let result=[];
    let err="";        
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
      result = await setCategoriasNegocios({categorianegocio, desc, descold, link, inserta, contenidofoto });
      result = await result.json();
      err=result.error;
     }
   else{
    err= await CategoriasInsertUpdate(categorianegocio, desc, descold, "productos", inserta, contenidofoto, isBase64ToBlob);
   }
   return err;
  }

  async function delCategoriaSB(categorianegocio){
    let err="";
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL') {
      const {error} = await delCategoria({categorianegocio });
      err=error;
    }else{
      const { error } = await supabase.from('tablacategorias').delete().eq('id', categorianegocio)
      err=error;
    }
    return err;
  }

  async function delAnuncio(id){
    let err="";
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL') {
      const {error} = await delAnuncio({id});
      err=error;
    }else{
      const { error } = await supabase.from('tablaAnuncios').delete().eq('id', id)
      err=error;
    }
    return err;

  }
  async function delProductoSB(producto){
    let err="";
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL') {
      const {error} = await delProducto({producto });
      err=error;
    }else{
      const { error } = await supabase.from('tablacatproductos').delete().eq('idproducto', producto)
      err=error;
    }
    return err;
  }

  async function getcategoriasnegociosappSB(){
    let resulttnegocios=[];
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL') {
      resulttnegocios = await getcategoriasnegociosapp({});
      resulttnegocios = await resulttnegocios.json();
    }
    else{
      const { data } =await supabase
      .from('tablacategorias')
      .select('*')
      .order('desc', { ascending: true })
      resulttnegocios=data;
    }
    return resulttnegocios;
  }

  function generaVistaGetProductosCategoria(producto, categoria, user, tipouser){
  let condicion = "";
  if (isValid(producto)===true ) {
     condicion = condicion===""?" where (tablacatproductos.idproducto=" + producto + ")":" and (tablacatproductos.idproducto=" + producto + ")";
  }
  if (isValid(categoria)===true && categoria!=="0") {
    condicion = condicion===""?" where (tablacatproductos.categorianegocio=" + categoria + ")":" and (tablacatproductos.categorianegocio=" + categoria + ")";
  }
  if (isValid(user)===true && tipouser!=='3') {
    condicion = condicion===""?" where (tablacatproductos.iduser='" + user + "')" : condicion + " and (tablacatproductos.iduser='" + user + "')";
  }

  let sql="CREATE OR REPLACE VIEW getproductoscategoria AS select tablacatproductos.*  from tablacatproductos" + condicion;

  return sql;

  }

  async function getproductoscategoriaSB(user, tipouser, categoria, producto){
    let resultproductos=[];
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL') {
       resultproductos = await getproductoscategoria({user, tipouser, categoria, producto});
       resultproductos = await resultproductos.json();
    }
    else{
      // Generar VISTA con API en SUPABASE
      let sql=generaVistaGetProductosCategoria(producto, categoria, user, tipouser);
      await supabase
      .rpc('execute_query', { query: sql });      
      // Ejecutar VISTA
      const { data} =await supabase
      .from('getproductoscategoria')
      .select('*')
      resultproductos=data;
    }
    return resultproductos;
  }

  async function delProducto(producto){
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL') await delproducto({ producto: producto })
      else
    await supabase.from('tablacatproductos').delete().eq('idproducto', producto)      
  }

  async function setProductoSB(user, producto, categoria, nick, contenidofoto, desc, precio, ocupado, domicilio, agregar, marca, modelo, talla, color, gps, latitud, longitud, sciudad, distanciamax, isBase64ToBlob){
    let err="";
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL') await setproducto({ user,producto, categoria, nick, desc, precio, domicilio, marca, modelo, talla, color, gps, latitud,longitud, ocupado,  sciudad, distanciamax, agregar, contenidofoto})
    else{
      if (agregar===true){
        const { error } = await supabase
        .from('tablacatproductos')
        .insert({ iduser: user, categorianegocio: categoria, nick, desc, precio, domicilio, marca, modelo, talla, color, gpssn: gps, latitud, longitud, ocupado, distanciamax, sciudad })
        if (isValid(error)===true && error.length===0) {
           err=error
        }
        else{
          const { data, error } = await supabase
          .from('tablacatproductos')
          .select('*')
          .order('idproducto', { ascending: false })
          .limit(1);
          if (isValid(error)===false){
             await uploadBase64Image(contenidofoto, 'galerias', "productos/" + data[0].idproducto + "/" + data[0].idproducto + ".jpg", isBase64ToBlob)
             err=error;
          }
        }
      }
      else{
        let distanciamaxT=Number(distanciamax)
        const { error } = await supabase
        .from('tablacatproductos')
        .update({ iduser: user, categorianegocio: categoria, nick: nick, desc: desc, precio: precio, domicilio: domicilio, marca: marca, modelo: modelo, talla: talla, 
                  color: color, gpssn: gps, latitud: latitud, longitud: longitud, ocupado: ocupado, distanciamax: distanciamaxT, sciudad: sciudad })
        .eq('idproducto', producto)
        if (isValid(error)===false) uploadBase64Image(contenidofoto, 'galerias', "productos/" + producto + "/" + producto + ".jpg", isBase64ToBlob)
        err=error;       
      }
    }
    return err;
  }

  async function getUsuariosSB(){
    let resultusuarios=[];
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL') {
       resultusuarios = await getusuarios({});
       resultusuarios = await resultusuarios.json();
    }
    else{
      const { data } = await supabase
      .from('tablausuarios')
      .select('*')
      .eq('activo', true);
      resultusuarios=data;
    }
    return resultusuarios;
  }

  async function setConfigSB(provincia, municipio){
    let result;
    let err;
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL') {
      result=await setconfig({provincia, municipio})
      err=result.error;
    }
      else{
        const { error } = await supabase
        .from('tablaconfig')
        .delete()
        .gt('provincia', 0)
        await supabase
        .from('tablaconfig')
        .insert({ provincia: provincia, municipio: municipio });
        err=error;
    }
    return err;
  }

  async function getConfigSB(){
    let result;
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL') {
      let resultconfig=await getconfig()
      resultconfig = await resultconfig.json();
      result=resultconfig;
    }
      else{
        const { data } = await supabase
        .from('tablaconfig')
        .select('*');
        result=data;
    }
    return result;
  }

  const apiBaseDatos = async (ruta, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12, param13, param14, param15, param16, param17, param18, param19, param20) => {
    switch (ruta) {
      case "anuncios":
        return anuncios();
      case "getcategoriasnew":
        return getcategoriasnew()            
      case "getCategoriasNegocios":
        return getCategoriasNegociosSB();
      case "setCategoriasNegocios":
        return setCategoriasNegociosSB(param1, param2, param3, param4, param5, param6, param7);
      case "login":
        return await loginSB(param1, param2);
      case "provincias"  :
        return provinciasSB();
      case "municipios"  :
        return municipiosSB();
      case "getdatosuser"  :
        return getdatosuser(param1);
      case "setregistrarse":
        return setregistrarseSB(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12);
      case "getAplicaciones":
        return getAplicacionesSB();
      case "setAplicaciones":
        return setAplicacionesSB(param1, param2, param3, param4, param5, param6, param7, param8, param9)
      case "setmovimientosNew"  :
        return setMovimientosNewSB(param1, param2, param3, param4, param5, param6, param7, param8, param9);
      case "updateOcupado"  :
        return updateOcupadoSB(param1, param2);
      case "getparesgpscategoria":
        return getparesgpscategoriaSB(param1, param2, param3);
      case "getProductos"  :
        return getProductosSB(param1, param2, param3);
      case "getProductoNew"  :
         return getProductosNew(param1);
      case "delCategoria" :
        return delCategoriaSB(param1);
      case "delAnuncio"  :
        return delAnuncio(param1);
      case "getcategoriasnegociosapp":
        return getcategoriasnegociosappSB();
      case "getproductoscategoria":
        return getproductoscategoriaSB(param1, param2, param3, param4);
      case "delProducto"  :
        return delProductoSB(param1);
      case "setProducto"  :
        return setProductoSB(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12, param13, param14, param15, param16, param17, param18, param19, param20)
      case "getUsuarios"  :
        return getUsuariosSB();
      case "setConfig"  :
        return setConfigSB(param1, param2);
      case "getConfig"  :
        return getConfigSB();
    }      
  };  

  export {isValid, buscarEnArreglo, buscarEnArregloString, obtenerImagen, uploadBase64Image, apiBaseDatos, buscaFoto, creaBucket}
  export { getFilesInFolderSB, getJpgFileSB, getInfoProducto, getParesGpsProducto, setMovimientosNewSB, getInfoNegocio, getcategoriasnegociosappSB}
  export {delProducto, borraSessionStorage}
