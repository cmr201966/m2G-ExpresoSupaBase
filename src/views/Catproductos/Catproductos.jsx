import Checkbox from "@mui/material/Checkbox";
import CollectionsIcon from "@mui/icons-material/Collections";
import { Box, CircularProgress } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import ComGalerias from "../../components/ComGalerias/ComGalerias";
import Map from "../../components/Map/MapBox";
import Tippy from "@tippyjs/react";
import Modal from "../../components/Modal/Modal";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../layouts/Hero/Hero";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { IconButton } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Check from "@mui/icons-material/Check";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getcategoriasnegociosapp } from "../../servicios/negocios";
import { getproductoscategoria,  setproducto,  delproducto,} from "../../servicios/productos";
import { getJpgFile } from "../../servicios/imagenes";
import { getusuarios } from "../../servicios/registrarse";
import { isValid } from "../../Utiles/Utiles";

import "./styles.css";

const CatProductos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {};
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [showGalerias, setShowGalerias] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [contenidofoto, setContenidofoto] = useState();
  const [contenido, setContenido] = useState("");
  const [arraytnegocios, setArraytnegocios] = useState([]);
  const [arrayUsuarios, setArrayUsuarios] = useState([]);
  const arrayNoUsuarios = [{iduser: 99999999, desc: "Desconocido"}];
  const [arrayproductos, setArrayproductos] = useState([]);
  const arraynoproductos = [{idproducto: 99999999, marca: 999999, desc: "Desconocido", nick: "Desconocido",}];

  const arraynonegocios = [{ categorianegocio: 999999, desc: "Desconocido" }];
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [talla, setTalla] = useState("");
  const [color, setColor] = useState("");
  const [latt, setLatt] = useState(0);
  const [lngt, setLngt] = useState(0);
  const [foto] = useState();
  const [usuario, setUsuario] = useState("");
  const [nombrefoto, setNombrefoto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nombrecorto, setNombrecorto] = useState("");
  const [precio, setPrecio] = useState(0);
  const [distanciaMax, setDistanciaMax] = useState(0);
  const [cbsCiudad, setCbsCiudad] = useState(0);
  const [producto, setProducto] = useState(null);
  const [tnegocio, setTnegocio] = useState(0);
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

  //Estados para recuperar los datos del producto

  const [productot] = useState("");
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

  const buscarEnArreglo = (arreglo, valor, atributo) => {
    let index = -1;
    arreglo.forEach((item, i) => {
      if (Number(item[atributo]) === Number(valor)) {
        index = i;
      }
    });
    return index;
  };

  const buscarEnArregloString = (arreglo, valor, atributo) => {
    let index = -1;
    arreglo.forEach((item, i) => {
      if (item[atributo].toUpperCase() === valor.toUpperCase()) {
        index = i;
      }
    });
    return index;
  };


  async function init() {
    console.log("1")
    setShow(true);
    for (let prop in parsedParams) {
      sessionStorage.setItem(prop, parsedParams[prop])
    }
    if ((sessionStorage.getItem("login")===1 || sessionStorage.getItem("login")==='1') && (sessionStorage.getItem("user")==='null' || sessionStorage.getItem("user")===null)){
        navigate(`/login?login=1&regreso=${sessionStorage.getItem("regreso")}`);
    }
    let ttarraytnegocios;
    let resulttnegocios = await getcategoriasnegociosapp({});
    resulttnegocios = await resulttnegocios.json();

    if (resulttnegocios.error || resulttnegocios.length === 0) {
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
    console.log("2")
    let resultusuarios = await getusuarios({});
    resultusuarios = await resultusuarios.json();
    console.log("3")
    if (resultusuarios.error || resultusuarios.length === 0) {
      setArrayUsuarios(arrayNoUsuarios);
    } 
    else {
      console.log(buscarEnArregloString(resultusuarios, resultusuarios[0].iduser, "iduser"));
      setUsuario(buscarEnArregloString(resultusuarios, resultusuarios[0].iduser, "iduser"));
      setArrayUsuarios(resultusuarios);
    }

    let resultproductos = await getproductoscategoria({
      user: sessionStorage.getItem("user"),
      categoria: ttarraytnegocios[posicion].categorianegocio,
      producto,
    });
    resultproductos = await resultproductos.json();
    if (resultproductos.error || resultproductos.length === 0) {
      setArrayproductos(arraynoproductos);
      recuperardatosproducto(arraynoproductos, 0);
    } else {
      const posicionProducto = buscarEnArreglo(resultproductos, parsedParams.idproducto, "idproducto");
      setArrayproductos(resultproductos);
      if (
        parsedParams.idproducto !== null &&
        parsedParams.idproducto !== "null" &&
        parsedParams.idproducto !== undefined &&
        parsedParams.idproducto !== "undefined"
      ) {
        restaurardatosproductosNew(resultproductos, posicionProducto);
        setEditarsn(true);
      }
      let resultado = await getJpgFile({file: "./galerias/app_images/productos/" + resultproductos[0].idproducto + "/" + "foto-1.jpg",});
      resultado = await resultado.text();

      if (resultado.length !== 0) {
        setContenidofoto(resultado);
        setNombrefoto("166", resultproductos[0].idproducto);
      } else {
        setNombrefoto("");
      }
    }

    setInicia(false);
    setShow(false);
  } //init

  const handleProducto = async (_, value) => {
    setProducto(value);
    recuperardatosproducto(arrayproductos, value.value);
    let resultado = await getJpgFile({
    file: "./galerias/app_images/productos" + "/" + arrayproductos[value?.value].idproducto + "/foto-1.jpg",});
    resultado = await resultado.text();

    if (resultado.length !== 0) {
      setContenidofoto(resultado);
      setNombrefoto(arrayproductos[value?.value].idproducto);
    } else {
      setNombrefoto("");
    }
  };

  async function getProductos(value) {
    let resultproductos = await getproductoscategoria({
      user: sessionStorage.getItem("user"),
      categoria: arraytnegocios[value].categorianegocio,
    });
    resultproductos = await resultproductos.json();
    setProducto(null);

    if (resultproductos.error || resultproductos.length === 0) {
      setArrayproductos(arraynoproductos);
      recuperardatosproducto(arraynoproductos, 0);
    } else {
      setArrayproductos(resultproductos);
      setNombrefoto(resultproductos[0].idproducto);
      recuperardatosproducto(resultproductos, 0);
      let resultado = await getJpgFile({file: "./galerias/app_images/productos" + "/" + resultproductos[0].idproducto + "/foto-1.jpg",});
      resultado = await resultado.text();

      if (resultado.length !== 0) {
        setContenidofoto(resultado);
        setNombrefoto(resultproductos[0].idproducto);
      } else {
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
    setPrecio(0);
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
    setProducto({ label: data[i].desc, value: index });
    setNombrecortot(data[i].nick);
    setDescripciont(data[i].desc);
    setPreciot(data[i].precio);
    setMarcat(data[i].marca);
    setModelot(data[i].modelo);
    setTallat(data[i].talla);
    setColort(data[i].color);
    setDomiciliot(data[i].domicilio === 0 ? false : true);
    setOcupadot(data[i].ocupado === 0 ? false : true);
    setGpst(data[i].gpsSN === 1 ? true : false);
    setCbgps(data[i].gpsSN === 1 ? true : false);
    setLatt(data[i].latitud === 0 ? null : data[i].latitud);
    setLngt(data[i].longitud === 0 ? null : data[i].longitud);
    setTcbsCiudad(data[i].sCiudad === 1 ? true : false);
    setTdistanciaMax(data[i].distanciaMax);
  }
  function restaurardatosproductosNew(data, posicion) {
    setProducto({ label: data[posicion].desc, value: posicion });
    setNombrecorto(data[posicion].nick);
    setDescripcion(data[posicion].desc);
    setPrecio(data[posicion].precio);
    setMarca(data[posicion].marca);
    setModelo(data[posicion].modelo);
    setTalla(data[posicion].talla);
    setColor(data[posicion].color);
    setDomicilio(data[posicion].domicilio === 0 ? false : true);
    setOcupado(data[posicion].ocupado === 0 ? false : true);
    setCbgps(data[posicion].gpsSN === 1 ? true : false);
    setLat(data[posicion].latitud === 0 ? null : data[posicion].latitud);
    setLng(data[posicion].longitud === 0 ? null : data[posicion].longitud);
    setCbsCiudad(data[posicion].sCiudad === 1 ? true : false);
    setDistanciaMax(data[posicion].distanciaMax);
  }

  function restaurardatosproductos() {
    //setNombrefoto(productot);
    setNombrecorto(nombrecortot);
    setDescripcion(descripciont);
    setPrecio(preciot);
    setMarca(marcat);
    setModelo(modelot);
    setTalla(tallat);
    setColor(colort);
    setDistanciaMax(tdistanciaMax);
    setOcupado(ocupadot===false?0:1);
    setDomicilio(domiciliot===false?0:1);
    setCbsCiudad(tcbsCiudad===false?0:1);
    setCbgps(gpst);
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
    };
    reader.readAsDataURL(file);
    setCbvista(true);
  };

  async function confirmar() {
    let mproducto = 0;
    if (producto === null) {
      mproducto = 0;
    } else {
      mproducto = arrayproductos[producto?.value].idproducto;
    }
    let result = await setproducto({
      user: sessionStorage.getItem("tipouser")==='3'?arrayUsuarios[usuario].iduser:sessionStorage.getItem("user"),
      producto: mproducto,
      categoria: arraytnegocios[tnegocio].categorianegocio,
      nick: nombrecorto,
      contenidofoto,
      desc: descripcion,
      precio,
      ocupado: ocupado === true ? 1 : 0,
      domicilio: domicilio === true ? 1 : 0,
      agregar: agregarsn ? true : false,
      editar: editarsn ? true : false,
      marca,
      modelo,
      talla,
      color,
      gps: cbgps === true || domicilio === true ? 1 : 0,
      latitud: lat,
      longitud: lng,
      sCiudad: cbsCiudad === true ? 1 : 0,
      distanciaMax: distanciaMax,
    });
    result = await result.json();

    if (result.error) {
      setContenido(result.error);
      setShow1(true);
      return;
    }
    if (agregarsn) {
      var productot = result.productot;
      arrayproductos.push({
        user: sessionStorage.getItem("user"),
        idproducto: productot,
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
        idproducto: productot,
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
    //
    setContenido(
      "El producto '" + descripcion + "' se registró correctamente."
    );
    setShow1(true);
    setShowMap(false);
    setAgregarsn(false);
    setEditarsn(false);
  } //confirma

  function editar() {
    restaurardatosproductos();
    setEditarsn(true);
  }

  function agregar() {
    iniciadatosgenerales();
    setAgregarsn(true);
    //setMarca(2);
  }

  const eliminar = () => {
    setEliminarsn(true);
    setContenido(
      "¿Está seguro que desea eliminar a " +
        arrayproductos[producto?.value].desc +
        "?"
    );
    setShow1(true);
  };

  async function sino() {
    await delproducto({ producto: arrayproductos[producto?.value].idproducto });

    iniciadatosgenerales();
    setShow1(false);
    setEliminarsn(false);
  }

  function tcancelar() {
    setAgregarsn(false);
    setEditarsn(false);
    setEliminarsn(false);
    setDescripcion("");
    setShowGalerias(false);
    setShowMap(false);
  }

  const onModalClose1 = () => {
    setShow1(false);
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
      <div>
        <Navbar />
        <Hero>
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
              <div className="div-papa">
                <div className="cabeza">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      navigate(`/?nivel=${0}`);
                    }}
                  >
                    <ArrowBack className="flecha" />
                  </IconButton>
                  <h4 className="h3-1-catproductos-cabeza">Atrás</h4>
                </div>

                <div className="catalogo-producto">
                  <p className="strong">Publicar un Productos</p>
                  {showMap === true || showMap === false ? (
                    <>
                      <div className="container-producto-select">
                        <div className="input-area1-producto">
                          <label className="label-datos-catproducto">
                            Categoria:{" "}
                          </label>
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
                                  {item.desc}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div className="input-area1-producto">
                          <label className="label-datos-catproducto">
                            Producto:
                          </label>
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
                              paddingleft: "7px",
                              borderRadius: "15px",
                              marginLeft: "30px",
                              marginTop: "5px",
                              minWidth: "336px",
                              height: "30px",
                              background: "aliceblue",
                              ".MuiAutocomplete-input": {
                                padding: "5px 0 0 5px !important",
                              },
                              ".MuiFilledInput-root": {
                                padding: 0,
                              },
                              ".MuiFilledInput-root::before": {
                                display: "none",
                              },
                              ".MuiFilledInput-root::after": {
                                display: "none",
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
                            <div className="label-datos-catproducto-1 strong">
                              Datos del nuevo producto{" "}
                            </div>
                            {sessionStorage.getItem("tipouser")==='3'?
                            <div className="input-area1-producto">
                            <label className="label-datos-catproducto">
                                Dueño:
                           </label>
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
                        </div>:""
                        }


                            <div className="input-area1-producto">
                              <label className="label-datos-catproducto">
                                *Nombre:
                              </label>
                              <input
                                className="input-cataproducto-1"
                                id="nombrecorto"
                                value={nombrecorto}
                                onChange={handleInput}
                                type="text"
                                required
                              />
                            </div>
                            <div className="input-area2">
                              <label className="label-datos-catproducto">
                                *Descripción:
                              </label>
                              <input
                                className="input-cataproducto-2"
                                id="descripcion"
                                value={descripcion}
                                onChange={handleInput}
                                type="text"
                                required
                              />
                            </div>
                            <div className="input-area2">
                              <label className="label-datos-catproducto">
                                Marca:
                              </label>
                              <input
                                className="input-cataproducto-20"
                                id="marca"
                                value={marca}
                                onChange={handleInput}
                                type="text"
                                required
                              />
                            </div>
                            <div className="input-area2">
                              <label className="label-datos-catproducto">
                                Modelo/Chapa:
                              </label>
                              <input
                                className="input-cataproducto-21"
                                id="modelo"
                                value={modelo}
                                onChange={handleInput}
                                type="text"
                                required
                              />
                            </div>
                            <div className="precio-capacidad-color">
                              <div className="input-area2">
                                <label className="label-datos-catproducto">
                                  Precio:
                                </label>
                                <input
                                  className="input-cataproducto-4"
                                  id="precio"
                                  value={precio}
                                  onChange={handleInput}
                                  type="text"
                                  required
                                />
                              </div>
                              <div className="input-area2">
                                <label className="label-datos-catproducto plazas">
                                  Plazas:
                                </label>
                                <input
                                  className="input-cataproducto-999"
                                  id="talla"
                                  value={talla}
                                  onChange={handleInput}
                                  type="text"
                                  required
                                />
                              </div>
                              <div className="input-area2">
                                <label className="label-datos-catproducto color">
                                  Color:
                                </label>
                                <input
                                  className="input-cataproducto-998"
                                  id="color"
                                  value={color}
                                  onChange={handleInput}
                                  type="text"
                                  required
                                />
                              </div>
                            </div>
                            <div className="domicilio-ocupado-gps">
                              <div className="input-area4">
                                <label className="label-datos-catproducto input-cataproducto-12 domicilio">
                                  Domicilio:
                                </label>
                                <Checkbox
                                  id="domicilio"
                                  sx={{ color: 'white', '&.Mui-checked': { color: 'white',},}}
                                  checked={domicilio}
                                  onClick={handleInput}
                                />
                              </div>
                              <div className="input-area4">
                                <label className="label-datos-catproducto input-cataproducto-12 ocupado">
                                  Ocupado:
                                </label>
                                <Checkbox
                                  id="ocupado"
                                  sx={{ color: 'white', '&.Mui-checked': { color: 'white',},}}
                                  checked={ocupado}
                                  onClick={handleInput}
                                />
                              </div>
                              {domicilio !== true ? (
                                <div className="input-area4">
                                  <label className="label-datos-catproducto gps">
                                    GPS:
                                  </label>
                                  <Checkbox
                                    className="combo-gps"
                                    id="cbgps"
                                    sx={{ color: 'white', '&.Mui-checked': { color: 'white',},}}
                                    checked={cbgps}
                                    onClick={handleInput}
                                  />
                                </div>
                              ) : (
                                ""
                              )}
                            </div>

                            {domicilio === true ? (
                              <div className="distancia-sciudad">
                                <div className="input-area4">
                                  <label className="lejania">
                                    Lejanía kms:
                                  </label>
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
                                  <label className="sciudad">Ciudad:</label>
                                  <Checkbox
                                    className="combo-gps"
                                    id="cbsCiudad"
                                    sx={{ color: 'white', '&.Mui-checked': { color: 'white',},}}
                                    checked={cbsCiudad}
                                    onClick={handleInput}
                                  />
                                </div>
                              </div>
                            ) : (
                              ""
                            )}

                            <div className="input-area-foto-prod">

                            </div>
                            {nombrefoto !== "" && cbvista ? (
                              <div className="img-class">
                                <img
                                  className="img-producto"
                                  src={contenidofoto}
                                />
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

                    {(agregarsn === true || editarsn === true) && nombrefoto !== "" && nombrecorto!="" && descripcion!==""? (
                      <Tippy content="Vista previa">
                        <button
                          type="button"
                          className="producto-button primary"
                          onClick={()=>setCbvista(!cbvista)}
                        >
                          <VisibilityIcon />
                        </button>
                      </Tippy>
                     ) : (
                      ""
                    )}

                      {(agregarsn === true || editarsn === true) && nombrecorto!="" && descripcion!==""? (
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
                    {producto &&
                    arrayproductos[producto?.value].desc !== "Desconocido" ? (
                      <>
                        {agregarsn === false && editarsn === false ? (
                          <Tippy content="Clic para editar el producto">
                            <button
                              type="button"
                              className="producto-button primary"
                              disabled={
                                arrayproductos[0].desc === "Desconocido"
                              }
                              onClick={editar}
                            >
                              <Edit />
                            </button>
                          </Tippy>
                        ) : (
                          ""
                        )}

                        {agregarsn === false && editarsn === false ? (
                          <Tippy content="Clic para eliminar el producto">
                            <button
                              type="button"
                              className="producto-button primary"
                              disabled={
                                arrayproductos[0].desc === "Desconocido"
                              }
                              onClick={eliminar}
                            >
                              <Delete />
                            </button>
                          </Tippy>
                        ) : (
                          ""
                        )}

                        {inicia === false &&
                        (agregarsn || editarsn) &&
                        showMap !== true ? (
                          <Tippy content={`Galeria de fotos del producto`}>
                            <button
                              type="button"
                              className="producto-button primary"
                              onClick={() => setShowGalerias(!showGalerias)}
                            >
                              <CollectionsIcon />
                            </button>
                          </Tippy>
                        ) : (
                          ""
                        )}
                        {cbgps === true &&
                        inicia === false &&
                        (agregarsn || editarsn) && ((showGalerias===false && showMap===false) || (showGalerias===false && (showMap===true))) ? (
                          <Tippy content="Ubicar el producto en el mapa">
                            <button
                              type="button"
                              className="negocio-button primary"
                              onClick={() => setShowMap(!showMap)}
                            >
                              <MapIcon />
                            </button>
                          </Tippy>
                        ) : (
                          ""
                        )}

                      </>
                    ) : (
                      ""
                    )}
                   {(agregarsn === true || editarsn === true) && nombrecorto!=="" && descripcion!==""  && nombrefoto !== "" ? (
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
                          <Check />
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
                </div>

                {inicia === false && showGalerias === true && showMap === false ? (
                    <ComGalerias
                      deQuien={arrayproductos[producto.value].desc}
                      rutatmp={
                        "productos/" + arrayproductos[producto.value].idproducto
                      }
                      perfil={arrayproductos[producto.value].idproducto}
                      permiso={true}
                      botonCerrar={false}
                    />
                  ) : (
                    ""
                  )}
                  {showMap === true && showGalerias === false && cbgps === true ? (
                    <div className="mapa-catalogo">
                      <Map
                        sx={{ height: "100%", width: "100%" }}
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
