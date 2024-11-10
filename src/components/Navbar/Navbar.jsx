import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Tippy from "@tippyjs/react";

// components
import NavigationDrawer from "./Drawer";
import Modal from "../../components/Modal/Modal";

// @mui/material
import { Box, IconButton } from "@mui/material";
// @mui/icons
import {
  Check,
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
  apiBaseDatos,
  borraSessionStorage,
} from "../../Utiles/Utiles";

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

  const [show1, setShow1] = useState(false);
  const [arrayprovincias, setArrayprovincias] = useState([]);
  const [arraymunicipios, setArraymunicipios] = useState([]);
  const [provincia, setProvincia] = useState(0);
  const [municipio, setMunicipio] = useState(0);
  const [tmunicipios, setTmunicipios] = useState([]);
  const arraydesconocido = [
    { provincia: 99, municipio: 99, desc: "Desconocido" },
  ];

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
      funcion: poneModal,
    },
  ]);
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
    let resultprovincia;
    let resultmunicipio;
    let ttmunicipios = [];
    resultprovincia = await apiBaseDatos("provincias");
    if (isValid(resultprovincia) === false)
      setArrayprovincias(arraydesconocido);
    else {
      setArrayprovincias(resultprovincia);
      resultmunicipio = await apiBaseDatos("municipios");
      if (isValid(resultmunicipio) === false) {
        setArraymunicipios(arraydesconocido);
        setTmunicipios(arraydesconocido);
        ttmunicipios = arraydesconocido;
      } else if (resultmunicipio.length !== 0)
        setArraymunicipios(resultmunicipio);
    }
    let resultconfig = await apiBaseDatos("getConfig");
    if (
      resultconfig.length === undefined ||
      resultconfig.length === null ||
      resultconfig.length === 0
    ) {
      setProvincia(14);
      setMunicipio(6);
      ttmunicipios = resultmunicipio.filter((item) => {
        if (item.provincia === 14) {
          return item;
        }
      });
      if (ttmunicipios.length !== 0) {
        setTmunicipios(ttmunicipios);
      } else setTmunicipios(arraydesconocido);
      setShow1(true);
    } else {
      if (resultconfig[0].provincia != 0) {
        setProvincia(resultconfig[0].provincia);
        setMunicipio(resultconfig[0].municipio);
        sessionStorage.setItem(
          "ubicacion-provincia",
          resultconfig[0].provincia
        );
        sessionStorage.setItem(
          "ubicacion-municipio",
          resultconfig[0].municipio
        );
        ttmunicipios = resultmunicipio.filter((item) => {
          if (item.provincia === resultconfig[0].provincia) {
            return item;
          }
        });
        if (ttmunicipios.length !== 0) {
          setTmunicipios(ttmunicipios);
        } else setTmunicipios(arraydesconocido);
      }
    }
    setInicia(false);
  }

  function poneModal() {
    setShow1(!show1);
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

  function categorias() {
    navigate("/catcategorias?login=1&regreso=/catcategorias");
  }

  const onModalClose = () => {
    if (sessionStorage.getItem("ubicacion-provincia") !== null) {
      setShow1(false);
    }
  };

  async function handleselect(e) {
    let ttmunicipio = [];
    switch (e.target.id) {
      case "provincia":
        setProvincia(Number(e.target.value));
        ttmunicipio = arraymunicipios.filter((item) => {
          if (item.provincia === Number(e.target.value)) {
            return item;
          }
        });
        if (ttmunicipio.length === 0) {
          setTmunicipios(arraydesconocido);
        } else setTmunicipios(ttmunicipio);
        setMunicipio(0);
        break;
      case "municipio":
        setMunicipio(Number(e.target.value));
        break;
    }
  }

  async function confirmar() {
    await apiBaseDatos("setConfig", provincia, municipio);
    setShow1(false);
  }

  function registrarseWhere() {
    navigate("/registrarse?inserta=true&where=true");
  }

  useEffect(() => {
    init();
  }, [location]);

  return (
    <>
      <Modal
        visible={show1}
        onClose={onModalClose}
        className="cmodal-home"
        classContainer="modal-catprod"
      >
        <div className="main-modal">
          <p className="strong font-size1">Ubicación</p>
          <div className="modal-provincia">
            <label>Provincia:</label>
            <select
              className="select-home-prov-munic"
              id="provincia"
              onChange={handleselect}
              value={provincia}
            >
              {arrayprovincias.map((item, i) => {
                return (
                  <option key={i} value={item.provincia}>
                    {item.desc}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="modal-municipio">
            <label>Municipio:</label>
            <select
              className="select-home-prov-munic"
              id="municipio"
              onChange={handleselect}
              value={municipio}
            >
              {tmunicipios.map((item, i) => {
                return (
                  <option key={i} value={item.municipio}>
                    {item.desc}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="grupo-button-modal-home">
            <button
              type="button"
              className="producto-button primary "
              onClick={confirmar}
            >
              <Check />
            </button>
          </div>
        </div>
      </Modal>

      <div className="navbar-row">
        <div className="logo">
          <Link className="link-logo" to="/acercade">
            <Tippy content="Acerca de M2G-Expreso">
              <img
                className="logo-img-one"
                src={
                  sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL"
                    ? urlMYSQL
                    : urlSUPABASE
                }
              />
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
                      <Tippy content={item.tooltips}>
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
                      </Tippy>
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
      <NavigationDrawer
        nivel={nivel}
        open={showMenu}
        onClose={() => setShowMenu(false)}
      />
    </>
  );
};

export default Navbar;
