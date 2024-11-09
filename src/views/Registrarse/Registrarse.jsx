import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Tippy from "@tippyjs/react";

// components
import Map from "../../components/Map/MapBox";
import Navbar from "../../components/Navbar/Navbar"
//import Modal from "../../components/Modal/Modal";

// Iconos
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { useNotification } from "../../context/NotificationProvider";

import Hero from "../../layouts/Hero/Hero";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton"
import ArrowBack from "@mui/icons-material/ArrowBack";
import { isValid, apiBaseDatos, getJpgFileSB, buscarEnArreglo } from "../../Utiles/Utiles";
import "./styles.css";

const Registrarse = () => {
  const location = useLocation();
  const parsedParams = {}
  const {setOpen, setMessage} = useNotification();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState();
  const [rpassword, setRpassword] = useState();
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [foto] = useState();
  const [nombrefoto, setNombrefoto] = useState("");
  const [contenidofoto, setContenidofoto] = useState();
  const [desc, setDesc] = useState("");
  const [provincia, setProvincia] = useState(13);
  const [municipio, setMunicipio] = useState(5);
  const arraydesconocido = [{ provincia: 99, municipio: 99, desc: "Desconocido" }];
  const arrayplan= [{ plan: 0,  desc: "Gratis", tip:"(Comprar y reservar)" },{ plan: 1,  desc: "Estandar", tip:"Negocio estandar" },
                    { plan: 2,  desc: "Premiun", tip:"Negocio Plus" },{ plan: 3,  desc: "Administrador", tip:"Administrador" }];
  const [plan, setPlan] = useState(0);
  const [arrayprovincias, setArrayprovincias] = useState([]);
  const [arraymunicipios, setArraymunicipios] = useState([]);
  const [tmunicipios, setTmunicipios] = useState([]);
  const [show1, setShow1] = useState(true);
  const [cbvista, setCbvista] = useState(false);
  const [resultado, setResultado] = useState("");
  const [resultadopw] = useState("");
  const [inicia, setInicia] = useState(true);
  const [modifica, setModifica] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [zoom] = useState(15.5);
  const [isBase64ToBlob, setIsBase64ToBlob]=useState(true);

  // Otros estados
  const navigate = useNavigate(); 

  async function init() {
    setShow1(true);
    setInicia(true);
    setNombrefoto("");
    setResultado(arrayplan[0].tip);
    setModifica(!(parsedParams.inserta==="true"));
    
    let ttprovincias=[];
    let resultprovincia = await apiBaseDatos("provincias")

    if (resultprovincia === undefined)
    {
      setArrayprovincias(arraydesconocido);
      ttprovincias=arraydesconocido;
    }
    else
    {
      setArrayprovincias(resultprovincia);
      ttprovincias=resultprovincia;
    }
    setProvincia(ttprovincias[0].provincia);
    let ttmunicipios=[];
    let resultmunicipio = await apiBaseDatos("municipios");
    if (resultmunicipio === true)
    {
       setArraymunicipios(arraydesconocido);
       setTmunicipios(arraydesconocido);
       ttmunicipios=arraydesconocido;
    }
    else
    {
      setArraymunicipios(resultmunicipio);
      if ((isValid(sessionStorage.getItem("user")) === false) && (isValid(sessionStorage.getItem("userprovincia")) === false)){
         ttmunicipios = resultmunicipio.filter((item)=>{if (item.provincia === ttprovincias[0].provincia){return item}});
      }
      else{
        ttmunicipios = resultmunicipio.filter((item)=>{if (item.provincia === ttprovincias[sessionStorage.getItem("userprovincia")-1].provincia){return item}});
      }
    }
    if (ttmunicipios.length!==0) setTmunicipios(ttmunicipios)
    else
    {
      setTmunicipios(arraydesconocido);
      ttmunicipios=arraydesconocido;
    }
    setMunicipio(ttmunicipios[0].municipio);
    if (isValid(sessionStorage.getItem("user")) === true && (parsedParams.where!=='true'))
    {
      let result = await apiBaseDatos("getdatosuser", sessionStorage.getItem("user"));
      setUser(result[0].iduser);
      setPassword(result[0].pw);
      setNombre(result[0].nombre);
      setPlan(result[0].tipouser);
      setCelular(result[0].celular);
      setProvincia(result[0].provincia);
      setMunicipio(result[0].municipio);
      setLat(isValid(result[0].latitud)===true && result[0].latitud!==0?result[0].latitud:ttmunicipios[buscarEnArreglo(ttmunicipios,result[0].municipio,"municipio")].latitud);
      setLng(isValid(result[0].longitud)===true && result[0].longitud!==0?result[0].longitud:ttmunicipios[buscarEnArreglo(ttmunicipios,result[0].municipio,"municipio")].longitud);
      setIsBase64ToBlob(true);
      let resultado = await getJpgFileSB(result[0].iduser + ".jpg", "./galerias/app_images/usuarios/" + result[0].iduser, "usuarios/" + result[0].iduser);
      if (resultado!== undefined && resultado!==null) {
        setContenidofoto(resultado);
        setNombrefoto(result[0].iduser);
      } else {
        setIsBase64ToBlob(false);
        setNombrefoto("");
        setMessage('Error al recuperar la imagen del usuario');
        setOpen(true);
      }
   }
   else
   {
     provinciachange(14,6, resultprovincia, resultmunicipio)
     setLat(ttmunicipios[buscarEnArreglo(ttmunicipios,6,"municipio")].latitud);
     setLng(ttmunicipios[buscarEnArreglo(ttmunicipios,6,"municipio")].longitud);
   }
   setInicia(false);
   setShow1(false);
  }
     
  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => { const [paramName, paramValue] = item.split("="); parsedParams[paramName] = paramValue });
  }, [location])

  useEffect(() => {
    init();
  }, [location]);
  

  function provinciachange(cambia, municipio, provinciadata, municipiodata)
  {
    let ttmunicipio=[];
        setProvincia(cambia);
        ttmunicipio=municipiodata.filter((item)=>{if (item.provincia === cambia){return item}});
        setTmunicipios(ttmunicipio);
     if (ttmunicipio.length === 0){
          setTmunicipios(arraydesconocido);
          ttmunicipio=arraydesconocido;
       }
       setMunicipio(municipio);
       setUser("");
       setPassword("");
       setRpassword("");
       setNombre("");
       setCelular("");
     

  }
  function tcancelar() {
    navigate("/?nivel=0")
  }

  async function handleselect(e) {
    let ttmunicipio=[];
    switch (e.target.id) {
      case "provincia":
        console.log(e.target.value);
        setProvincia(Number(e.target.value));
        ttmunicipio=arraymunicipios.filter((item)=>{if (item.provincia === Number(e.target.value)){return item}});
        setTmunicipios(ttmunicipio);
        if (ttmunicipio.length === 0){
          setTmunicipios(arraydesconocido);
          ttmunicipio=arraydesconocido;
        }
       setMunicipio(0);
       console.log(ttmunicipio);
       setLat(ttmunicipio[buscarEnArreglo(ttmunicipio, ttmunicipio[0].municipio,"municipio")].latitud);
       setLng(ttmunicipio[buscarEnArreglo(ttmunicipio, ttmunicipio[0].municipio,"municipio")].longitud);
      break
      case "municipio":
        setMunicipio(Number(e.target.value));
        setLat(tmunicipios[buscarEnArreglo(tmunicipios,e.target.value,"municipio")].latitud);
        setLng(tmunicipios[buscarEnArreglo(tmunicipios,e.target.value,"municipio")].longitud);
          break
      case "plan":
          setPlan(e.target.value);
          setResultado(arrayplan[Number(e.target.value)].tip);
          break; 
      }
  }

  function handleInput(e) {
    setResultado(arrayplan[plan].tip);
    switch (e.target.id) {
      case "user":
        setUser(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      case "rpassword":
        setRpassword(e.target.value);
        break;
      case "nombre":
        setNombre(e.target.value);
        break;
      case "celular":
        setCelular(e.target.value);
        break;
      case "desc":
        setDesc(e.target.value);
        break;
      case "vista":
        setCbvista(e.target.checked);
        break;
      default:
        break;
    }
  }

  async function confirmar() {
    if (password !== rpassword ) {
      setMessage("Contraseña incorrecta");
      setOpen(true);
  
      document.getElementById("password").focus();
    }
    else
    {
      if (desc===undefined || desc===null)
      {
        setDesc("");
      }
      let latT=lat===null || lat===undefined?0:lat;
      let lngT=lat===null || lng===undefined?0:lng;
      let response = await apiBaseDatos("setregistrarse", user, nombre, password, celular, provincia, municipio, contenidofoto, modifica, plan, latT, lngT, isBase64ToBlob)
      let isOk=true;
      if (isValid(response)===true )
         if (isValid(response.length)===true) isOk=false;
      if (isOk===false)
      {
        setMessage("Ocurrio un error mientras se registraba el usuario.");
        setOpen(true);
          
      }
      else {
        setMessage("El usuario se registró correctamente.");
        setOpen(true);
        tcancelar();
     }
   } 
  } 

  const onPhotoChange = (e) => {
    const file = e.target.files[0];
    setNombrefoto(e.target.value);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setContenidofoto(content);
      setIsBase64ToBlob(false);
    };
    reader.readAsDataURL(file);
  }
  
  const lngLatSelected = (point, lngLat) => {
    console.log(lngLat.lat, lngLat.lng );
    setLng(lngLat.lng);
    setLat(lngLat.lat);
  };

  const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };

  return (
    <>
    <div>
      <Navbar
      />
      <Hero>
      <div className="div-papa">
          <div className="cabeza">
               <IconButton color="primary" onClick={() => 
               {
                  navigate("/?nivel=0");
               }}>
                <ArrowBack className="flecha" />
                
              </IconButton>
              <h4 className="registrarse-cabeza-1">Atrás</h4>
          </div>
          {console.log(inicia)}
          {inicia===true && show1===true ? <Box sx={{ width: "100%", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}><CircularProgress color="checkbox" /></Box> : null}

        {inicia===false?
        <>
        <div className="registrarse">
          <div className="container-registrarse">
          <label className="label-grupo label-registrase-size strong">Registrarse</label>
          <label className="label-grupo label-datos-size strong">Datos Generales</label>
            <div className="input-area-registrarse">
              <label className="usuario" >* Usuario:</label>
              <input
                id="user"
                value={user}
                color="black"
                disabled={modifica}
                onChange={handleInput}
                type="text"
                required
              />
            </div>
            <div className="input-area-registrarse">
              <label className="pw">* Password:</label>
              <input
                id="password"
                value={password}
                onChange={handleInput}
                type="password"
                required
              />
            </div>
            <div className="input-area-registrarse">
              <label className="rpw">* Repetir Pw:</label>
              <input
                id="rpassword"
                value={rpassword}
                onChange={handleInput}
                type="password"
                required
              />
            </div>
            {
              resultadopw !== "" && <label className="resultadopw-registrarse">{resultadopw}</label>
            }

            <div className="input-area-registrarse">
              <label className="celular">* Celular:</label>
              <input
                id="celular"
                value={celular}
                onChange={handleInput}
                type="phone"
                required
              />
            </div>
            <div className="input-area-registrarse-plan">
              <label className="plan">* Plan:</label>
              <select  className="select-registrarse-plan"  id="plan" onChange={handleselect} value={plan}>
                {arrayplan.filter((item,i)=>{if (i<3){return item}}).map((item1,i)=>{return <option key={i} value={i} >{item1.desc}</option>})}
              </select>
            </div>
            {
              resultado !== "" && <label className="resultado-registrarse">{resultado}</label>
            }
            <label className="label-grupo label-datos-size strong">Datos Personales</label>
            <div className="input-area-registrarse">
              <label className="nombre" >Nombre:</label>
              <input
                id="nombre"
                value={nombre}
                onChange={handleInput}
                type="text"
                required
              />
            </div>

              {(nombrefoto!=="") && cbvista?
              <div className="img-class">
                  <img className="img-registrarse" src={contenidofoto} />
              </div>:""
              }
            
            <div className="input-area-registrarse-provincia">
              <label>Provincia:</label>
              <select  className="select-registrarse-prov"  id="provincia" onChange={handleselect} value={provincia}>
                {arrayprovincias.map((item, i) => {
                  return <option key={i} value={item.provincia} >{item.desc}</option>
                })}
              </select>
            </div>
            <div className="input-area-registrarse-municipio">
              <label>Municipio:</label>
              <select className="select-registrarse-munic" id="municipio" onChange={handleselect} value={municipio}>
                {tmunicipios.map((item, i) => {
                  return <option key={i} value={item.municipio} >{item.desc}</option>
                })}
              </select>
            </div>

            <div className="grupo-button-registrarse">
                     {nombrefoto!==""?
                     <Tippy content="Vista previa">
                        <button
                          type="button"
                          className="producto-button primary"
                          onClick={()=>setCbvista(!cbvista)}
                        >
                          <VisibilityIcon />
                        </button>
                      </Tippy>:""
                    }
               
                        {inicia === false  && user!=="" && password!=="" && celular!==""? 
                         <label className="producto-button primary label-photo">
                          <input
                            id="foto"
                            value={foto}
                            onChange={onPhotoChange}
                            type="file"
                            required
                            multiple
                          />
                          <Tippy content="Añadir foto">
                            <AddPhotoAlternateIcon />
                          </Tippy>
                        </label>:""}
                        {inicia === false  && user!=="" && password!=="" && celular!==""? (
                          <Tippy content="Ubicar el negocio en el mapa">
                            <button
                              type="button"
                              className="negocio-button primary"
                              onClick={() => setShowMap(!showMap)}
                            >
                              <PlaceOutlinedIcon/>
                            </button>
                          </Tippy>
                        ) : (
                          ""
                        )}
                       {inicia===false && user!=="" && password!=="" && rpassword!=="" && celular!==""?
                        <button type="button" className="producto-button primary " onClick={confirmar}>
                          <Check />
                        </button>:""
                       }
                       <button type="button" className="producto-button primary" onClick={tcancelar}>
                         <Close />
                      </button>
                </div>                 
            </div>
         </div>
        </>:""}

        <div className="mapa-1">
           {showMap === true ? (
                    <div className="mapa-catalogo">
                      <Map
                        sx={{ height: "100%", width: "100%" }}
                        onMapClick={lngLatSelected}
                        remoteshowMap={showMap}
                        lat={lat}
                        lng={lng}
                        point={{ lat, lng }}
                        onChange={onChangeMap}
                        remoteZoom={zoom}
                      />
                      </div>
                  ) : (
                    ""
                  )}
          </div>

        </div>
      </Hero>
    </div>
    </>
  );
};

export default Registrarse;
