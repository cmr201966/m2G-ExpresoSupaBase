import { Fragment } from "react";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";

import { Box, IconButton } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
//import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';// styles
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//import { getJpgFile } from "../../servicios/imagenes";
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
      img: 1,
      anuncio: null,
      tipo: 1,
      funcion: props.showModal
    },
  ]);
{/* depende=0->no depende de nada, 1->nivel, 2-> no autentificado*/} 
  const [menuSegundo] = useState([
    { label: "Inicio", to: "/", tooltips: "Ir a la página principal", depende: 1, login: 0, tipo: 0 },
    {
      label:
        sessionStorage.getItem("user") === null || sessionStorage.getItem("user") === 'null'? "Inicio sesión": "Cerrar sesión",
      to: sessionStorage.getItem("user") === null || sessionStorage.getItem("user") === 'null' ? "/login" : "/cerrarsesion",
      tooltips:
        sessionStorage.getItem("user") === null || sessionStorage.getItem("user") === 'null'? "Abrir sesión": "Cerrar la sesión de " + sessionStorage.getItem("usernombre"), depende:0, login: 0, tipo:0
    },

    {
      label: "Registrarse",
      to: "/registrarse",
      tooltips: "Crear una cuenta de usuario",
      depende: 2, 
      login: 0,
      inserta: "inserta=true",
      tipo:0
    },
    { label: "Categorias", to: "/categorias", tooltips: "Productos de una categoria", depende: 0, login: 0, tipo:0 },
    {
      label: "Vender",
      to: "/catproductos",
      tooltips: "Vender un producto",
      depende: 0, login: 1, tipo:0
    },
    {
      label: "Anuncios",
      to: "/aplicaciones",
      tooltips: "Anunciar un negocio",
      depende: 0,
      categoria: "",
      login: 1,
      tipo:0
    },
  ]);

  const [menuTercero] = useState([
    { label: "Acerca de", to: "/acercade", tooltips: "Acerca de Destodo", login: 0, tipo:0 },
  ]);

  async function init() {
    sessionStorage.removeItem("categoria");
    sessionStorage.removeItem("login");
    sessionStorage.removeItem("idproducto");

    setInicia(false);
  }

  function updateUserInfo(e){
    e.preventDefault()
    navigate(`/registrarse?inserta=false`);

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

  function validState(state){
    if (state==null || state==='null' || state===undefined || state==='undefined')  return false
    else return true;
  }

  function categorias(){
    navigate(`/catcategorias?`);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div className="navbar-row">
        <div className="logo">
          <Link className="link-logo" to="/acercade">
            <Tippy content="Acerca de M2G-Expreso">
              <img className="logo-img-one" src={foto1} />
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
               <Tippy content={"Agregar, editar y eliminar categorias"}>
                  <IconButton
                     sx={{ padding: 0 }}
                     id="categorias"
                     color="inherit"
                     onClick={categorias}
                   >
                     <SettingsIcon />
                   </IconButton>
               </Tippy>

              <Link className="tools-color" to="/whatsapp?login=1&regreso=/whatsapp" >
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

             {validState(sessionStorage.getItem("user"))?
              <Tippy content={`Actualizar datos de ${sessionStorage.getItem("user")}`}>
                 <IconButton
                   sx={{ padding: 0 }}
                   id="user"
                   color="inherit"
                   onClick={updateUserInfo}
                 >
                 <PersonIcon id="user" />
                 </IconButton>
              </Tippy>:""

              }
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
                      {item.tipo===0?
                      <Link className="place" key={item.label} to={item.to}>
                        {item.img===1?<PlaceOutlinedIcon sx={{fontSize:"28px"}}/>:""}
                        {item.label}
                      </Link>:
                      <IconButton
                         sx={{ padding: 0 }}
                         id={i}
                         color="inherit"
                         onClick={()=>{item.funcion()}}>
                         {item.img===1?<PlaceOutlinedIcon sx={{color: "aliceblue", fontSize:"28px"}}/>:""}
                         <span className="ubicacion">{item.label}</span>
                      </IconButton>
                    }
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
                {((item.depende === 1 && nivel === 0) || (item.depende === 2 && sessionStorage.getItem("user")!== null)) ? (
                      ""
                    ) : (
                        <Tippy content={item.tooltips}>
                          <Link
                            className="menu-nav"
                            key={item.label}
                            to={item.anuncio===undefined?`${item.to}?categoria=0&login=${item.login}&regreso=${item.to}&${item.inserta}`:`${item.to}?anuncio=${item.anuncio}&${item.inserta}
                            &categoria=0&login=${item.login}&regreso=${item.to}`}>
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
