// components
import Tippy from "@tippyjs/react";
import Navbar from "../../components/Navbar/Navbar"
// layouts
import Hero from "../../layouts/Hero/Hero";
// styles
import "./styles.css";
import { useEffect, useState } from "react";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton"
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom";
import { setComando } from "../../servicios/Whatsapp";

const Whatsapp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {}
  // Estados para almacenar los datos del negocio activo
  const [contenido, setContenido] = useState("");
  const [cmd, setCmd] = useState("");
  const [nivel, setNivel] = useState(9999);
  const [idowner, setIdowner] = useState(9999);
  const [naturaleza, setNaturaleza] = useState(9999);

  async function init() {
    setNivel(parsedParams.nivel);
    setNaturaleza(parsedParams.naturaleza);
    setIdowner(parsedParams.idowner);
      
  } // init


  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location]);
    
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
    if (e.key==='Enter') 
      {}
    else{
      switch (e.target.id) {
        case "cmd":
             setContenido("");
             setCmd(e.target.value);
             break;
        default:
            break;
    }
  }
  }

  function key(e){
    if (e.key==='Enter' && cmd.length!==0) confirmar();
  }

  useEffect(() => {
    init()
    if (document.getElementById("cmd")) document.getElementById("cmd").focus();
  }, [])

  return (
    <>
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
              navigate(`/?naturaleza=${naturaleza}&idowner=${idowner}&nivel=${nivel}`);
            }}>
              <ArrowBack />
            </IconButton>
            <h3 className="h2-cabeza-negocios">Destodo</h3>
            <h4 className="h3-1-cabeza-negocios"> - WhatsApp</h4>
       </div>

       <div className="WhatsApp">
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
            </div>        

        </div>                       
        </Hero>
    </div> 
    </>
);
};

export default Whatsapp;
