import { Fragment } from "react";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";

import { Box, IconButton } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
//import useOnclickOutside from "react-cool-onclickoutside";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';// styles
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getJpgFile } from "../../servicios/imagenes";
import NavigationDrawer from "./Drawer";
import "./styles.css";

const Navbar = (props) => {
  const navigate = useNavigate();
  const { nivel } = props;
  const foto1=      "http://localhost:3001/app_images/destodo/dtlogo.jpg";
  const [showMenu, setShowMenu] = useState(false);

  const [inicia, setInicia] = useState(true);
  const [buscar, setBuscar] = useState("");
  const [menuPrimero] = useState([
    {
      label: "Ubicación",
      to: "/ubicacion",
      tooltips: "Donde recibira su producto ó servicio",
      img:1, anuncio: null
    },
  ]);
{/* depende=0->no depende de nada, 1->nivel, 2-> no autentificado*/} 
  const [menuSegundo] = useState([
    { label: "Inicio", to: "/", tooltips: "Ir a la página principal", depende: 1 },
    {
      label:
        sessionStorage.getItem("user") === null || sessionStorage.getItem("user") === 'null'? "Inicio sesión": "Cerrar sesión",
      to: sessionStorage.getItem("user") === null || sessionStorage.getItem("user") === 'null' ? "/login" : "/cerrarsesion",
      tooltips:
        sessionStorage.getItem("user") === null || sessionStorage.getItem("user") === 'null'? "Abrir sesión": "Cerrar la sesión de " + sessionStorage.getItem("usernombre"), depende:0
    },

    {
      label: "Registrarse",
      to: "/registrarse?inserta=true",
      tooltips: "Crear una cuenta de usuario",
      depende:2
    },
    { label: "Categorias", to: "/categorias", tooltips: "Productos de una categoria", depende: 0 },
    {
      label: "Vender",
      to: "/catproductos",
      tooltips: "Vender un producto",
      depende: 0
    },
    {
      label: "Anuncios",
      to: "/aplicaciones",
      tooltips: "Anunciar un negocio",
      depende: 0,
      categoria: ""
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
    //  setContenidofoto(resultado);
    } else {
      //  no se pudo leer el contenido de la foto
    }
    // foto del logo

    setInicia(false);
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
  function buscaProductos(e){
    e.preventDefault()
    navigate(`/productos?buscar=${buscar}&user=${sessionStorage.getItem("user")}&nombre=Filtro: '${buscar}'`);
  }

  useEffect(() => {
    init();
  }, []);

/*
  const ref = useOnclickOutside((e) => {
    setShowMenu(false);
  });
*/
  return (
    <>
      <div className="navbar-row">
        <div className="logo">
          <Link className="link-logo" to="/acercade">
            <Tippy content="Acerca de M2G-Expreso">
              <img className="logo-img-one" src={foto1} />
{/*}              <img className="logo-img-one" src={contenido_logo} />*/}
            </Tippy>
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
    //          required
            />
            <IconButton
              className="lupa"
              id="lupa"
              color="primary"
              type="submit"
            >
              <SearchIcon />
            </IconButton>
            </form>
          </div>          
          {inicia === false ? (          
            <div className="menuTercero">
              <Link className="tools-color" to="/whatsapp" >
              <Tippy content={`Ejecutar pedidos del cliente`}>
                <IconButton
                  sx={{ padding: 0 }}
                  id="tool"
                  color="inherit"
                >
                <ManageAccountsIcon />
                </IconButton>
                </Tippy>
              </Link>

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
                            to={item.anuncio===undefined?`${item.to}?categoria=0`:`${item.to}?anuncio=${item.anuncio}&categoria=0`}
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
