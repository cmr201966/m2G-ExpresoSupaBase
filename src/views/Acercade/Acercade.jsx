import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";

// components
import Navbar from "../../components/Navbar/Navbar";

// layouts
import Hero from "../../layouts/Hero/Hero";

// styles
import "./styles.css";

// @mui/icons
import {
  ArrowBack,
  ContactPhone,
  WhatsApp,
  AlternateEmail,
  SettingsCell,
  Email,
  PhoneAndroid,
  Phone,
} from "@mui/icons-material";
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
    let resultado = await getJpgFileSB(
      "logo.jpg",
      "./galerias/app_images/destodo/",
      "destodo/",
      false,
      "",
      "",
      ""
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
    <div>
      <Navbar nivel={1} />
      <Hero>
        <div className="encabezado">
          {parsedParams.nivel === 0 ? (
            ""
          ) : (
            <IconButton
              color="primary"
              onClick={() => {
                navigate(`/?nivel=${sessionStorage.getItem("nivel")}`);
              }}
            >
              <ArrowBack className="color-flecha" />
            </IconButton>
          )}
        </div>
        <div className="acercade">
          {console.log(sessionStorage.getItem("idapp"))}
          <div className="logo-acerca">
            <Link to="/">
              <Tippy content="Inicio">
                <img className="logo-acerca-img" src={contenidofoto} />
              </Tippy>
            </Link>
            <h3>Acerca de</h3>
          </div>
          <p>{sessionStorage.getItem("idapp")} Versión 1.0</p>
          <p>Desarrollado por m2G-Software.</p>
          <div className="acercade-flex">
            <div className="acercade-row">
              <PhoneAndroid />
              <span> +(53)52675359 </span>
            </div>
            <a href="tel:+5322657241" className="acercade-row">
              <Phone />
              <span>+(53)22657241</span>
            </a>
          </div>
          <div className="acercade-flex">
            <a href="mailto:cmr201966@gmail.com" className="acercade-row">
              <Email />
            </a>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="acercade-row"
            >
              <WhatsApp />
            </a>
          </div>

          <p>Santiago de Cuba.</p>
          <p className="text-center">Todos los derechos reservados. 2024</p>
        </div>
      </Hero>
    </div>
  );
};

export default Acercade;
