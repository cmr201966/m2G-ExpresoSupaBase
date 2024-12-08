import Checkbox from '@mui/material/Checkbox';
import Tippy from "@tippyjs/react";
import Modal from "../../components/Modal/Modal";
import { useLocation } from "react-router-dom";
import Calendario from "../../components/Calendar/Calendar";
import Navbar from "../../components/Navbar/Navbar"
import ChatDialogo from "../../components/ChatDialogo/ChatDialogo";
import ComGalerias from "../../components/ComGalerias/ComGalerias";
import Map from "../../components/Map/Map";
// @mui icons
import MapIcon from "@mui/icons-material/Map";
import Delete from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import CollectionsIcon from "@mui/icons-material/Collections";
import Chat from "@mui/icons-material/Chat";
import Add from "@mui/icons-material/Add";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import { useTheme } from "@mui/material";

import { Box, Button } from "@mui/material"

// layouts
import Hero from "../../layouts/Hero/Hero";

// 
import { useNavigate } from "react-router-dom"

// styles
import "./styles.css";

import { useEffect, useState } from "react";
import axios from "axios";
//import styledEngineSc from "@mui/styled-engine-sc";

import { useNotification } from "../../context/NotificationProvider";

// utils
import {
  isValid,
  getJpgFileSB,
} from "../../Utiles/Utiles";
import {
  getContratoClientes, getInfoProductoCM
} from "../../Utiles/apiBaseDatos";


Date.prototype.toDateInputValue = (function () {
  let local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10)
})

const Contrato = () => {
  const location = useLocation();
  const parsedParams = {}
  const navigate = useNavigate();
  const { setOpen, setMessage } = useNotification();
  const [resultado, setResultado] = useState("");
  const [fechat, setFechat] = useState(new Date().toDateInputValue());
  const [contrato, setContrato] = useState(0);
  const [sino, setSino] = useState(false);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show4, setShow4] = useState(false);
  const [showGalerias, setShowGalerias] = useState(false);
  const [showselectimg, setShowselecimg] = useState(false);
  const [showimg, setShowimg] = useState(false);
  const [menusn, setMenusn] = useState(false);
  const [incluye, setIncluye] = useState(false);
  const [elegirya, setElegirya] = useState(false);
  const [foto, setFoto] = useState();
  const [contenidofoto, setContenidofoto] = useState([]);
  const [nombrefoto, setNombrefoto] = useState("");
  const [negocio, setNegocio] = useState(99999999);
  const [producto, setProducto] = useState("");
  const [productos, setProductos] = useState([]);
  const [desc, setDesc] = useState("");
  const [precio, setPrecio] = useState(0);
  const [ya, setYa] = useState(false);
  const [domicilioSN, setDomicilioSN] = useState(false);
  const [domicilio, setDomicilio] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [cantidadsn, setCantidadsn] = useState(false);
  const [capacidadsn, setCapacidadsn] = useState(false);
  const [capacidad, setCapacidad] = useState(0);
  const [nombremenu, setNombremenu] = useState("");
  const [capacidaddisponible, setCapacidaddisponible] = useState(0);
  const [showCalendario, setShowCalendario] = useState(false);
  const [contenidomodal, setContenidomodal] = useState("");
  const [contenidomodal2, setContenidomodal2] = useState("");
  const [inicia, setInicia] = useState(true);
  const [tinicia, setTinicia] = useState(false);
  const [arraycantidad, setArraycantidad] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  const [cargandocantidades, setCargandocantidades] = useState(false);
  const [arraycategoriasproductos, setArraycategoriasproductos] = useState([]);
  const arraynocategoriasproductos = [{ idcategoria: 999999, desc: "Desconocida" }];
  const [categoria, setCategoria] = useState(0);
  // Otros estados
  const [productotmp, setProductotmp] = useState("");
  const [categoriatmp, setCategoriatmp] = useState("");
  const [tdesc, setTdesc] = useState("");
  const [cantidadtmp, setCantidadtmp] = useState(0);
  const [indice, setindice] = useState(0);
  const [selec, setSelec] = useState(false);
  const [cantidadselec, setCantidadselec] = useState(0);
  const [cambios, setCambios] = useState(0);
  const [selectfoto, setSelectfoto] = useState(99999999);
  const theme = useTheme();
  const fixed="";
 //Parametros
  const [keyproducto, setKeyproducto] = useState(0);
  const [descnaturaleza, setDescnaturaleza] = useState("");

  // Estados para calculo de ganancias y costos
  const [importe, setImporte] = useState(0);
  const [tcantidad, setTcantidad] = useState(0);
  const [hora, setHora] = useState("");
  const [minuto, setMinuto] = useState("");
  //
  const [nombre, setNombre] = useState("");
  const [ape1, setApe1] = useState("");
  const [ape2, setApe2] = useState("");
  const [nit, setNit] = useState("");
  const [celular, setCelular] = useState("");
  const [fijo, setFijo] = useState("");
  const [tproducto, setTproducto] = useState("");
  const [tindice, setTindice] = useState(0);
  const [contenidofotos, setContenidofotos] = useState([]);
  const [showchat, setShowchat] = useState(false);
  const [añadir_user, setAñadir_user] = useState(false);
  const [arrayclientes, setArrayclientes] = useState([]);
  const arraynoclientes = [{ iduser: 99999999, nombre: "No hay clientes" }];
  const [cliente, setCliente] = useState(0);
  const [agregando, setAgregando] = useState(false);
  const [cbahora, setCbahora] = useState(true);
  let filedesc="";
  let tfiles=".jpg";

  
  
  // Estados para la posición GPS del mapa
  const [zoom, setZoom] = useState(15.00);
  const [showMap, setShowMap] = useState(false);

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

  async function init(dia, mes, año) {
    if (sessionStorage.getItem("dueño") === null) {
      sessionStorage.setItem("filtro", "")
      sessionStorage.setItem("naturaleza", parsedParams.naturaleza);
      sessionStorage.setItem("idowner", parsedParams.idowner);
      sessionStorage.setItem("nivel", parsedParams.nivel);
      sessionStorage.setItem("dueño", parsedParams.dueno);
    }
    let tkeyproducto = keyproducto;
    if (keyproducto === 0) {
      tkeyproducto = parsedParams.keyproducto;
      setKeyproducto(parsedParams.keyproducto);
      setDescnaturaleza(parsedParams.descnaturaleza);
    }
    setMessage("Preparando condiciones, espere por favor...");
    setOpen(true);
    let result = await getContratoClientes();
    if (
      (isValid(result) === true && result.err) ||
      isValid(result) === false ||
      result.length === 0
    ) {
      setArrayclientes(arraynoclientes);
    } else {
      setArrayclientes(result);
    }


    let idsb = "";
    let result2 = await getInfoProductoCM(tkeyproducto);
    if (isValid(result) === true) {
      setProducto(tkeyproducto);
      setNegocio(result[0].negocio);
      setDesc(result[0].desc);
      setPrecio(result[0].precio);
      setCantidad(result[0].cantidad);
      setDomicilio(result[0].domicilio);
      setLat(result[0].latitud);
      setLng(result[0].longitud);
      idsb = result[0].idsb;
    }

    const result99 = await axios.post(
      "http://localhost:3001/getproducto",
      { keyproducto: tkeyproducto },
      {}
    );
    if (!result2.error) 
    {
      setProducto(result2[0].keyproducto);
      setDesc(result2[0].descripcion);
      setPrecio(result2[0].precio);
      setCapacidadsn(result2[0].capacidadsn);
      setCantidad(result2[0].cantidad);
      setCantidadsn(result2[0].cantidadsn);
      setMenusn(result2[0].menuSN);
      setDomicilioSN(result2[0].domicilioSN);
      setDomicilio(result2[0].domicilio);
      setNegocio(result2.data[0].idnegocio);

      const result9 = await axios.post(
        "http://localhost:3001/getdisponibilidad",
        { keyproducto: tkeyproducto, dia, mes, año },
        {}
      );

      if (result9.data.length === 0) {
        setCapacidaddisponible(0);
      }
      else {
        setCapacidaddisponible(result9.data[0].capacidaddisponible);
      }

      const result0 = await axios.post(
        "http://localhost:3001/getnegocioproducto",
        { keyproducto: tkeyproducto },
        {}
      );
      if (result2.data[0].cantidadsn===true)
      {
         setCapacidad(result2.data[0].cantidad);
      }
      else
      {
        if (result2.data[0].capacidadsn===true)
        {
           if (result9.data.length === 0) 
           {
              setCapacidad((result0.data[0].capacidadacontratar / result2.data[0].aportecapacidad).toFixed(0))
           }
           else 
           {
        //
        // Preguntar si el negocio tiene capacidad, en caso positivo, verificar si hay capacidad
        //
            if (result9.data[0].capacidaddisponible === 0) 
            {
          // setCapacidad((result0.data[0].capacidadacontratar / result2.data[0].aportecapacidad).toFixed(0))
              setCapacidad(0);
            }
            else 
            {
              if ((result9.data[0].capacidaddisponible / result2.data[0].aportecapacidad).toFixed(0) === "-0") 
              {
                 setCapacidad(0);
              }
              else 
              {
                 setCapacidad((result9.data[0].capacidaddisponible / result2.data[0].aportecapacidad).toFixed(0))
              }
             }
           }
         }
        }
      const result1 = await axios.post(
        "http://localhost:3001/getuserdatos",
        { user: sessionStorage.getItem("user") },
        {}
      );
    }
    setShow2(false);
    setInicia(false);
  } //init

  const onModalClose = () => {
    setShow(false)
  }

  const onModalClose1 = () => {
    if (document.getElementById("cantidad") !== null) document.getElementById("cantidad").focus();
    setShow1(false)
  }
  const modalbutton1 = () => {
    setContenidomodal2("Explicar como transferir")
    setShow2(true);
  }
  const modalbutton2 = () => {
    setContenidomodal2("")
    setShow2(true);
  }
  const modalbutton3 = () => {
    setContenidomodal2("")
    setShow2(true);
  }
  const onModalClose2 = () => {
    setShowCalendario(false)
  }
  function onModalCloseShowimg() {
    setShowimg(false);
  }

  const onModalClose3 = () => {
    setShow2(false);
  }
  const onModalClose4 = () => {
    setShow4(false);
  }


  function handleInput(e) {
    switch (e.target.id) {
      case "cliente":
        setCliente(e.target.value);
        break;
      case "nombre":
        setNombre(e.target.value);
        break;
      case "ape1":
        setApe1(e.target.value);
        break;
      case "ape2":
        setApe2(e.target.value);
        break;
      case "nit":
        setNit(e.target.value);
        break;
      case "celular":
        setCelular(e.target.value);
        break;
      case "fijo":
        setFijo(e.target.value);
        break;
      case "cbahora":
        setCbahora(e.target.checked);
        break;
      case "hora":
        setHora(e.target.value);
        break;
      case "minuto":
        setMinuto(e.target.value);
        break;
      case "tcantidad":
        setTcantidad(e.target.value);
        arraycantidad[indice] = Number(e.target.value);
        break;
      case "fechat":
        setFechat(e.target.value);
        setResultado("");
        break;
      case "cantidad":
        for (let i = 0; i < cbopciones.length; i += 1) {
          cbopciones[i] = (false);
          setCargandocbopciones(true);
        }

        if (Number(e.target.value) > capacidad) {
          setContenidomodal2(`La cantidad no puede exceder la capacidad (${capacidad})`);
          document.getElementById("cantidad").focus();
          setShow2(true);
        }
        else {
          setCantidad(e.target.value);
          setResultado("");
        }
        break;
      case "opcion":
        setOpciones(e.target.value);
        break;
      default:
        if (Number(e.target.value) >= 0 && Number(e.target.value) < 50) {
          setCambios(true);
          setCargandocantidades(true);
          arraycantidad[Number(e.target.id)] = Number(e.target.value);
          setTcantidad(Number(e.target.value));
          setCantidadtmp(Number(e.target.value));
          let importeT = 0;
          arrayopcionesselect.forEach((item, i) => {
            importeT = importeT + (item.precio * arraycantidad[i]);
          })
          setImporte(importeT);
        }
        if (Number(e.target.id) >= 50 && Number(e.target.id) < 100) {
          let i = Number(e.target.id) - 50;
          setProductotmp(arrayopcionesselect[i].producto);
          setCategoriatmp(arrayopcionesselect[i].idcategoria);
          setTdesc(arrayopcionesselect[i].desc);
          setCantidadtmp(arraycantidad[i]);
          setindice(i);
          setSelec(arrayopcionesselect[i].select);
          cbopciones[Number(e.target.id) - 50] = (e.target.checked);
          if (e.target.checked === true) {
            setCantidadselec(cantidadselec + 1)
          }
          else {
            setShowselecimg(false);
            if (cantidadselec > 0) {
              setCantidadselec(cantidadselec - 1);
            }
          }
          setCargandocbopciones(true);
        }

        break;
    }
  }

  function onDaySelected(year, month, day) {
    setFechat(new Date(year, month, day).toDateInputValue());
    setShowCalendario(false);
    init(day, month + 1, year);
  }


  async function reservar() {
    let tuser = sessionStorage.getItem("user");
    if (Number(sessionStorage.getItem("tipouser")) === 1 && añadir_user === false && sessionStorage.getItem("dueño") === sessionStorage.getItem("user")) {
      tuser = arrayclientes[cliente].iduser;
    }
    let resultuser = [];
    if (añadir_user === true) {
      // Registrar los datos del usuario en la tablausuarios
      tuser = nombre.substring(0, 1).toLowerCase() + ape1.substring(0, 1).toLowerCase() + ape2.substring(0, 1).toLowerCase();
      resultuser = await axios.post(
        "http://localhost:3001/setuserexpress",
        {
          user: tuser, nombre: nombre + " " + ape1 + " " + ape2,nit: nit, celular: celular, fijo: fijo
        },
        {}
      );

    }
    if (cantidad !== 0) {

      // productotmp,  producto para el que seleccionaros las imagenes
      // arrayopcionesselect es el menu para este contrato
      // arraycantidad son las cantidades de los productos del menu
      const result = await axios.post(
        "http://localhost:3001/setcontrato",
        {
          user: tuser, keyproducto, fechat, hora: hora + ":" + minuto, cantidad,
          seleccionados: arraybannerseleccionados,
          menu: arrayopcionesselect, producto: productotmp, cantidades: arraycantidad,
          lng, lat
        },
        {}
      );
      const data = await result.data;
      if (data.error) {
        setContenidomodal2(data.error);
        setShow2(true);
      }
      else {
        setContenidomodal("No. del contrato-> " + data[0].contrato + ". Esto es una pre-reservación, se hará efectivo cuando pague el contrato." +
          " En el botón ¿como transferir? se explica como transferir dinero a nuestra cuenta bancaria. Dentro de 24 horas esta pre-reservación será elimindada" +
          " si no se paga el contrato y el día quedara disponible. Otra opción es contactar al dueño y concretar un acuerdo");
        setContrato(data[0].contrato)
        setSino(true);
        setYa(true);
        setShow1(true);
      }
    }
  } // Confirmar

  async function seleccionar(producto, tmpcantidad, indice) {
    if (showselectimg === false) {
      setTproducto(producto);
      setTcantidad(tmpcantidad);
      setTindice(indice);
      setShowselecimg(true);
      if (elegirya===false)
      {
        setElegirya(true);
        arraybannerseleccionados.splice(0,arraybannerseleccionados.length);
         rutatmp = "productos/" + productotmp;
         init1(rutatmp, 0);
      }
    }
    else {
      setShowselecimg(false);
    }
  }

  function selectitemselec(indice) 
  {
    setItemopcionselec(indice);
    setShowimg(true);
    sessionStorage.setItem("hd_i",indice);
  }

  function fsubirfotos() 
  {
    filedesc=tfichero===0?"Subir Foto":tfichero===1?"Subir Texto":tfichero===2?"Subir Video":tfichero===3?"Subir Audio":"";
    tfiles=tfichero===0?".jpg":tfichero===1?".doc":tfichero===2?".avi;.mp4;.wav":tfichero===3?".mp3":""
    setShow4(true);
  }

  const onPhotoChange = (e) => 
  {
    const file = e.target.files[0];
    filesuploaded.push(e.target.files[0].name);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => 
    {
      const content = e.target.result;
      setContenidophotoupload(content);
    };
    reader.readAsDataURL(file);
  }

  useEffect(() =>
  {
    if (inicia === false && contenidophotoupload.length !== 0)
    {
      contenidofotoupload.push(contenidophotoupload);
      setContenidophotoupload("");
      setAgregando(true);
    }
  }, [contenidophotoupload]);

  async function confirma_subir() 
  {
    for (let i = 0; i < contenidofotoupload.length; i += 1) 
    {
      const resultado1 = await axios.post(
        "http://localhost:3001/set-pedidos",
        { user: sessionStorage.getItem("user"), keyproducto, rutafiles: "./galerias/app_images/productos/" + keyproducto + "/pedidos/", contenidos: contenidofotoupload[i], index: i },
        {}
      );
    }
    filesuploaded.splice(0, filesuploaded.length);
    contenidofotoupload.splice(0, contenidofotoupload.length);
    onModalClose4();
  }

  function set_borrarI(i) {
    if (borrarI === i) {
      setBorrarI(filesuploaded.length + 1);
    }
    else {
      setBorrarI(i);
    }
  }

  function sumamas() {
    setAñadir_user(!añadir_user);
  }

  function eliminar_subir() {
    let tfiles = filesuploaded;
    let tcontenidos = contenidofotos;
    tfiles.splice(borrarI, 1)
    tcontenidos.splice(borrarI, 1)
    setFilesuploaded(tfiles);
    setContenidofotos(tcontenidos);
    setEliminandosubir(true);
  }

  function callchat() {
    if (showGalerias === false) setShowchat(!showchat)
  }

  function selectAlbum(i) {
    setSelectalbum(i);
    setAlbumtxt(arrayalbum[i]);
    cambialbum(i);
  }

  function cambialbum(i) {
    carpeta = arrayalbum[i].toLowerCase() === "perfil" ? "" : arrayalbum[i];
    talbum = arrayalbum[i];
    rutatmp = "productos/" + productotmp;
    init1(rutatmp + "/" + carpeta, i);
  }

  function eliminaropcion(i)
  {
    let tcontenidofoto=[];
    tcontenidofoto=contenidofoto;
    tcontenidofoto.push(arraybannerseleccionados[i]);
    setContenidofoto(tcontenidofoto);
    let tarraybanner=[];
    tarraybanner=arraybannerseleccionados;
    tarraybanner.splice(i,1);
    setArraybannerseleccionados(tarraybanner);
    setAgregando(true);
  }

  function selectFoto(i)   
  {
    if (arraybannerseleccionados.length+1<=tcantidad) 
    {
    let tarraybanner=[];
    tarraybanner=arraybannerseleccionados;
    tarraybanner.push(contenidofoto[i]);
    setArraybannerseleccionados(tarraybanner);
    let tcontenidofoto=[];
    tcontenidofoto=contenidofoto;
    tcontenidofoto.splice(i,1);
    setContenidofoto(tcontenidofoto);
    setAgregando(true);
    }
    else
    {
      setContenidomodal2("Ya se seleccionaron las " + tcantidad + " opciones");
      setShow2(true);
    }
  }

  useEffect(() => {
    if (agregando)
      setTimeout(() => {
        setAgregando(false)
      }, 300)
  }, [agregando])

  useEffect(() => {
    if (document.getElementById("nombre")) {
      document.getElementById("nombre").focus();
    }
  }, [añadir_user])

  useEffect(() => {
    if (eliminandosubir)
      setTimeout(() => {
        setEliminandosubir(false)
      }, 300)
  }, [eliminandosubir])

  useEffect(() => {
    if (cargandoarraybanneropciones)
      setTimeout(() => {
        setCargandoarraybanneropciones(false)
      }, 300)
  }, [cargandoarraybanneropciones])

  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item, i) => { const [paramName, paramValue] = item.split("="); parsedParams[paramName] = paramValue });
  }, [location])

  useEffect(() => {
    if (cargandocantidades)
      setTimeout(() => {
        setCargandocantidades(false)
      }, 300)
  }, [cargandocantidades])

  useEffect(() => {
    if (cargandocbopciones)
      setTimeout(() => {
        setCargandocbopciones(false)
      }, 300)
  }, [cargandocbopciones])

  useEffect(() => {
    if (cargandoarrayopcionesselect)
      setTimeout(() => {
        setCargandoarrayopcionesselect(false)
      }, 300)
  }, [cargandoarrayopcionesselect])

  useEffect(() => {
    init(new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear())
  }, [])

  useEffect(() => {
    if (document.getElementById("cantidad") !== null) document.getElementById("cantidad").focus();

    if (inicia === false) restaurarmenut(producto, arrayopciones);
  }, [inicia])

  return (
    <>
      <Modal visible={showCalendario} onClose={onModalClose2} className="cmodal modalcalendario">
        <div className="cerrar-button">
          <button className="cerrar" onClick={onModalClose2}>X</button>
        </div>
        <Calendario onDaySelected={onDaySelected} />
      </Modal>

      <Modal visible={show1} onClose={onModalClose1} className="cmodal wmodal" classContainer="modal-contrato">
        <div className="cerrar-button">
          <button className="cerrar" onClick={onModalClose1}>X</button>
        </div>
        <div className="main-modal">
          <p className="plabel">{contenidomodal}</p>
        </div>
        <div className="main-modal-button">
          <button className="contrato-button primary-contrato modal-button-1" onClick={modalbutton1}>¿Como transferir?</button>
          <button className="contrato-button primary-contrato modal-button-1" onClick={modalbutton2}>Datos dueño</button>
          <button className="contrato-button primary-contrato modal-button-1" onClick={modalbutton3}>Notificar dueño</button>
        </div>
      </Modal>

      <Modal visible={show2} onClose={onModalClose3} className="cmodal wmodal" classContainer="modal-contrato">
        <div className="cerrar-button">
          <button className="cerrar" onClick={onModalClose3}>X</button>
        </div>
        <div className="main-modal">
          <p className="plabel">{contenidomodal2}</p>
        </div>
      </Modal>

      <Modal visible={show4} onClose={onModalClose4} className="cmodal wmodal" classContainer="modal-contrato">
        <div className="cerrar-button">
          <button className="cerrar" onClick={onModalClose4}>X</button>
        </div>
        <div className="modal-subir-fotos-head">
          <label className="label-subir-fotos">{filedesc}</label>
          <label className="label-subir-fotos-producto">{desc}</label>
        </div>

        <div className="imgs-subir">
          <label className="card-img-add">
            <input
              id="foto"
              value={foto}
              onChange={onPhotoChange}
              type="file"
              accept={tfichero===0?".jpg":tfichero===1?".docx;.doc":tfichero===2?".avi;.mp4;.wav":tfichero===3?".mp3":""}
              required
            />
            <AddCircleIcon sx={{ fontSize: "22px" }} />
          </label>
          {inicia === false ?
            <>
              {filesuploaded.map((item, i) =>
                <div key={i}>
                    <img className={borrarI === i ? "card-img-ready-border" : "card-img-ready"} onClick={() => set_borrarI(i)} src={contenidofotoupload[i]} alt={filesuploaded[i]} />
                </div>)
              }
            </> : ""
          }
        </div>
        <div className="grupo-button-subir-fotos">
          <Tippy content="Subir las fotos">
            <button type="button" className="button-contrato-subir primary-contrato" onClick={confirma_subir}>
              <Check />
            </button>
          </Tippy>
          <Tippy content="Eliminar foto">
            <button type="button" className="button-contrato-subir primary-contrato" onClick={eliminar_subir} disabled={borrarI === 99999999}>
              <Delete />
            </button>
          </Tippy>
          <Tippy content="Clic para volver">
            <button type="button" className="button-contrato-subir primary-contrato" onClick={onModalClose4}>
              <Close />
            </button>
          </Tippy>
        </div>
      </Modal>

      <Modal visible={showimg} onClose={onModalCloseShowimg} className="cmodal" classContainer="modal-cardrow">
      <div className="cerrar-button">
           <button className="cerrar" onClick={onModalCloseShowimg}>
                X
           </button>
      </div>
      <div className="img_zoom">
           <img src={arraybannerseleccionados[Number(sessionStorage.getItem("hd_i"))]} alt="dueño" />
      </div>
     </Modal>

      <div>
        <Navbar
          links={[
            { label: "Inicio", to: "/", tooltips: "Ir a la página principal" },
            { label: sessionStorage.getItem("user") === null ? "Iniciar sesión" : "Cerrar sesión", to: sessionStorage.getItem("user") === null ? "/login" : "/cerrarsesion", tooltips: sessionStorage.getItem("user") === null ? "Abrir sesión" : "Cerrar la sesión de " + sessionStorage.getItem("usernombre") },
            { label: "Registrarse", to: "/registrarse?inserta=true", tooltips: "Crear una cuenta de usuario" },
            { label: "Acerca de", to: "/Acercade", tooltips: "Acerca de Destodo.cu" },
          ]}
        />
        <Hero>
          <div className="cabeza">
            {parsedParams.nivel === 0 ? "" :
              <IconButton color="primary" onClick={() => {
                navigate(`/?naturaleza=${sessionStorage.getItem("naturaleza")}&owner=${sessionStorage.getItem("idowner")}&nivel=${sessionStorage.getItem("nivel")}`);
              }}>
                <ArrowBack />
              </IconButton>
            }
            <h3 className="h1-cabeza">Destodo.cu</h3>
            <h4 className="h3-1-cabeza-contrato"> - {descnaturaleza}</h4>
          </div>
          {/* Este bloque solo se mostrara cuando termine init*/}
          {inicia === false ?
            <>
              <div className="contrato">
                <div className="container-contrato">
                  <label className="label">CONTRATO{contrato === 0 ? "" : ` (${contrato})`}</label>
                  <div className="contrato-input-area">
                    <label>Producto:</label>
                    <input
                      className="contrato-input-input"
                      id="producto"
                      value={desc}
                      onChange={handleInput}
                      type="text"
                      required
                      disabled
                    />
                  </div>
                  {capacidadsn===true?
                    <div className="contrato-input-area">
                        <label>Capacidad:</label>
                        <input
                           className="contrato-input-input"
                           id="capacidad"
                           value={capacidad}
                           onChange={handleInput}
                           type="text"
                           required
                           disabled
                        />
                    </div>:""
                  }
                  <div className="contrato-input-area-cantidad">
                    <label>Cantidad:</label>
                    <input
                      id="cantidad"
                      value={cantidad}
                      onChange={handleInput}
                      type="number"
                      required
                      disabled={sino || masdeuno === false || (capacidad === 0)}
                    />
                  </div>

                  {
                    Number(sessionStorage.getItem("tipouser")) === 1 && añadir_user === false && sessionStorage.getItem("dueño") === sessionStorage.getItem("user") ?
                      <div className="input-area-cliente">
                        <label className="label-datos-cliente">Cliente: </label>
                        <select className="contrato-input-area contrato-input-select" id="cliente" onChange={handleInput} value={cliente} >
                          {arrayclientes.map((item, i) => {
                            return <option key={i} value={i} >{item.nombre}</option>
                          })}
                        </select>
                      </div> : ""

                  }

                  {añadir_user === true ?
                    <>
                      <div className="contrato-input-area">
                        <label>Nombre:</label>
                        <input className="contrato-input-input"
                          id="nombre"
                          value={nombre}
                          onChange={handleInput}
                          type="text"
                          required
                        />
                      </div>
                      <div className="contrato-input-area">
                        <label>Apellido 1:</label>
                        <input className="contrato-input-input"
                          id="ape1"
                          value={ape1}
                          onChange={handleInput}
                          type="text"
                          required
                        />
                      </div>
                      <div className="contrato-input-area">
                        <label>Apellido 2:</label>
                        <input className="contrato-input-input"
                          id="ape2"
                          value={ape2}
                          onChange={handleInput}
                          type="text"
                          required
                        />
                      </div>
                      <div className="contrato-input-area">
                        <label>C.I:</label>
                        <input className="contrato-input-input"
                          id="nit"
                          value={nit}
                          onChange={handleInput}
                          type="text"
                          required
                        />
                      </div>
                      <div className="contrato-input-area">
                        <label>Celular:</label>
                        <input className="contrato-input-input"
                          id="celular"
                          value={celular}
                          onChange={handleInput}
                          type="text"
                          required
                        />
                      </div>
                      <div className="contrato-input-area">
                        <label>Fijo:</label>
                        <input className="contrato-input-input"
                          id="fijo"
                          value={fijo}
                          onChange={handleInput}
                          type="text"
                          required
                        />
                      </div>
                    </> : ""}

                    <div className="input-ahora">
                        <label className="label-ahora">Ahora:</label>
                        <Checkbox id="cbahora" color="checkbox" defaultChecked checked={cbahora} onClick={handleInput} />
                    </div>

                    {cbahora===false?
                    <>
                    <div className="contrato-input-area">
                         <label>Fecha del trabajo:</label>
                         <input
                             className="contrato-input-input"
                             id="fechat"
                             value={fechat}
                             onChange={handleInput}
                             type="text"
                             required
                             onClick={(e) => { e.preventDefault(); setShowCalendario(true) }}
                             disabled={sino || unicavez === true}
                          />
                    </div>
                    <div className="contrato-input-area">
                         <label>Hora:</label>
                         <input
                             className="contrato-input-input"
                             id="hora"
                             value={hora}
                             onChange={handleInput}
                             type="text"
                             required
                          />
                    </div>
                    <div className="contrato-input-area">
                         <label>Minuto:</label>
                         <input
                             className="contrato-input-input"
                             id="minuto"
                             value={minuto}
                             onChange={handleInput}
                             type="text"
                             required
                          />
                    </div>
                    </>
                    :""}

                  {sino ?
                    <>
                      <div className="contrato-input-area">
                        <label>No. Contrato:</label>
                        <input
                          id="contrato"
                          value={contrato}
                          onChange={handleInput}
                          type="text"
                          required
                          disabled={sino}
                        />
                      </div>
                    </> : ""}
                  {menusn === true && incluye === true ?
                    <><label className="label-datos-producto label-head-menu">MENU </label>
                      <div className="container-menu">

                        <div className="container-opciones-posibles">
                          <div className="agrupa-1">
                            <Tippy content="Agregar al menú la opcion seleccionada en opciones posibles">
                              <button type="button" className="contrato-button1" onClick={abajoprimero}>
                                <Add />
                              </button>
                            </Tippy>
                            {selec && cantidadselec === 1 && inicia === false ?
                            <>
                              <Tippy content={`Elejir ${arraycantidad[indice]} ${arrayopcionesselect[indice].desc}`}>
                                <button type="button" className="contrato-button3" onClick={() => seleccionar(tdesc, cantidadtmp, indice)}>
                                  Elejir
                                </button>
                              </Tippy></> : ""
                            }
                            {cantidadselec > 0 ?
                              <Tippy content="Eliminar del menu la opcion seleccionada">
                                <button type="button" className="contrato-button2" onClick={arriba}>
                                  <Delete />
                                </button>
                              </Tippy> : ""
                            }
                            {menu_negocio === true ?
                              <Tippy content="Crear un nuevo menú y desechar el que ofrece el negocio">
                                <button type="button" className="contrato-button2" onClick={nuevomenu}>
                                  Crear Menu
                                </button>
                              </Tippy> : ""
                            }
                            {menu_negocio === false ?
                              <Tippy content="Volver al menú que ofrece el negocio">
                                <button type="button" className="contrato-button2" onClick={menunegocio}>
                                  Menu negocio
                                </button>
                              </Tippy> : ""
                            }
                          </div>
                        </div>
                        {showselectimg === false ?
                          <>
                            <div className="contrato-input-area1">
                              <label className="label-menu-producto">Opciones posibles: </label>
                              <select className="selectop" id="opcion" onChange={handleInput} value={opciones}>
                                {arrayopciones.filter((item, i) => { if (item.show) { return item } }).map((item, i) => {
                                  return <option key={i} value={item.indice} >{item.desc}</option>
                                })}
                              </select>
                            </div>

                            <div className="container-opciones-del-menu">
                              <label className="label-menu-producto">Opciones seleccionadas: </label>
                              <div className="etiquetas">
                                <label className="label-menu-producto-desc">Producto</label>
                                <label className="label-menu-producto-precio">Precio</label>
                                <label className="label-menu-producto-cantidad">Cantidad</label>
                              </div>
                              {!cargandoarrayopcionesselect ? arrayopcionesselect.map((item, i) =>
                                <div className='menu-opciones' key={i} id={i}>
                                  <div className="menu-opciones-check">
                                    <label className="label-menu-opciones-check"></label>
                                    <Checkbox key={i} id={i + 50} color="checkbox" defaultChecked checked={cbopciones[i]} onClick={handleInput} />
                                  </div>
                                  <label className="label-opciones-desc">{item.desc}</label>
                                  <div className='precio-cantidad'>
                                    <label className="label-opciones-precio">{item.precio}</label>
                                    <input className="cantidad-contrato"
                                      id={i}
                                      value={arraycantidad[i]}
                                      onChange={handleInput}
                                      type="number"
                                      required
                                    />
                                  </div>
                                </div>
                              ) : ""
                              }
                            </div>
                            <div>
                              <label className="label-menu-importe-1">Importe:</label>
                              <label className="label-menu-importe-2">{importe} </label>
                            </div>
                          </> : ""}
                      </div></> : ""
                  }
                  {showselectimg === false ?
                    <>
                      <div className="contrato-grupo-button">
                        {subirfichero ?
                          <>
                            <Tippy content="Subir fotos relacionadas con el producto" >
                              <button type="button" className="contrato-button primary-contrato" onClick={fsubirfotos}>
                                {tfichero===0?"Subir Foto":tfichero===1?"Subir Texto":tfichero===2?"Subir Video":tfichero===3?"Subir Audio":""}
                              </button>
                            </Tippy>
                          </> : ""}
                        {menusn ?
                          <>
                            <Tippy content="Productos que incluye esta oferta" >
                              <button type="button" className="contrato-button primary-contrato" onClick={incluir}>
                                Incluye
                              </button>
                            </Tippy>
                          </> : ""}
                        {/*
                    <Tippy content="Solicitar ahora" >
                      <button type="button" className="contrato-button primary-contrato" onClick={reservar} >
                        Solicitar
                      </button>
                    </Tippy>
*/}
                        {((nombre !== "") && (ape1 !== "") && (ape2 !== "") && (celular.length >= 8 || fijo.length >= 8)) || añadir_user === false && sino === false && (capacidad !== 0) ?
                          <Tippy content="Reservar" >
                            <button type="button" className="contrato-button primary-contrato" onClick={reservar}>
                              Reservar
                            </button>
                          </Tippy> : ""
                        }
                        {Number(sessionStorage.getItem("tipouser")) === 1 && sessionStorage.getItem("dueño") === sessionStorage.getItem("user") && sino === false && (capacidad !== 0) ?
                          <Tippy content="Añadir un usuario" >
                            <button className="contrato-button primary-contrato" onClick={sumamas}>
                              <Add />
                            </button>
                          </Tippy > : ""
                        }
                        <Tippy content="Enviar mensajes al dueño del negocio" >
                          <button className="contrato-button primary-contrato" onClick={callchat}>
                            <Chat />
                          </button>
                        </Tippy >
                        {subirfichero === false ?
                          <Tippy content="Galeria de fotos del producto" >
                            <button type="button" className="contrato-button primary-contrato" onClick={galerias}>
                              <CollectionsIcon />
                            </button>
                          </Tippy>
                          : ""}
                        <Tippy content="Ver en el mapa ubicación del negocio" >
                          <button type="button" className="contrato-button primary-contrato" onClick={() => setShowMap(!showMap)}>
                            <MapIcon />
                          </button>
                        </Tippy>
                      </div>
                    </> : ""}
                </div>
              </div>
              {/*Este bloque que termina solo se muestra cuando termina init */}
            </> : ""}

          {/* Seleccionar un producto segun cantidad, ej. 4 trajes*/}
          {tinicia === false && showselectimg === true ?
            <>
              <div className="seleccionar">
                <div className="plabel-producto">
                  <label>Producto: {tproducto}</label>
                </div>
                <div className="plabel-cantidad">
                  <label >Cantidad:</label>
                  <input className="contrato-input-area-tcantidad"
                    id="tcantidad"
                    value={tcantidad}
                    onChange={handleInput}
                    type="number"
                    required
                    disabled
                  />
                </div>

      <Box sx={{background: theme.palette.primary.main, width: "100vw", position: !fixed ? "relative" : "fixed", left: 0, bottom: 0,}}>
      {inicia === false ? (
        <Box sx={{ paddingRight:"27px", position: "relative", height: "100%" }}>
          <Button
            variant="contained"
            onClick={handleShowGaleries}
            color="error"
            sx={{
              position: "absolute",
              top: "5px",
              right: "20px",
              borderRadius: "100%",
              minWidth: 0,
              minHeight: 0,
              width: "35px",
              height: "35px",
            }}
          >
            <Close />
          </Button>
          <label className="titulo-album">Albunes</label>
          <div id="galeria-album" className="galeria-album">
            {arrayalbum.map((item, i) => (
              <div key={i}>
                <div>
                  <img
                    id={`imagen-${i}`}
                    onClick={() => selectAlbum(i)}
                    className={
                      selectalbum === i
                        ? "image-galeria-border album-foto"
                        : "image-galeria-noborder album-foto"
                    }
                    src={contenidoalbum[i]}
                    alt={arrayalbum[i]}
                  />
                </div>
                <div>
                  <label className="label-img-galeria">{item}</label>
                </div>
              </div>
            ))}
          </div>
          <label className="titulo-album">Album {albumtxt}</label>
          <div className="galeria-foto">
            <div className="galeria-fotos-view">
              {contenidofoto.map((item, i) => (
                <img
                  key={i}
                  onClick={() => selectFoto(i)}
                  className={
                    selectfoto === i
                      ? "image-galeria-border album-foto"
                      : "image-galeria-noborder album-foto"
                  }
                  src={contenidofoto[i]}
                />
              ))}
            </div>
          </div>
        </Box>
      ) : (
        ""
      )}
    </Box>

                <label className="pmodal-seleccionados">Seleccionados:</label>
                <div className='galeria-foto'>
                  <div className='galeria-fotos-view'>
                    {arraybannerseleccionados.map((item, i) =>
                      <Box sx={{ position: "relative" }} className="link-image-banner-selec" key={i}>
                        <Button color="error" onClick={()=>eliminaropcion(i)} sx={{ position: "absolute", top: "-10px", right: "-10px", minWidth: 0, minHeight: 0, width: "40px", height: "40px", borderRadius: "100%" }} variant="contained" >
                          <Delete />
                        </Button>
                        <div onClick={() => selectitemselec(i)}>
                          <img className={`link-image-img-banner-selec ${itemopcionselec === i ? "banner-selec-borde" : ""}`} src={item} />
                        </div>
                      </Box>)}
                  </div>
                </div>
              </div>
            </> : ""}

          {domicilioSN === true && domicilio === true && showMap === true ?
            <>
              <label className="label-mapa">Ubique donde recibirá el servicio:</label>
              <Map onMapClick={lngLatSelected} remoteshowMap={showMap} lat={lat} lng={lng} point={`${lat},${lng}`} onChange={onChangeMap} remoteZoom={zoom} />
            </> : ""
          }

          {showGalerias && showchat === false ?
            <ComGalerias rutatmp={rutatmp} desctmp={desctmp} />
            : ""
          }

          {showchat && showGalerias === false ?
            <ChatDialogo user={chatuser} nombre={chatnombre} indexChat={indexChat} />
            : ""
          }

        </Hero>
      </div>
    </>
  );
};

export default Contrato;
