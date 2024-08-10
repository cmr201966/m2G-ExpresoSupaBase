import Tippy from "@tippyjs/react";
import Modal from "../../components/Modal/Modal";
import Checkbox from '@mui/material/Checkbox';
// Mis controles
import ChatDialogo from "../../components/ChatDialogo/ChatDialogo";
import Chat from "@mui/icons-material/Chat"
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
import axios from "axios";
import { FormatColorResetRounded } from "@mui/icons-material";
//import styledEngineSc from "@mui/styled-engine-sc";
import Check from "@mui/icons-material/Check";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton"
import ArrowBack from "@mui/icons-material/ArrowBack";
import CollectionsIcon from "@mui/icons-material/Collections"
import MapIcon from "@mui/icons-material/Map";

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
  const arraycategoriasnegocios1 = [
//    { categorianegocio: 91, desc: "Compra/Venta" }, 
//    { categorianegocio: 61, desc: "Fiestas" }, { categorianegocio: 62, desc: "Eventos" },
//    { categorianegocio: 63, desc: "Cursos" }, { categorianegocio: 60, desc: "Empleos" },
//    { categorianegocio: 86, desc: "Bolsa de Empleos" }, { categorianegocio: 90, desc: "Taxis" }, 
    { categorianegocio: 90, desc: "Taxi ligero" }, 
    { categorianegocio: 92, desc: "Moto taxi" }]
//    { categorianegocio: 53, desc: "Software" }, { categorianegocio: 4, desc: "Restaurantes" }];
  const [descripcionadicional, setDescripcionadicional] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const arraydesconocido = [{ provincia: 99, municipio: 99, desc: "Desconocido" }];
  const [cbhorarios, setCbhorarios] = useState(true);
  const [cbcapacidad, setCbcapacidad] = useState(true);
  const arrayperiodo = [{ key: 1, desc: "Día" }, { key: 2, desc: "Mes" }, { key: 3, desc: "Año" }, { key: 4, desc: "Turno" }];
  const [iperiodo, setIperiodo] = useState(0);
  const [capacidad, setCapacidad] = useState(0);
  const arraysemana = [{ key: 0, desc: "Todos los días" }, { key: 1, desc: "Domingo" }, { key: 2, desc: "Lunes" }, { key: 3, desc: "Martes" }, { key: 4, desc: "Miercoles" }, { key: 5, desc: "Jueves" }, { key: 6, desc: "Viernes" }, { key: 7, desc: "Sábado" }, { key: 8, desc: "Lunes a Sábado" }, { key: 9, desc: "Lunes a viernes" }];
  const [isemana, setIsemana] = useState(0);
  let [arrayhorarios, setArrayhorarios] = useState([{ diasemana: 99, horaopen: 0, minutoopen: 0, horaclose: 0, minutoclose: 0 }, { idnegocio: 99999999, horaopen: 0, minutoopen: 0, horaclose: 0, minutoclose: 0 }, { idnegocio: 99999999, horaopen: 0, minutoopen: 0, horaclose: 0, minutoclose: 0 }, { idnegocio: 99999999, horaopen: 0, minutoopen: 0, horaclose: 0, minutoclose: 0 }, { idnegocio: 99999999, horaopen: 0, minutoopen: 0, horaclose: 0, minutoclose: 0 }, { idnegocio: 99999999, horaopen: 0, minutoopen: 0, horaclose: 0, minutoclose: 0 }, { idnegocio: 99999999, horaopen: 0, minutoopen: 0, horaclose: 0, minutoclose: 0 }, { idnegocio: 99999999, horaopen: 0, minutoopen: 0, horaclose: 0, minutoclose: 0 }, { idnegocio: 99999999, horaopen: 0, minutoopen: 0, horaclose: 0, minutoclose: 0 }, { idnegocio: 99999999, horaopen: 0, minutoopen: 0, horaclose: 0, minutoclose: 0 }]);
  const [arraythorarios, setArraythorarios] = useState([]);
  const [arraynegocios, setArraynegocios] = useState([]);
  const arraynonegocios = [{ idnegocio: 99999999, desc: "Desconocido" }];
  const arraynohorarios = [{ idnegocio: 99999999, diasemana: 99, horaopen: 99, minutoopen: 99, horaclose: 99, minutoclose: 99 }];
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
  const [descripcionadicionalt, setDescripcionadicionalt] = useState("");
  const [direccionpostalt, setDireccionpostalt] = useState("");
  const [telefonofijot, setTelefonofijot] = useState("");
  const [telefonocelulart, setTelefonocelulart] = useState("");
  const [correot, setCorreot] = useState("");
  const [capacidadt, setCapacidadt] = useState("");
  const [cbcapacidadt, setCbcapacidadt] = useState(false);
  const [cbhorariost, setCbhorariost] = useState(false);
  const [iperiodot, setIperiodot] = useState("");
  const [cbgps, setCbgps] = useState(false);
  const [cbgpst, setCbgpst] = useState(false);
  const [cbvista, setCbvista] = useState(false);
  // Variables del CHAT
  const [chatuser, setChatuser] = useState("");
  const [chatnombre, setChatnombre] = useState("");
  const [indexChat, setIndexChat] = useState(0);
  const [showchat, setShowchat] = useState(false);
  const [desctmp, setDesctmp] = useState("");
  const [rutatmp, setRutatmp] = useState("");
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
    sessionStorage.setItem("filtro", "Ubicación")
    setShow(true);
    setCategorianegocio(0)
    setNivel(parsedParams.nivel);
    setNaturaleza(parsedParams.naturaleza);
    setIdowner(parsedParams.idowner);
    // Recuperar las categorias de las aplicaciones que existen
    const resulcategoriasnegocios = await axios.post(
      "http://localhost:3001/getcategoriasnegociosapp",
      { },
      {}
    );
    if (resulcategoriasnegocios.data.length===0){
       setShow(false);
       setContenido("Agregue primero aplicaciones a la plataforma")
       setShow1(true);
       return
    }

//    setArraycategoriasnegocios(resulcategoriasnegocios.data);
    setArraycategoriasnegocios(arraycategoriasnegocios1);
    
    //Recuperar los negocios de esta categoria
    const resultnegocios = await axios.post(
      "http://localhost:3001/getallnegocios",
//      { categorianegocio: resulcategoriasnegocios.data[0].categorianegocio, user: sessionStorage.getItem("user") },
      { categorianegocio: resulcategoriasnegocios.data[0].categorianegocio, user: "" },
      {}
    );
    if (resultnegocios.data.error || resultnegocios.data.length === 0) {
      setArraynegocios(arraynonegocios);
    }
    else {
      // Posicionar el GPS
      if ((resultnegocios.data[0].longitud !== null)) {
        setLng(resultnegocios.data[0].longitud);
      }
      if ((resultnegocios.data[0].latitud !== null)) {
        setLat(resultnegocios.data[0].latitud);
      }
      setArraynegocios(resultnegocios.data);
      recuperadatosnegocio(resultnegocios.data[0]);
      const resultado = await axios.post(
        "http://localhost:3001/getjpg-file",
        { file: "./galerias/app_images/negocios/" + resultnegocios.data[0].idnegocio + "/" + "foto-1.jpg" },
        {}
      );
      if (resultado.data.length !== 0) {
        setContenidofoto(resultado.data);
        setNombrefoto(foto-1);
//        setNombrefoto(resultnegocios.data[0].idnegocio);
      }
      else {
        setNombrefoto("");
      }
    }
    setIdnegocio(0);

    const resultprovincia = await axios.post(
      "http://localhost:3001/getprovincias",
      {},
      {}
    );
    if (resultprovincia.data.error || resultprovincia.data.length === 0) {
      setArrayprovincia(arraydesconocido);
      setProvincia(0);
    }
    else {
      setArrayprovincia(resultprovincia.data);
      setProvincia(resultprovincia.data[0].provincia);
    }

    var ttmunicipio = [];
    const resultmunicipio = await axios.post(
      "http://localhost:3001/getmunicipios",
      { provincia: "" },
      {}
    );
    if (resultmunicipio.data.error || resultmunicipio.data.length === 0) {
      setArraymunicipio(arraydesconocido);
      setTmunicipio(arraydesconocido);
      ttmunicipio = arraydesconocido;
    }
    else {
      setArraymunicipio(resultmunicipio.data);
      ttmunicipio = resultmunicipio.data.filter((item, i) => { if (item.provincia === resultprovincia.data[0].provincia) { return item } });
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
    setChatuser("root");
    setChatnombre("Destodo");
    setProvinciat(datos.provincia);
    setMunicipiot(datos.municipio);
    setDescripciont(datos.desc);
    setDescripcionadicionalt(datos.descadicional);
    setDireccionpostalt(datos.sede);
    setTelefonofijot(datos.fijo);
    setTelefonocelulart(datos.celular)
    setCorreot(datos.email);
    setCbgpst(datos.gpsSN===1?true:false);
    setCbgps(datos.gpsSN===1?true:false);
    setCapacidadt(datos.capacidadacontratar);
    if (datos.capacidadSN) {
      setCbcapacidadt(true);
    }
    else {
      setCbcapacidadt(false);
    }
    if (datos.horarioSN) {
      setCbhorariost(true);
    }
    else {
      setCbhorariost(false);
    }
    setIperiodot(datos.periodocapacidad);
  }

  function transferirdatosnegocio() {
    let ttmunicipio = [];
    setNick(nickt);
    setDescripcion(descripciont);
    setDescripcionadicional(descripcionadicionalt);
    setDireccionpostal(direccionpostalt);
    setProvincia(provinciat);
    setMunicipio(municipiot);
    ttmunicipio = arraymunicipios.filter((item, i) => { if (item.provincia === provinciat) { return item } });
    setTmunicipio(ttmunicipio);
    setTelefonofijo(telefonofijot);
    setTelefonocelular(telefonocelulart)
    setCorreo(correot);
    setCbgps(cbgpst);
    setCapacidad(capacidadt);
    setCbcapacidad(cbcapacidadt);
    setCbhorarios(cbhorariost);
    setIperiodo(iperiodot);

  }

  function limpiardatosnegocio() {
    setNick("");
    setDescripcion("");
    setDescripcionadicional("");
    setDireccionpostal("");
    setTelefonofijo("");
    setTelefonocelular("")
    setCorreo("");
    setCbgps(false);
    setCapacidad("");
    setCbcapacidad(false);
    setCbhorarios(false);
    setIperiodo(0);
    setNombrefoto("");
    setContenidofoto("");
    //setMunicipio("");
    //setProvincia("");
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

  async function handleInput(e) {
    switch (e.target.id) {
      case "categorianegocio":
        setCategorianegocio(e.target.value);
        // recuperar los negocios de esta categoria
        const resultnegocio = await axios.post(
          "http://localhost:3001/getallnegocios",
          { categorianegocio: arraycategoriasnegocios[e.target.value].categorianegocio, user: "" },
//          { categorianegocio: arraycategoriasnegocios[e.target.value].categorianegocio, user: sessionStorage.getItem("user") },
          {}
        );
        const data = resultnegocio.data;
        console.log(data);
        if (data.error || data.length === 0) {
          setArraynegocios(arraynonegocios);
        }
        else {
          setArraynegocios(resultnegocio.data);
          if ((resultnegocio.data[0].longitud !== null)) {
            setLng(resultnegocio.data[0].longitud);
          }
          if ((resultnegocio.data[0].latitud !== null)) {
            setLat(resultnegocio.data[0].latitud);
          }
          recuperadatosnegocio(resultnegocio.data[0]);

          const resultado = await axios.post(
            "http://localhost:3001/getjpg-file",
            {file: "./galerias/app_images/negocios/" + resultnegocio.data[0].idnegocio + "/" + "foto-1.jpg"},
//            { foto: resultnegocio.data[0].idnegocio, folder: "negocios" },
            {}
          );
          if (resultado.data.length !== 0) {
            setContenidofoto(resultado.data);
            setNombrefoto(resultnegocio.data[0].idnegocio);
          }
          else {
            setNombrefoto("");
          }

        }
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

        const resultado = await axios.post(
          "http://localhost:3001/getjpg-file",
          {file: "./galerias/app_images/negocios/" + arraynegocios[e.target.value].idnegocio + "/" + "foto-1.jpg"},
//          { foto: arraynegocios[e.target.value].idnegocio, folder: "negocios" },
          {}
        );
        if (resultado.data.length !== 0) {
          setContenidofoto(resultado.data);
          setNombrefoto(arraynegocios[e.target.value].idnegocio);
        }
        else {
          setNombrefoto("");
        }

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
        setDescripcionadicional(e.target.value);
        break;
      case "descripcion":
        setCambios(true);
        setDescripcion(e.target.value);
        break;
      case "horarios":
        setCambios(true);
        setCbhorarios(e.target.checked);
        break;
      case "capacidad":
        setCambios(true);
        setCbcapacidad(e.target.checked);
        break;
      case "tcapacidad":
        setCambios(true);
        setCapacidad(e.target.value);
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
    const result = await axios.post(
      "http://localhost:3001/setnegocio",
      {
        user: user, nick, categorianegocio: arraycategoriasnegocios[categorianegocio].categorianegocio,
        negocio: arraynegocios[negocio].idnegocio, desc: descripcion,
        sede: direccionpostal, fijo: telefonofijo, celular: telefonocelular, email: correo,        
        agregarsn, editarsn, contenidofoto, provincia: provincia, municipio: municipio,
        latitud: lat, longitud: lng, gps: cbgps===true?1:0, creaCategoriaProducto: false
      },
      {}
    );
    if (result.data.error) {
      //      setContenido("No se registró el negocio.");
      setContenido(result.data.error);
      setShow1(true);
    }
    else {
      if (agregarsn) {
        arraynegocios.push({ idnegocio: result.data[0].mayor, desc: descripcion });
        arraynegocios.sort((itemA, itemB) => {
          if (itemA.desc.charCodeAt(0) > itemB.desc.charCodeAt(0)) return 1;
          if (itemA.desc.charCodeAt(0) < itemB.desc.charCodeAt(0)) return -1;
          return 0
        })
      }

      if (editarsn) {
        arraynegocios[negocio].nick = nick;
        arraynegocios[negocio].categorianegocio = arraycategoriasnegocios[categorianegocio].categorianegocio;
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

    let thorarios = arrayhorarios;
    setArraythorarios(arrayhorarios);
    for (let i = 0; i < 10; i += 1) {
      thorarios.push({ idnegocio: 99999999, horaopen: 0, minutoopen: 0, horaclose: 0, minutoclose: 0 })
    }
    arrayhorarios = thorarios;


    setAgregarsn(true);
    if (document.getElementById("nick")) document.getElementById("nick").focus();
  }

  const eliminar = () => {
    setContenido("¿Está seguro que desea eliminar a " + arraynegocios[negocio].desc + "?");
    setEliminarsn(true);
    setShow1(true);
  }

  async function sino() {
    await axios.post(
      "http://localhost:3001/delnegocio",
      { negocio: arraynegocios[negocio].idnegocio },
      {}
    );
    //    refrescar la lista despues de eliminada la categoria
    arraynegocios.splice(negocio, 1);
    setShow1(false)
    setEliminarsn(false);
  }

  function tcancelar() {
    setCambios(FormatColorResetRounded);
    setEliminarsn(false);
    setAgregarsn(false);
    setArrayhorarios(arraythorarios);
    setEditarsn(false);
    setDescripcion("");
    setShowGalerias(false);
    setShowMap(false);
  }

  const onModalClose1 = () => {
    setShow1(false)
  }
  const galerias = () => {
    if (showchat === true) return
    if (showMap === true) return
    if (showGalerias === false) {
      setDesctmp(arraynegocios[negocio].desc);
      setRutatmp("negocios/" + arraynegocios[negocio].idnegocio);
      setShowGalerias(true);
    }
    else {
      setShowGalerias(false);
    }

  }

  const onPhotoChange = (e) => {
    const file = e.target.files[0];
    const fileName = e.target.value;
    setNombrefoto(e.target.value);
    if (!file) return;
    const reader = new FileReader();
    // eslint-disable-next-line no-shadow
    reader.onload = (e) => {
      const content = e.target.result;
      setContenidofoto(content);
    };
    reader.readAsDataURL(file);
    //const p  = e.target.value.substring(0).split("\\");
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
        <Hero>
          <div className="cabeza">
            <IconButton color="primary" onClick={() => {
              navigate(`/?naturaleza=${naturaleza}&idowner=${idowner}&nivel=${nivel}`);
            }}>
              <ArrowBack />
            </IconButton>
            <h3 className="h2-cabeza-negocios">Destodo</h3>
            <h4 className="h3-1-cabeza-negocios"> - Negocios</h4>
          </div>
          {show ? <Box sx={{ width: "100%", height: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}><CircularProgress color="checkbox" /></Box> : null}
          {inicia === false ?
            <>
              <div className="negocio">
                <div className="container-negocio">
                  <div className="input-area-negocio">
                    <label className="label-n">Tipo Negocio: </label>
                    <select className="selectn" id="categorianegocio" onChange={handleInput} value={categorianegocio} disabled={agregarsn || editarsn}>
                      {arraycategoriasnegocios.map((item, i) => {
                        return <option key={i} value={i} >{item.desc}</option>
                      })}
                    </select>
                  </div>
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

                </div>

                {showchat === true && showGalerias === false && showMap === false ?
                  <ChatDialogo user={chatuser} nombre={chatnombre} indexChat={indexChat} />
                  : ""
                }
              </div>
            </> : ""}
        </Hero>
      </div>
    </>
  );
};

export default CatNegocios;
