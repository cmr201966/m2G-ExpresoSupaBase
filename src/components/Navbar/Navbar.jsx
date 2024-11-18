/* eslint-disable react/prop-types */
import { Fragment, useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
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
import {
  isValid,
  borraSessionStorage,
  getJpgFileSB,
} from "../../Utiles/Utiles";

// services
import { getConfigCM } from "../../Utiles/apiBaseDatos";

// config
//import config from "../../config";

import { useNotification } from "../../context/NotificationProvider";

// styles
import "./styles.css";

const Navbar = (props) => {
  const [contenidofoto, setContenidofoto] = useState();
  const { nivel } = props;

  const location = useLocation();
  const { setOpen, setMessage } = useNotification();
  const [showMenu, setShowMenu] = useState(false);
  const [whereIs, setWhereIs] = useState("");

  const [inicia, setInicia] = useState(true);

  const [menuPrimero] = useState([]);
  {
    /* depende=0->no depende de nada, 1->nivel, 2-> no autentificado, 3-> superAdmin, 4-> dueño de negocio*/
  }
  const [menuSegundo] = useState([
    {
      label: "Inicio",
      to: "/",
      tooltips: "",
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
        isValid(sessionStorage.getItem("user")) === false ? "Abrir sesión" : "",
      depende: 0,
      login: 0,
      inserta: "",
      tipo: 0,
    },

    {
      label: "Registrarse",
      to: "/registrarse",
      tooltips: "Agregar un negocio",
      depende: 2,
      login: 0,
      inserta: "inserta=true&where=false",
      tipo: 0,
    },
    /*
    {
      label: "Categorias",
      to: "/categorias",
      tooltips: "Ir a los productos de una categoria",
      depende: 0,
      login: 0,
      inserta: "",
      tipo: 0,
    },
  */
    {
      label: "Publicar",
      to: "/catproductos",
      tooltips: "Publicar productos",
      depende: 4,
      login: 1,
      inserta: "",
      tipo: 0,
    },
    {
      label: "Anuncios",
      to: "/anuncios",
      tooltips: "Publicar anuncios",
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

  function toggleMenu() {
    setShowMenu(!showMenu);
  }

  function BuscarMovil() {
    setWhereIs("movil");
    setShowDialog(true);
  }

  function cierraDialogo() {
    setShowDialog(false);
    /*if (whereIs==="movil") navigate(`/productos?buscar=${buscar}&user=${sessionStorage.getItem("user")}&nombre=Filtro: '${buscar}'`);*/
    init;
  }

  const [showDialog, setShowDialog] = useState(false);

  const onModalClose = useCallback(() => cierraDialogo(), [setShowDialog]);

  async function init() {
    if (
      sessionStorage.getItem("deDonde") !== "infoProducto" &&
      sessionStorage.getItem("deDonde") !== "infoNegocio"
    ) {
      borraSessionStorage(["categoria", "login", "idproducto"]);
    }

    const config = await getConfigCM();
    //    const config = await apiBaseDatos("getConfig");

    if (!config?.length) setShowDialog(true);

    //    let resultado = await getJpgFileCM("logo.jpg", "./galerias/app_images/destodo", "destodo");
    let resultado = await getJpgFileSB(
      "logo.jpg",
      "./galerias/app_images/destodo",
      "destodo", false, "", "",""
    );
    if (isValid(resultado) === true) {
      setContenidofoto(resultado);
    } else {
      setMessage("Error al recuperar la imagen del negocio");
      setOpen(true);
    }

    //cambiaWhereIs("ubica");
    setInicia(false);
  }

  function goToUbica() {
    console.log("Aqui...");
    setWhereIs("Unica");
    setShowDialog(true);
  }

  useEffect(() => {
    init();
  }, [location]);

  return (
    <>
      <div className="navbar-row">
        <div className="navbar-main">
          <Link className="link-logo" to="/">
            <img className="logo-img-one" src={contenidofoto} />
            Expreso
          </Link>

          <SearchWrapper />

          {inicia === false ? (
            <div className="menuTercero">
              <div className="optional-buttons">
                {Number(sessionStorage.getItem("tipouser")) === 3 ? (
                  <Tippy content={"Categorias de negocios"}>
                    <Link to="/catcategorias?login=1&regreso=/catcategorias">
                      <IconButton sx={{ color: "aliceblue" }} id="categorias">
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
                    <Link to="/registrarse?inserta=false&where=false">
                      <IconButton sx={{ color: "aliceblue" }} id="user">
                        <Person id="user" />
                      </IconButton>
                    </Link>
                  </Tippy>
                ) : (
                  ""
                )}

                {Number(sessionStorage.getItem("tipouser")) === 3 ? (
                  <Tippy content={"Agregar un usuario"}>
                    <Link to="/registrarse?inserta=true&where=true">
                      <IconButton sx={{ color: "aliceblue" }} id="user">
                        <PersonAddAlt1 />
                      </IconButton>
                    </Link>
                  </Tippy>
                ) : (
                  ""
                )}
              </div>

              {/*<Link to="/productos">*/}
              <IconButton
                className="responsive-lupa"
                id="lupa"
                color="inherit"
                onClick={() => BuscarMovil()}
                /*                  type="submit"*/
              >
                <Search />
              </IconButton>
              {/*</Link>*/}

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
                <Tippy content={"Su ubicación actual"}>
                  <IconButton
                    sx={{ padding: 0 }}
                    color="inherit"
                    onClick={() => goToUbica()}
                  >
                    <PlaceOutlined
                      sx={{ color: "aliceblue", fontSize: "28px" }}
                    />
                    <span className="ubicacion">Ubicación</span>
                  </IconButton>
                </Tippy>
                <Location
                  open={showDialog}
                  onModalClose={onModalClose}
                  whereIs={whereIs}
                />
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
                    {item.tooltips !== "" ? (
                      <Tippy content={item.tooltips}>
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
                      </Tippy>
                    ) : (
                      <>
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
                      </>
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
        openLocation={() => goToUbica()}
      />
    </>
  );
};

export default Navbar;
