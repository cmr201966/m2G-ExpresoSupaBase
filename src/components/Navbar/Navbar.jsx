/* eslint-disable react/prop-types */
import { Fragment, useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";

// components
import NavigationDrawer from "./Drawer";
import SearchWrapper from "./SearchWrapper";
import { ShoppingCart } from "@mui/icons-material";
import LanguageIcon from "@mui/icons-material/Language";
import GroupsIcon from "@mui/icons-material/Groups";

// @mui/material
import { Box, IconButton } from "@mui/material";
// @mui/icons
import {
  Menu,
  Search,
  Settings,
  Person,
  PersonAddAlt1,
  Logout,
} from "@mui/icons-material";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";

// utils
import {
  isValid,
  borraSessionStorage,
  getJpgFileSB,
} from "../../Utiles/Utiles";

// services
import { getConfigCM } from "../../Utiles/apiBaseDatos";

// context
import { useNotification } from "../../context/NotificationProvider";

// styles
import "./styles.css";

const Navbar = (props) => {
  const [contenidofoto, setContenidofoto] = useState();
  const { nivel } = props;

  const location = useLocation();
  const navigate = useNavigate();
  const { setOpen, setMessage } = useNotification();
  const [showMenu, setShowMenu] = useState(false);
  const [whereIs, setWhereIs] = useState("");
  const [inicia, setInicia] = useState(true);

  // Estado de usuario
  const [user, setUser] = useState(sessionStorage.getItem("user"));
  const [tipouser, setTipouser] = useState(
    Number(sessionStorage.getItem("tipouser"))
  );

  // Menús
  const [menuPrimero] = useState([]);
  const [menuSegundo] = useState([
    { label: "Inicio", to: "/", tooltips: "" },
    { label: "Inicio sesión", to: "/login", tooltips: "Abrir sesión" },
    { label: "Registrarse", to: "/registrarse", tooltips: "Agregar un negocio" },
    {
      label: "Ir a categoria",
      to: "/categorias",
      tooltips: "Ir a los productos de una categoria",
    },
    { label: "Publicar", to: "/catproductos", tooltips: "Publicar productos" },
    { label: "Anuncios", to: "/anuncios", tooltips: "Publicar anuncios" },
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
  }

  const [showDialog, setShowDialog] = useState(false);
  const onModalClose = useCallback(() => cierraDialogo(), [setShowDialog]);

  async function init() {
    setInicia(true);

    if (
      sessionStorage.getItem("deDonde") !== "infoProducto" &&
      sessionStorage.getItem("deDonde") !== "infoNegocio"
    ) {
      borraSessionStorage(["categoria", "login", "idproducto"]);
    }

    const config = await getConfigCM();
    sessionStorage.setItem("idapp", config[0].idapp);

    if (!config?.length) setShowDialog(true);

    let resultado = await getJpgFileSB(
      "logo.jpg",
      "./galerias/app_images/destodo",
      "destodo",
      Date.now()
    );

    if (isValid(resultado) === true) {
      setContenidofoto(resultado);
    } else {
      setMessage("Error al recuperar la imagen de " + config[0].idapp);
      setOpen(true);
    }

    setInicia(false);

    // Actualizamos estado usuario
    setUser(sessionStorage.getItem("user"));
    setTipouser(Number(sessionStorage.getItem("tipouser")));
  }

  function goToUbica() {
    setWhereIs("Unica");
    setShowDialog(true);
  }

  useEffect(() => {
    init();
  }, [location]);

  // 🔹 Manejo del logout con recarga completa
  const handleLogout = () => {
    sessionStorage.clear();   // limpiar sessionStorage
    window.location.reload(); // 🔹 Recarga toda la app como si fuese F5
  };

  return (
    <>
      {inicia === false ? (
        <>
          {/* 🔹 Navbar fijo */}
          <div className="navbar-row">
            <div className="navbar-main">
              <Link className="link-logo" to="/">
                <img className="logo-img-one" src={contenidofoto} />
                {sessionStorage.getItem("idapp")}
              </Link>

              <SearchWrapper />

              <div className="menuTercero">
                <div className="optional-buttons">
                  {/* ⚙️ Solo admin */}
                  {tipouser === 3 && (
                    <Tippy content={"Categorias de negocios"}>
                      <Link to="/catcategorias?login=1&regreso=/catcategorias">
                        <IconButton sx={{ color: "aliceblue" }} id="categorias">
                          <Settings />
                        </IconButton>
                      </Link>
                    </Tippy>
                  )}

                  {/* 👤 Usuario logueado */}
                  {isValid(user) && (
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
                  )}

                  {/* 🔑 Login */}
                  {!isValid(user) && (
                    <Tippy content="Iniciar sesión">
                      <IconButton
                        sx={{ padding: 0, color: "aliceblue" }}
                        id="login"
                        onClick={() => navigate("/login")}
                      >
                        <Person />
                      </IconButton>
                    </Tippy>
                  )}

                  {/* 🆕 Registrarse */}
                  {!isValid(user) && (
                    <Tippy content="Registrarse">
                      <IconButton
                        sx={{ padding: 0, color: "aliceblue", ml: 1 }}
                        id="registrarse"
                        onClick={() => navigate("/registrarse")}
                      >
                        <PersonAddAlt1 />
                      </IconButton>
                    </Tippy>
                  )}

                  {/* 👥 Solo admin */}
                  {tipouser === 3 && (
                    <>
                      <Tippy content={"Agregar un usuario"}>
                        <Link to="/registrarse?inserta=true&where=true">
                          <IconButton sx={{ color: "aliceblue" }} id="user">
                            <PersonAddAlt1 />
                          </IconButton>
                        </Link>
                      </Tippy>
                      <Tippy content={"Editar un usuario"}>
                        <Link to="/registrarse?inserta=false&where=true">
                          <IconButton sx={{ color: "aliceblue" }} id="user">
                            <ManageAccountsOutlinedIcon />
                          </IconButton>
                        </Link>
                      </Tippy>
                    </>
                  )}
                </div>

                {/* 🔎 Lupa móvil */}
                <IconButton
                  className="responsive-lupa"
                  id="lupa"
                  color="inherit"
                  onClick={() => BuscarMovil()}
                >
                  <Search />
                </IconButton>

                {/* Idioma */}
                <Tippy content={"Idioma"}>
                  <IconButton
                    sx={{ padding: 0 }}
                    id="idioma"
                    color="inherit"
                    onClick={() => console.log("Cambiar idioma")}
                  >
                    <LanguageIcon className="icono-idioma" />
                  </IconButton>
                </Tippy>

                {/* 🛒 Carrito */}
                <Tippy content={"Comprar"}>
                  <IconButton
                    sx={{ padding: 0 }}
                    id="carrito"
                    color="inherit"
                    onClick={() => console.log("Ir al carrito")}
                  >
                    <ShoppingCart className="icono-carrito" />
                  </IconButton>
                </Tippy>

                {/* 🚪 Logout */}
                {isValid(user) && (
                  <Tippy content="Cerrar sesión">
                    <IconButton
                      sx={{ padding: 0, color: "aliceblue" }}
                      id="logout"
                      onClick={handleLogout}
                    >
                      <Logout />
                    </IconButton>
                  </Tippy>
                )}

                {/* Nosotros */}
                <Tippy content={"Nosotros"}>
                  <IconButton
                    sx={{ padding: 0 }}
                    id="nosotros"
                    color="inherit"
                    onClick={() => navigate("/acercade")}
                  >
                    <GroupsIcon className="icono-nosotros" />
                  </IconButton>
                </Tippy>

                {/* 🍔 Menú hamburguesa */}
                <IconButton
                  sx={{ padding: 0 }}
                  id="toggle-b"
                  color="inherit"
                  onClick={toggleMenu}
                >
                  <Menu className="hamburguesa" id="toggle-i" />
                </IconButton>
              </div>
            </div>

            <div className="agrupa-menu">
              {tipouser === 3 && (
                <>
                  <div className="menuPrimero">
                    <Box
                      sx={{ display: { xs: "none", md: "flex" } }}
                      className="links"
                    >
                      {menuPrimero.map((item, i) => (
                        <Fragment key={i}>
                          <Tippy content={item.tooltips}>
                            <Link className="place" key={item.label} to={item.to}>
                              {item.label}
                            </Link>
                          </Tippy>
                        </Fragment>
                      ))}
                    </Box>
                  </div>

                  <div className="menuSegundo">
                    <Box
                      sx={{ display: { xs: "none", md: "flex" }, gap: "20px" }}
                      className="links"
                    >
                      {menuSegundo.map((item, i) => (
                        <Fragment key={i}>
                          <Link className="menu-nav" key={item.label} to={item.to}>
                            {item.label}
                          </Link>
                        </Fragment>
                      ))}
                    </Box>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 🔹 Este div empuja el contenido hacia abajo */}
          <div className="navbar-spacer"></div>

          <NavigationDrawer
            nivel={nivel}
            open={showMenu}
            onClose={() => setShowMenu(false)}
            openLocation={() => goToUbica()}
          />
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default Navbar;
