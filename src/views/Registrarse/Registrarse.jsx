import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
// components
import Navbar from "../../components/Navbar/Navbar"
import Checkbox from '@mui/material/Checkbox';
import Modal from "../../components/Modal/Modal";

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

const Registrarse = () => {
  const location = useLocation();
  const parsedParams = {}
  const [user, setUser] = useState("");
  const [password, setPassword] = useState();
  const [rpassword, setRpassword] = useState();
  const [nombre, setNombre] = useState("");
  const [fijo, setFijo] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [sede, setSede] = useState("");
  const [foto, setFoto] = useState();
  const [nombrefoto, setNombrefoto] = useState("");
  const [contenidofoto, setContenidofoto] = useState();
  const [nit, setNit] = useState("");
  const [desc, setDesc] = useState("");
  const [provincia, setProvincia] = useState(13);
  const [municipio, setMunicipio] = useState(0);
  const [cbcup, setCbcup] = useState("");
  const [cbmlc, setCbmlc] = useState("");
  const arraydesconocido = [{ keycercade: 99, provincia: 99, municipio: 99, desc: "Desconocido" }];
//  const arrayplan= [{ plan: 0,  desc: "Gratis", tip:"Explorar, Comprar y Reservar" },{ plan: 1,  desc: "Básico", tip:"Crear Negocios" }];
  const arrayplan= [{ plan: 0,  desc: "Gratis", tip:"Explorar, Comprar y Reservar" },{ plan: 1,  desc: "Básico", tip:"Crear Negocios" },{ plan: 2,  desc: "Premiun", tip:"Crear Negocios Plus" }];
  const [plan, setPlan] = useState(0);
  const [arrayprovincias, setArrayprovincias] = useState([]);
  const [arraymunicipios, setArraymunicipios] = useState([]);
  const [tmunicipios, setTmunicipios] = useState([]);
  const [cp1, setCp1] = useState("Z");
  const [cp2, setCp2] = useState("K");
  const [cp3, setCp3] = useState("M");
  const [cp4, setCp4] = useState("W");
  const [cp5, setCp5] = useState("P");
  const [cp6, setCp6] = useState();
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [cbvista, setCbvista] = useState(false);
  const [resultado, setResultado] = useState("");
  const [contenido, setContenido] = useState("");
  const [inicia, setInicia] = useState(true);
  const [modifica, setModifica] = useState(false);
  
  // Otros estados
  const navigate = useNavigate(); 

  async function init() {
    setShow1(true);
    setResultado(arrayplan[0].tip);
    console.log("Insertar:", parsedParams.inserta==="true");
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
      if (sessionStorage.getItem("user") === null){
         ttmunicipios = resultmunicipio.filter((item,i)=>{if (item.provincia === ttprovincias[0].provincia){return item}});
      }
      else{
        ttmunicipios = resultmunicipio.filter((item,i)=>{if (item.provincia === ttprovincias[sessionStorage.getItem("userprovincia")-1].provincia){return item}});
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
    if (sessionStorage.getItem("user") !== null)
    {

      let result = await getdatosiduser({user: sessionStorage.getItem("user")});
      result = await result.json();
  
      //
      // Si ok poner valores de bd en estados
      //
      console.log(result[0]);
      setUser(result[0].iduser);
      setPassword(result[0].pw);
      setNombre(result[0].nombre);
      setEmail(result[0].email);
      setFijo(result[0].fijo);
      setPlan(result[0].tipouser);
      console.log(result[0].tipouser);
      setCelular(result[0].celular);
      setProvincia(result[0].provincia);
      setMunicipio(result[0].municipio);
      //
      // Recuperar el contenido de la foto de perfil
      //             
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
  }
      
  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => { const [paramName, paramValue] = item.split("="); parsedParams[paramName] = paramValue });
  }, [location])

  useEffect(() => {
    init()
  }, [])


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

  }

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
      case "email":
        setEmail(e.target.value);
        break;
      case "fijo":
        setFijo(e.target.value);
        break;
      case "sede":
        setSede(e.target.value);
        break;
      case "celular":
        setCelular(e.target.value);
        break;
      case "cbmlc":
        setCbmlc(e.target.value);
        break;
      case "cbcup":
        setCbcup(e.target.value);
        break;
      case "desc":
        setDesc(e.target.value);
        break;
      case "nit":
        setNit(e.target.value);
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
      setResultado("Las contraseñas no coinciden"); 
      document.getElementById("password").focus();
    }
    else
    {
      if (desc===undefined || desc===null)
      {
        setDesc("");
      }
    let response = await setregistrarse({user, nombre, password, email, celular, fijo, provincia:provincia,municipio:municipio, contenidofoto,modifica,plan});
    response = await response.json();

    const data = await response;
    if (data.error) 
    {
      setContenido(data.error);
      setShow(true);
    }
    else {
      setContenido("El usuario se registró correctamente.");
      setShow(true);
    }
  } // if password
  } //confirmaregistrarse

  const onPhotoChange = (e) => {
    const file = e.target.files[0];
    setNombrefoto(e.target.value);
    if (!file) return;
    const reader = new FileReader();
    // eslint-disable-next-line no-shadow
    reader.onload = (e) => {
      const content = e.target.result;
      setContenidofoto(content);
    };
    reader.readAsDataURL(file);
  }

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
          { label: "Acerca de", to: "/Acercade", tooltips: "Acerca de M2g-Destodo" },
        ]} 
      />
      <Hero>
      <div className="cabeza">
               <IconButton color="primary" onClick={() => 
               {
                  navigate(`/?naturaleza=${sessionStorage.getItem("naturaleza")}&owner=${sessionStorage.getItem("idowner")}&nivel=${sessionStorage.getItem("nivel")}`);
               }}>
                <ArrowBack />
              </IconButton>
              <h3 className="registrarse-cabeza">M2G-Destodo</h3>
              <h4 className="registrarse-cabeza-1"> - Registrarse</h4>
      </div>
      {show1 ? <Box sx={{ width: "100%", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}><CircularProgress color="checkbox" /></Box> : null}

        {inicia===false?
        <>
        <div className="registrarse">
          <div className="container-registrarse">
            <label className="label-grupo">Datos Generales</label>
            <div className="input-area-registrarse">
              <label className="usuario" >*Usuario:</label>
              <input
                id="user"
                value={user}
                onChange={handleInput}
                type="text"
                required
              />
            </div>
            <div className="input-area-registrarse">
              <label className="pw">*PassWord(PW):</label>
              <input
                id="password"
                value={password}
                onChange={handleInput}
                type="password"
                required
              />
            </div>
            <div className="input-area-registrarse">
              <label className="rpw">*Repetir PW:</label>
              <input
                id="rpassword"
                value={rpassword}
                onChange={handleInput}
                type="password"
                required
              />
            </div>
            <div className="input-area-registrarse">
              <label className="email">*Email:</label>
              <input
                id="email"
                value={email}
                onChange={handleInput}
                type="text"
                required
              />
            </div>
            <div className="input-area-registrarse">
              <label className="celular">*Celular:</label>
              <input
                id="celular"
                value={celular}
                onChange={handleInput}
                type="phone"
                required
              />
            </div>
            {
              resultado !== "" && <label className="resultado-registrarse">{resultado}</label>
            }
            <div className="input-area-registrarse-plan">
              <label className="plan">*Plan:</label>
              <select  className="select-registrarse-plan"  id="plan" onChange={handleselect} value={plan}>
                {arrayplan.map((item, i) => {
                  return <option key={i} value={i} >{item.desc}</option>
                })}
              </select>
            </div>
            <label className="label-grupo">Datos Personales</label>
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

            <div className="input-area-registrarse">
              <label className="fijo">Tel. Fijo:</label>
              <input
                id="fijo"
                value={fijo}
                onChange={handleInput}
                type="phone"
                required
              />
            </div>
            <div className="input-area-foto-registrarse">
                <label className="label-2-registrarse">Foto:</label>
                <label className="label-2-1-registrarse">
                <input
                  id="foto"
                  value={foto}
                  onChange={onPhotoChange}
                  type="file"
                  required
                />
                Añadir foto
                </label>
                {(nombrefoto!=="") ? 
                  <div className="check-vista-1">
                      <label className="label-vista-registrase-1-1">Vista previa</label>
                      <Checkbox className="cbox-vista" id="vista" color="checkbox" defaultChecked  checked={cbvista} onClick={handleInput}/>
                  </div>:""
                 }                              
            </div>
              {(nombrefoto!=="") && cbvista?
              <div className="img-class">
                  <img className="img-registrarse" src={contenidofoto} />
              </div>:""
              }

            <label className="label-grupo">Ubicación</label>
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

            <label className="label-grupo">Comprobación</label>
            <div className="input-cp">
              <label className="cp" style={{transform:`rotateZ(${35}deg)`}}>{cp1}</label>
              <label className="cp" style={{transform:`rotateZ(${45}deg)`}}>{cp2}</label>
              <label className="cp" style={{transform:`rotateZ(${55}deg)`}}>{cp3}</label>
              <label className="cp" style={{transform:`rotateZ(${45}deg)`}}>{cp4}</label>
              <label className="cp" style={{transform:`rotateZ(${35}deg)`}}>{cp5}</label>
            </div>
            <div className="input-area-registrarse">
              <label className="label-comprobacion">*Captcha:</label>
              <input
                id="cp6"
                value={cp6}
                onChange={handleInput}
                type="text"
                required
              />
            </div>

            <div className="grupo-button-registrarse">
              <button type="button" className="confirmar registrarse-button primary" onClick={confirmar}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
        </>:""}
      </Hero>
    </div>
    </>
  );
};

export default Registrarse;
