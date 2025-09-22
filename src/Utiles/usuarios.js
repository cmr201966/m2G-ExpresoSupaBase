import {  isValid, uploadBase64Image} from "./Utiles";
import { setuserexpress } from "../servicios/catalogos";
import { login } from "../servicios/login";
import { getdatosiduser, setregistrarse } from "../servicios/registrarse";
import { getusuarios } from "../servicios/registrarse";
import supabase from "./connection";

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
    email,
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
        email,
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
          email: email,
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
            email: email,
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
  
  async function setUserExpress(user, nombre, celular){
    let datos;
    if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL") {
      datos = await setuserexpress({user, nombre, celular});
      datos = await datos.json();
      return datos;
    } else {
      const { data } = await supabase
        .from("tablausuarios")
        .select("*")
        .eq("celular", celular);
      if (data.length!==0){
        return "Ya existe un usuario con este celular (" + celular + "), abra sesión con ese usuario o cambie el celular";
      }
      else{
      const { error} = await supabase
        .from("tablausuarios")
        .insert({ iduser: user, tipouser: 0, nombre: nombre, celular: celular, activo: true});
      return error;
      }
    }
  }
  
  export {
    loginCM,
  };
  
  export {
    getUsuariosCM,
    getdatosuserCM,
  };
  
  export {
    setregistrarseCM,
    setActivaUsuarioCM,
    setUserExpress,
  };
  