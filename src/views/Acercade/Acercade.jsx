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
          <div className="logo-acerca">
            <Link to="/">
              <Tippy content="Inicio">
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
              <SettingsCell />
            </button>
            <span> +(53)52675359 </span>
            <button
              type="button"
              disabled
              className="producto-button email-acercade"
            >
              <ContactPhone />
            </button>
            <span> +(53)22657241 </span>
          </div>
          <div className="acercade-flex">
            <button
              type="button"
              disabled
              className="producto-button email-acercade"
            >
              <AlternateEmail />
            </button>
            <p>cmr201966@gmail.com </p>
          </div>
          <div className="ws-acercade">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <WhatsApp className="ws-acercade-1" />
            </a>
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
