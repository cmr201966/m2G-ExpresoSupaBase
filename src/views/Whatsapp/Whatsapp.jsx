import Tippy from "@tippyjs/react";
import Navbar from "../../components/Navbar/Navbar"
import Hero from "../../layouts/Hero/Hero";
import { useEffect, useState } from "react";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton"
import ArrowBack from "@mui/icons-material/ArrowBack";
import MapIcon from "@mui/icons-material/Map";
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom";
import { setComando } from "../../servicios/Whatsapp";
import { getprovincias, getmunicipios  } from "../../servicios/catalogos";
import { getCategoriaText  } from "../../servicios/catalogos";
import { getProductoText  } from "../../servicios/catalogos";

import "./styles.css";

const Whatsapp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {}
  // Estados para almacenar los datos del negocio activo
  const [contenido, setContenido] = useState("");
  const [cmd, setCmd] = useState("");
  const arraydesconocido = [{ provincia: 99, municipio: 99, desc: "Desconocido" }];
  const [arrayprovincias, setArrayprovincias] = useState([]);
  const [arraymunicipios, setArraymunicipios] = useState([]);
  const [tmunicipios, setTmunicipios] = useState([]);
  const [provincia, setProvincia] = useState(14);
  const [municipio, setMunicipio] = useState(6);
  //const [zoom] = useState(15.5);
  const [lng, setLng] = useState();
  const [lat, setLat] = useState();
//  const [lng, setLng] = useState(-75.829090519);
//  const [lat, setLat] = useState(20.0217583);

  async function init() {
    let resultprovincia = await getprovincias({});
    resultprovincia = await resultprovincia.json();
    if (resultprovincia.error || resultprovincia.length === 0)
    {
      setArrayprovincias(arraydesconocido);
    }
    else
    {
      setArrayprovincias(resultprovincia);
    }
    let ttmunicipios=[];

    let resultmunicipio = await getmunicipios({});
    resultmunicipio = await resultmunicipio.json();

    if (resultmunicipio.error || resultmunicipio.length === 0)
    {
       setArraymunicipios(arraydesconocido);
       setTmunicipios(arraydesconocido);
       ttmunicipios=arraydesconocido;
    }
    else
    {
      setArraymunicipios(resultmunicipio);
      if (sessionStorage.getItem("user") === null || sessionStorage.getItem("user") === 'null'){
         ttmunicipios = resultmunicipio.filter((item)=>{if (item.provincia === provincia){return item}});         
         setLat(ttmunicipios[municipio-1].latitud);
         setLng(ttmunicipios[municipio-1].longitud)
      }
      else{
        ttmunicipios = resultmunicipio.filter((item)=>{if (item.provincia === Number(sessionStorage.getItem("userprovincia"))){return item}});
      }
    }
    if (ttmunicipios.length!==0)
    {
      setTmunicipios(ttmunicipios);
      console.log(ttmunicipios);
    }
    else
    {
      setTmunicipios(arraydesconocido);
      ttmunicipios=arraydesconocido;
    }

  } // init

  async function handleselect(e) {
    let ttmunicipio=[];
    switch (e.target.id) {
      case "provincia":
        setProvincia(Number(e.target.value));
        ttmunicipio=arraymunicipios.filter((item,i)=>{if (item.provincia === Number(e.target.value)){return item}});
        setTmunicipios(ttmunicipio);
        if (ttmunicipio.length === 0){
          setTmunicipios(arraydesconocido);
          ttmunicipio=arraydesconocido;
        }
        setLat(tmunicipios[0].latitud);
        setLng(tmunicipios[0].longitud);
        setMunicipio(0);
       break
      case "municipio":
        setMunicipio(Number(e.target.value));
        console.log(tmunicipios);
        console.log("Provincia:",provincia);
        console.log("Municipio:",tmunicipios[Number(e.target.value)-1].desc)
        console.log("Latitud:", tmunicipios[Number(e.target.value)-1].latitud)
        console.log("Longitud:",tmunicipios[Number(e.target.value)-1].longitud)
        setLat(tmunicipios[Number(e.target.value)-1].latitud);
        setLng(tmunicipios[Number(e.target.value)-1].longitud);
        console.log(tmunicipios[Number(e.target.value)-1].longitud);
        break

      }
  }
    
  function limpiar(){
     setCmd("");
     setContenido("");
  }

  async function confirmar() {
    let result = await setComando({cmd: cmd});
    result = await result.json();

    if (result.ok==="ok"){
        setContenido("(El comando se ejecuto correctamente)")
        setCmd("")
    }
    else{
        setContenido(result.ok);
    }
    if (document.getElementById("cmd")) document.getElementById("cmd").focus();
}

  function handleInput(e) {
      switch (e.target.id) {
        case "cmd":
             setContenido("");
             setCmd(e.target.value);
             break;
        default:
            break;
    }
  }

  function key(e){
    if (e.key==='Enter' && cmd.length!==0) confirmar();
  }

  async function BuscarCategoria(cmd){
    let result = await getCategoriaText({categoria: cmd});
    result = await result.json();
    return (result.categoria)
  }

  async function irAproductos(){
    let categoria= await BuscarCategoria(cmd);
    console.log("##########","Lat:",lat,"Lng:",lng);
    navigate(`/productos?categoria=${categoria}&nombre=${cmd}&mapa=true&latitud=${lat}&longitud=${lng}`);
  }

  async function BuscarProducto(cmd){
    let result = await getProductoText({producto: cmd});
    result = await result.json();
    return (result)
  }

  async function irAcatProductos(){
    let result = await BuscarProducto(cmd);
    navigate(`/catproductos?idproducto=${result.idproducto}&categoria=${result.categoria}`);
  }

  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location]);

  useEffect(() => {
    init()
    if (document.getElementById("cmd")) document.getElementById("cmd").focus();
  }, [])

  return (
    <>
    <div className="whatsapp-container">
      <Navbar
        links={[
          { label: "Inicio", to: "/",tooltips: "Ir a la página principal" },
          { label: sessionStorage.getItem("user") === null ? "Iniciar sesión" : "Cerrar sesión", to: sessionStorage.getItem("user") === null ? "/login" : "/cerrarsesion", tooltips: sessionStorage.getItem("user") === null ? "Abrir sesión" : "/Cerrar la sesión de " + sessionStorage.getItem("usernombre") },
          { label: "Registrarse", to: "/registrarse?inserta=true", tooltips: "Crear una cuenta de usuario" },
          { label: "Acerca de", to: "/Acercade", tooltips: "Acerca de Destodo" },
        ]}
      />
      <Hero>

       <div className="div-papa"> 
       <div className="cabeza">
            <IconButton color="primary" onClick={() => {
              navigate(`/?nivel=${0}`);
            }}>
              <ArrowBack className="flecha" />
            </IconButton>
            <h4 className="h3-1-cabeza-negocios"> Atrás</h4>
       </div>

       <div className="WhatsApp">
              <label>Provincia:</label>
              <select  className="select-registrarse-prov"  id="provincia" onChange={handleselect} value={provincia}>
                {arrayprovincias.map((item, i) => {
                  return <option key={i} value={item.provincia} >{item.desc}</option>
                })}
              </select>
              <label>Municipio:</label>
              <select className="select-registrarse-munic" id="municipio" onChange={handleselect} value={municipio}>
                {tmunicipios.map((item, i) => {
                  return <option key={i} value={item.municipio} >{item.desc}</option>
                })}
              </select>

             <label>Comando: {contenido}</label>
             <input className="cmd-input-area"
                               id="cmd"
                               value={cmd}
                               onChange={handleInput}
                               onKeyDown={key}
                               type="text"
                               placeholder="moto/r-23456/parque cespedes/on"
                               required/>
            <div className="cmd-botones">
                 <Tippy content={cmd.length !== 0 ? "Registrar el producto" : "Complete los datos necesarios"}>
                    <button type="button" className="cmd-button primary" onClick={cmd.length !== 0 ? confirmar : ""}>
                    <Check />
                    </button>
                </Tippy>
                <Tippy content="Limpiar CMD">
                      <button
                        type="button"
                        className="cmd-button primary"
                        onClick={limpiar}
                      >
                        <Close />
                      </button>
                </Tippy>
                {cmd!==""?
                <>
                <Tippy content="Ubicar el producto en el mapa">
                         <button
                          className="cmd-button primary"
                          type="button"
                          onClick={irAproductos}>
                          <MapIcon />
                       </button>
                </Tippy>
                <Tippy content="Editar el producto">
                         <button
                          className="cmd-button primary"
                          type="button"
                          onClick={irAcatProductos}>
                          <CreateIcon />
                       </button>
                </Tippy></>:""
                }

            </div>        

        </div>     
        </div>

        </Hero>
    </div> 
    </>
);
};

export default Whatsapp;
