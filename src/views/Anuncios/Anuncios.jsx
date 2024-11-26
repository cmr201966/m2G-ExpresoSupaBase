import Tippy from "@tippyjs/react";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// @mui/material

import { Box, CircularProgress } from "@mui/material";

// @mui/icons
import {
  Check,
  Add,
  Delete,
  Close,
  Edit,
  AddPhotoAlternate,
  Visibility,
} from "@mui/icons-material";

// contexts
import { useNotification } from "../../context/NotificationProvider";

// components
import Modal from "../../components/Modal/Modal";
import Navbar from "../../components/Navbar/Navbar";
import Encabezado from "../../components/Encabezado/Encabezado";

// layouts
import Hero from "../../layouts/Hero/Hero";

// styles
import "./styles.css";

// utils
import { isValid, buscarEnArreglo, getJpgFileSB } from "../../Utiles/Utiles";
import {
  getAplicacionesCM,
  getCategoriasNegociosCM,
  setAplicacionesCM,
  delAnuncioCM,
} from "../../Utiles/apiBaseDatos";

const Aplicaciones = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {};
  const [loading, setLoading] = useState(false);
  const [imagen, setImagen] = useState(false);
  const [show, setShow] = useState(false);
  const { setOpen, setMessage } = useNotification();
  const [nick, setNick] = useState("");
  const [desc, setDesc] = useState("");
  const [ttip, setTtip] = useState("");
  const [arrayCategorias, setArrayCategorias] = useState([]);
  const arraynoCategorias = [{ categorianegocio: 8, desc: "Desconocida" }];
  const [categoria, setCategoria] = useState("");
  const [inicia, setInicia] = useState(true);
  const [agregarsn, setAgregarsn] = useState(false);
  const [editarsn, setEditarsn] = useState(false);
  const [eliminarsn, setEliminarsn] = useState(false);
  const [aplicacion, setAplicacion] = useState(0);
  const [arrayAplicaciones, setArrayAplicaciones] = useState([]);
  const arraynoaplicaciones = [{ id: 0, idapp: "Desconocida", desc: "Desconocida" }];
  const [isBase64ToBlob, setIsBase64ToBlob] = useState(true);
  // Estados para almacenar los datos del negocio activo
  const [nickt, setNickt] = useState("");
  const [desct, setDesct] = useState("");
  const [ttipt, setTtipt] = useState("");
  const [contenido, setContenido] = useState("");
  const [nombrefoto, setNombrefoto] = useState("");
  const [contenidofoto, setContenidofoto] = useState("");
  const [cbvista, setCbvista] = useState(false);
  const [foto] = useState();

  async function init() {
    for (let prop in parsedParams) {
      sessionStorage.setItem(prop, parsedParams[prop]);
    }

    if (
      (sessionStorage.getItem("login") === 1 ||
        sessionStorage.getItem("login") === "1") &&
      isValid(sessionStorage.getItem("user")) === false
    ) {
      navigate(`/login?login=1&regreso=${sessionStorage.getItem("regreso")}`);
      return;
    }
    if (
      sessionStorage.getItem("tipouser") !== "3"
    ) {
      setMessage("No tiene derechos para crear, editar o eliminar Anuncios");
      setOpen(true);
      navigate(`/`);
      return;
    }
    let result = await getAplicacionesCM(true);
    //      let result = await apiBaseDatos("getAplicaciones");
    if ((isValid(result) === true && result.err) || isValid(result) === false || result.length===0) {
      setArrayAplicaciones(arraynoaplicaciones);
      setAplicacion(
        buscarEnArreglo(arraynoaplicaciones, arraynoaplicaciones[0].id, "id")
      );
    } else {
      guardaDatosAplicacion(result, 0);
      setAplicacion(buscarEnArreglo(result, result[0].id, "id"));
    }
    let resultcategorias = await getCategoriasNegociosCM(true);
    //      let resultcategorias= await apiBaseDatos("getCategoriasNegocios");
    if (resultcategorias.length === 0) {
      setArrayCategorias(arraynoCategorias);
      setCategoria(
        buscarEnArreglo(
          arraynoCategorias,
          arraynoCategorias[0].categorianegocio,
          "categorianegocio"
        )
      );
    } else {
      setArrayCategorias(resultcategorias);
      setIsBase64ToBlob(false);
      setNombrefoto("");
      if (result.length > 0) {
        setCategoria(buscarEnArreglo(resultcategorias, result[buscarEnArreglo(result, result[0].id, "id")].idcategoria, "categorianegocio"));
        setIsBase64ToBlob(true);
        let resultado = await getJpgFileSB(
          result[0].id + ".jpg",
          "./galerias/app_images/aplicaciones/" + result[0].id,
          "aplicaciones/" + result[0].id, imagen, "tablaanuncios", "id", result[0].id
        );
        //           let resultado = await getJpgFileSB(result[0].id + ".jpg", "./galerias/app_images/aplicaciones/" + result[0].id, "aplicaciones/" + result[0].id);
        if (isValid(resultado) === true) {
          setIsBase64ToBlob(true);
          setContenidofoto(resultado);
          setNombrefoto(result[0].id);
        } else {
          setMessage("Error al recuperar la imagen del usuario");
          setOpen(true);
        }
      }
      else{
        setCategoria(0);
      }
    }

    setShow(false);
    setInicia(false);
  } // init

  function guardaDatosAplicacion(data, i) {
    setArrayAplicaciones(data);
    recuperardatosproducto(data, i);
    setNick(data[i].idapp);
    setDesc(data[i].desc);
    setTtip(data[i].tooltip);
    setCategoria(
      buscarEnArreglo(arrayCategorias, data[i].idcategoria, "categorianegocio")
    );
    setAplicacion(i);
  }

  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location, parsedParams]);

  function recuperardatosproducto(data, i) {
    setNickt(data[i].idapp);
    setDesct(data[i].desc);
    setTtipt(data[i].tooltip);
  }

  function restaurardatosproductos() {
    setNick(nickt);
    setDesc(desct);
    setTtip(ttipt);
  }

  function tcancelar() {
    setAgregarsn(false);
    setEditarsn(false);
    setEliminarsn(false);
    setDesc("");
  }

  function limpiardatosaplicacion() {
    setNick("");
    setDesc("");
    setTtip("");
  }
  const onModalClose = () => {
    setShow(false);
  };

  function editar() {
    restaurardatosproductos();
    setEditarsn(true);
  }

  function agregar() {
    limpiardatosaplicacion();
    setAgregarsn(true);
  }

  const eliminar = () => {
    setEliminarsn(true);
    setContenido(
      "¿Está seguro que desea eliminar a " +
        arrayAplicaciones[aplicacion].desc +
        "?"
    );
    setShow(true);
  };

  async function confirmar() {
    console.log(arrayCategorias);
    console.log(categoria);
    setLoading(true);
    let result = await setAplicacionesCM(
      arrayAplicaciones[aplicacion].id,
      sessionStorage.getItem("user"),
      nick,
      desc,
      ttip,
      arrayCategorias[categoria].categorianegocio,
      agregarsn,
      contenidofoto,
      isBase64ToBlob,
    );
    //    let result= await apiBaseDatos("setAplicaciones", arrayAplicaciones[aplicacion].id, sessionStorage.getItem("user"), nick, desc,
    //                                    ttip, arrayCategorias[categoria].categorianegocio, agregarsn, contenidofoto, isBase64ToBlob);

    if (isValid(result) === true) {
      setLoading(false);
      setMessage("Ocurrio un error al registrar el anuncio");
      setOpen(true);
    } else {
      setLoading(false);
      setMessage(
        agregarsn === true
          ? "El anuncio se agrego correctamente."
          : "El anuncio se edito correctamente."
      );
      setOpen(true);
      limpiardatosaplicacion;
    }
  }

  async function handleInput(e) {
    let resultado = {};
    switch (e.target.id) {
      case "nick":
        setNick(e.target.value);
        break;
      case "idapp":
        setAplicacion(e.target.value);
        recuperardatosproducto(arrayAplicaciones, e.target.value);
        setCategoria(
          buscarEnArreglo(
            arrayCategorias,
            arrayAplicaciones[e.target.value].idcategoria,
            "categorianegocio"
          )
        );

        resultado = await getJpgFileSB(
          arrayAplicaciones[e.target.value].id + ".jpg",
          "./galerias/app_images/aplicaciones/" +
            arrayAplicaciones[e.target.value].id,
          "aplicaciones/" + arrayAplicaciones[e.target.value].id, arrayAplicaciones[e.target.value].imagen
        );
        if (isValid(resultado) === true) {
          setIsBase64ToBlob(true);
          setContenidofoto(resultado);
          setNombrefoto(arrayAplicaciones[e.target.value].id);
        } else {
          setNombrefoto("");
          setMessage("Error al recuperar la imagen del usuario");
          setOpen(true);
        }
        break;
      case "desc":
        setDesc(e.target.value);
        break;
      case "ttip":
        setTtip(e.target.value);
        break;
      case "categoria":
        setCategoria(e.target.value);
        break;
      case "vista":
        setCbvista(e.target.checked);
        break;
      default:
        break;
    }
  }

  const onPhotoChange = (e) => {
    setImagen(true);
    const file = e.target.files[0];
    setNombrefoto(e.target.value);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setContenidofoto(content);
      setIsBase64ToBlob(false);
    };
    reader.readAsDataURL(file);
    setCbvista(true);
  };

  async function sino() {
    await delAnuncioCM(arrayAplicaciones[aplicacion].id);
    //    await apiBaseDatos("delAnuncio", arrayAplicaciones[aplicacion].id);
    setMessage("Se eliminó el anuncio " + arrayAplicaciones[aplicacion].desc);
    setOpen(true);
    setShow(false);
    setEliminarsn(false);
    init;
  }
  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Modal
        visible={show}
        onClose={onModalClose}
        className="cmodal wmodal"
        classContainer="modal-catalogo-productos"
      >
        <div className="cerrar-button">
          <button className="cerrar" onClick={onModalClose}>
            X
          </button>
        </div>
        <div className="main-modal">
          <label>{contenido}</label>
          {eliminarsn ? (
            <>
              <button className="si" onClick={sino}>
                Si
              </button>
              <button className="no" onClick={onModalClose}>
                No
              </button>
            </>
          ) : (
            ""
          )}
        </div>
      </Modal>

      <div>
        <Navbar nivel={1} />
        <Hero>
          {inicia === true ? (
            <Box
              sx={{
                width: "100%",
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress color="checkbox" />
            </Box>
          ) : (
            ""
          )}

          {inicia === false ? (
            <div className="div-papa-aplicaciones">
              <Encabezado />
              <div className="aplicaciones">
                <h3 className="strong">Publicar anuncio</h3>
                <div className="container-aplicaciones">
                  <div className="form-main">
                    <div className="app-flex">
                      <div className="form-control">
                        <label>Anuncio:</label>
                        {agregarsn === true ? (
                          <input
                            className="app-input-area"
                            id="nick"
                            value={nick}
                            placeholder="Nombre corto"
                            onChange={handleInput}
                            type="text"
                            required
                          />
                        ) : (
                          ""
                        )}
                        {(agregarsn === false && editarsn === false) ||
                        editarsn === true ? (
                          <select
                            className="app-select-naturaleza"
                            disabled={editarsn === true ? true : false}
                            id="idapp"
                            onChange={handleInput}
                            value={aplicacion}
                          >
                            {arrayAplicaciones.map((item, i) => {
                              return (
                                <option key={i} value={i}>
                                  {item.idapp}
                                </option>
                              );
                            })}
                          </select>
                        ) : (
                          ""
                        )}
                      </div>

                      {inicia === false && (agregarsn || editarsn) ? (
                        <>
                          <div className="form-control">
                            <label>Descripcion</label>
                            <input
                              className="app-input-area"
                              id="desc"
                              value={desc}
                              placeholder="Descripción"
                              onChange={handleInput}
                              type="text"
                              required
                            />
                          </div>
                          <div className="form-control">
                            <label>Categoria </label>
                            <select
                              className="app-select-naturaleza"
                              id="categoria"
                              onChange={handleInput}
                              value={categoria}
                            >
                              {arrayCategorias.map((item, i) => {
                                return (
                                  <option key={i} value={i}>
                                    {item.nick}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                    {nombrefoto !== "" && cbvista ? (
                      <img className="img-producto" src={contenidofoto} />
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="grupo-button-app">
                    {(agregarsn === true || editarsn === true) &&
                    nombrefoto !== "" &&
                    nick !== "" &&
                    desc !== "" ? (
                      <Tippy content="Vista previa">
                        <button
                          type="button"
                          className="producto-button primary"
                          onClick={() => setCbvista(!cbvista)}
                        >
                          <Visibility />
                        </button>
                      </Tippy>
                    ) : (
                      ""
                    )}
                    {(agregarsn === true || editarsn === true) &&
                    nick !== "" &&
                    desc !== "" ? (
                      <label className="producto-button primary label-photo">
                        <input
                          id="foto"
                          value={foto}
                          onChange={onPhotoChange}
                          type="file"
                          required
                          multiple
                        />
                        <Tippy content="Añadir foto">
                          <AddPhotoAlternate />
                        </Tippy>
                      </label>
                    ) : (
                      ""
                    )}
                    {agregarsn === false && editarsn === false ? (
                      <Tippy content="Añadir Anuncio">
                        <button
                          type="button"
                          className="producto-button primary"
                          onClick={agregar}
                        >
                          <Add />
                        </button>
                      </Tippy>
                    ) : (
                      ""
                    )}
                    {inicia === false ? (
                      <>
                        {agregarsn === false &&
                        editarsn === false &&
                        arrayAplicaciones[aplicacion].desc !== "Desconocida" ? (
                          <Tippy content="Clic para editar el anuncio">
                            <button
                              type="button"
                              className="producto-button primary"
                              disabled={
                                arrayAplicaciones[aplicacion].desc ===
                                "Desconocida"
                              }
                              onClick={editar}
                            >
                              <Edit />
                            </button>
                          </Tippy>
                        ) : (
                          ""
                        )}

                        {agregarsn === false &&
                        editarsn === false &&
                        arrayAplicaciones[aplicacion].desc !== "Desconocida" ? (
                          <Tippy content="Clic para eliminar el anuncio">
                            <button
                              type="button"
                              className="producto-button primary"
                              disabled={
                                arrayAplicaciones[aplicacion].desc ===
                                "Desconocida"
                              }
                              onClick={eliminar}
                            >
                              <Delete />
                            </button>
                          </Tippy>
                        ) : (
                          ""
                        )}
                      </>
                    ) : (
                      ""
                    )}
                    {inicia === false &&
                    (agregarsn || editarsn) &&
                    nick?.length !== 0 &&
                    desc?.length !== 0 ? (
                      <Tippy
                        content={
                          nick.length !== 0 && desc.length !== 0
                            ? "Registrar el anuncio"
                            : "Complete los datos necesarios"
                        }
                      >
                        <button
                          type="button"
                          className="producto-button primary"
                          onClick={
                            nick.length !== 0 && desc.length !== 0
                              ? confirmar
                              : ""
                          }
                        >
                          {loading ? (
                            <CircularProgress color="inherit" size={16} />
                          ) : (
                            <Check />
                          )}
                        </button>
                      </Tippy>
                    ) : (
                      ""
                    )}

                    {inicia === false && (agregarsn || editarsn) ? (
                      <Tippy content={`Cancelar ${agregarsn===true?'agregar':'editar'} anuncio`}>
                        <button
                          type="button"
                          className="producto-button primary"
                          onClick={tcancelar}
                        >
                          <Close />
                        </button>
                      </Tippy>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </Hero>
      </div>
    </>
  );
};

export default Aplicaciones;
