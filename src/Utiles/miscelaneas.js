import {  isValid} from "./Utiles";
import { getdisponibilidad, } from "../servicios/contratos";

import {updateOcupado} from "../servicios/productos";
import { registraws, } from "../servicios/contratos";
import supabase from "./connection";

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
  

function crearVistaReservar(producto, movimiento){
    return "CREATE OR REPLACE VIEW getdisponibilidad  AS select sum(tablamovimientos.cantidad) as reservas from tablacatproductos, tablamovimientos where" +
    " tablacatproductos.idproducto = " + producto + " and tablacatproductos.idproducto = tablamovimientos.idproducto and tablamovimientos.idmovimiento=" + movimiento
  }
  
  async function registraWS(quien){
    let datos;
    if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL") {
      datos = await registraws({quien});
      datos = await datos.json();
      return datos;
    } else {
      const { error} = await supabase
        .from("ws")
        .insert({ quien});
      return error;
    }
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

    

export {
  getDisponibilidad,
};

export {
  registraWS,
};

export {
  updateOcupadoCM
};
  
