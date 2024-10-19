import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Tippy from "@tippyjs/react";

// components
import Map from "../../components/Map/MapBox";
import Navbar from "../../components/Navbar/Navbar"
import Modal from "../../components/Modal/Modal";
import Snackbar from '@mui/material/Snackbar';

// Iconos
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';

// layouts
import Hero from "../../layouts/Hero/Hero";
// styles
import "./styles.css";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton"
import ArrowBack from "@mui/icons-material/ArrowBack";
import { getprovincias, getmunicipios  } from "../../servicios/catalogos";
import { getdatosiduser, setregistrarse  } from "../../servicios/registrarse";
import { getjpg  } from "../../servicios/imagenes";
import { isValid } from "../../Utiles/Utiles";

const Registrarse = () => {
  const location = useLocation();
  const parsedParams = {}
  const [user, setUser] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState();
  const [rpassword, setRpassword] = useState();
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [foto] = useState();
  const [nombrefoto, setNombrefoto] = useState("");
  const [contenidofoto, setContenidofoto] = useState();
  const [desc, setDesc] = useState("");
  const [provincia, setProvincia] = useState(13);
  const [municipio, setMunicipio] = useState(0);
  const arraydesconocido = [{ provincia: 99, municipio: 99, desc: "Desconocido" }];
  //,{ plan: 3,  desc: "administrador", tip:"Super administrador" }
  const arrayplan= [{ plan: 0,  desc: "Gratis", tip:"(Comprar y reservar)" },{ plan: 1,  desc: "Estandar", tip:"Negocio estandar" },{ plan: 2,  desc: "Premiun", tip:"Negocio Plus" },{ plan: 3,  desc: "Administrador", tip:"Administrador" }];
  const [plan, setPlan] = useState(0);
  const [arrayprovincias, setArrayprovincias] = useState([]);
  const [arraymunicipios, setArraymunicipios] = useState([]);
  const [tmunicipios, setTmunicipios] = useState([]);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [cbvista, setCbvista] = useState(false);
  const [resultado, setResultado] = useState("");
  const [resultadopw] = useState("");
  const [contenido] = useState("");
  const [inicia, setInicia] = useState(true);
  const [modifica, setModifica] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [zoom] = useState(15.5);

  // Otros estados
  const navigate = useNavigate(); 

  async function init() {
    setShow1(true);
    setResultado(arrayplan[0].tip);
    setModifica(!(parsedParams.inserta==="true"));
    
    let ttprovincias=[];
    let resultprovincia = await getprovincias({});
    resultprovincia = await resultprovincia.json();

    if (resultprovincia.error || resultprovincia.length === 0)
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
      if ((sessionStorage.getItem("user") === 'null' || sessionStorage.getItem("user") === null) && (sessionStorage.getItem("userprovincia") === 'null' || sessionStorage.getItem("userprovincia") === null)){
         ttmunicipios = resultmunicipio.filter((item)=>{if (item.provincia === ttprovincias[0].provincia){return item}});
      }
      else{
        ttmunicipios = resultmunicipio.filter((item)=>{if (item.provincia === ttprovincias[sessionStorage.getItem("userprovincia")-1].provincia){return item}});
      }
    }
    if (ttmunicipios.length!==0)
    {
      setTmunicipios(ttmunicipios);
    }
    else
    {
      setTmunicipios(arraydesconocido);
      ttmunicipios=arraydesconocido;
    }

    setMunicipio(ttmunicipios[0].municipio);
    if (isValid(sessionStorage.getItem("user")) === true && (parsedParams.where!=='true'))
    {
      let result = await getdatosiduser({user: sessionStorage.getItem("user")});
      result = await result.json();
      setUser(result[0].iduser);
      setPassword(result[0].pw);
      setNombre(result[0].nombre);
      setPlan(result[0].tipouser);
      setCelular(result[0].celular);
      setProvincia(result[0].provincia);
      setMunicipio(result[0].municipio);
      setLat(result[0].latitud);
      setLng(result[0].longitud)
      let resultado = await getjpg({foto: sessionStorage.getItem("user"), folder: "usuarios"});
      resultado = await resultado.text();

             if (resultado.length!==0)
              {
                 setContenidofoto(resultado);
                 setNombrefoto(sessionStorage.getItem("user"));
              }
              else
              {
                setNombrefoto("");
              }
      }
      else
      {
        provinciachange(14, resultprovincia, resultmunicipio)
      }

    setInicia(false);
    setShow1(false);
  }

  const onModalClose = () => 
  {
  setShow(false)
  document.getElementById("password").focus();
  }
      
  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => { const [paramName, paramValue] = item.split("="); parsedParams[paramName] = paramValue });
  }, [location])

  useEffect(() => {
    init();
  }, [location]);
  

  function provinciachange(cambia, provinciadata, municipiodata)
  {
    let ttmunicipio=[];
        setProvincia(cambia);
        ttmunicipio=municipiodata.filter((item)=>{if (item.provincia === cambia){return item}});
        setTmunicipios(ttmunicipio);
     if (ttmunicipio.length === 0){
          setTmunicipios(arraydesconocido);
          ttmunicipio=arraydesconocido;
       }
       setMunicipio(0);
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
        setProvincia(Number(e.target.value));
        ttmunicipio=arraymunicipios.filter((item)=>{if (item.provincia === Number(e.target.value)){return item}});
        setTmunicipios(ttmunicipio);
        if (ttmunicipio.length === 0){
          setTmunicipios(arraydesconocido);
          ttmunicipio=arraydesconocido;
        }
       setMunicipio(0);
       break
      case "municipio":
        setMunicipio(Number(e.target.value));
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
      let response = await setregistrarse({user, nombre, password, celular, provincia:provincia,municipio:municipio, contenidofoto,modifica,plan, lat, lng});
      response = await response.json();
      if (response.error) 
      {
        setMessage(response.error);
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
    };
    reader.readAsDataURL(file);
  }
  
  const lngLatSelected = (point, lngLat) => {
    setLng(lngLat.lng);
    setLat(lngLat.lat);
  };

  const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };


  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        autoHideDuration={4000}
        open={open}
        onClose={()=>setOpen(!open)}
        message={message}
      />

    <Modal visible={show} onClose={onModalClose} className="cmodal" classContainer="modal-catprod">
      <div className="cerrar-button">
        <button className="cerrar" onClick={onModalClose}>X</button>
      </div>
      <div className="main-modal">
           <label>{contenido}</label>
      </div>
    </Modal>

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
          {show1 ? <Box sx={{ width: "100%", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}><CircularProgress color="checkbox" /></Box> : null}

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
                        </label>
                        {inicia === false  ? (
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
              {user!=="" && password!=="" && rpassword!=="" && celular!==""?
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
