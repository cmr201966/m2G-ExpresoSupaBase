import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Tippy from "@tippyjs/react";

// components
import NavigationDrawer from "./Drawer";

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

// config
import config from "../../config";

// styles
import "./styles.css";
import Location from "./Location";

const Navbar = (props) => {
  const { nivel } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const urlMYSQL = config.urlmysql;
  const urlSUPABASE = config.urlsupabase;
  const [showMenu, setShowMenu] = useState(false);

  const [inicia, setInicia] = useState(true);
  const [buscar, setBuscar] = useState("");

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

  async function init() {
    borraSessionStorage(["categoria", "login", "idproducto"]);
    setInicia(false);
  }

  function updateUserInfo(e) {
    e.preventDefault();
    navigate(`/registrarse?inserta=false&where=false`);
  }
  function toggleMenu() {
    setShowMenu(!showMenu);
  }

  function handleInput(e) {
    switch (e.target.id) {
      case "buscar":
        setBuscar(e.target.value);
        break;
      default:
        break;
    }
  }

  function buscaProductos(e) {
    e.preventDefault();
    navigate(
      `/productos?buscar=${buscar}&user=${sessionStorage.getItem(
        "user"
      )}&nombre=Filtro: '${buscar}'`
    );
  }

  useEffect(() => {
    init();
  }, [location]);

  return (
    <>
      <div className="navbar-row">
        <div className="logo">
          <Link className="link-logo" to="/acercade">
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

          <div className="input-lupa">
            <form onSubmit={buscaProductos}>
              <input
                className="buscar-input"
                id="buscar"
                placeholder="Buscar productos, marcas y más..."
                value={buscar}
                onChange={handleInput}
                type="text"
              />
              <IconButton
                className="lupa"
                id="lupa"
                color="primary"
                type="submit"
              >
                <Search />
              </IconButton>
            </form>
          </div>

          {inicia === false ? (
            <div className="menuTercero">
              {Number(sessionStorage.getItem("tipouser")) === 3 ? (
                <Tippy
                  content={"Agregar, editar y eliminar categorias de negocios"}
                >
                  <IconButton
                    sx={{ padding: 0 }}
                    id="categorias"
                    color="inherit"
                    onClick={categorias}
                  >
                    <Settings />
                  </IconButton>
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
                  <IconButton
                    sx={{ padding: 0 }}
                    id="user"
                    color="inherit"
                    onClick={registrarseWhere}
                  >
                    <PersonAddAlt1 />
                  </IconButton>
                </Tippy>
              ) : (
                ""
              )}

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
                <Location />
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
      />
    </>
  );
};

export default Navbar;
