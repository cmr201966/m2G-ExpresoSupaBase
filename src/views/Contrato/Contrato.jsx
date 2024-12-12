import Checkbox from '@mui/material/Checkbox';
import Tippy from "@tippyjs/react";
import Modal from "../../components/Modal/Modal";
import { useLocation } from "react-router-dom";
import Calendario from "../../components/Calendar/Calendar";
import Navbar from "../../components/Navbar/Navbar"
import ComGalerias from "../../components/ComGalerias/ComGalerias";
import Map from "../../components/Map/MapBox";
// @mui icons
import MapIcon from "@mui/icons-material/Map";
import Add from "@mui/icons-material/Add";
import {
  Collections,
  ShoppingCartOutlined,
  WhatsApp,
} from "@mui/icons-material";

import { Box, CircularProgress } from "@mui/material";
import Encabezado from "../../components/Encabezado/Encabezado";

// layouts
import Hero from "../../layouts/Hero/Hero";

// styles
import "./styles.css";

import { useEffect, useState } from "react";
//import styledEngineSc from "@mui/styled-engine-sc";

import { useNotification } from "../../context/NotificationProvider";

// utils
import {
  isValid,
} from "../../Utiles/Utiles";
import {
  getContratoClientes, 
  getInfoProductoCM, 
  getDisponibilidad,
  setContratoCM,
  setUserExpress,
} from "../../Utiles/apiBaseDatos";


Date.prototype.toDateInputValue = (function () {
  let local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10)
})

const Contrato = () => {
  const location = useLocation();
  const parsedParams = {}
  const { setOpen, setMessage } = useNotification();
  const [fechat, setFechat] = useState(new Date().toDateInputValue());
  const [contrato, setContrato] = useState(0);
  const [sino, setSino] = useState(false);
  const [show1, setShow1] = useState(false);
  const [showGalerias, setShowGalerias] = useState(false);
  const [desc, setDesc] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [capacidad, setCapacidad] = useState(0);
  const [disponible, setDisponible] = useState(0);
  const [mdisponible, setMdisponible] = useState(0);
  const [showCalendario, setShowCalendario] = useState(false);
  const [contenidomodal, setContenidomodal] = useState("");
  const [inicia, setInicia] = useState(true);
  const [loading, setLoading] = useState(false);
  const [celular, setCelular] = useState("");
  const url = `https://wa.me/${celular}?text=`;
  const [accion, setAccion] = useState("");

 //Parametros
  const [keyproducto, setKeyproducto] = useState(0);

  // Estados para calculo de ganancias y costos
  const [hora, setHora] = useState("");
  const [minuto, setMinuto] = useState("");
  //
  const [nombre, setNombre] = useState("");
  const [añadir_user, setAñadir_user] = useState(true);
  const [arrayclientes, setArrayclientes] = useState([]);
  const arraynoclientes = [{ iduser: 99999999, nombre: "No hay clientes" }];
  const [cliente, setCliente] = useState(0);
  const [cbahora, setCbahora] = useState(true);
  
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

  async function init() {
    if (isValid(sessionStorage.getItem("dueño")) === false) {
      sessionStorage.setItem("nivel", parsedParams.nivel);
      sessionStorage.setItem("dueño", parsedParams.dueno);
    }
    let tkeyproducto = keyproducto;
    if (keyproducto === 0) {
      tkeyproducto = parsedParams.keyproducto;
      setKeyproducto(parsedParams.keyproducto);
    }
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
    console.log(result2);
    let mcantidad=0;
    if (isValid(result2) === true) {
      mcantidad=isValid(result2[0].cantidad)===true?result2[0].cantidad:0
      setCelular(result2[0].celular);
      setDesc(result2[0].producto);
      setCapacidad(mcantidad);
      setLat(result2[0].latitud);
      setLng(result2[0].longitud);
      setAccion(result2[0].accion);
    }
    let tdisponible=0;
    let result9 = await getDisponibilidad(tkeyproducto, 1);
    let treservas=isValid(result9[0].reservas)===true?result9[0].reservas:0
    if (result9.length>0) tdisponible = mcantidad-treservas;
    let result10 = await getDisponibilidad(tkeyproducto, 2);
    let tcancela=isValid(result10[0].reservas)===true?result10[0].reservas:0
    if (result10.length>0) tdisponible = tdisponible + tcancela;
    let tcantidad=isValid(cantidad)===true?cantidad:0;
    setDisponible(tdisponible-tcantidad);
    setMdisponible(tdisponible);
    setAñadir_user(sessionStorage.getItem("user")==="" || isValid(sessionStorage.getItem("user"))===false);
    setInicia(false);
  } //init

  const onModalClose1 = () => {
    if (document.getElementById("cantidad") !== null) document.getElementById("cantidad").focus();
    setShow1(false)
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
      case "celular":
        setCelular(e.target.value);
        break;
      case "hora":
        setHora(e.target.value);
        break;
      case "minuto":
        setMinuto(e.target.value);
        break;
      case "fechat":
        setFechat(e.target.value);
        break;
      case "cbahora":
        setCbahora(e.target.checked);
        break;
      case "cantidad":
        if ((Number(e.target.value) > disponible) && (capacidad>0)) {
          document.getElementById("cantidad").focus();
          setMessage(`La cantidad no puede exceder la capacidad (${capacidad})`);
          setOpen(true);
          }
        else {
          let tvalor=e.target.value>=0?e.target.value:0;
          setCantidad(tvalor);
          setDisponible(mdisponible-Number(tvalor));
        }
        break;
      default:
        break;
    }
  }

  function onDaySelected(year, month, day) {
    setFechat(new Date(year, month, day).toDateInputValue());
    setShowCalendario(false);
    init(day, month + 1, year);
  }

  async function reservar() {
    setLoading(true);
    let tuser = sessionStorage.getItem("user");
    if (Number(sessionStorage.getItem("tipouser")) === 1 && añadir_user === false && sessionStorage.getItem("dueño") === tuser) {
      tuser = arrayclientes[cliente].iduser;
    }
    if (añadir_user === true) {
      // Registrar los datos del usuario en la tablausuarios
      let nombres = nombre.split(" ");
      let lng="";
      tuser="";
      nombres.forEach((name) => {
        tuser=tuser+name.substring(0, 1).toLowerCase()
        lng = lng + name.length;
      });      
      tuser=tuser + lng;
      let err =await setUserExpress(tuser, nombre, celular);
      if (isValid(err)===true){
        setMessage(err + ", no se registro la reservación.");
        setOpen(true);
        return
      }
    }
    if (cantidad !== 0) {
      let mhora=hora===''?"0":hora;
      let mmin= minuto===''?"0":minuto;
      let result = await setContratoCM(tuser, keyproducto, fechat, mhora + ":" + mmin, cantidad, lng, lat);
      if (result.length===0) {
        setMessage("Ocurrio un error mientras se registraba el contrato");
        setOpen(true);
      }
      else {
        let msg = añadir_user===true?", para dar seguimiento al estado de su reservación inicie sesión como " + tuser + " contraseña 1234 y vaya a administrar contrato en la hamburguesa":"";
        setContenidomodal("Contrato " + result[0].id + ". Esto es una pre-reservación, contacte al dueño, por whatsapp, para concretar el pago y hacer efectiva la reservación," +
                          " sino lo hace en 24 hora esta pre-reservación será eliminada, anote el número del contrato" + msg + "."
        )
        setShow1(true);
        setSino(true);
        setContrato(result[0].id)
      }
      setLoading(false)
    }
  } 
  const cambiaNombreFoto = () => {
  };

  const cambiaFoto = () => {
  };

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
      </Modal>

      <div>
      <Navbar nivel={1} />
      <Hero>
          {inicia === true ? (
            <Box
              sx={{
                width: "100%",
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress color="checkbox" />
            </Box>
           ) : (
            ""
           )}
          {inicia === false ?
            <>
              <Encabezado />
              <div className="contrato">
                <div className="container-contrato">
                  <div className="ws">
                     <label className="label">CONTRATO{contrato === 0 ? "" : ` (${contrato})`}</label>
                     {celular.length>=8?
                     <Tippy content={`${accion} via WhatsApp${celular}`}>
                         <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                         >
                         <WhatsApp className="ws-1" />
                        </a>
                     </Tippy>:""}
                  </div>
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
                  {capacidad>0?
                    <>
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
                    </div>
                    <div className="contrato-input-area-cantidad">
                      <label>Disponible:</label>
                        <input
                          id="disponible"
                          value={disponible}
                          onChange={handleInput}
                          type="number"
                          required
                          disabled
                        />
                    </div>
                    </>:""
                  }

                  <div className="contrato-input-area-cantidad">
                    <label>Cantidad:</label>
                    <input
                      id="cantidad"
                      value={cantidad}
                      onChange={handleInput}
                      type="number"
                      required
                      disabled={sino || (disponible === 0)}
                    />
                  </div>
                  { 
                    Number(sessionStorage.getItem("tipouser")) === 1 && añadir_user === false 
                           && sessionStorage.getItem("dueño") === sessionStorage.getItem("user") ?
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
                        <Checkbox id="cbahora" color="checkbox" checked={cbahora} onClick={handleInput} />
                    </div>

                    {cbahora===false?
                    <>
                    <div className="contrato-input-area">
                         <label>Fecha:</label>
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
                      <div className="contrato-grupo-button">
                                                  
                        {(((nombre !== "") && (celular.length >= 8) && ((añadir_user === true) || (isValid(sessionStorage.getItem("user"))===false))) || ((isValid(sessionStorage.getItem("user"))===true) && (sino === false))) && (cantidad >0) ?
                          <Tippy content="Reservar" >
                            <button type="button" className="producto-button primary" onClick={reservar}>
                            {loading ? (
                            <CircularProgress color="inherit" size={16} />
                          ) : (
                            <ShoppingCartOutlined/>)}                    
                            </button>
                          </Tippy> : ""
                        }
                        { (Number(sessionStorage.getItem("tipouser")) === 3 || sessionStorage.getItem("user")==="" || isValid(sessionStorage.getItem("user"))===false) || (Number(sessionStorage.getItem("tipouser")) === 1 && sessionStorage.getItem("dueño") === sessionStorage.getItem("user") && sino === false && (capacidad !== 0)) ?
                          <Tippy content="Añadir un usuario" >
                            <button className="producto-button primary" onClick={sumamas}>
                              <Add />
                            </button>
                          </Tippy > : ""
                        }
                        <Tippy content="Ver en el mapa ubicación del negocio" >
                          <button type="button" className="producto-button primary" onClick={() => setShowMap(!showMap)}>
                            <MapIcon />
                          </button>
                        </Tippy>
                        <Tippy content={`Galeria de fotos del producto`}>
                            <button
                              type="button"
                              className="producto-button primary"
                              onClick={() => setShowGalerias(!showGalerias)}
                            >
                              <Collections />
                            </button>
                          </Tippy>
                      </div>

                      {showMap === true ?
                        <div className="mapa-catalogo">
                           <p>Ubicación del producto o servicio</p>
                           <Map
                              sx={{ height: "340px", width: "100%" }}
                              onMapClick={lngLatSelected}
                              remoteshowMap={showMap}
                              lat={lat}
                              lng={lng}
                              point={{ lat, lng }}
                              onChange={onChangeMap}
                              remoteZoom={zoom}
                           />
                        </div>:""
                      }
                        {showGalerias?
                        <ComGalerias 
                        deQuien={"Imagenes"}
                        ruta={"productos/" + keyproducto}
                        perfil={keyproducto}
                        permiso={true}
                        botonCerrar={false}
                        cambiaNombreFoto={cambiaNombreFoto}
                        cambiaFoto={cambiaFoto}
                        idsb={""}
                        nophoto={""}
                        tabla={""}
                        campo={""}
                         />
                         : ""
                      }
                </div>
              </div>
              {/*Este bloque que termina solo se muestra cuando termina init */}
            </> : ""}
        </Hero>
      </div>
    </>
  );
};

export default Contrato;
