/* eslint-disable react/prop-types */
import { Fragment, useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Tippy from "@tippyjs/react";

// components
import NavigationDrawer from "./Drawer";
import Location from "./Location";
import SearchWrapper from "./SearchWrapper";

// @mui/material
import { Box, IconButton } from "@mui/material";
// @mui/icons
import {
  Menu,
  Search,
  Settings,
  Person,
  PlaceOutlined,
  PersonAddAlt1,
} from "@mui/icons-material";

// utils
import { isValid, borraSessionStorage } from "../../Utiles/Utiles";

// services
import { apiBaseDatos } from "../../Utiles/Utiles";

// config
import config from "../../config";

// styles
import "./styles.css";

const Navbar = (props) => {
  const { nivel } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const urlMYSQL = config.urlmysql;
  const urlSUPABASE = config.urlsupabase;
  const [showMenu, setShowMenu] = useState(false);

  const [inicia, setInicia] = useState(true);

  const [menuPrimero] = useState([]);
  {
    /* depende=0->no depende de nada, 1->nivel, 2-> no autentificado, 3-> superAdmin, 4-> dueño de negocio*/
  }
  const [menuSegundo] = useState([
    {
      label: "Inicio",
      to: "/",
      tooltips: "Ir a la página principal",
      depende: 1,
      login: 0,
      inserta: "",
      tipo: 0,
    },
    {
      label:
        isValid(sessionStorage.getItem("user")) === false
          ? "Inicio sesión"
          : "Cerrar sesión",
      to:
        isValid(sessionStorage.getItem("user")) === false
          ? "/login"
          : "/cerrarsesion",
      tooltips:
        isValid(sessionStorage.getItem("user")) === false
          ? "Abrir sesión"
          : "Cerrar la sesión de " + sessionStorage.getItem("usernombre"),
      depende: 0,
      login: 0,
      inserta: "",
      tipo: 0,
    },

    {
      label: "Registrarse",
      to: "/registrarse",
      tooltips: "Crear una cuenta de usuario",
      depende: 2,
      login: 0,
      inserta: "inserta=true&where=false",
      tipo: 0,
    },
    {
      label: "Vender",
      to: "/catproductos",
      tooltips: "Agregar, editar o eliminar productos",
      depende: 4,
      login: 1,
      inserta: "",
      tipo: 0,
    },
    {
      label: "Anuncios",
      to: "/aplicaciones",
      tooltips: "Agregar, editar o eliminar un anuncio",
      depende: 4,
      categoria: "",
      login: 1,
      inserta: "",
      tipo: 0,
    },
  ]);

  const [menuTercero] = useState([
    {
      label: "Acerca de",
      to: "/acercade",
      tooltips: "Acerca de Destodo",
      login: 0,
      inserta: "",
      tipo: 0,
    },
  ]);

  function updateUserInfo(e) {
    e.preventDefault();
    navigate(`/registrarse?inserta=false&where=false`);
  }

  function toggleMenu() {
    setShowMenu(!showMenu);
  }

  const [showDialog, setShowDialog] = useState(false);

  const onModalClose = useCallback(() => setShowDialog(false), [setShowDialog]);

  async function init() {
    borraSessionStorage(["categoria", "login", "idproducto"]);

    const config = await apiBaseDatos("getConfig");

    if (!config?.length) setShowDialog(true);

    setInicia(false);
  }

  useEffect(() => {
    init();
  }, [location]);

  return (
    <>
      <div className="navbar-row">
        <div className="navbar-main">
          <Link className="link-logo" to="/">
            <img
              className="logo-img-one"
              src={
                sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL"
                  ? urlMYSQL
                  : urlSUPABASE
              }
            />
            El Expreso
          </Link>

          <SearchWrapper />

          {inicia === false ? (
            <div className="menuTercero">
              {Number(sessionStorage.getItem("tipouser")) === 3 ? (
                <Tippy
                  content={"Agregar, editar y eliminar categorias de negocios"}
                >
                  <Link to="/catcategorias?login=1&regreso=/catcategorias">
                    <IconButton
                      sx={{ padding: 0 }}
                      id="categorias"
                      color="inherit"
                    >
                      <Settings />
                    </IconButton>
                  </Link>
                </Tippy>
              ) : (
                ""
              )}

              {isValid(sessionStorage.getItem("user")) ? (
                <Tippy
                  content={`Actualizar datos de ${sessionStorage.getItem(
                    "user"
                  )}`}
                >
                  <IconButton
                    sx={{ padding: 0 }}
                    id="user"
                    color="inherit"
                    onClick={updateUserInfo}
                  >
                    <Person id="user" />
                  </IconButton>
                </Tippy>
              ) : (
                ""
              )}
              {Number(sessionStorage.getItem("tipouser")) === 3 ? (
                <Tippy content={"Registrarse un usuario nuevo"}>
                  <Link to="/registrarse?inserta=true&where=true">
                    <IconButton sx={{ padding: 0 }} id="user" color="inherit">
                      <PersonAddAlt1 />
                    </IconButton>
                  </Link>
                </Tippy>
              ) : (
                ""
              )}
              <Link to="/productos">
                <IconButton
                  className="responsive-lupa"
                  id="lupa"
                  color="inherit"
                  type="submit"
                >
                  <Search />
                </IconButton>
              </Link>
              <IconButton
                sx={{ padding: 0 }}
                id="toggle-b"
                color="inherit"
                onClick={toggleMenu}
              >
                <Menu className="hamburguesa" id="toggle-i" />
              </IconButton>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="agrupa-menu">
          {inicia === false ? (
            <div className="menuPrimero">
              <Box
                sx={{ display: { xs: "none", md: "flex" } }}
                className="links"
              >
                <Tippy content={"Donde recibirá su producto ó servicio"}>
                  <IconButton
                    sx={{ padding: 0 }}
                    color="inherit"
                    onClick={() => setShowDialog(true)}
                  >
                    <PlaceOutlined
                      sx={{ color: "aliceblue", fontSize: "28px" }}
                    />
                    <span className="ubicacion">Ubicación</span>
                  </IconButton>
                </Tippy>
                <Location open={showDialog} onModalClose={onModalClose} />
                {menuPrimero.map((item, i) => (
                  <Fragment key={i}>
                    <Tippy content={item.tooltips}>
                      {item.tipo === 0 ? (
                        <Link className="place" key={item.label} to={item.to}>
                          {item.img === 1 ? (
                            <PlaceOutlined sx={{ fontSize: "28px" }} />
                          ) : (
                            ""
                          )}
                          {item.label}
                        </Link>
                      ) : (
                        <IconButton
                          sx={{ padding: 0 }}
                          id={i}
                          color="inherit"
                          onClick={() => item.funcion()}
                        >
                          {item.img === 1 ? (
                            <PlaceOutlined
                              sx={{ color: "aliceblue", fontSize: "28px" }}
                            />
                          ) : (
                            ""
                          )}
                          <span className="ubicacion">{item.label}</span>
                        </IconButton>
                      )}
                    </Tippy>
                  </Fragment>
                ))}
              </Box>
            </div>
          ) : (
            ""
          )}
          {inicia === false ? (
            <div className="menuSegundo">
              <Box
                sx={{ display: { xs: "none", md: "flex" }, gap: "20px" }}
                className="links"
              >
                {menuSegundo.map((item, i) => (
                  <Fragment key={i}>
                    {(item.depende === 1 && nivel === 0) ||
                    (item.depende === 2 &&
                      isValid(sessionStorage.getItem("user")) === true) ||
                    (item.depende === 4 &&
                      sessionStorage.getItem("tipouser") !== "1" &&
                      sessionStorage.getItem("tipouser") !== "2" &&
                      sessionStorage.getItem("tipouser") !== "3") ? (
                      ""
                    ) : (
                      <Link
                        className="menu-nav"
                        key={item.label}
                        to={
                          isValid(item.anuncio) === false
                            ? `${item.to}?categoria=0&login=${item.login}&regreso=${item.to}&${item.inserta}`
                            : `${item.to}?anuncio=${item.anuncio}&${item.inserta}
                            &categoria=0&login=${item.login}&regreso=${item.to}`
                        }
                      >
                        {item.label}
                      </Link>
                    )}
                  </Fragment>
                ))}
              </Box>
            </div>
          ) : (
            ""
          )}
          <Box sx={{ display: { xs: "none", md: "flex" } }} className="links">
            {menuTercero.map((item, i) => (
              <Fragment key={i}>
                <Link className="menu-nav" key={item.label} to={item.to}>
                  {item.label}
                </Link>
              </Fragment>
            ))}
          </Box>
        </div>
      </div>
      <NavigationDrawer
        nivel={nivel}
        open={showMenu}
        onClose={() => setShowMenu(false)}
        openLocation={() => setShowDialog(true)}
      />
    </>
  );
};

export default Navbar;
