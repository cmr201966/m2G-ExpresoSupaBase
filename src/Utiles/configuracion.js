import {  isValid} from "./Utiles";
import { setconfig, getconfig } from "../servicios/config";
import supabase from "./connection";

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
  
 
  export {getConfigCM,  };
  export { setConfigCM,};
  
  