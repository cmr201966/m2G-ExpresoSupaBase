import {setMovimientosNew} from "../servicios/productos";
import supabase from "./connection";

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
 
  export {
    setMovimientosNewCM,
  };
  
  