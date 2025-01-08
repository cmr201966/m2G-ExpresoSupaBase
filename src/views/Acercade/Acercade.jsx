import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";

// components
import Navbar from "../../components/Navbar/Navbar";
import Encabezado from "../../components/Encabezado/Encabezado";

// layouts
import Hero from "../../layouts/Hero/Hero";

// styles
import "./styles.css";

// @mui/icons
import {
  ArrowBack,
  WhatsApp,
  Email,
  PhoneAndroid,
  Phone,
} from "@mui/icons-material";
//import {  CreaTablaBaseDatos} from "../../Utiles/apiBaseDatos";

// @mui/material
import { IconButton } from "@mui/material";

// utiles
import { isValid, getJpgFileSB } from "../../Utiles/Utiles";

// contexts
import { useNotification } from "../../context/NotificationProvider";

const Acercade = () => {
  const [contenidofoto, setContenidofoto] = useState();
  const { setOpen, setMessage } = useNotification();
  const parsedParams = {};
  const navigate = useNavigate();
  const url = `https://wa.me/52675359?text=`;

  async function init() {
    //let db = await CreaTablaBaseDatos();
    let resultado = await getJpgFileSB(
      "logo.jpg",
      "./galerias/app_images/destodo/",
      "destodo/",Date.now()
    );
    if (isValid(resultado) === true) {
      setContenidofoto(resultado);
    } else {
      setMessage("Error al recuperar la imagen del usuario");
      setOpen(true);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div  className="info-anuncios">
      <Navbar nivel={1} />
      <Encabezado clase={"encabezado"}/>
      <Hero clase={"hero-section-about"}>
        <div className="acercade">
          <div className="logo-acerca">
            <Link to="/">
              <Tippy content="Inicio">
                <img className="logo-acerca-img" src={contenidofoto} />
              </Tippy>
            </Link>
            <h3 className="about-1">Acerca de</h3>
          </div>
          <p>{sessionStorage.getItem("idapp")} Versión 1.0</p>
          <div className="texto-acercade">
            <p>
               DesTodo es tu plataforma 'todo en uno', donde puedes encontrar servicios y productos variados en
               Santiago de Cuba, incluye transporte, fotografía, ventas, fiestas, restaurantes, clubes, bares, discotecas y mucho más. 
               Conecta con los servicios y productos que necesitas de manera rápida y fácil.
            </p>
            <p>
               Tiene como misión facilitar la vida de las personas en Santiago de Cuba, 
               conectando a clientes y proveedores de servicios y productos de manera eficiente y confiable,
               fomentando el crecimiento de la economía local y la colaboración comunitaria.            
            </p>
          </div>
          <div className="acercade-flex-1">
             <p>Esta aplicación web fue desarrollada por</p>
             {sessionStorage.getItem("idapp")==="m2G-Software"?"m2G-Software":
             <a href="https://m2g-software-stgo.web.app" target='_blank' rel='noopener noreferrer' className='acercade-row'>
                <span>m2G-Software </span>
             </a>
             }
          </div>
          <div className="acercade-flex">
            <a href="tel:+5352675359" className="acercade-row">
              <PhoneAndroid />
              {/*<span> +(53)52675359 </span>*/}
            </a>
            <a href="tel:+5322657241" className="acercade-row">
              <Phone />
              {/*<span>+(53)22657241</span>*/}
            </a>
          {/*</div>
          <div className="acercade-flex">*/}
            <a href="mailto:cmr201966@gmail.com" className="acercade-row">
              <Email />
            </a>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="acercade-row ws-1"
            >
              <WhatsApp />
            </a>
          </div>

          <p> En Santiago de Cuba.</p>
          <p className="text-center">Todos los derechos reservados. 2024</p>
        </div>
      </Hero>
    </div>
  );
};

export default Acercade;
