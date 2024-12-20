import Tippy from "@tippyjs/react";
import Modal from "../../components/Modal/Modal";
import Checkbox from '@mui/material/Checkbox';
// Mis controles
//import ChatDialogo from "../../components/ChatDialogo/ChatDialogo";
import ComGalerias from "../../components/ComGalerias/ComGalerias";
import Map from "../../components/Map/MapBox";

import { Box, CircularProgress } from "@mui/material";
// components
import Navbar from "../../components/Navbar/Navbar"
// layouts
import Hero from "../../layouts/Hero/Hero";
//
import { useLocation } from "react-router-dom";
//
import { useNavigate } from "react-router-dom"
// styles
import "./styles.css";
import { useEffect, useState } from "react";
import { FormatColorResetRounded } from "@mui/icons-material";
import Check from "@mui/icons-material/Check";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton"
import ArrowBack from "@mui/icons-material/ArrowBack";
import CollectionsIcon from "@mui/icons-material/Collections"
import MapIcon from "@mui/icons-material/Map";
import { setnegocio, getcategoriasnegociosapp, getallnegocios, delnegocio  } from "../../servicios/negocios";
import { getJpgFile } from "../../servicios/imagenes";
import { getprovincias, getmunicipios } from "../../servicios/catalogos";


const CatNegocios = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {}
  const [user, setUser] = useState(sessionStorage.getItem("user"));
  const [resultado, setResultado] = useState("");
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [showGalerias, setShowGalerias] = useState(false);
  const [foto, setFoto] = useState();
  const [contenidofoto, setContenidofoto] = useState();
  const [nombrefoto, setNombrefoto] = useState("");
  const [contenido, setContenido] = useState("");
  const [nick, setNick] = useState("");
  const [categorianegocio, setCategorianegocio] = useState("");
  const [direccionpostal, setDireccionpostal] = useState("");
  const [telefonofijo, setTelefonofijo] = useState("");
  const [telefonocelular, setTelefonocelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [arrayprovincias, setArrayprovincia] = useState([]);
  const [provincia, setProvincia] = useState(0);
  const [arraymunicipios, setArraymunicipio] = useState([]);
  const [municipio, setMunicipio] = useState(0);
  const [tmunicipio, setTmunicipio] = useState([]);
  const [arraycategoriasnegocios, setArraycategoriasnegocios] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const arraydesconocido = [{ provincia: 99, municipio: 99, desc: "Desconocido" }];
  const [arraynegocios, setArraynegocios] = useState([]);
  const arraynonegocios = [{ idnegocio: 99999999, desc: "Desconocido" }];
  const [negocio, setIdnegocio] = useState(0);
  const [agregarsn, setAgregarsn] = useState(false);
  const [editarsn, setEditarsn] = useState(false);
  const [eliminarsn, setEliminarsn] = useState(false);
  const [inicia, setInicia] = useState(true);
  // Estados para almacenar los datos del negocio activo
  const [nickt, setNickt] = useState("");
  const [provinciat, setProvinciat] = useState("");
  const [municipiot, setMunicipiot] = useState("");
  const [descripciont, setDescripciont] = useState("");
  const [direccionpostalt, setDireccionpostalt] = useState("");
  const [telefonofijot, setTelefonofijot] = useState("");
  const [telefonocelulart, setTelefonocelulart] = useState("");
  const [correot, setCorreot] = useState("");
  const [cbgps, setCbgps] = useState(false);
  const [cbgpst, setCbgpst] = useState(false);
  const [cbvista, setCbvista] = useState(false);
  // Variables del CHAT
  const [chatuser, setChatuser] = useState("");
  const [chatnombre, setChatnombre] = useState("");
  const [indexChat, setIndexChat] = useState(0);
  const [showchat, setShowchat] = useState(false);
  const [cambios, setCambios] = useState(false);
  const [nivel, setNivel] = useState(9999);
  const [idowner, setIdowner] = useState(9999);
  const [naturaleza, setNaturaleza] = useState(9999);

  // Estados para la posición GPS del mapa
  const [zoom, setZoom] = useState(15.50);
  const [showMap, setShowMap] = useState(false);

  // Estados para la posición GPS del mapa
  const [lng, setLng] = useState(-75.829090519);
  const [lat, setLat] = useState(20.0217583);

  const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };

  const lngLatSelected = (point, lngLat) => {
    setLng(lngLat.lng);
    setLat(lngLat.lat);
  };

  async function init() {
    if (user==="cmr") {
      setChatuser("jge");
      setChatnombre("Jennifer Gonzalez")
    }
      else {
        setChatuser("cmr");
        setChatnombre("Carlos Mora Rojas")
      }
    sessionStorage.setItem("filtro", "Ubicación")
    setShow(true);
    //setCategorianegocio(0)
    setNivel(parsedParams.nivel);
    setNaturaleza(parsedParams.naturaleza);
    setIdowner(parsedParams.idowner);
    // Recuperar las categorias de las aplicaciones que existen
    {/*
    let resulcategoriasnegocios = await getcategoriasnegociosapp({});
    resulcategoriasnegocios = await resulcategoriasnegocios.json();

        if (resulcategoriasnegocios.length===0){
       setShow(false);
       setContenido("Agregue primero aplicaciones a la plataforma")
       setShow1(true);
       return
    }

    setArraycategoriasnegocios(resulcategoriasnegocios);
    */}
    
    //Recuperar los negocios de esta categoria
    
    let resultnegocios = await getallnegocios({categorianegocio: "", user: "" });
//    let resultnegocios = await getallnegocios({categorianegocio: resulcategoriasnegocios[0].categorianegocio, user: "" });
    resultnegocios = await resultnegocios.json();


    if (resultnegocios.error || resultnegocios.length === 0) {
      setArraynegocios(arraynonegocios);
    }
    else {
      // Posicionar el GPS
      if ((resultnegocios[0].longitud !== null)) {
        setLng(resultnegocios[0].longitud);
      }
      if ((resultnegocios[0].latitud !== null)) {
        setLat(resultnegocios[0].latitud);
      }
      setArraynegocios(resultnegocios);
      recuperadatosnegocio(resultnegocios[0]);
      
      let resultado = await getJpgFile({file: "./galerias/app_images/negocios/" + resultnegocios[0].idnegocio + "/" + resultnegocios[0].idnegocio + ".jpg" });
      resultado = await resultado.text();
      if (resultado.length !== 0) {
        setContenidofoto(resultado);
        setNombrefoto(foto);
//        setNombrefoto(resultnegocios.data[0].idnegocio);
      }
      else {
        setNombrefoto("");
      }
    }
    setIdnegocio(0);
    let resultprovincia= await getprovincias({});
    resultprovincia = await resultprovincia.json();

    if (resultprovincia.error || resultprovincia.length === 0) {
      setArrayprovincia(arraydesconocido);
      setProvincia(0);
    }
    else {
      setArrayprovincia(resultprovincia);
      setProvincia(resultprovincia[0].provincia);
    }

    var ttmunicipio = [];
    let resultmunicipio= await getmunicipios({});
    resultmunicipio = await resultmunicipio.json();

    if (resultmunicipio.error || resultmunicipio.length === 0) {
      setArraymunicipio(arraydesconocido);
      setTmunicipio(arraydesconocido);
      ttmunicipio = arraydesconocido;
    }
    else {
      setArraymunicipio(resultmunicipio);
      ttmunicipio = resultmunicipio.filter((item) => { if (item.provincia === resultprovincia[0].provincia) { return item } });
      if (ttmunicipio.length !== 0) {
        setTmunicipio(ttmunicipio);
        setMunicipio(ttmunicipio[0].municipio);
      }
      else {
        setTmunicipio(arraydesconocido);
        setMunicipio(0);
      }
    }

    setShow(false);
    setInicia(false);
  } // init

  function agregarchange() {
    if (document.getElementById("nick")) {
      document.getElementById("nick").focus();
    }
  }

  function recuperadatosnegocio(datos) {
    setNickt(datos.nick);
    setProvinciat(datos.provincia);
    setMunicipiot(datos.municipio);
    setDescripciont(datos.desc);
    setDireccionpostalt(datos.sede);
    setTelefonofijot(datos.fijo);
    setTelefonocelulart(datos.celular)
    setCorreot(datos.email);
    setCbgpst(datos.gpsSN===1?true:false);
    setCbgps(datos.gpsSN===1?true:false);
  }

  function transferirdatosnegocio() {
    let ttmunicipio = [];
    setNick(nickt);
    setDescripcion(descripciont);
    setDireccionpostal(direccionpostalt);
    setProvincia(provinciat);
    setMunicipio(municipiot);
    ttmunicipio = arraymunicipios.filter((item) => { if (item.provincia === provinciat) { return item } });
    setTmunicipio(ttmunicipio);
    setTelefonofijo(telefonofijot);
    setTelefonocelular(telefonocelulart)
    setCorreo(correot);
    setCbgps(cbgpst);

  }

  function limpiardatosnegocio() {
    setNick("");
    setDescripcion("");
    setDireccionpostal("");
    setTelefonofijo("");
    setTelefonocelular("")
    setCorreo("");
    setCbgps(false);
    setNombrefoto("");
    setContenidofoto("");
  }

  async function handleselect(e) {
    let ttmunicipio = [];
    switch (e.target.id) {
      case "provincia":
        setProvincia(Number(e.target.value));
        ttmunicipio = arraymunicipios.filter((item, i) => { if (item.provincia === Number(e.target.value)) { return item } });
        if (ttmunicipio.length !== 0) {
          setTmunicipio(ttmunicipio);
        }
        else {
          setTmunicipio(arraydesconocido);
          ttmunicipio = arraydesconocido;
        }
        setMunicipio(0);
        break
      case "municipio":
        setMunicipio(Number(e.target.value));
        break
      default:
        break;
    }
  }

  async function recuperaNegocios(value){
    let resultnegocio = await getallnegocios({categorianegocio: "", user: ""});
//    let resultnegocio = await getallnegocios({categorianegocio: arraycategoriasnegocios[value].categorianegocio, user: ""});
    resultnegocio = await resultnegocio.json();
    const data = resultnegocio;
    if (data.error || data.length === 0) {
      setArraynegocios(arraynonegocios);
    }
    else {
      setArraynegocios(resultnegocio);
      if ((resultnegocio[0].longitud !== null)) {
        setLng(resultnegocio[0].longitud);
      }
      if ((resultnegocio[0].latitud !== null)) {
        setLat(resultnegocio[0].latitud);
      }
      recuperadatosnegocio(resultnegocio[0]);
      let resultado = await getJpgFile({file: "./galerias/app_images/negocios/" + resultnegocio[0].idnegocio + "/" + resultnegocio[0].idnegocio + ".jpg"});
      resultado = await resultado.text();

      if (resultado.length !== 0) {
        setContenidofoto(resultado);
        setNombrefoto(resultnegocio[0].idnegocio);
      }
      else {
        setNombrefoto("");
      }

    }

  }

async function recuperaImgagenNegocio(value){
 let resultado = await getJpgFile({file: "./galerias/app_images/negocios/" + arraynegocios[value].idnegocio + "/" + arraynegocios[value].idnegocio + ".jpg"});
 resultado = await resultado.text();
  if (resultado.length !== 0) {
    setContenidofoto(resultado);
    setNombrefoto(arraynegocios[value].idnegocio);
  }
  else {
    setNombrefoto("");
  }

}

function handleInput(e) {
    switch (e.target.id) {
      case "categorianegocio":
        setCategorianegocio(e.target.value);
        // recuperar los negocios de esta categoria
        recuperaNegocios(e.target.value);

        setIdnegocio(0)
        tcancelar();
        break;
      case "negocio":
        setIdnegocio(e.target.value);
        // Recuperar los datos del negocio
        tcancelar();
        recuperadatosnegocio(arraynegocios[e.target.value]);

        if ((arraynegocios[e.target.value].longitud !== null)) {
          setLng(arraynegocios[e.target.value].longitud);
        }
        if ((arraynegocios[e.target.value].latitud !== null)) {
          setLat(arraynegocios[e.target.value].latitud);
        }
        recuperaImgagenNegocio(e.target.value);

        break;
      case "direccionpostal":
        setCambios(true);
        setDireccionpostal(e.target.value);
        break;
      case "fijo":
        setCambios(true);
        setTelefonofijo(e.target.value);
        break;
      case "celular":
        setCambios(true);
        setTelefonocelular(e.target.value);
        break;
      case "correo":
        setCambios(true);
        setCorreo(e.target.value);
        break;
      case "nick":
        setCambios(true);
        setNick(e.target.value);
        break;
      case "descripcionadicional":
        setCambios(true);
        break;
      case "descripcion":
        setCambios(true);
        setDescripcion(e.target.value);
        break;
      case "horarios":
        setCambios(true);
        break;
      case "capacidad":
        setCambios(true);
        break;
      case "tcapacidad":
        setCambios(true);
        break;
      case "cbgps":
        setCbgps(e.target.checked);
        break;
      case "vista":
        setCbvista(e.target.checked);
        break;
      default:
        break;
    }
  }

  async function confirmar() {
//    let result = await setnegocio({ user: user, nick, categorianegocio: arraycategoriasnegocios[categorianegocio].categorianegocio,
    let result = await setnegocio({ user: user, nick,
        negocio: arraynegocios[negocio].idnegocio, desc: descripcion,
      sede: direccionpostal, fijo: telefonofijo, celular: telefonocelular, email: correo,        
      agregarsn, editarsn, contenidofoto, provincia: provincia, municipio: municipio,
      latitud: lat, longitud: lng, gps: cbgps===true?1:0, creaCategoriaProducto: false
});
    result = await result.json();


    if (result.error) {
      setContenido(result.error);
      setShow1(true);
    }
    else {
      if (agregarsn) {
        arraynegocios.push({ idnegocio: result[0].mayor, desc: descripcion });
        arraynegocios.sort((itemA, itemB) => {
          if (itemA.desc.charCodeAt(0) > itemB.desc.charCodeAt(0)) return 1;
          if (itemA.desc.charCodeAt(0) < itemB.desc.charCodeAt(0)) return -1;
          return 0
        })
      }

      if (editarsn) {
        arraynegocios[negocio].nick = nick;
//        arraynegocios[negocio].categorianegocio = arraycategoriasnegocios[categorianegocio].categorianegocio;
        arraynegocios[negocio].negocio = arraynegocios[negocio].idnegocio;
        arraynegocios[negocio].desc = descripcion;
        arraynegocios[negocio].sede = direccionpostal;
        arraynegocios[negocio].fijo = telefonofijo;
        arraynegocios[negocio].celular = telefonocelular;
        arraynegocios[negocio].email = correo;
        arraynegocios[negocio].provincia = provincia;
        arraynegocios[negocio].municipio = municipio;
        recuperadatosnegocio(arraynegocios[negocio]);

      }

      setAgregarsn(false);
      setEditarsn(false);

      setContenido("Se registró correctamente el negocio.");
      setShow1(true);
    }
  } //confirma

  function editar() {
    transferirdatosnegocio();
    setEditarsn(true);
    if (document.getElementById("nick")) document.getElementById("nick").focus();
  }

  function onModalClose(){
     setShow1(false);
  }

  function agregar() {
    limpiardatosnegocio();

    setAgregarsn(true);
    if (document.getElementById("nick")) document.getElementById("nick").focus();
  }

  const eliminar = () => {
    setContenido("¿Está seguro que desea eliminar a " + arraynegocios[negocio].desc + "?");
    setEliminarsn(true);
    setShow1(true);
  }

  async function sino() {
    
    await delnegocio({negocio: arraynegocios[negocio].idnegocio});
       // refrescar la lista despues de eliminada la categoria
    arraynegocios.splice(negocio, 1);
    setShow1(false)
    setEliminarsn(false);
  }

  function tcancelar() {
    setCambios(FormatColorResetRounded);
    setEliminarsn(false);
    setAgregarsn(false);
    setEditarsn(false);
    setDescripcion("");
    setShowGalerias(false);
    setShowMap(false);
  }

  const onModalClose1 = () => {
    setShow1(false)
  }

  const onPhotoChange = (e) => {
    const file = e.target.files[0];
    setNombrefoto(e.target.value);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setContenidofoto(content);
    };
    reader.readAsDataURL(file);
    setCbvista(true);
  }


  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location]);

  useEffect(() => {
    agregarchange()
  }, [agregarsn])

  useEffect(() => {
    agregarchange()
  }, [editarsn])

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <Modal visible={show1} onClose={onModalClose1} className="cmodal wmodal" classContainer="modal-negocios">
        <div className="cerrar-button">
          <button className="cerrar" onClick={onModalClose1}>X</button>
        </div>
        <div className="main-modal">
          <label>{contenido}</label>
          {eliminarsn ?
            <>
              <button className="si" onClick={sino}>Si</button>
              <button className="no" onClick={onModalClose}>No</button>
            </> : ""
          }
        </div>
      </Modal>

      <div>
        <Navbar
          links={[
            { label: "Inicio", to: "/", tooltips: "Ir a la página principal" },
            {
              label: sessionStorage.getItem("user") === null ? "Iniciar sesión" : "Cerrar sesión", to: sessionStorage.getItem("user") === null ? "/login" : "/cerrarsesion",
              tooltips: sessionStorage.getItem("user") === null ? "Abrir sesión" : "Cerrar la sesión de " + sessionStorage.getItem("usernombre")
            },
            { label: "Registrarse", to: "/registrarse?inserta=true", tooltips: "Crear una cuenta de usuario" },
            { label: "Acerca de", to: "/Acercade", tooltips: "Acerca de M2G-Destodo" },
          ]}
        />
          <Hero clase={"hero-section"}>
          <div className="cabeza">
            <IconButton color="primary" onClick={() => {
              navigate(`/?naturaleza=${naturaleza}&idowner=${idowner}&nivel=${nivel}`);
            }}>
              <ArrowBack className="flecha"/>
            </IconButton>
            <h4 className="h3-1-cabeza-negocios">Negocios</h4>
          </div>
          {show ? <Box sx={{ width: "100%", height: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}><CircularProgress color="checkbox" /></Box> : null}
          {inicia === false ?
            <>
              <div className="negocio">
                <div className="container-negocio">
                  {/*
                  <div className="input-area-negocio">
                    <label className="label-n">Categoria: </label>
                    <select className="selectn" id="categorianegocio" onChange={handleInput} value={categorianegocio} disabled={agregarsn || editarsn}>
                      {arraycategoriasnegocios.map((item, i) => {
                        return <option key={i} value={i} >{item.desc}</option>
                      })}
                    </select>
                  </div>
                  */}
                  {agregarsn === false && editarsn === false ?
                    <>
                      <div className="input-area-negocio">
                        <label className="label-n">Negocios: </label>
                        <select className="select-negocio-2" id="negocio" onChange={handleInput} value={negocio}>
                          {arraynegocios.map((item, i) => {
                            return <option key={i} value={i} >{item.desc}</option>
                          })}
                        </select>
                      </div>
                    </> : ""
                  }

                  {agregarsn || (editarsn && inicia === false) ?
                    <>
                      <label className="label-1-1">Ubicación:</label>
                      <div className="input-area-negocio">
                        <label>Provincia:</label>
                        <select className="select-provincia-negocio" id="provincia" onChange={handleselect} value={provincia}>
                          {arrayprovincias.map((item, i) => {
                            return <option key={i} value={item.provincia} >{item.desc}</option>
                          })}
                        </select>
                      </div>
                      <div className="input-area-negocio">
                        <label>Municipio:</label>
                        <select className="select-municipio-negocio" id="municipio" onChange={handleselect} value={municipio}>
                          {tmunicipio.map((item, i) => {
                            return <option key={i} value={item.municipio} >{item.desc}</option>
                          })}
                        </select>
                      </div>
                    </>
                    : ""}

                  {agregarsn || editarsn ?
                    <>
                      <label className="label-1-1">Datos:</label>
                      <div className="input-area-negocio">
                        <div className="input-area2">
                          <label className="label-1-1">Nombre:</label>
                          <input className="input-negocio-p"
                            id="nick"
                            value={nick}
                            onChange={handleInput}
                            type="text"
                            required
                          />
                        </div>
                      </div>
                      <div className="input-area-negocios-1">
                        <label className="label-1-1">Descripción: </label>
                        <input className="input-negocio-4"
                          id="descripcion"
                          value={descripcion}
                          onChange={handleInput}
                          type="text"
                          required
                        />
                      </div>
                      <div className="input-area2">
                        <label className="label-1-1">Direccion:</label>
                        <input className="input-negocio-6"
                          id="direccionpostal"
                          value={direccionpostal}
                          onChange={handleInput}
                          type="text"
                          required
                        />
                      </div>
                      <div className="input-area2">
                        <label className="label-1-1">Tel. fijo:</label>
                        <input className="input-negocio-7"
                          id="fijo"
                          value={telefonofijo}
                          onChange={handleInput}
                          type="phone"
                          required
                        />
                      </div>
                      <div className="input-area2">
                        <label className="label-1-1">Celular:</label>
                        <input className="input-negocio-8"
                          id="celular"
                          value={telefonocelular}
                          onChange={handleInput}
                          type="phone"
                          required
                        />
                      </div>
                      <div className="input-area2">
                        <label className="label-1-1">Email:</label>
                        <input className="input-negocio-1"
                          id="correo"
                          value={correo}
                          onChange={handleInput}
                          type="email"
                          required
                        />
                      </div>

                      <div className="input-area4">
                          <label className="label-datos-catproducto input-catnegocios-99">GPS:</label>
                          <Checkbox sx={{ padding: 0 }} id="cbgps" color="checkbox" defaultChecked checked={cbgps} onClick={handleInput} />
                        </div> 

                      <div className="input-area-foto-producto">
                        <label className="label-negocio-2">Foto:</label>
                        <label className="label-2-1-prod">
                          <input
                            id="foto"
                            value={foto}
                            onChange={onPhotoChange}
                            type="file"
                            required
                          />
                          Añadir foto
                        </label>
                        {nombrefoto !== "" ?
                          <div className="check-vista-1">
                            <label className="label-vista-negocio-1-1">Vista previa</label>
                            <Checkbox className="cbox-vista" id="vista" color="checkbox" defaultChecked checked={cbvista} onClick={handleInput} />
                          </div> : ""
                        }
                      </div>
                      {(nombrefoto !== "" && cbvista) ?
                        <div className="img-class">
                          <img className="img-negocio" src={contenidofoto} Alt="Imagen del negocio" />
                        </div> : ""
                      }
                    </> : ""
                  }

                  {
                    resultado !== "" && <label className="err">{resultado}</label>
                  }

                  <div className="negocio-grupo-button">
                    {(agregarsn === false && editarsn === false) && inicia === false ?
                      <Tippy content="Añadir categoria de negocio">
                        <button type="button" className="negocio-button primary" onClick={agregar}>
                          <Add />
                        </button>
                      </Tippy> : ""
                    }
                    {
                      arraynegocios[0].idnegocio === undefined ? arraynegocios[0].idnegocio = 99999999 :
                        (agregarsn === false && editarsn === false) && inicia === false && arraynegocios[0].idnegocio !== 99999999 ?
                          <Tippy content="Clic para editar">
                            <button type="button" className="negocio-button primary" onClick={editar}>
                              <Edit />
                            </button>
                          </Tippy> : ""
                    }
                    {(agregarsn === false && editarsn === false) && inicia === false && arraynegocios[0].idnegocio !== 99999999 ?
                      <Tippy content="Clic para eliminar">
                        <button type="button" className="negocio-button primary" onClick={eliminar}>
                          <Delete />
                        </button>
                      </Tippy> : ""
                    }
                    {(agregarsn || editarsn) && inicia === false && cambios ?
                      <Tippy content="Registrar los datos del negocio">
                        <button type="button" className="negocio-button primary" onClick={confirmar}>
                          <Check />
                        </button>
                      </Tippy> : ""
                    }
                    {agregarsn || (editarsn && inicia === false) ?
                      <Tippy content="Cancelar agregar/editar">
                        <button type="button" className="negocio-button primary" onClick={tcancelar}>
                          <Close />
                        </button>
                      </Tippy> : ""
                    }
                    {(inicia === false && (editarsn)) || (inicia === false && arraynegocios[0].idnegocio !== 99999999 && agregarsn) ?
                      <>
                       {cbgps===true?
                        <Tippy content="Ubicar el negocio en el mapa" >
                          <button type="button" className="negocio-button primary" onClick={() => setShowMap(!showMap)}>
                            <MapIcon />
                          </button>
                        </Tippy>:""
                       }

                        <Tippy content={`Galeria de fotos del negocio`}>
                           <button type="button" className="producto-button primary"  onClick={() => setShowGalerias(!showGalerias)}>
                             <CollectionsIcon />
                           </button>
                        </Tippy>
                        <Tippy content={`Chat`}>
                           <button type="button" className="producto-button primary"  onClick={() => setShowchat(!showchat)}>
                               Chat
                           </button>
                        </Tippy>
                      </> : ""
                    }
                  </div>
                  {inicia === false && showGalerias === true && showchat === false && showMap === false ? (
                     <ComGalerias deQuien={arraynegocios[negocio].desc} rutatmp={"negocios/" + arraynegocios[negocio].idnegocio} perfil={arraynegocios[negocio].idnegocio} permiso={true} botonCerrar={false}
                     />
                  ) : ("")}


                  {showMap === true && showchat === false && showGalerias === false && cbgps===true ?
                  <>

                    <Map sx={{ height: "800px", width: "100%" }} onMapClick={lngLatSelected} remoteshowMap={showMap} lat={lat} lng={lng} point={{ lat, lng }} onChange={onChangeMap} remoteZoom={zoom} /></> : ""
                  }
{/*
                  {showchat === true && showGalerias === false && showMap === false ?
                     <ChatDialogo user={chatuser} nombre={chatnombre} indexChat={indexChat} /> : ""
                  }

*/}
                </div>
              </div>
            </> : ""}
        </Hero>
      </div>
    </>
  );
};

export default CatNegocios;
