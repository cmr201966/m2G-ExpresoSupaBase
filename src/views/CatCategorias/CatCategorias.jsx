import Tippy from "@tippyjs/react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../layouts/Hero/Hero";
import { useEffect, useState } from "react";
import Check from "@mui/icons-material/Check";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationProvider";
import Modal from "../../components/Modal/Modal";
import { useLocation } from "react-router-dom";
import { isValid, getJpgFileSB } from "../../Utiles/Utiles";
import {
  getCategoriasNegociosCM,
  setCategoriasNegociosCM,
  delCategoriaCM,
} from "../../Utiles/apiBaseDatos";
import { Box, CircularProgress } from "@mui/material";
import Encabezado from "../../components/Encabezado/Encabezado";
import "./styles.css";

const CatCategorias = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {};
  const { setOpen, setMessage } = useNotification();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [nick, setNick] = useState("");
  const [accion, setAccion] = useState("");
  const [desc, setDesc] = useState("");
  const [nickt, setNickt] = useState("");
  const [acciont, setAcciont] = useState("");
  const [desct, setDesct] = useState("");
  const [descold, setDescold] = useState("");
  const [inicia, setInicia] = useState(true);
  const [agregarsn, setAgregarsn] = useState(false);
  const [editarsn, setEditarsn] = useState(false);
  const [eliminarsn, setEliminarsn] = useState(false);
  const [categoria, setCategoria] = useState(0);
  const [arrayCategorias, setArrayCategorias] = useState([]);
  const arraynoCategorias = [
    { categorianegocio: 99999999, desc: "Desconocida", nick: "Desconocida" },
  ];
  const [isBase64ToBlob, setIsBase64ToBlob] = useState(true);
  // Estados para almacenar los datos del negocio activo
  const [contenido, setContenido] = useState("");
  const [nombrefoto, setNombrefoto] = useState("");
  const [contenidofoto, setContenidofoto] = useState();
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

    if (sessionStorage.getItem("tipouser") !== "3") {
      setMessage("No tiene derechos para manipular las categorias de negocios");
      setOpen(true);
      navigate(`/`);
      return;
    }
    let resultcategorias = await getCategoriasNegociosCM(true);
    console.log(resultcategorias);
    //    let resultcategorias = await apiBaseDatos("getCategoriasNegocios")
    if (
      isValid(resultcategorias) === false ||
      isValid(resultcategorias.length) === false ||
      resultcategorias.length === 0
    ) {
      setArrayCategorias(arraynoCategorias);
      setCategoria(
        buscaCategoria(arraynoCategorias, arraynoCategorias[0].categorianegocio)
      );
    } else {
      guardaDatosCategoria(resultcategorias, 0);
      setArrayCategorias(resultcategorias);
      setCategoria(
        buscaCategoria(resultcategorias, resultcategorias[0].categorianegocio)
      );

      setIsBase64ToBlob(true);
      let resultado = await getJpgFileSB(
        resultcategorias[0].categorianegocio + ".jpg",
        "./galerias/app_images/categorias_de_negocios/" +
          resultcategorias[0].categorianegocio,
        "categorias_de_negocios/" + resultcategorias[0].categorianegocio,
        resultcategorias[0].idsb
      );
      if (resultado !== undefined && resultado !== null) {
        setIsBase64ToBlob(true);
        setContenidofoto(resultado);
        setNombrefoto(resultcategorias[0].categorianegocio);
      } else {
        setIsBase64ToBlob(false);
        setNombrefoto("");
        setMessage("Error al recuperar la imagen del usuario");
        setOpen(true);
      }
    }
    setShow(false);
    setInicia(false);
  }

  function guardaDatosCategoria(data, i) {
    setNickt(data[i].nick);
    setAcciont(data[i].accion);
    setDesct(data[i].desc);
  }

  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location]);

  function buscaCategoria(data, categoria) {
    let j = 999999;
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].categorianegocio === categoria) {
        j = i;
      }
    }
    return j;
  }

  function recuperarDatosCategoria() {
    setDesc(desct);
    setDescold(desct);
    setNick(nickt);
    setAccion(acciont);
  }

  function tcancelar() {
    setCbvista(false);
    setAgregarsn(false);
    setEditarsn(false);
    setDesc("");
    setNick("");
    setAccion("");
  }

  function limpiardatosCategoria() {
    setDesc("");
    setAgregarsn(true);
    setEditarsn(false);
  }

  const onModalClose = () => {
    setShow(false);
  };

  function editar() {
    recuperarDatosCategoria();
    setEditarsn(true);
    setTimeout(() => {
      if (document.getElementById("nick"))
        document.getElementById("nick").focus();
    }, 50);
  }

  function agregar() {
    limpiardatosCategoria();
    setNombrefoto("");
    setAgregarsn(true);
    setTimeout(() => {
      if (document.getElementById("desc"))
        document.getElementById("desc").focus();
    }, 50);
  }
  const eliminar = () => {
    setEliminarsn(true);
    setContenido(
      "¿Está seguro que desea eliminar a " +
        arrayCategorias[categoria].desc +
        "?"
    );
    setShow(true);
  };

  async function confirmar() {
    setLoading(true);
    let err = await setCategoriasNegociosCM(
      arrayCategorias[categoria].categorianegocio,
      desc,
      descold,
      "productos",
      nick,
      accion,
      agregarsn,
      contenidofoto,
      isBase64ToBlob
    );
    //    let err= await apiBaseDatos("setCategoriasNegocios", arrayCategorias[categoria].categorianegocio, desc, descold, "productos", nick, accion,  agregarsn, contenidofoto, isBase64ToBlob );
    setLoading(false);
    if (isValid(err) === true && isValid(err.length) === true) {
      setMessage("Ocurrido un error al registrar la categoria");
      setOpen(true);
    } else {
      setMessage("La categoria se agrego correctamente.");
      setOpen(true);
    }
    init();
    //tcancelar();
  }

  async function handleInput(e) {
    let resultado;
    switch (e.target.id) {
      case "categorianegocio":
        setCategoria(e.target.value);
        guardaDatosCategoria(arrayCategorias, e.target.value);
        setCbvista(false);
        setIsBase64ToBlob(true);
        resultado = await getJpgFileSB(
          arrayCategorias[e.target.value].categorianegocio + ".jpg",
          "./galerias/app_images/categorias_de_negocios/" +
            arrayCategorias[e.target.value].categorianegocio,
          "categorias_de_negocios/" +
            arrayCategorias[e.target.value].categorianegocio,
          arrayCategorias[e.target.value].idsb
        );
        if (resultado !== undefined && resultado !== null) {
          setIsBase64ToBlob(true);
          setContenidofoto(resultado);
          setNombrefoto(arrayCategorias[e.target.value].categorianegocio);
        } else {
          setIsBase64ToBlob(false);
          setNombrefoto("");
          setMessage("Error al recuperar la imagen del usuario");
          setOpen(true);
        }
        break;
      case "nick":
        setNick(e.target.value);
        break;
      case "accion":
        setAccion(e.target.value);
        break;
      case "desc":
        setDesc(e.target.value);
        break;
      case "vista":
        setCbvista(e.target.checked);
        break;
      default:
        break;
    }
  }

  const onPhotoChange = (e) => {
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
    await delCategoriaCM(arrayCategorias[categoria].categorianegocio);
    //    await apiBaseDatos("delCategoria", arrayCategorias[categoria].categorianegocio);
    setMessage("Se eliminó la categoria " + arrayCategorias[categoria].desc);
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
            <div className="div-papa-categorias">
              <Encabezado />
              <div className="categorias">
                <p className="strong margen-catnegocio">
                  {" "}
                  Categorias de Negocios
                </p>
                <div className="container-categorias">
                  <div className="grip-categorias">
                    <div className="flex-categorias">
                      {agregarsn === true || editarsn === true ? (
                        <>
                          <div className="grupo-nick-accion">
                            <input
                              className="input-area-categorias"
                              id="nick"
                              placeholder="Nombre corto"
                              value={nick}
                              onChange={handleInput}
                              type="text"
                              required
                            />
                            <input
                              className="input-area-categorias"
                              id="accion"
                              placeholder="Acción"
                              value={accion}
                              onChange={handleInput}
                              type="text"
                              required
                            />
                          </div>
                          <input
                            className="input-area-categorias-desc"
                            id="desc"
                            placeholder="Descripción"
                            value={desc}
                            onChange={handleInput}
                            type="text"
                            required
                          />
                        </>
                      ) : (
                        ""
                      )}
                      {agregarsn === false && editarsn === false ? (
                        <div className="">
                          <select
                            className="select-categorias"
                            disabled={editarsn === true ? true : false}
                            id="categorianegocio"
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
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  {nombrefoto !== "" && cbvista ? (
                    <div className="img-class">
                      <img className="img-producto" src={contenidofoto} />
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="grupo-button-categorias">
                    {(agregarsn === true || editarsn === true) &&
                    nick !== "" &&
                    accion !== "" &&
                    nombrefoto !== "" &&
                    desc !== "" ? (
                      <Tippy content="Vista previa">
                        <button
                          type="button"
                          className="producto-button primary"
                          onClick={() => setCbvista(!cbvista)}
                        >
                          <VisibilityIcon />
                        </button>
                      </Tippy>
                    ) : (
                      ""
                    )}
                    {(agregarsn === true || editarsn === true) &&
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
                          <AddPhotoAlternateIcon />
                        </Tippy>
                      </label>
                    ) : (
                      ""
                    )}
                    {agregarsn === false && editarsn === false ? (
                      <Tippy content="Añadir Producto">
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
                        arrayCategorias[categoria].desc !== "Desconocida" ? (
                          <Tippy content="Clic para editar el producto">
                            <button
                              type="button"
                              className="producto-button primary"
                              disabled={
                                arrayCategorias[categoria].desc ===
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
                        arrayCategorias[categoria].desc !== "Desconocida" ? (
                          <Tippy content="Clic para eliminar el producto">
                            <button
                              type="button"
                              className="producto-button primary"
                              disabled={
                                arrayCategorias[categoria].desc ===
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
                    desc?.length !== 0 ? (
                      <Tippy
                        content={
                          desc.length !== 0
                            ? "Registrar el producto"
                            : "Complete los datos necesarios"
                        }
                      >
                        <button
                          type="button"
                          className="producto-button primary"
                          onClick={desc.length !== 0 ? confirmar : ""}
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
                      <Tippy content="Cancelar, agregar ó editar producto">
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

export default CatCategorias;
