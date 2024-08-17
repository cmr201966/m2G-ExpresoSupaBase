import { Fragment } from "react"
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";

// @mui components
import { Box, Button, useTheme, Badge } from "@mui/material";

// @mui/icons-material
//import CollectionsIcon from "@mui/icons-material/Collections";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
//import Chat from "@mui/icons-material/Chat";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import useOnclickOutside from "react-cool-onclickoutside";

// styles
import "./styles.css";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useFilter } from "../../context/FilterProvider";
import { getJpgFile } from "../../servicios/imagenes";

const Navbar = (props) => {
  const theme = useTheme();
  const { filterState, setFilterState } = useFilter();
  const { links } = props;
  const { nivel } = props;
  const [showMenu, setShowMenu] = useState(false);

  const [contenidofoto, setContenidofoto] = useState();
  const [contenido_logo, setContenido_logo] = useState();
  const [inicia, setInicia] = useState(true);
  const filtro =
    sessionStorage.getItem("filtro_contrato") === null &&
      sessionStorage.getItem("filtro_productos") === null
      ? false
      : true;
  const tfiltro = "Filtrar " + sessionStorage.getItem("filtro");
  const mfiltro = sessionStorage.getItem("filtro") !== "";
//  const [rutatmp, setRutatmp] = useState("");
//  const [desctmp, setDesctmp] = useState("");
  const [setCbhowclient] = useState(false);
//  const [cbhowclient, setCbhowclient] = useState(false);
  const navigate = useNavigate();

  async function init() {
    let foto;
//    let folder;
    if (sessionStorage.getItem("user") === null) {
      foto = "invitado";
//      folder = "usuarios";
    } else {
      foto = sessionStorage.getItem("user");
//      folder = "usuarios";
    }
    // foto de perfil del usuario si ninguno entonces invitado.jpg


    let resultado = await getJpgFile({ file: "./galerias/app_images/usuarios/" + foto +  "/foto-1.jpg"});
    resultado = await resultado.text();
    if (resultado.length !== 0) {
      setContenidofoto(resultado);
    } else {
      //  no se pudo leer el contenido de la foto
    }
    // foto del logo

    let resultado_logo = await getJpgFile({ file: "./galerias/app_images/destodo/logo.jpg"});
    resultado_logo = await resultado_logo.text();
    if (resultado_logo.length !== 0) {
      setContenido_logo(resultado_logo);
    } else {
      //  no se pudo leer el contenido de la foto
    }
    setInicia(false);
  }

  function toggleMenu(e) {
    const { target } = e;
    const { id } = target;
    if (id.indexOf("toggle") >= 0) setShowMenu(!showMenu);
  }

  function destodo_chat() {
    navigate(`/chat`);
  }

  function galerias() {
    let rutatmp =
      sessionStorage.getItem("user") === null
        ? "usuarios/invitado"
        : `usuarios/${sessionStorage.getItem("user")}`;
    let desctmp =
      sessionStorage.getItem("user") === null
        ? "invitado"
        : `${sessionStorage.getItem("usernombre")}`;
    navigate(
      `/Galerias?naturaleza=58&nombre=Galerias&rutatmp=${rutatmp}&desctmp=${desctmp}`
    );
  }

  function handleInput(e) {
    switch (e.target.id) {
      case "howclient":
        setCbhowclient(e.target.checked);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    init();
  }, []);

  const ref = useOnclickOutside((e) => {
    setShowMenu(false);
  });

  const [mensajes, setMensajes] = useState(4);

  return (
    <div className="navbar-row">
      <div className="logo">
        <Link to="/acercade">
          <Tippy content="Acerca de M2G-Software">
            <img className="logo-img-one" src={contenido_logo} />
          </Tippy>
        </Link>
      </div>

      {inicia === false ? (
        <div className="flex justify-content-end">
          <Box sx={{ display: { xs: "none", md: "flex" } }} className="links">
            {links.map((item, i) =>
              <Fragment key={i}>
                {i === 0 ? (
                  <Tippy content={item.tooltips}>
                    <Link key={item.label} to="/">
                      {item.label}
                    </Link>
                  </Tippy>
                ) : i === 2 ? (
                  sessionStorage.getItem("user") === null ? (
                    <Tippy content={item.tooltips}>
                      <Link key={item.label} to={item.to}>
                        {item.label}
                      </Link>
                    </Tippy>
                  ) : (
                    <></>
                  )
                ) : (
                  <Tippy content={item.tooltips}>
                    <Link key={item.label} to={item.to}>
                      {item.label}
                    </Link>
                  </Tippy>
                )}
              </Fragment>
            )}
          </Box>
          {nivel!==0 && nivel!==null && nivel!==undefined?
          <Tippy content={tfiltro}>
            <div className="filter">
              <Button
                onClick={() => setFilterState({ type: "toggle" })}
                color={filtro ? (mfiltro ? "success" : "secondary") : "primary"}
                variant="contained"
                sx={{
                  minWidth: 0,
                  width: "44px",
                  height: "44px",
                  borderRadius: "100%",
                  padding: "5px",
                }}
              >
                <FilterAltIcon />
              </Button>
            </div>
          </Tippy>:""}

          <div className="user">
            <Link
              to={
                sessionStorage.getItem("user") === null
                  ? `/acercade?nivel=${nivel}`
                  : "/registrarse?inserta=false&nivel=0"
              }
            >
              <Tippy
                content={
                  sessionStorage.getItem("user") === null
                    ? "Invitado"
                    : sessionStorage.getItem("usernombre")
                }
              >
                <Box
                  sx={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "100%",
                    padding: "5px",
                  }}
                >
                  <img className="logo-img" src={contenidofoto} />
                </Box>
              </Tippy>
            </Link>
          </div>
          <Box ref={ref} sx={{ position: "relative" }}>
            {showMenu ? (
              <Box
                sx={{
                  position: "fixed",
                  zIndex: 99,
                  right: 0,
                  top: "90px",
                  background: theme.palette.primary.main,
                  height: "auto",
                  width: "auto",
                  padding: "10px",
                }}
              >
                {sessionStorage.getItem("user") === null ? (
                  <div className="menu-no-login">
                    <Tippy content="Iniciar sesión">
                      <button
                        className="button-no-login-1"
                        onClick={() => {
                          navigate("/login");
                        }}
                      >
                        Iniciar sesión
                      </button>
                    </Tippy>
                    <Tippy content="Crear una cuenta de usuario">
                      <button
                        className="button-no-login-1"
                        onClick={() => {
                          navigate("/registrarse?inserta=true");
                        }}
                      >
                        Registrarse
                      </button>
                    </Tippy>
                    {nivel !== 0 ? (
                      <Tippy content="Ir a la página principal">
                        <button
                          className="button-no-login-1"
                          onClick={() => {
                            navigate("/");
                          }}
                        >
                          Inicio
                        </button>
                      </Tippy>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
                {sessionStorage.getItem("tipouser") &&
                  Number(sessionStorage.getItem("tipouser")) === 0 ? (
                  <div className="menu-gratis">
                    <Tippy content="Ir a la página principal">
                      <button
                        className="button-no-login-1"
                        onClick={() => {
                          navigate("/");
                        }}
                      >
                        Inicio
                      </button>
                    </Tippy>
                    <Tippy content="Cerrar la sesión">
                      <button
                        className="button-no-login-1"
                        onClick={() => {
                          navigate("/cerrarsesion");
                        }}
                      >
                        Cerrar sesión
                      </button>
                    </Tippy>
                  </div>
                ) : (
                  ""
                )}

                {sessionStorage.getItem("tipouser") &&
                  Number(sessionStorage.getItem("tipouser")) !== 0 ? (
                  <div className="menu-duenos">
                    <Tippy content="Ir a la página principal">
                      <button
                        className="button-no-login-1"
                        onClick={() => {
                          navigate("/");
                        }}
                      >
                        Inicio
                      </button>
                    </Tippy>
                    <Tippy content="Administrar mis negocios">
                      <button
                        className="button-no-login-1"
                        onClick={() => {
                          navigate(
                            `/negocios?naturaleza=41&nombre=Negocios&condicion=&campo1=&owner=56&idowner=86&rutatmp=usuarios/${sessionStorage.getItem(
                              "user"
                            )}&desctmp=${sessionStorage.getItem(
                              "usernombre"
                            )}&nohay=&naturalezas=&nivel=2`
                          );
                        }}
                      >
                        Negocios
                      </button>
                    </Tippy>
                    <Tippy content="Administrar mis productos">
                      <button
                        className="button-no-login-1"
                        onClick={() => {
                          navigate(
                            `/catproductos?naturaleza=41&nombre=Negocios&condicion=&campo1=&owner=56&idowner=86&rutatmp=usuarios/${sessionStorage.getItem(
                              "user"
                            )}&desctmp=${sessionStorage.getItem(
                              "usernombre"
                            )}&nohay=&naturalezas=&nivel=2`
                          );
                        }}
                      >
                        Productos
                      </button>
                    </Tippy>
                    <Tippy content="Cerrar la sesión">
                      <button
                        className="button-no-login-1"
                        onClick={() => {
                          navigate("/cerrarsesion");
                        }}
                      >
                        Cerrar sesión
                      </button>
                    </Tippy>
                  </div>
                ) : (
                  ""
                )}
              </Box>
            ) : null}
            <Tippy content="">
              <div className="destodo-chat">
                <Button
                  id="toggle-b"
                  onClick={toggleMenu}
                  variant="contained"
                  sx={{
                    minWidth: 0,
                    width: "44px",
                    height: "44px",
                    borderRadius: "100%",
                    padding: "5px",
                  }}
                >
                  <MoreHoriz id="toggle-i" />
                </Button>
              </div>
            </Tippy>
          </Box>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Navbar;
