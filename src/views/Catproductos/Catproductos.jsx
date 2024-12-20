import Tippy from "@tippyjs/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// @mui/icons
import {
  PlaceOutlined,
  Collections,
  Check,
  Add,
  Delete,
  Close,
  Edit,
  AddPhotoAlternate,
  Visibility,
} from "@mui/icons-material";
// @mui/material
import {
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  Checkbox,
} from "@mui/material";

// utils
import {
  isValid,
  buscarEnArreglo,
  buscarEnArregloString,
  getJpgFileSB,
} from "../../Utiles/Utiles";
import {
  getcategoriasnegociosappCM,
  getUsuariosCM,
  getproductoscategoriaCM,
  delProductoCM,
  setProductoCM,
} from "../../Utiles/apiBaseDatos";

// contexts
import { useNotification } from "../../context/NotificationProvider";

// layouts
import Hero from "../../layouts/Hero/Hero";

// components
import Map from "../../components/Map/MapBox";
import Modal from "../../components/Modal/Modal";
import Navbar from "../../components/Navbar/Navbar";
import ComGalerias from "../../components/ComGalerias/ComGalerias";
import Encabezado from "../../components/Encabezado/Encabezado";

// styles
import "./styles.css";

const CatProductos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {};
  const { setOpen, setMessage } = useNotification();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [showGalerias, setShowGalerias] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [contenidofoto, setContenidofoto] = useState();
  const [contenido, setContenido] = useState("");
  const [arraytnegocios, setArraytnegocios] = useState([]);
  const [arrayUsuarios, setArrayUsuarios] = useState([]);
  const arrayNoUsuarios = [{ iduser: 99999999, desc: "Desconocido" }];
  const [arrayproductos, setArrayproductos] = useState([]);
  const arraynoproductos = [
    {
      idproducto: 99999999,
      marca: 999999,
      desc: "Desconocido",
      nick: "Desconocido",
    },
  ];
  const arraynonegocios = [{ categorianegocio: 999999, desc: "Desconocido" }];
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [talla, setTalla] = useState("");
  const [color, setColor] = useState("");
  const [latt, setLatt] = useState(0);
  const [lngt, setLngt] = useState(0);
  const [foto] = useState();
  const [usuario, setUsuario] = useState("");
  const [usuariot, setUsuariot] = useState("");
  const [nombrefoto, setNombrefoto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nombrecorto, setNombrecorto] = useState("");
  const [precio, setPrecio] = useState("");
  const [distanciaMax, setDistanciaMax] = useState(0);
  const [cbsCiudad, setCbsCiudad] = useState(0);
  const [producto, setProducto] = useState(null);
  const [tnegocio, setTnegocio] = useState(0);
  const [informativo, setInformativo] = useState(false);
  const [informativot, setInformativot] = useState(false);
  const [cbvista, setCbvista] = useState(false);
  const [domicilio, setDomicilio] = useState(false);
  const [cbgps, setCbgps] = useState(false);
  const [nombrecortofoto] = useState("");
  const [inicia, setInicia] = useState(true);
  const [agregarsn, setAgregarsn] = useState(false);
  const [editarsn, setEditarsn] = useState(false);
  const [eliminarsn, setEliminarsn] = useState(false);
  const [zoom] = useState(15.5);
  const [lng, setLng] = useState(-75.829090519);
  const [lat, setLat] = useState(20.0217583);
  const [ocupado, setOcupado] = useState(true);
  const [isBase64ToBlob, setIsBase64ToBlob] = useState(true);
  //Estados para recuperar los datos del producto
  const [nombrecortot, setNombrecortot] = useState("");
  const [descripciont, setDescripciont] = useState("");
  const [preciot, setPreciot] = useState("");
  const [domiciliot, setDomiciliot] = useState("");
  const [ocupadot, setOcupadot] = useState(true);
  const [gpst, setGpst] = useState(false);
  const [tcbsCiudad, setTcbsCiudad] = useState(false);
  const [tdistanciaMax, setTdistanciaMax] = useState(false);
  const [marcat, setMarcat] = useState("");
  const [modelot, setModelot] = useState("");
  const [tallat, setTallat] = useState("");
  const [colort, setColort] = useState("");
  const [idsb, setIdsb] = useState("");
  const [nophoto, setNophoto] = useState("");

  async function init() {
    setShow(true);
    tcancelar();
    for (let prop in parsedParams)
      sessionStorage.setItem(prop, parsedParams[prop]);
    if (
      (sessionStorage.getItem("login") === 1 ||
        sessionStorage.getItem("login") === "1") &&
      isValid(sessionStorage.getItem("user")) === false
    ) {
      navigate(`/login?login=1&regreso=${sessionStorage.getItem("regreso")}`);
      return;
    }
    if (
      sessionStorage.getItem("tipouser") !== "1" &&
      sessionStorage.getItem("tipouser") !== "2" &&
      sessionStorage.getItem("tipouser") !== "3"
    ) {
      setMessage("No tiene derechos para crear, editar o eliminar productos");
      setOpen(true);
      navigate(`/`);
      return;
    }
    let ttarraytnegocios;
    let resulttnegocios = await getcategoriasnegociosappCM(true);
    //    let resulttnegocios = await apiBaseDatos("getcategoriasnegociosapp");
    if (resulttnegocios.length === 0) {
      setArraytnegocios(arraynonegocios);
      ttarraytnegocios = arraynonegocios;
    } else {
      setArraytnegocios(resulttnegocios);
      ttarraytnegocios = resulttnegocios;
    }
    let posicion = buscarEnArreglo(
      ttarraytnegocios,
      parsedParams.categoria,
      "categorianegocio"
    );
    posicion = posicion === -1 ? 0 : posicion;
    setTnegocio(posicion);
    let resultusuarios = await getUsuariosCM(true);
    //    let resultusuarios = await apiBaseDatos("getUsuarios");
    if (isValid(resultusuarios) === false) setArrayUsuarios(arrayNoUsuarios);
    else {
      setArrayUsuarios(resultusuarios);
    }
    setUsuario(0);
    let resultproductos = await getproductoscategoriaCM(
      sessionStorage.getItem("user"),
      sessionStorage.getItem("tipouser"),
      ttarraytnegocios[posicion].categorianegocio,
      producto
    );
    //let resultproductos = await apiBaseDatos("getproductoscategoria", sessionStorage.getItem("user"), sessionStorage.getItem("tipouser"), ttarraytnegocios[posicion].categorianegocio, producto);
    if (resultproductos.length === 0) {
      setProducto({ label: arraynoproductos[0].desc, value: 0 });
      setArrayproductos(arraynoproductos);
      recuperardatosproducto(arraynoproductos, 0);
    } else {
      const posicionProducto = buscarEnArreglo(
        resultproductos,
        resultproductos[0].idproducto,
        "idproducto"
      );
      setArrayproductos(resultproductos);
      setProducto({ label: resultproductos[0].desc, value: 0 });

      if (isValid(resultproductos[0].idproducto) === true) {
        recuperardatosproducto(resultproductos, 0);
        restaurardatosproductosNew(
          resultproductos,
          posicionProducto,
          resultusuarios
        );
        //setEditarsn(true);
      }
      setIsBase64ToBlob(true);
      setIdsb(resultproductos[0].idsb);
      setNophoto(resultproductos[0].nophoto);
      let resultado = await getJpgFileSB(
        resultproductos[0].idproducto + ".jpg",
        "./galerias/app_images/productos/" + resultproductos[0].idproducto,
        "productos/" + resultproductos[0].idproducto,
        resultproductos[0].idsb
      );
      if (
        isValid(resultado) === true &&
        resultado !== "" &&
        isValid(resultado.length) === true
      ) {
        setIsBase64ToBlob(true);
        setContenidofoto(resultado);
        setNombrefoto(resultproductos[0].idproducto);
      } else {
        setIsBase64ToBlob(false);
        setNombrefoto("");
        setMessage("Error al recuperar la imagen del usuario");
        setOpen(true);
      }
    }
    setInicia(false);
    setShow(false);
  }

  const handleProducto = async (_, value) => {
    setProducto(value);
    if (isValid(value) === false) {
      return;
    }
    recuperardatosproducto(
      arrayproductos,
      isValid(value) === false ? 0 : value.value
    );
    setIsBase64ToBlob(true);
    setIdsb(arrayproductos[value?.value].idsb);
    setNophoto(arrayproductos[value?.value].nophoto);
    let resultado = await getJpgFileSB(
      arrayproductos[value?.value].idproducto + ".jpg",
      "./galerias/app_images/productos/" +
        arrayproductos[value?.value].idproducto,
      "productos/" + arrayproductos[value?.value].idproducto,
      arrayproductos[value?.value].idsb
    );
    if (resultado.length !== 0) {
      setContenidofoto(resultado);
      setNombrefoto(arrayproductos[value?.value].idproducto);
    } else {
      setIsBase64ToBlob(false);
      setNombrefoto("");
    }
  };

  async function getProductos(value) {
    let resultproductos = await getproductoscategoriaCM(
      sessionStorage.getItem("user"),
      sessionStorage.getItem("tipouser"),
      arraytnegocios[value].categorianegocio
    );
    //    let resultproductos = await apiBaseDatos("getproductoscategoria",
    //                                              sessionStorage.getItem("user"),
    //                                              sessionStorage.getItem("tipouser"),
    //                                              arraytnegocios[value].categorianegocio);
    setProducto(null);
    if (isValid(resultproductos) === false || resultproductos.length === 0) {
      setArrayproductos(arraynoproductos);
      recuperardatosproducto(arraynoproductos, 0);
    } else {
      setArrayproductos(resultproductos);
      setNombrefoto(resultproductos[0].idproducto);
      recuperardatosproducto(resultproductos, 0);
      setIdsb(resultproductos[0].idsb);
      setNophoto(resultproductos[0].nophoto);
      let resultado = await getJpgFileSB(
        resultproductos[0].idproducto + ".jpg",
        "./galerias/app_images/productos/" + resultproductos[0].idproducto,
        "productos/" + resultproductos[0].idproducto,
        resultproductos[0].idsb
      );
      if (isValid(resultado) === true) {
        setIsBase64ToBlob(true);
        setContenidofoto(resultado);
        setNombrefoto(resultproductos[0].idproducto);
      } else {
        setIsBase64ToBlob(false);
        setNombrefoto("");
      }
    }
  }
  function handleselect(e) {
    switch (e.target.id) {
      case "tnegocio":
        setTnegocio(e.target.value);
        getProductos(e.target.value);
        break;
      case "usuario":
        setUsuario(e.target.value);
        break;
    }
  }

  const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };

  const lngLatSelected = (point, lngLat) => {
    setLng(lngLat.lng);
    setLat(lngLat.lat);
  };

  function handleInput(e) {
    switch (e.target.id) {
      case "informativo":
        setInformativo(e.target.checked)
        break;
      case "usuario":
        setUsuario(e.target.value);
        break;
      case "nombrecorto":
        setNombrecorto(e.target.value);
        break;
      case "descripcion":
        setDescripcion(e.target.value);
        break;
      case "precio":
        setPrecio(e.target.value);
        break;
      case "marca":
        setMarca(e.target.value);
        break;
      case "modelo":
        setModelo(e.target.value);
        break;
      case "talla":
        setTalla(e.target.value);
        break;
      case "color":
        setColor(e.target.value);
        break;
      case "distanciaMax":
        setDistanciaMax(e.target.value);
        break;
      case "cbsCiudad":
        setCbsCiudad(e.target.checked);
        break;
      case "cbgps":
        setCbgps(e.target.checked);
        break;
      case "domicilio":
        setDomicilio(e.target.checked);
        if (e.target.checked === true) setCbgps(true);
        break;
      case "ocupado":
        setOcupado(e.target.checked);
        break;
      case "vista":
        setCbvista(e.target.checked);
        break;
      default:
        break;
    }
  }
  function iniciadatosgenerales() {
    setMarca("");
    setModelo("");
    setTalla("");
    setColor("");
    setNombrefoto("");
    setNombrecorto("");
    setDescripcion("");
    setPrecio("");
    setCbgps(true);
  }

  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location]);

  function recuperardatosproducto(data, i) {
    let index = buscarEnArreglo(data, data[i].idproducto, "idproducto");
    setUsuariot(isValid(data[i].user) === true ? data[i].user : data[i].iduser);
    setProducto({ label: data[i].nick, value: index });
    setNombrecortot(data[i].nick);
    setDescripciont(data[i].desc);
    setPreciot(isValid(data[i].precio) === true ? data[i].precio : "");
    setMarcat(isValid(data[i].marca) === true ? data[i].marca : "");
    setModelot(isValid(data[i].modelo) === true ? data[i].modelo : "");
    setTallat(isValid(data[i].talla) === true ? data[i].talla : "");
    setColort(isValid(data[i].color) === true ? data[i].color : "");
    setDomiciliot(data[i].domicilio === 0 ? false : true);
    setOcupadot(data[i].ocupado === 0 ? false : true);
    setGpst(data[i].gpssn === 1 ? true : false);
    setInformativot(data[i].info);
    setCbgps(data[i].gpssn === 1 ? true : false);
    setLatt(data[i].latitud === 0 ? null : data[i].latitud);
    setLngt(data[i].longitud === 0 ? null : data[i].longitud);
    setTcbsCiudad(data[i].sciudad === 1 ? true : false);
    setTdistanciaMax(data[i].distanciamax);
  }

  function restaurardatosproductosNew(data, posicion, arrayUsuarios) {
    setUsuario(
      buscarEnArregloString(arrayUsuarios, data[posicion].iduser, "iduser")
    );
    setProducto({ label: data[posicion].nick, value: posicion });
    setNombrecorto(data[posicion].nick);
    setDescripcion(data[posicion].desc);
    setPrecio(data[posicion].precio);
    setMarca(data[posicion].marca);
    setModelo(data[posicion].modelo);
    setTalla(data[posicion].talla);
    setColor(data[posicion].color);
    setDomicilio(data[posicion].domicilio === 0 ? false : true);
    setOcupado(data[posicion].ocupado === 0 ? false : true);
    setCbgps(data[posicion].gpssn === 1 ? true : false);
    setInformativo(data[posicion].info);
    setLat(data[posicion].latitud === 0 ? null : data[posicion].latitud);
    setLng(data[posicion].longitud === 0 ? null : data[posicion].longitud);
    setCbsCiudad(data[posicion].sciudad === 1 ? true : false);
    setDistanciaMax(data[posicion].distanciamax);
  }

  function restaurardatosproductos() {
    setUsuario(buscarEnArregloString(arrayUsuarios, usuariot, "iduser"));
    setNombrecorto(nombrecortot);
    setDescripcion(descripciont);
    setPrecio(preciot);
    setMarca(marcat);
    setModelo(modelot);
    setTalla(tallat);
    setColor(colort);
    setDistanciaMax(tdistanciaMax);
    setOcupado(ocupadot);
    setDomicilio(domiciliot);
    setCbsCiudad(tcbsCiudad);
    setCbgps(gpst);
    setInformativo(informativot);
    setLat(latt);
    setLng(lngt);
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

  async function confirmar() {
    setLoading(true);
    let mproducto = 0;
    if (producto === null) mproducto = 0;
    else mproducto = arrayproductos[producto?.value].idproducto;
    // let result = await apiBaseDatos("setProducto",
    let mtalla=isValid(talla)===false || talla===""?0:talla;
    let result = await setProductoCM(
      sessionStorage.getItem("tipouser") === "3"
        ? arrayUsuarios[usuario].iduser
        : sessionStorage.getItem("user"),
      mproducto,
      arraytnegocios[tnegocio].categorianegocio,
      nombrecorto,
      contenidofoto,
      descripcion,
      precio !== "" ? precio : "0",
      ocupado === true ? 1 : 0,
      domicilio === true ? 1 : 0,
      agregarsn ? true : false,
      marca,
      modelo,
      mtalla,
      color,
      cbgps === true || domicilio === true ? 1 : 0,
      informativo,
      lat,
      lng,
      cbsCiudad === true ? 1 : 0,
      distanciaMax,
      isBase64ToBlob
    );

    if (isValid(result?.err) === true) {
      setMessage("Ocurrio un error mientras se registraba el producto");
      setOpen(true);
      setLoading(false);
      return;
    }
    if (agregarsn) {
      arrayproductos.push({
        user: sessionStorage.getItem("user"),
        idproducto: mproducto,
        foto: nombrecortofoto,
        nick: nombrecorto,
        desc: descripcion,
        precio,
        domicilio: domicilio === true ? 1 : 0,
        gps: cbgps === true ? 1 : 0,
        agregar: agregarsn ? true : false,
        editar: editarsn ? true : false,
      });
    } else {
      let tarrayproductos = [];
      tarrayproductos.push({
        user: sessionStorage.getItem("user"),
        idproducto: mproducto,
        foto: nombrecortofoto,
        nick: nombrecorto,
        desc: descripcion,
        precio,
        domicilio: domicilio === true ? 1 : 0,
        gps: cbgps === true ? 1 : 0,
        agregar: agregarsn ? true : false,
        editar: editarsn ? true : false,
      });
    }
    setMessage("El producto '" + nombrecorto + "' se registró correctamente.");
    setOpen(true);
    setShowMap(false);
    setShowGalerias(false);
    setAgregarsn(false);
    setEditarsn(false);
    setLoading(false);
    init;
  }

  function editar() {
    restaurardatosproductos();
    setEditarsn(true);
  }

  function agregar() {
    iniciadatosgenerales();
    setAgregarsn(true);
  }

  const eliminar = () => {
    setEliminarsn(true);
    setContenido(
      "¿Está seguro que desea eliminar a " +
        arrayproductos[producto?.value].nick +
        "?"
    );
    setShow1(true);
  };

  async function sino() {
    await delProductoCM(arrayproductos[producto?.value].idproducto);
    //    await apiBaseDatos("delProducto", arrayproductos[producto?.value].idproducto);
    iniciadatosgenerales();
    setMessage(
      "Se eliminó el producto " + arrayproductos[producto?.value].desc
    );
    setOpen(true);
    setShow1(false);
    setEliminarsn(false);
    init;
  }

  function tcancelar() {
    setAgregarsn(false);
    setEditarsn(false);
    setEliminarsn(false);
    setShowGalerias(false);
    setShowMap(false);
  }

  const onModalClose1 = () => {
    setShow1(false);
  };

  const cambiaNombreFoto = (valor) => {
    setNombrefoto(valor);
  };

  const cambiaFoto = (contenidofoto) => {
    setContenidofoto(contenidofoto);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Modal
        visible={show1}
        onClose={onModalClose1}
        className="cmodal wmodal"
        classContainer="modal-catalogo-productos"
      >
        <div className="cerrar-button">
          <button className="cerrar" onClick={onModalClose1}>
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
              <button className="no" onClick={onModalClose1}>
                No
              </button>
            </>
          ) : (
            ""
          )}
        </div>
      </Modal>

      <div className="info-catproductos">
        <Navbar />
        <Encabezado clase={"encabezado"}/>
        <Hero clase={"hero-section"}>
          {show ? (
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
          ) : null}
          {inicia === false ? (
            <>
              <div className="div-papa-catProductos">
                <form className="catalogo-producto">
                  <p className="strong catproductos-color">Publicar un producto</p>
                  {showMap === true || showMap === false ? (
                    <>
                      <div className="container-producto-select">
                        <div className="cat-select">
                          <p className="label-datos-catproducto">Categoria</p>
                          <select
                            className="selecttn-prod"
                            id="tnegocio"
                            onChange={handleselect}
                            value={tnegocio}
                            disabled={agregarsn || editarsn}
                          >
                            {arraytnegocios.map((item, i) => {
                              return (
                                <option key={i} value={i}>
                                  {item.nick}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div className="cat-select">
                          <p className="label-datos-catproducto">Producto</p>
                          <Autocomplete
                            disablePortal
                            disabled={agregarsn || editarsn}
                            id="producto"
                            options={arrayproductos.map((item, i) => ({
                              label: item.nick,
                              value: i,
                            }))}
                            isOptionEqualToValue={(option, value) =>
                              option.value === value.value
                            }
                            value={producto}
                            onChange={handleProducto}
                            sx={{
                              paddingLeft: "5px",
                              borderRadius: "100px",
                              height: "30px",
                              background: "aliceblue",
                              ".MuiAutocomplete-input": {
                                padding: "5px 0 0 5px !important",
                                fontSize: "14px !important",
                              },
                              ".MuiFilledInput-root": {
                                padding: 0,
                                background: "none",
                                ":hover": {
                                  background: "none",
                                },
                              },
                              ".MuiFilledInput-root::before": {
                                display: "none",
                              },
                              ".MuiFilledInput-root::after": {
                                display: "none",
                              },
                              ".MuiAutocomplete-endAdornment": {
                                marginTop: "2px",
                              },
                            }}
                            renderInput={(params) => (
                              <TextField
                                variant="filled"
                                {...params}
                                label=""
                              />
                            )}
                            renderOption={(props, option) => (
                              <li {...props} key={option.value}>
                                {option.label}
                              </li>
                            )}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                  {agregarsn || editarsn ? (
                    <>
                      <div className="container-producto-datos">
                        {sessionStorage.getItem("tipouser") === "3" ? (
                          <div className="input-area1-producto">
                            <p className="label-datos-catproducto">Dueño</p>
                            <select
                              className="select-usuario"
                              id="usuario"
                              onChange={handleselect}
                              value={usuario}
                            >
                              {arrayUsuarios.map((item, i) => {
                                return (
                                  <option key={i} value={i}>
                                    {item.nombre}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        ) : (
                          ""
                        )}

                        <div className="label-datos-catproducto-1 strong">
                          Datos del nuevo producto{" "}
                        </div>
                        <div className="input-area2">
                          <input
                            className="input-cataproducto"
                            id="nombrecorto"
                            placeholder="Nombre"
                            value={nombrecorto}
                            onChange={handleInput}
                            type="text"
                            required
                          />
                        </div>
                        <div className="input-area2">
                          <input
                            className="input-cataproducto"
                            id="descripcion"
                            placeholder="Descripción"
                            value={descripcion}
                            onChange={handleInput}
                            type="text"
                            required
                          />
                        </div>
                        <div className="input-area2">
                          <input
                            className="input-cataproducto"
                            id="marca"
                            placeholder="Más datos (ejemplo: marca, horario)"
                            value={marca}
                            onChange={handleInput}
                            type="text"
                            required
                          />
                        </div>
                        <div className="input-area2">
                          <input
                            className="input-cataproducto"
                            id="modelo"
                            placeholder="Otros datos (ejemplo: modelo, chapa, fechas)"
                            value={modelo}
                            onChange={handleInput}
                            type="text"
                            required
                          />
                        </div>
                        <div className="precio-capacidad-color">
                          <div>
                            <p className="label-datos-catproducto">Precio</p>
                            <Tippy content="Precio">
                              <input
                                className="input-cataproducto-4"
                                id="precio"
                                placeholder="Precio"
                                value={precio}
                                onChange={handleInput}
                                type="text"
                                required
                              />
                            </Tippy>
                          </div>
                            <div>
                              <p className="label-datos-catproducto plazas">
                                Cantidad
                              </p>
                              <input
                                className="input-cataproducto-999"
                                id="talla"
                                placeholder="Cantidad"
                                value={talla}
                                onChange={handleInput}
                                type="text"
                                required
                              />
                            </div>
                          <div>
                            <p className="label-datos-catproducto color">
                              Color
                            </p>
                            <input
                              className="input-cataproducto-998"
                              id="color"
                              placeholder="Color"
                              value={color}
                              onChange={handleInput}
                              type="text"
                              required
                            />
                          </div>
                        </div>
                        <div className="domicilio-ocupado-gps">
                          <div className="input-area4">
                            <Checkbox
                              id="domicilio"
                              sx={{
                                color: "white",
                                "&.Mui-checked": { color: "white" },
                              }}
                              checked={domicilio}
                              onClick={handleInput}
                             />
                             <label className="label-datos-catproducto input-cataproducto-12 domicilio">
                               Domicilio
                             </label>
                          </div>
                          {sessionStorage.getItem("idapp") === "Expreso" ? (
                            <div className="input-area4">
                              <Checkbox
                                id="ocupado"
                                sx={{
                                  color: "white",
                                  "&.Mui-checked": { color: "white" },
                                }}
                                checked={ocupado}
                                onClick={handleInput}
                              />
                              <label className="label-datos-catproducto input-cataproducto-12 ocupado">
                                Ocupado
                              </label>
                            </div>
                          ) : (
                            ""
                          )}
                          {domicilio !== true ||
                          sessionStorage.getItem("idapp") !== "Expreso" ? (
                            <div className="input-area4">
                              <Checkbox
                                className="combo-gps"
                                id="cbgps"
                                sx={{
                                  color: "white",
                                  "&.Mui-checked": { color: "white" },
                                }}
                                checked={cbgps}
                                onClick={handleInput}
                              />
                              <label className="label-datos-catproducto gps">
                                GPS
                              </label>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="input-area4">
                            <Checkbox
                              id="informativo"
                              sx={{
                                color: "white",
                                "&.Mui-checked": { color: "white" },
                              }}
                              checked={informativo}
                              onClick={handleInput}
                             />
                             <label className="label-datos-catproducto input-cataproducto-12 informativo">
                               Informativo
                             </label>
                          </div>

                        {domicilio === true &&
                        sessionStorage.getItem("idapp") === "Expreso" ? (
                          <>
                            <p className="lejania">Lejanía kms:</p>
                            <div className="distancia-sciudad">
                              <div className="input-area4">
                                <input
                                  className="input-cataproducto-101"
                                  id="distanciaMax"
                                  value={distanciaMax}
                                  onChange={handleInput}
                                  type="text"
                                  required
                                />
                              </div>
                              <div className="input-area4">
                                <Checkbox
                                  className="combo-gps"
                                  id="cbsCiudad"
                                  sx={{
                                    color: "white",
                                    "&.Mui-checked": { color: "white" },
                                  }}
                                  checked={cbsCiudad}
                                  onClick={handleInput}
                                />
                                <label className="lejania">Ciudad</label>
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                        <div className="input-area-foto-prod"></div>
                        {nombrefoto !== "" && cbvista ? (
                          <div className="img-class">
                            <img className="img-producto" src={contenidofoto} />
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  <div className="producto-grupo-button">
                    {(agregarsn === true || editarsn === true) &&
                    nombrefoto !== "" &&
                    nombrecorto != "" &&
                    descripcion !== "" ? (
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
                    {agregarsn === true &&
                    nombrecorto != "" &&
                    descripcion !== "" ? (
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
                    {producto &&
                    arrayproductos[producto?.value].desc !== "Desconocido" ? (
                      <>
                        {agregarsn === false &&
                        editarsn === false &&
                        isValid(producto?.value) === true &&
                        arrayproductos[0].desc !== "Desconocido" ? (
                          <Tippy content="Clic para editar el producto">
                            <button
                              type="button"
                              className="producto-button primary"
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
                        isValid(producto?.value) === true &&
                        arrayproductos[0].desc !== "Desconocido" ? (
                          <Tippy content="Clic para eliminar el producto">
                            <button
                              type="button"
                              className="producto-button primary"
                              onClick={eliminar}
                            >
                              <Delete />
                            </button>
                          </Tippy>
                        ) : (
                          ""
                        )}

                        {inicia === false &&
                        editarsn === true &&
                        showMap !== true ? (
                          <Tippy content={`Galeria de fotos del producto`}>
                            <button
                              type="button"
                              className="producto-button primary"
                              onClick={() => setShowGalerias(!showGalerias)}
                            >
                              <Collections />
                            </button>
                          </Tippy>
                        ) : (
                          ""
                        )}
                        {cbgps === true &&
                        inicia === false &&
                        (agregarsn === true || editarsn === true) &&
                        showGalerias === false &&
                        nombrecorto !== "" &&
                        descripcion !== "" &&
                        nombrefoto !== "" ? (
                          <Tippy content="Ubicar el producto en el mapa">
                            <button
                              type="button"
                              className="producto-button primary"
                              onClick={() => setShowMap(!showMap)}
                            >
                              <PlaceOutlined />
                            </button>
                          </Tippy>
                        ) : (
                          ""
                        )}
                      </>
                    ) : (
                      ""
                    )}
                    {(agregarsn === true || editarsn === true) &&
                    nombrecorto !== "" &&
                    descripcion !== "" &&
                    nombrefoto !== "" ? (
                      <Tippy
                        content={
                          nombrecorto.length !== 0 && descripcion.length !== 0
                            ? "Registrar el producto"
                            : "Complete los datos necesarios"
                        }
                      >
                        <button
                          type="button"
                          className="producto-button primary"
                          onClick={
                            nombrecorto.length !== 0 && descripcion.length !== 0
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

                    {agregarsn || editarsn ? (
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

                  {inicia === false &&
                  showGalerias === true &&
                  showMap === false ? (
                    <ComGalerias
                      deQuien={arrayproductos[producto.value].nick}
                      ruta={
                        "productos/" + arrayproductos[producto.value].idproducto
                      }
                      perfil={arrayproductos[producto.value].idproducto}
                      permiso={true}
                      botonCerrar={false}
                      cambiaNombreFoto={cambiaNombreFoto}
                      cambiaFoto={cambiaFoto}
                      idsb={idsb}
                      nophoto={nophoto}
                      tabla={"tablacatproductos"}
                      campo={"idproducto"}
                    />
                  ) : (
                    ""
                  )}
                  {showMap === true &&
                  showGalerias === false &&
                  cbgps === true ? (
                    <div className="mapa-catalogo">
                      <Map
                        sx={{ height: "340px", width: "100%" }}
                        onMapClick={lngLatSelected}
                        remoteshowMap={showMap}
                        lat={lat}
                        lng={lng}
                        point={{ lat, lng }}
                        onChange={onChangeMap}
                        remoteZoom={zoom}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </form>
              </div>
            </>
          ) : (
            ""
          )}
        </Hero>
      </div>
    </>
  );
};

export default CatProductos;
