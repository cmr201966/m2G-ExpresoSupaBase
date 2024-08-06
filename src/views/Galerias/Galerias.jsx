// components
import ComGalerias from "../../components/ComGalerias/ComGalerias";
import Navbar from "../../components/Navbar/Navbar";
// layouts
import Hero from "../../layouts/Hero/Hero";
// @mui/material
import { IconButton } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Galerias = () => {
  const location = useLocation();
  const parsedParams = {};
  const navigate = useNavigate();
  const [rutatmp, setRutatmp] = useState("");
  const [desctmp, setDesctmp] = useState("");
  const [inicia, setInicia] = useState(true);
  const [deQuien, setDeQuien] = useState(true);


  function init() {
    setRutatmp(parsedParams.rutatmp);
    setDeQuien(parsedParams.deQuien===undefined || parsedParams.deQuien===null?"":parsedParams.deQuien.replaceAll("%20"," "));
    let tmp=parsedParams.desctmp.replaceAll("%20", " ");
    tmp=tmp.replaceAll("%C3%B3", "ó");
    setDesctmp(tmp);
    setInicia(false);
  }

  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item, i) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location]);

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Navbar
        links={[
          { label: "Inicio", to: "/", tooltips: "Ir a la página principal" },
          {
            label:
              sessionStorage.getItem("user") === null
                ? "Iniciar sesión"
                : "Cerrar sesión",
            to:
              sessionStorage.getItem("user") === null
                ? "/login"
                : "/cerrarsesion",
            tooltips:
              sessionStorage.getItem("user") === null
                ? "Abrir sesión"
                : "/Cerrar la sesión de " +
                  sessionStorage.getItem("usernombre"),
          },
          {
            label: "Registrarse",
            to: "/registrarse?inserta=true",
            tooltips: "Crear una cuenta de usuario",
          },
          {
            label: "Acerca de",
            to: "/Acercade",
            tooltips: "Acerca de Destodo.cu",
          },
        ]}
      />
      <Hero>
        <div className="cabeza">
          {parsedParams.nivel === 0 ? (
            ""
          ) : (
            <IconButton
              color="primary"
              onClick={() => {
                navigate(
                  `/?naturaleza=${sessionStorage.getItem(
                    "naturaleza"
                  )}&owner=${sessionStorage.getItem(
                    "idowner"
                  )}&nivel=${sessionStorage.getItem("nivel")}`
                );
              }}
            >
              <ArrowBack />
            </IconButton>
          )}
          {inicia === false ? (
            <>
              <h3 className="h1-1-cabeza">Destodo.cu</h3>
              <h5 className="h3-1-cabeza-galerias">-Galerias-{desctmp}</h5>
            </>
          ) : (
            ""
          )}
        </div>
        {inicia === false ? (
          <ComGalerias
            deQuien={deQuien}
            rutatmp={rutatmp}
            perfil={
              sessionStorage.getItem("user") === null
                ? "invitado.jpg"
                : sessionStorage.getItem("user") + ".jpg"
            }
            permiso={true}
            botonCerrar={false}
          />
        ) : (
          ""
        )}
      </Hero>
    </div>
  );
};

export default Galerias;
