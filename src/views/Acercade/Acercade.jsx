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
            <h3 className="about-1">Habon</h3>
          </div>
          {/*<p>{sessionStorage.getItem("idapp")}Amor a tu piel</p>*/}
          <div className="texto-acercade">
            <p>
                Hace unos meses, en la Ciudad de México, nació nuestro emprendimiento con un propósito sencillo pero profundo:
                transformar lo cotidiano en algo especial. Descubrimos que el cuidado personal puede ser más que una rutina;
                puede ser un momento de conexión, frescura y bienestar.

                Cada jabón artesanal que elaboramos es único, hecho a mano con dedicación, paciencia y amor. Usamos ingredientes naturales,
                cuidamos cada detalle y buscamos que cada pieza no solo limpie, sino que también nutra tu piel y despierte tus sentidos.
            </p>
            <p>
                Somos un equipo joven que, desde hace 4 meses, trabaja para ofrecerte productos auténticos y diferentes a lo convencional.
                Nuestros jabones son ideales para consentirte todos los días o para regalar un detalle especial lleno de aroma, suavidad y naturaleza.

                En pocas palabras: jabones hechos a mano, con ingredientes naturales y con un propósito claro… regalarte pequeños instantes de frescura y bienestar.

                ✨ Amor a tu piel ✨
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
          <p className="text-center">Todos los derechos reservados. 2025</p>
        </div>
      </Hero>
    </div>
  );
};

export default Acercade;
