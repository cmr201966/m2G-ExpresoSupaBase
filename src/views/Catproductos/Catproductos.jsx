//import FormGroup from '@mui/material/FormGroup';
//import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from "@mui/material/Checkbox";
import CollectionsIcon from "@mui/icons-material/Collections";
import { Box, CircularProgress } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import ComGalerias from "../../components/ComGalerias/ComGalerias";
import Map from "../../components/Map/MapBox";

import Tippy from "@tippyjs/react";
//import { Link } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
//import { useParams } from "react-router-dom";
// components
import Navbar from "../../components/Navbar/Navbar";
// layouts
import Hero from "../../layouts/Hero/Hero";
//
import { useNavigate } from "react-router-dom";
// styles
import "./styles.css";
// @mui/material
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { IconButton } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Check from "@mui/icons-material/Check";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";

import { useEffect, useState } from "react";
//import axios from "axios";
import { useLocation } from "react-router-dom";
import { getcategoriasnegociosapp, getnegociosusercategoria  } from "../../servicios/negocios";
import { getproductoscategoria, setproducto, delproducto  } from "../../servicios/productos";
import { getJpgFile  } from "../../servicios/imagenes";
import { getnaturalezaproducto  } from "../../servicios/naturalezas";

//import styledEngineSc from "@mui/styled-engine-sc";

const CatProductos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {};
  const [tuser, setTuser] = useState(sessionStorage.getItem("user"));
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [showGalerias, setShowGalerias] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [contenidofoto, setContenidofoto] = useState();
  const [contenido, setContenido] = useState("");
  const [arraynegocios, setArraynegocios] = useState([]);
  const [arraytnegocios, setArraytnegocios] = useState([]);
  const [arrayproductos, setArrayproductos] = useState([]);
  const arraynoproductos = [
    { idproducto: 99999999, marca: 999999, desc: "Desconocido" },
  ];
  const arraynonegocios = [
    { keycategorianegocio: 999999, idnegocio: 999999, desc: "Desconocido" },
  ];
  //const [arraynaturaleza, setArraynaturaleza] = useState([]);
  //const arraynonaturaleza = [{ idnaturaleza: 8, desc: "Desconocida" }];
  const [naturaleza, setNaturaleza] = useState(0);
  const [thora, setThora] = useState("");
  const [tfecha, setTfecha] = useState("");
  const [latt, setLatt] = useState(0);
  const [lngt, setLngt] = useState(0);
  const [foto, setFoto] = useState();
  const [nombrefoto, setNombrefoto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [negocio, setNegocio] = useState(0);
  const [nombrecorto, setNombrecorto] = useState("");
  const [precio, setPrecio] = useState(0);
  const [distanciaMax, setDistanciaMax] = useState(0);
  const [cbsCiudad, setCbsCiudad] = useState(0);
  const [producto, setProducto] = useState(null);
  const [tnegocio, setTnegocio] = useState(0);
  const [cbvista, setCbvista] = useState(false);
  const [domicilio, setDomicilio] = useState(false);
  const [cbgps, setCbgps] = useState(false);
  const [nombrecortofoto, setNombrecortofoto] = useState("");
  const [inicia, setInicia] = useState(true);
  const [agregarsn, setAgregarsn] = useState(false);
  const [editarsn, setEditarsn] = useState(false);
  const [eliminarsn, setEliminarsn] = useState(false);
  const [zoom, setZoom] = useState(15.5);
  const [ocupado, setOcupado] = useState(1);

  //Estados para recuperar los datos del producto

  const [negociot, setNegociot] = useState("");
  const [naturalezat, setNaturalezat] = useState("");
  const [productot, setProductot] = useState("");
  const [nombrecortot, setNombrecortot] = useState("");
  const [descripciont, setDescripciont] = useState("");
  const [preciot, setPreciot] = useState("");
  const [domiciliot, setDomiciliot] = useState("");
  const [ocupadot, setOcupadot] = useState(1);
  const [tfechat, setTfechat] = useState(false);
  const [thorat, setThorat] = useState(false);
  const [gpst, setGpst] = useState(false);
  const [fecha, setFecha] = useState("");
  const [nivel, setNivel] = useState(9999);
  const [idowner, setIdowner] = useState(9999);
  const [naturaleza1, setNaturaleza1] = useState(9999);
  const [tcbsCiudad, setTcbsCiudad] = useState(false);
  const [tdistanciaMax, setTdistanciaMax] = useState(false);

  async function init() {
    sessionStorage.setItem("filtro", "");
    setShow(true);
    setNivel(parsedParams.nivel);
    setNaturaleza1(parsedParams.naturaleza);
    setIdowner(parsedParams.idowner);

    //
    // Tipos de negocios
    //
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
    setTnegocio(0);
    //
    // Negocios de un tipo y que pertenescan a un dueño
    //
    let resultnegocios = await getnegociosusercategoria({ user: "", categorianegocio: ttarraytnegocios[0].categorianegocio,});
    resultnegocios = await resultnegocios.json();
    setNegocio(0);
    if (resultnegocios.error || resultnegocios.length === 0) {
      //
      // No encontro ningun negocio para este usuario
      //
      setArraynegocios(arraynonegocios);
      setArrayproductos(arraynoproductos);
    } else {
      //
      // se encontraron negocios de este tipo
      // buscar los horarios del primer negocio
      //
      setArraynegocios(resultnegocios);
      //
      // Productos de este negocio
      //
      let resultproductos = await getproductoscategoria({ negocio: resultnegocios[0].negocio});
      resultproductos = await resultproductos.json();
      //let tproducto = 0;
      if (resultproductos.error || resultproductos.length === 0) {
        setArrayproductos(arraynoproductos);
        recuperardatosproducto(arraynoproductos, 0);
        //tproducto = arraynoproductos[0].idproducto;
        setProducto(null);
      } else {
        const [primero] = resultproductos;
        setProducto({ label: primero.desc, value: 0 });
        setArrayproductos(resultproductos);
        recuperardatosproducto(resultproductos, 0);
        //tproducto = resultproductos[0].idproducto;
        let resultado = await getJpgFile({ file: "./galerias/app_images/productos/" + resultproductos[0].idproducto + "/" + "foto-1.jpg"});
        resultado = await resultado.text();
  
        if (resultado.length !== 0) {
          setContenidofoto(resultado);
          setNombrefoto(resultproductos[0].idproducto);
        } else {
          setNombrefoto("");
        }
      }
    }
    setInicia(false);
    setShow(false);
  } //init

  const handleProducto = async (_, value) => {
          setProducto(value);

          recuperardatosproducto(arrayproductos, value.value);
          {/*
          // Productos del negocio
          let resultproductos = await getproductoscategoria({ negocio: arraynegocios[negocio].negocio });
          resultproductos = await resultproductos.json();

          if (resultproductos.error || resultproductos.length === 0) {
            setArrayproductos(arraynoproductos);
          } else {
            // get la naturaleza de este producto
*/}
        let rnaturaleza = await getnaturalezaproducto({ producto: arrayproductos[value?.value].idproducto});
        rnaturaleza = await rnaturaleza.json();
        if (rnaturaleza.length !== 0) {
              setNaturalezat(rnaturaleza[0].naturaleza);
            }

    let resultado = await getJpgFile({ file: "./galerias/app_images/productos" + "/" + arrayproductos[value?.value].idproducto + "/foto-1.jpg"});
    resultado = await resultado.text();

    if (resultado.length !== 0) {
      setContenidofoto(resultado);
      setNombrefoto(arrayproductos[value?.value].idproducto);
    } else {
      setNombrefoto("");
    }
  };

  async function getNegocios(value){
    let resultnegocios = await getnegociosusercategoria({ user: "", categorianegocio: arraytnegocios[value].categorianegocio});
    resultnegocios = await resultnegocios.json();

    if (resultnegocios.error || resultnegocios.length === 0) {
      // No encontro ningun negocio para este usuario
      setArraynegocios(arraynonegocios);
      setArrayproductos(arraynoproductos);
    } else {
      setArraynegocios(resultnegocios);

      // Productos del negocio
      let resultproductos = await getproductoscategoria({ negocio: resultnegocios[0].negocio });
      resultproductos = await resultproductos.json();

      if (resultproductos.error || resultproductos.length === 0) {
        setArrayproductos(arraynoproductos);
        recuperardatosproducto(arraynoproductos, 0);
      } else {
        setArrayproductos(resultproductos);
        recuperardatosproducto(resultproductos, 0);
        const [primero] = resultproductos;
        setProducto({ label: primero.desc, value: 0 });
            //restaurarmenut(tcategorias, 0, resultproductos.data, 0, topciones);
{/*
            const resultado = await axios.post(
          "http://localhost:3001/getjpg-file",
          {
            file: "./galerias/app_images/productos" + "/" + resultproductos.data[0].idproducto + "/foto-1.jpg", },
          {}
        );
*/}
        let resultado = await getJpgFile({ file: "./galerias/app_images/productos" + "/" + resultproductos[0].idproducto + "/foto-1.jpg"});
        resultado = await resultado.text();
        
        if (resultado.length !== 0) {
          setContenidofoto(resultado);
          setNombrefoto(resultproductos[0].idproducto);
        } else {
          setNombrefoto("");
        }
      }
      setNegocio(0);
    }

  }

  async function getProductos(value){
    let resultproductos = await getproductoscategoria({ negocio: arraynegocios[value].negocio });
    resultproductos = await resultproductos.json();

    if (resultproductos.error || resultproductos.length === 0) {
      setArrayproductos(arraynoproductos);
      recuperardatosproducto(arraynoproductos, 0);
    } else {
      setArrayproductos(resultproductos);
      recuperardatosproducto(resultproductos, 0);
      // get la naturaleza de este producto
      let rnaturaleza = await getnaturalezaproducto({ producto: resultproductos[0].idproducto});
      rnaturaleza = await rnaturaleza.json();

      if (rnaturaleza.length !== 0) {
        setNaturalezat(rnaturaleza[0].naturaleza);
      }
{/*
      const resultado = await axios.post(
        "http://localhost:3001/getjpg-file",
        {
          file:
            "./galerias/app_images/productos" +
            "/" +
            resultproductos.data[0].idproducto +
            "/foto-1.jpg",
        },
        {}
      );
*/}
      let resultado = await getJpgFile({ file: "./galerias/app_images/productos" +  "/" +  resultproductos[0].idproducto + "/foto-1.jpg"});
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
        getNegocios(e.target.value);      
        break;

      case "negocio":
        setNegocio(e.target.value);
        getProductos(e.target.value);       
        setProducto(null);
        break;

      case "producto":
        break;

      case "naturaleza":
        setNaturaleza(e.target.value);
        break;
    }
  }

  // Estados para la posición GPS del mapa
  const [lng, setLng] = useState(-75.829090519);
  const [lat, setLat] = useState(20.0217583);

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
      case "nombrecorto":
        setNombrecorto(e.target.value);
        break;
      case "descripcion":
        setDescripcion(e.target.value);
        break;
      case "precio":
        setPrecio(e.target.value);
        break;
      case "distanciaMax":
        setDistanciaMax(e.target.value);
        break;
      case "cbsCiudad":
        setCbsCiudad(e.target.checked);
        break;
      case "tfecha":
        setTfecha(e.target.value);
        break;
      case "cbgps":
        setCbgps(e.target.checked);
        break;
      case "thora":
        setThora(e.target.value);
        break;
      case "fecha":
        setFecha(e.target.value);
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
    setTfecha("");
    setThora("");
    setNombrefoto("");
    setNombrecorto("");
    setDescripcion("");
    setPrecio(0);
  }

  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location]);

  function recuperardatosproducto(data, i) {
    setNegociot(i);
    setProductot(data[i].idproducto);
    setNombrecortot(data[i].nick);
    setDescripciont(data[i].desc);
    setPreciot(data[i].precio);
    setTfechat(data[i].fecha);
    setThorat(data[i].hora);
    setDomiciliot(data[i].domicilio === 0 ? false : true);
    setOcupadot(data[i].ocupado === 0 ? false : true);
    setGpst(data[i].gpsSN === 1 ? true : false);
    setCbgps(data[i].gpsSN === 1 ? true : false);
    setLatt(data[i].latitud===0?null:data[i].latitud);
    setLngt(data[i].longitud===0?null:data[i].longitud);
    setTcbsCiudad(data[i].sCiudad===1?true:false);
    setTdistanciaMax(data[i].distanciaMax);
  }
  function restaurardatosproductos() {
    //setNegocio(negociot);
    setNombrefoto(productot);
    setNombrecorto(nombrecortot);
    setDescripcion(descripciont);
    setNaturaleza(naturalezat);
    setPrecio(preciot);
    setOcupado(ocupadot);
    setDomicilio(domiciliot);
    setTfecha(tfechat);
    setThora(thorat);
    setCbgps(gpst);
    setLat(latt);
    setLng(lngt);
    setCbsCiudad(tcbsCiudad);
    setDistanciaMax(tdistanciaMax);
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
    let mproducto=0;
    if (producto===null){
       mproducto=0;
    }
    else{
       mproducto=arrayproductos[producto?.value].idproducto;
    }
    let result = await setproducto({  user: tuser,
      producto: mproducto,
      negocio: arraynegocios[negocio].negocio,
      nick: nombrecorto,
      contenidofoto,
      desc: descripcion,
      precio,
      ocupado: ocupado===true?1:0,
      domicilio: domicilio === true ? 1 : 0,
      agregar: agregarsn ? true : false,
      editar: editarsn ? true : false,
      fecha,
      thora,
      tfecha,
      gps: (cbgps === true) || (domicilio===true)? 1 : 0,
      latitud: lat,
      longitud: lng,
      sCiudad: cbsCiudad ===true?1:0,
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
        user: tuser,
        idproducto: productot,
        negocio: arraynegocios[negocio].negocio,
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
        user: tuser,
        idproducto: productot,
        negocio: arraynegocios[negocio].negocio,
        foto: nombrecortofoto,
        nick: nombrecorto,
        desc: descripcion,
        precio,
        domicilio: domicilio === true ? 1 : 0,
        gps: cbgps === true ? 1 : 0,
        agregar: agregarsn ? true : false,
        editar: editarsn ? true : false,
      });

      recuperardatosproducto(tarrayproductos, 0);
      productot = arrayproductos[producto?.value].idproducto;
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
{/*
    await axios.post(
      "http://localhost:3001/delproducto",
      { producto: arrayproductos[producto?.value].idproducto },
      {}
    );
*/}    
    await delproducto({ producto: arrayproductos[producto?.value].idproducto});

    // refrescar la lista despues de eliminada la categoria
    //arraycategoriasproductos.splice(borrar, 1);
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
  const onModalClose = () => {
    setShow(false);
  };

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
        <Navbar
          links={[
            { label: "Inicio", to: "/", tooltips: "Ir a la página principal" },
            {
              label:
                sessionStorage.getItem("user") === null
                  ? "Iniciar sesión"
                  : "Cerrar sesión",
              to:
                sessionStorage.getItem("user") === null
                  ? "/login"
                  : "/cerrarsesion",
              tooltips:
                sessionStorage.getItem("user") === null
                  ? "Abrir sesión"
                  : "/Cerrar la sesión de " +
                    sessionStorage.getItem("usernombre"),
            },
            {
              label: "Registrarse",
              to: "/registrarse?inserta=true",
              tooltips: "Crear una cuenta de usuario",
            },
            {
              label: "Acerca de",
              to: "/Acercade",
              tooltips: "Acerca de M2G-Destodo",
            },
          ]}
        />
        <Hero>
          <div className="cabeza">
            <IconButton
              color="primary"
              onClick={() => {
                navigate(
                  `/?naturaleza=${naturaleza1}&idowner=${idowner}&nivel=${nivel}`
                );
              }}
            >
              <ArrowBack />
            </IconButton>
            <h3 className="h1-cabeza">DesTodo</h3>
            <h4 className="h3-1-catproductos-cabeza">
              {" "}
              - Catálogo de Productos
            </h4>
          </div>
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
              <div className="catalogo-producto">
                {showMap !== true ? (
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
                          Negocio:{" "}
                        </label>
                        <select
                          className="selectne-prod"
                          id="negocio"
                          onChange={handleselect}
                          value={negocio}
                          disabled={agregarsn || editarsn}
                        >
                          {arraynegocios.map((item, i) => {
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
                          Producto:{" "}
                        </label>
                        <Autocomplete
                          disablePortal
                          disabled={agregarsn || editarsn}
                          id="producto"
                          options={arrayproductos.map((item, i) => ({
                            label: item.desc,
                            value: i,
                          }))}
                          isOptionEqualToValue={(
                            option,
                            value
                        ) => option.value === value.value}                          
                          value={producto}
                          onChange={handleProducto}
                          sx={{
                            marginLeft: "31px",
                            marginTop: "5px",
                            width: "300px",
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
                            <TextField variant="filled" {...params} label="" />
                          )}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}

                {showMap !== true ? (
                  <>
                    {agregarsn || editarsn ? (
                      <>
                        <div className="container-producto-datos">
                          {agregarsn === false ? (
                            <label className="label-datos-catproducto">
                              DATOS{" "}
                            </label>
                          ) : (
                            <label className="label-datos-catproducto">
                              DATOS DEL NUEVO PRODUCTO{" "}
                            </label>
                          )}
                          <div className="input-area1-producto">
                            <label className="label-datos-catproducto">
                              *Nombre:{" "}
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
                              Fecha:
                            </label>
                            <input
                              className="input-cataproducto-20"
                              id="tfecha"
                              value={tfecha}
                              onChange={handleInput}
                              type="text"
                              required
                            />
                          </div>
                          <div className="input-area2">
                            <label className="label-datos-catproducto">
                              Hora:
                            </label>
                            <input
                              className="input-cataproducto-21"
                              id="thora"
                              value={thora}
                              onChange={handleInput}
                              type="text"
                              required
                            />
                          </div>
                          <div className="input-area4">
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
                          <div className="domicilio-ocupado">
                                <div className="input-area4">
                                   <label className="label-datos-catproducto input-cataproducto-12">
                                          Domicilio:
                                   </label>
                                   <Checkbox
                                   sx={{ padding: 0 }}
                                   id="domicilio"
                                   color="checkbox"
                                   defaultChecked
                                   checked={domicilio}
                                   onClick={handleInput}
                                   />
                               </div>
                               <div className="input-area4">
                                   <label className="label-datos-catproducto input-cataproducto-12">
                                          Ocupado:
                                   </label>
                                   <Checkbox
                                   sx={{ padding: 0 }}
                                   id="ocupado"
                                   color="checkbox"
                                   defaultChecked
                                   checked={ocupado}
                                   onClick={handleInput}
                                   />
                               </div>
                        </div>
                         {domicilio!==true?
                          <div className="input-area4">
                            <label className="label-datos-catproducto input-cataproducto-99">
                              GPS:
                            </label>
                            <Checkbox className="combo-gps"
                              id="cbgps"
                              color="checkbox"
                              defaultChecked
                              checked={cbgps}
                              onClick={handleInput}
                            />
                          </div>:""}
                          {domicilio===true?
                          <div className="distancia-sciudad">
                              <div className="input-area4">
                                   <label className="label-datos-catproducto input-cataproducto-102">
                                          Distancia MAX:
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
                                   <label className="label-datos-catproducto input-cataproducto-104">
                                          Solo ciudad:
                                   </label>
                                   <Checkbox className="combo-gps"
                                       id="cbsCiudad"
                                       color="checkbox"
                                       defaultChecked
                                       checked={cbsCiudad}
                                       onClick={handleInput}
                                   />
                              </div>
                          </div>:""}

                          <div className="input-area-foto-prod">
                            <div className="foto-anadir">
                                 <label className="label-2-prod">Foto:</label>
                                 <label className="label-2-1-prod">
                                 <input
                                    id="foto"
                                    value={foto}
                                    onChange={onPhotoChange}
                                    type="file"
                                    required
                                    multiple
                                 />
                                 Añadir foto
                                </label>
                            </div>
                            {nombrefoto !== "" ? (
                              <div className="check-vista-1">
                                <label className="label-vista-productos-1-1">
                                  Vista previa
                                </label>
                                <Checkbox
                                  className="combo-gps"
                                  id="vista"
                                  color="checkbox"
                                  defaultChecked
                                  checked={cbvista}
                                  onClick={handleInput}
                                />
                              </div>
                            ) : (
                              ""
                            )}
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
                  </>
                ) : (
                  ""
                )}

                <div className="producto-grupo-button">
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
                            disabled={arrayproductos[0].desc === "Desconocido"}
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
                            disabled={arrayproductos[0].desc === "Desconocido"}
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
                      (agregarsn || editarsn) ? (
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

                  {agregarsn || editarsn ? (
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
                {inicia === false &&
                showGalerias === true &&
                showMap === false ? (
                  <ComGalerias
                    deQuien={arrayproductos[producto.value].desc}
                    rutatmp={"productos/" + arrayproductos[producto.value].idproducto}
                    perfil={arrayproductos[producto.value].idproducto}
                    permiso={true}
                    botonCerrar={false}
                  />
                ) : (
                  ""
                )}

                {showMap === true &&
                showGalerias === false &&
                cbgps === true ? (
                  <>
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
                  </>
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
