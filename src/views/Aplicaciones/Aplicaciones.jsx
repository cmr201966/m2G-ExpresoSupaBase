import Tippy from "@tippyjs/react";
import Checkbox from '@mui/material/Checkbox';
// components
import Navbar from "../../components/Navbar/Navbar"
// layouts
import Hero from "../../layouts/Hero/Hero";
//
//import { useLocation } from "react-router-dom";
//
// styles
import "./styles.css";
import { useEffect, useState } from "react";
import axios from "axios";
//import { FormatColorResetRounded } from "@mui/icons-material";
//import styledEngineSc from "@mui/styled-engine-sc";
import Check from "@mui/icons-material/Check";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton"
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom"
import Modal from "../../components/Modal/Modal";
import { useLocation } from "react-router-dom";

const Aplicaciones = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {}
  const [show, setShow] = useState(false);
  const [nick, setNick] = useState("");
  const [desc, setDesc] = useState("");
  const [ttip, setTtip] = useState("");
  const [arrayNaturalezas, setArrayNaturalezas] = useState([]);
  const arraynonaturaleza = [{ idnaturaleza: 8, desc: "Desconocida" }];
  const [naturaleza, setNaturaleza] = useState("");
  const [cbocultar, setCbocultar] = useState(false);
  const [cbrlogin, setCbrlogin] = useState(false);
  const [cbadmin, setCbadmin] = useState(false);
  const [inicia, setInicia] = useState(true);
  const [agregarsn, setAgregarsn] = useState(false);
  const [editarsn, setEditarsn] = useState(false);
  const [eliminarsn, setEliminarsn] = useState(false);
  const [aplicacion, setAplicacion] = useState(0);
  const [arrayAplicaciones, setArrayAplicaciones] = useState([]);
  const arraynoaplicaciones = [{ id: 0, desc: "Desconocida" }];
  // Estados para almacenar los datos del negocio activo
  const [nickt, setNickt] = useState("");
  const [desct, setDesct] = useState("");
  const [ttipt, setTtipt] = useState("");
  const [naturalezat, setNaturalezat] = useState("");
  const [cbocultart, setCbocultart] = useState(false);
  const [cbrlogint, setCbrlogint] = useState(false);
  const [cbadmint, setCbadmint] = useState(false);
  const [contenido, setContenido] = useState("");
  const [nivel, setNivel] = useState(9999);
  const [idowner, setIdowner] = useState(9999);
  const [naturaleza1, setNaturaleza1] = useState(9999);


  async function init() {
    setContenido("Preparando condiciones...");
    setShow(true);
    setNivel(parsedParams.nivel);
    setNaturaleza1(parsedParams.naturaleza);
    setIdowner(parsedParams.idowner);

    const result = await axios.post(
      "http://localhost:3001/getaplicaciones",
      {},
      {}
    );
    if (result.data.error || result.data.length === 0) 
    {
      setArrayAplicaciones(arraynoaplicaciones);
      setAplicacion(arraynoaplicaciones[0].id);
    }
    else 
    {
      console.log(result.data);
      setArrayAplicaciones(result.data);
      setAplicacion(0);
      recuperardatosproducto(result.data, 0);
      setNick(result.data[0].idapp);
      setDesc(result.data[0].desc);
      setTtip(result.data[0].tooltip);
      setNaturaleza(result.data[0].idnaturaleza);
      setCbocultar(result.data[0].ocultar);
      setCbrlogin(result.data[0].rlogin);
      setCbadmin(result.data[0].admin);
  
    }

    const resultnaturaleza = await axios.post(
        "http://localhost:3001/getnaturaleza",
        { naturaleza: "", admin: false },
        {}
      );
      console.log(resultnaturaleza);
      if (resultnaturaleza.data.error || resultnaturaleza.data.length === 0) 
      {
        setArrayNaturalezas(arraynonaturaleza);
        setNaturaleza(arraynonaturaleza[0].idnaturaleza);
      }
      else 
      {
        setArrayNaturalezas(resultnaturaleza.data);
        setNaturaleza(resultnaturaleza.data[0].idnaturaleza);
      }
      
    setShow(false);
    setInicia(false);
  } // init

  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location]);


  function recuperardatosproducto(data, i) 
  {
    setNickt(data[i].idapp);
    setDesct(data[i].desc);
    setTtipt(data[i].tooltip);
    setNaturalezat(data[i].idnaturaleza);
    setCbocultart(data[i].ocultar);
    setCbrlogint(data[i].rlogin);
    setCbadmint(data[i].admin);
    
  }
  function restaurardatosproductos() 
  {
    //setNegocio(negociot);
    setNick(nickt);
    setDesc(desct);
    setTtip(ttipt);
    setNaturaleza(naturalezat);
    setCbocultar(cbocultart);
    setCbrlogin(cbrlogint);
    setCbadmin(cbadmint);
  }
    
  function tcancelar() 
  {
    setAgregarsn(false);
    setEditarsn(false);
    setEliminarsn(false);
    setDesc("");
  }


  function limpiardatosaplicacion() {
    setNick("");
    setDesc("");
    setTtip("");
    setCbocultar(false);
    setCbrlogin(false);
    setCbadmin(false);

  }
  const onModalClose = () => 
    {
    setShow(false)
    }
  
    function editar() 
    {
      restaurardatosproductos();
      setEditarsn(true);
    }
  
    function agregar() 
    {
      limpiardatosaplicacion();
      setAgregarsn(true);
      //setMarca(2);
    }
  
    const eliminar = () => 
    {
      setEliminarsn(true);
      setContenido("¿Está seguro que desea eliminar a " + arrayAplicaciones[aplicacion].desc + "?");
      //setShow1(true);
    }
  
  async function confirmar() {
    const result = await axios.post(
      "http://localhost:3001/setaplicacion",
      {
        id: arrayAplicaciones[aplicacion].id, idapp: nick, desc, tooltip: ttip, naturaleza, ocultar: cbocultar===true?1:0, 
        rlogin: cbrlogin===true?1:0, admin: cbadmin===true?1:0, agregarsn, editarsn
      },
      {}
    );
    if (result.data.ok!=="ok"){
        setContenido("Error al agregar la aplicacion");
        setShow(true);
  
    }
    else{
        setContenido("La aplicacion se agrego correctamente.");
        setShow(true);
        limpiardatosaplicacion;
  
    }
  }
  async function handleInput(e) {
    switch (e.target.id) {
      case "nick":
          setNick(e.target.value);
          break;
      case "idapp":
          setAplicacion(e.target.value);
          setNick(arrayAplicaciones[e.target.value].idapp);
          setDesc(arrayAplicaciones[e.target.value].desc);
          setTtip(arrayAplicaciones[e.target.value].tooltip);
          setNaturaleza(arrayAplicaciones[e.target.value].idnaturaleza);
          setCbocultar(arrayAplicaciones[e.target.value].ocultar);
          setCbrlogin(arrayAplicaciones[e.target.value].rlogin);
          setCbadmin(arrayAplicaciones[e.target.value].admin);
              break;
       case "desc":
            setDesc(e.target.value);
            break;
      case "ttip":
           setTtip(e.target.value);
           break;
      case "naturaleza":
           setNaturaleza(e.target.value);
           break;
      case "ocultar":
           setCbocultar(e.target.checked);
           break;
      case "rlogin":
           setCbrlogin(e.target.checked);
           break;
      case "admin":
           setCbadmin(e.target.checked);
           break;
     default:
        break;
    }
  }

  useEffect(() => {
    init()
  }, [])

  return (

    <>    
    <Modal visible={show} onClose={onModalClose} className="cmodal wmodal" classContainer="modal-catprod">
      <div className="cerrar-button">
        <button className="cerrar" onClick={onModalClose}>X</button>
      </div>
      <div className="main-modal">
           <label>{contenido}</label>
      </div>
    </Modal>

    <div>
      <Navbar
        links={[
          { label: "Inicio", to: "/",tooltips: "Ir a la página principal" },
          { label: sessionStorage.getItem("user") === null ? "Iniciar sesión" : "Cerrar sesión", to: sessionStorage.getItem("user") === null ? "/login" : "/cerrarsesion", tooltips: sessionStorage.getItem("user") === null ? "Abrir sesión" : "/Cerrar la sesión de " + sessionStorage.getItem("usernombre") },
          { label: "Registrarse", to: "/registrarse?inserta=true", tooltips: "Crear una cuenta de usuario" },
          { label: "Acerca de", to: "/Acercade", tooltips: "Acerca de Destodo" },
        ]}
      />
      <Hero>
      <div className="cabeza">
            <IconButton color="primary" onClick={() => {
              navigate(`/?naturaleza=${naturaleza1}&idowner=${idowner}&nivel=${nivel}`);
//              navigate(-1);
            }}>
              <ArrowBack />
            </IconButton>
            <h3 className="h2-cabeza-negocios">Destodo</h3>
            <h4 className="h3-1-cabeza-negocios"> - Aplicaciones</h4>
          </div>

        <div className="aplicaciones">
          <div className="container-login">
            <div className="app-grip">
                <div className="app-flex app-flex-gap">
                     <label>ID aplicacion:</label>
                     {inicia===false && (agregarsn || editarsn)?
                      <>
                     <label>Descripcion:</label>
                     <label>Tooltip:</label>
                     <label className="app-label-naturaleza">Naturaleza: </label>
                     <label className="app-label app-input--12">Ocultar:</label>
                     <label className="app-label app-input--12">Requerido login:</label>
                     <label className="app-label app-input--12">Solo administrador:</label>
                     </>:""
                     }
                 </div>
                 <div className="app-flex">
                    {agregarsn===true?
                      <input className="app-input-area"
                               id="nick"
                               value={nick}
                               onChange={handleInput}
                               type="text"
                               required
                       />:""}
                    {(agregarsn===false && editarsn===false) || editarsn===true?
                      <div className="input-area1-producto">
                        <select className="app-select-naturaleza" disabled={editarsn===true?true:false} id="idapp" onChange={handleInput} value={aplicacion}>
                          {arrayAplicaciones.map((item, i) => {
                            return <option key={i} value={i} >{item.idapp}</option>
                          })}
                        </select>
                      </div>:""}


                      {inicia===false && (agregarsn || editarsn)?
                       <>
                       <input className="app-input-area"
                                id="desc"
                                value={desc}
                                onChange={handleInput}
                                type="text"
                                required
                        />

                       <input className="app-input-area"
                              id="ttip"
                              value={ttip}
                              onChange={handleInput}
                              type="text"
                              required
                        />

                      <div className="input-area1-producto">
                          <select className="app-select-naturaleza" id="naturaleza" onChange={handleInput} value={naturaleza}>
                               {arrayNaturalezas.map((item, i) => {
                                   return <option key={i} value={item.idnaturaleza} >{item.desc}</option>
                               })}
                          </select>
                      </div>

                      <div className="input-area4">
                           <Checkbox sx={{ padding: 0 }} id="ocultar" color="checkbox" defaultChecked checked={cbocultar} onClick={handleInput} />
                      </div>
                      <div className="input-area4">
                          <Checkbox sx={{ padding: 0 }} id="rlogin" color="checkbox" defaultChecked checked={cbrlogin} onClick={handleInput} />
                     </div>
                     <div className="input-area4">
                         <Checkbox sx={{ padding: 0 }} id="admin" color="checkbox" defaultChecked checked={cbadmin} onClick={handleInput} />
                     </div>
                     </>:""
                     }

                 </div>                 
          </div>          

          <div className="producto-grupo-button">
                  {(agregarsn === false && editarsn === false) ?
                    <Tippy content="Añadir Producto">
                      <button type="button" className="producto-button primary" onClick={agregar}>
                      <Add />
                      </button>
                    </Tippy> : ""
                  }
                  {inicia===false?
                  <>
                  {(agregarsn === false && editarsn === false && arrayAplicaciones[aplicacion].desc!=="Desconocida") ?
                    <Tippy content="Clic para editar el producto">
                      <button type="button" className="producto-button primary" disabled={arrayAplicaciones[aplicacion].desc === "Desconocida"} onClick={editar}>
                      <Edit />
                      </button>
                    </Tippy> : ""
                  }

                  {(agregarsn === false && editarsn === false  && arrayAplicaciones[aplicacion].desc!=="Desconocida") ?
                    <Tippy content="Clic para eliminar el producto">
                      <button type="button" className="producto-button primary" disabled={arrayAplicaciones[aplicacion].desc === "Desconocida"} onClick={eliminar}>
                      <Delete />
                      </button>
                    </Tippy> : ""
                  }

                  </>:""}
                  {inicia===false && (agregarsn || editarsn) && (nick.length!=0 && desc.length!=0) ?
                    <Tippy content={nick.length !== 0 && desc.length !== 0 ? "Registrar el producto" : "Complete los datos necesarios"}>
                      <button type="button" className="producto-button primary" onClick={nick.length !== 0 && desc.length !== 0 ? confirmar : ""}>
                      <Check />
                      </button>
                    </Tippy> : ""
                  }

                  {inicia===false && (agregarsn || editarsn) ?
                    <Tippy content="Cancelar, agregar ó editar producto">
                      <button type="button" className="producto-button primary" onClick={tcancelar}>
                      <Close />
                      </button>
                    </Tippy> : ""
                  }

                </div>

           </div>

        </div>

      </Hero>
    </div>
    </>

);
};

export default Aplicaciones;
