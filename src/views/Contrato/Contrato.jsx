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
  const [disponible, setDisponible] = useState(0);
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

    let result2 = await getInfoProductoCM(tkeyproducto);
    if (isValid(result2) === true) {
      setProducto(tkeyproducto);
      setDesc(result2[0].desc);
      setPrecio(result2[0].precio);
      setCantidad(result2[0].cantidad);
      setDomicilio(result2[0].domicilio);
      setNegocio(result2[0].negocio);
      setLat(result2[0].latitud);
      setLng(result2[0].longitud);
    }

    //let result9 = await getDisponibilidad(tkeyproducto, dia, mes, año);
/*
    if (isValid(result9)===true && result9.length === 0) {
       setDisponible(0);
    }
    else {
      setDisponible(result9[0].disponible);
    }*/
    //let result1 = await getdatosuserCM(sessionStorage.getItem("user"));
       
    setShow2(false);
    setInicia(false);
  } //init

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
      case "celular":
        setCelular(e.target.value);
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

        if (Number(e.target.value) > capacidad) {
          document.getElementById("cantidad").focus();
          setMessage(`La cantidad no puede exceder la capacidad (${capacidad})`);
          setOpen(true);
          }
        else {
          setCantidad(e.target.value);
          setResultado("");
        }
        break;
      default:
        if (Number(e.target.value) >= 0 && Number(e.target.value) < 50) {
          setCambios(true);
          setCargandocantidades(true);
          arraycantidad[Number(e.target.id)] = Number(e.target.value);
          setTcantidad(Number(e.target.value));
          setCantidadtmp(Number(e.target.value));
          let importeT = 0;
          setImporte(importeT);
        }
        if (Number(e.target.id) >= 50 && Number(e.target.id) < 100) {
          let i = Number(e.target.id) - 50;
          setindice(i);
          if (e.target.checked === true) {
            setCantidadselec(cantidadselec + 1)
          }
          else {
            setShowselecimg(false);
            if (cantidadselec > 0) {
              setCantidadselec(cantidadselec - 1);
            }
          }
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
    if (añadir_user === true) {
      // Registrar los datos del usuario en la tablausuarios
      tuser = nombre.substring(0, 1).toLowerCase() + ape1.substring(0, 1).toLowerCase() + ape2.substring(0, 1).toLowerCase();
      //await setUserExpress(tuser, nombre + " " + ape1 + " " + ape2, celular);
    }
    if (cantidad !== 0) {
      let result = await setContrato(tuser, keyproducto, fechat, hora + ":" + minuto, cantidad, lng, lat);
      const data = await result.data;
      if (data.error) {
        setMessage("Ocurrio un error mientras se registraba el contrato");
        setOpen(true);
      }
      else {
        setMessage("No. del contrato-> " + result[0].contrato + ". Esto es una pre-reservación, se hará efectivo cuando pague el contrato." +
          " En el botón ¿como transferir? se explica como transferir dinero a nuestra cuenta bancaria. Si no se transfiere, dentro de 1 hora esta pre-reservación será elimindada" +
          " y la capacidad quedará disponible. Otra opción es contactar al dueño y concretar un acuerdo");
        setOpen(true);
        setContrato(result[0].contrato)
      }
    }
  } 

  function sumamas() {
    setAñadir_user(!añadir_user);
  }

  useEffect(() => {
    if (document.getElementById("nombre")) {
      document.getElementById("nombre").focus();
    }
  }, [añadir_user])

  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => { const [paramName, paramValue] = item.split("="); parsedParams[paramName] = paramValue });
  }, [location])

  useEffect(() => {
    init(new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear())
  }, [])

  useEffect(() => {
    if (document.getElementById("cantidad") !== null) document.getElementById("cantidad").focus();
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
                      disabled={sino || (capacidad === 0)}
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
                        <label>Celular:</label>
                        <input className="contrato-input-input"
                          id="celular"
                          value={celular}
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
                             disabled={sino}
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
                  {showselectimg === false ?
                    <>
                      <div className="contrato-grupo-button">
                                                  
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

          {domicilioSN === true && domicilio === true && showMap === true ?
            <>
              <label className="label-mapa">Ubique donde recibirá el servicio:</label>
              <Map onMapClick={lngLatSelected} remoteshowMap={showMap} lat={lat} lng={lng} point={`${lat},${lng}`} onChange={onChangeMap} remoteZoom={zoom} />
            </> : ""
          }

          {showGalerias && showchat === false ?
            <ComGalerias 
            deQuien={""}
            ruta={""}
            perfil={""}
            permiso={true}
            botonCerrar={false}
            cambiaNombreFoto={""}
            cambiaFoto={""}
            idsb={""}
            nophoto={""}
            tabla={""}
            campo={""}
  />
            : ""
          }

        </Hero>
      </div>
    </>
  );
};

export default Contrato;
