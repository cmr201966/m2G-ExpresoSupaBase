
// components
import Navbar from "../../components/Navbar/Navbar"
import Tippy from "@tippyjs/react";
// layouts
import Hero from "../../layouts/Hero/Hero";
// 
//import { Link } from "react-router-dom"
// styles
import "./styles.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
//import Modal from "../../components/Modal/Modal";
//import ChatDialogo from "../../components/ChatDialogo/ChatDialogo";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import SettingsCellIcon from '@mui/icons-material/SettingsCell';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { useNavigate } from "react-router-dom"
import { isValid, getJpgFileSB  } from "../../Utiles/Utiles";
import { useNotification } from "../../context/NotificationProvider";
//import config from "../../config";


const Acercade = () => {
  const [contenidofoto, setContenidofoto] = useState();
  const {setOpen, setMessage} = useNotification();
  const parsedParams = {}
  const navigate = useNavigate();
  const url = `https://wa.me/52675359?text=`
  //const [showchat, setShowchat] = useState(false);
  //const [chatuser, setChatuser] = useState("root");
  //const [chatnombre, setChatnombre] = useState("Destodo");
  //const [indexChat, setIndexChat] = useState(0);


async function init()
{
  let resultado = await getJpgFileSB("logo.jpg", "./galerias/app_images/destodo/", "destodo/", false, "", "", "");
  if (isValid(resultado)=== true) {
     setContenidofoto(resultado);
  } else {
     setMessage('Error al recuperar la imagen del usuario');
     setOpen(true);
  }                       
}

useEffect(() => {
  init()
}, [])

  return (
    <div>
      <Navbar nivel={1}/>
      <Hero>
        <div className="cabeza">
            {parsedParams.nivel === 0 ? "" :
              <IconButton color="primary" onClick={() => {
                navigate(`/?nivel=${sessionStorage.getItem("nivel")}`);
              }}>
                <ArrowBack />
              </IconButton>
            }
        </div>
        <div className="acercade">
          <div className="logo-acerca">
            <Link to="/">
               <Tippy content="Inicio" >
{/*                  <img className="logo-acerca-img" src={sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL"? urlMYSQL: urlSUPABASE} />*/}
                  <img className="logo-acerca-img" src={contenidofoto} />
               </Tippy>
            </Link>
            <h3>Acerca de</h3>
          </div>
              <p>m2G-Expreso Versión 1.0</p>
              <p>Desarrollado por m2G-Software.</p>
              <div className="acercade-flex">
                 <button
                     type="button"
                     className="producto-button email-acercade"
                     disabled
                  >
                     <SettingsCellIcon />
                  </button>
                 <span> +(53)52675359 </span>
                 <button
                     type="button"
                     disabled
                     className="producto-button email-acercade"
                  >
                     <ContactPhoneIcon />
                  </button>
                 <span> +(53)22657241 </span>
              </div>
              <div className="acercade-flex">
                 <button
                     type="button"
                     disabled
                     className="producto-button email-acercade"
                  >
                     <AlternateEmailIcon />
                  </button>
              <p>cmr201966@gmail.com </p>
              </div>
              <div className="ws-acercade">
                 <a href={url} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="ws-acercade-1" /></a>
                 <span>WhatsApp </span>
              </div>
              <p>Santiago de Cuba.</p>
              <p>Todos los derechos reservados. 2024</p>
        </div>
      </Hero>
    </div>
  );
};

export default Acercade;
