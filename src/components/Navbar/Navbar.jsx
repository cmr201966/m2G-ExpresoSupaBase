import { Fragment } from "react";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";

// @mui components
import { Box, useTheme, IconButton } from "@mui/material";

// @mui/icons-material
//import CollectionsIcon from "@mui/icons-material/Collections";
//import Chat from "@mui/icons-material/Chat";
//import MoreHoriz from "@mui/icons-material/MoreHoriz";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import useOnclickOutside from "react-cool-onclickoutside";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';// styles
import "./styles.css";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useFilter } from "../../context/FilterProvider";
import { getJpgFile } from "../../servicios/imagenes";
import NavigationDrawer from "./Drawer";

const Navbar = (props) => {
  const theme = useTheme();
  const { filterState, setFilterState } = useFilter();
  const { links } = props;
  const { nivel } = props;
  const [showMenu, setShowMenu] = useState(false);

  const [contenidofoto, setContenidofoto] = useState();
  const [contenido_logo, setContenido_logo] = useState();
  const [inicia, setInicia] = useState(true);
  const [buscar, setBuscar] = useState("");
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

  const [menuPrimero] = useState([
    {
      label: "Ubicación",
      to: "/ubicacion",
      tooltips: "Donde recibira su producto ó servicio",
      img:1,
    },
  ]);
{/* depende=0->no depende de nada, 1->nivel, 2-> no autentificado*/} 
  const [menuSegundo] = useState([
    { label: "Inicio", to: "/", tooltips: "Ir a la página principal", depende: 1 },
    {
      label:
        sessionStorage.getItem("user") === null
          ? "Inicio sesión"
          : "Cerrar sesión",
      to: sessionStorage.getItem("user") === null ? "/login" : "/cerrarsesion",
      tooltips:
        sessionStorage.getItem("user") === null
          ? "Abrir sesión"
          : "Cerrar la sesión de " + sessionStorage.getItem("usernombre"),
          depende:0,
    },

    {
      label: "Registrarse",
      to: "/registrarse?inserta=true",
      tooltips: "Crear una cuenta de usuario",
      depende:2,
    },
    { label: "Categorias", to: "/categorias", tooltips: "Productos de una categoria", depende: 0 },
    {
      label: "Vender",
      to: "/administrar",
      tooltips: "Vender",
      depende: 0,
    },
  ]);

  const [menuTercero] = useState([
    { label: "Acerca de", to: "/acercade", tooltips: "Acerca de Destodo" },
  ]);

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

    let resultado = await getJpgFile({
      file: "./galerias/app_images/usuarios/" + foto + "/foto-1.jpg",
    });
    resultado = await resultado.text();
    if (resultado.length !== 0) {
      setContenidofoto(resultado);
    } else {
      //  no se pudo leer el contenido de la foto
    }
    // foto del logo

    let resultado_logo = await getJpgFile({
      file: "./galerias/app_images/destodo/logo.jpg",
    });
    resultado_logo = await resultado_logo.text();
    if (resultado_logo.length !== 0) {
      setContenido_logo(resultado_logo);
    } else {
      //  no se pudo leer el contenido de la foto
    }
    setInicia(false);
  }

  function toggleMenu(e) {
    {
      /*    const { target } = e;
    const { id } = target;
    console.log(id)
    if (id.indexOf("toggle") >= 0) setShowMenu(!showMenu);*/
    }
    console.log("Hola......", !showMenu);
    setShowMenu(!showMenu);
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
      case "buscar":
        setBuscar(e.target.value);
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


  return (
    <>
      <div className="navbar-row">
        <div className="logo">
          <Link className="link-logo" to="/acercade">
            <Tippy content="Acerca de M2G-Software">
              <img className="logo-img-one" src={contenido_logo} />
            </Tippy>
            DesTodo
          </Link>
          <div className="input-lupa">
            <input
              className="buscar-input"
              id="buscar"
              placeholder="Buscar productos, marcas y más..."
              value={buscar}
              onChange={handleInput}
              type="text"
              required
            />
            <IconButton
              className="lupa"
              id="lupa"
              color="primary"
              type="submit"
            >
              <SearchIcon />
            </IconButton>
          </div>
          {inicia === false ? (
            <div className="menuTercero">
              <IconButton
                sx={{ padding: 0 }}
                id="car"
                color="inherit"
                onClick={toggleMenu}
              >
                <ShoppingCartOutlinedIcon id="car" />
              </IconButton>

              <IconButton
                sx={{ padding: 0 }}
                id="toggle-b"
                color="inherit"
                onClick={toggleMenu}
              >
                <MenuIcon className="hamburguesa" id="toggle-i" />
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
                {menuPrimero.map((item, i) => (
                  <Fragment key={i}>
                    <Tippy content={item.tooltips}>
                      <Link className="place" key={item.label} to={item.to}>
                        {item.img===1?<PlaceOutlinedIcon sx={{fontSize:"28px"}}/>:""}
                        {item.label}
                      </Link>
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
                sx={{ display: { xs: "none", md: "flex"  }, gap: "20px" }}
                className="links"
              >
                {menuSegundo.map((item, i) => (
                  <Fragment key={i}>

                   {((item.depende === 1 && nivel === 0) || (item.depende === 2 &&  sessionStorage.getItem("user")!== null)) ? (
                      <></>
                    ) : (
                        <Tippy content={item.tooltips}>
                          <Link
                            className="menu-nav"
                            key={item.label}
                            to={item.to}
                          >
                            {item.label}
                          </Link>
                       </Tippy>
                    )
                    }
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
                <Tippy content={item.tooltips}>
                  <Link className="menu-nav" key={item.label} to={item.to}>
                    {item.label}
                  </Link>
                </Tippy>
              </Fragment>
            ))}
          </Box>
        </div>
      </div>
      <NavigationDrawer open={showMenu} onClose={() => setShowMenu(false)} />
    </>
  );
};

export default Navbar;
