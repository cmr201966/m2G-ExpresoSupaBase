import {  isValid, uploadBase64Image} from "./Utiles";
import { getAplicaciones, setAplicaciones } from "../servicios/aplicaciones";
import {  delAnuncio } from "../servicios/catalogos";
import supabase from "./connection";

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
    frm,
    carpeta,
    orden,
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
        frm,
        carpeta,
        orden,
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
          frm: frm,
          orden: orden,
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
              "aplicaciones/" + carpeta + "/" + data[0].id + "/" + data[0].id + ".jpg",
              isBase64ToBlob, "tablaanuncios","id",data[0].id
              );
              err = error;
          }
          if (isValid(error) === false && contenidofotomovil!=="") {          
            await uploadBase64Image(
            contenidofotomovil,
            "galerias",
            "aplicaciones/" + carpeta + "/" + data[0].id + "/" + data[0].id + "-movil.jpg",
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
            frm: frm,
            orden: orden,
          })
          .eq("id", id);
          if (isValid(error) === false && contenidofoto!=="") { 
            uploadBase64Image(
            contenidofoto,
            "galerias",
            "aplicaciones/" + carpeta + "/" + id + "/" + id + ".jpg", 
            isBase64ToBlob, "tablaanuncios","id", id
          );
        }
        if (isValid(error) === false && contenidofotomovil!=="") {          
          await uploadBase64Image(
          contenidofotomovil,
          "galerias",
          "aplicaciones/" + carpeta + "/" + id + "/" + id + "-movil.jpg",
          isBase64ToBlobMovil, "tablaanuncios","id", id
          );
          err = error;
      }
        err = error;
      }
    }
    return err;
  }
  
  
  async function getanunciosCM(frm, categoria) {
    let datos;
    if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL") {
      datos = await getAplicaciones({});
      datos = await datos.json();
      return datos;
    } else {
      if (frm==="1"){
        const { error, data } = await supabase
        .from("tablaanuncios")
        .select("*")
        .order("orden", { ascending: true })
        .eq("idcategoria", categoria)
        .eq("activo", true)
        .eq("frm", frm);
        return data;
      }
      else{
      const { error, data } = await supabase
        .from("tablaanuncios")
        .select("*")
        .order("orden", { ascending: true })
        .eq("activo", true)
        .eq("frm", frm);
        return data;
      }
    }
  }
    
  export {
    getAplicacionesCM,
    getanunciosCM,
  };
  
  export {
    setAplicacionesCM,
  };
  
  export {
    delAnuncioCM
  };
  