// components
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Modal from "../../components/Modal/Modal";
//import Map from "../../components/Map/MapBox";
import Hero from "../../layouts/Hero/Hero";
// @mui/icons-material
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Check from "@mui/icons-material/Check";
import FilterAltOff from "@mui/icons-material/FilterAltOff";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import { Box, CircularProgress } from "@mui/material";
import Tippy from "@tippyjs/react";
import { useNavigate } from "react-router-dom";
import Close from "@mui/icons-material/Close";
import Map from "../../components/Map/MapBox";
import libre from "../../assets/images/libre.png";
import marker from "../../assets/images/custom_marker.png";
import { getproductos, getproductoscategoria, setMovimientosNew, updateOcupado } from "../../servicios/productos";
import { getJpgFile } from "../../servicios/imagenes";
import { getparesgpsnaturaleza } from "../../servicios/naturalezas";
import { getprovincias, getmunicipios  } from "../../servicios/catalogos";
import { getcategoriasnegocios, getnegocios1  } from "../../servicios/negocios";

// Otros
import { useEffect, useState } from "react";
import { useFilter } from "../../context/FilterProvider";

// components
import CardRow from "../../components/CardRow/CardRow";

// styles
import "./styles.css";
import config from "../../config";

const Productos = () => {
  const navigate = useNavigate();
  const [mapLoading, setMapLoading] = useState(true);
  const [puntos, setPuntos] = useState([]);
  const { filterState, setFilterState } = useFilter();
  const location = useLocation();
  const parsedParams = {};
  const opciones = [{ desc: "Si" }, { desc: "No" }];
  const [nivel, setNivel] = useState(0);
  const [noproducto, setNoproducto] = useState(false);
  const [showrow3, setShowrow3] = useState(false);
  const [result, setResult] = useState([]);
  const [cantidadproductos, setCantidadproductos] = useState(0);
  const [nombre, setNombre] = useState("");
  const [inicia, setInicia] = useState(true);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [botones, setBotones] = useState(false);
  const [contenido, setContenido] = useState("");
  const [contenidofoto, setContenidofoto] = useState([]);
  const [mascerca, setMascerca] = useState(0);
  const [productot, setProductot] = useState();
  const [idproductot, setIdroductot] = useState();
  const [items, setItems] = useState([]);
  const [puntosState, setPuntosState] = useState(0);
  const [carrera, setCarrera] = useState(0);
  const [duracion, setDuracion] = useState(0);
  const [duracion1, setDuracion1] = useState(0);
  const [verOtraVez, setVerOtraVez] = useState(true);
  const [viewCarrito, setViewCarrito] = useState(false);
  const [toFly, setToFly] = useState(null);

  let users =
    sessionStorage.getItem("user") === null
      ? ""
      : sessionStorage.getItem("user");
  let item;
  const arraytusuarios = [
    { tipouser: 0, desc: "DesTodo" },
    { tipouser: 1, desc: "Dueño" },
  ];
  const arrayopciones = [
    { opcion: "Cualquier parte del campo" },
    { opcion: "Hacer coincidir todo el campo" },
    { opcion: "Comienzo del campo" },
  ];
  //let filtro_productos = sessionStorage.getItem("filtro_productos");
  let condicion_filter = "";
  //
  // Estados del filtro
  //
  // Estados que vienen del filtro
  const [arraynaturalezas, setArraynaturalezas] = useState([]);
  const [cbnaturaleza, setCbnaturaleza] = useState(0);
  const [naturaleza, setNaturaleza] = useState(0);
  const [arraytnegocios, setArraytnegocios] = useState([]);
  const arraynotnegocios = [
    { categorianegocio: 999999, desc: "No hay tipos de negocios" },
  ];
  const [tnegocio, setTnegocio] = useState(0);
  const [arraynegocios, setArraynegocios] = useState([]);
  const arraynonegocios = [{ idnegocio: 999999, desc: "No hay negocios" }];
  const [tnegocios, setTnegocios] = useState([]);
  const [negocio, setNegocio] = useState(0);
  const [arrayproductos, setArrayproductos] = useState([]);
  const arraynoproductos = [{ producto: 999999, desc: "No hay productos" }];
  const [tproductos, setTproductos] = useState([]);
  const [producto, setProducto] = useState(0);
  const [desc, setDesc] = useState("");
  //
  //
  const [cbdesc, setCbdesc] = useState(false);
  const [cbprecio, setCbprecio] = useState(false);
  const [precio, setPrecio] = useState("");
  const [cbubicacion, setCbubicacion] = useState(false);
  const [cbproducto, setCbproducto] = useState(false);
  const [cbnegocio, setCbnegocio] = useState(false);
  const [cbtnegocio, setCbtnegocio] = useState(false);
  const [cbmunicipio, setCbmunicipio] = useState(false);
  const [cbprovincia, setCbprovincia] = useState(false);
  const [arrayprovincias, setArrayprovincias] = useState([]);
  const [provincia, setProvincia] = useState("");
  const [arraymunicipios, setArraymunicipios] = useState([]);
  const [tmunicipios, setTmunicipios] = useState([]);
  const arraynomunicipios = [
    { idmunicipio: 999999, municipio: 999999, desc: "No hay municipios" },
  ];
  const [municipio, setMunicipio] = useState("");
  const [cbnegocioproducto, setCbnegocioproducto] = useState(false);
  const [cbatributos, setCbatributos] = useState(false);
  const [cbdomicilio, setCbdomicilio] = useState(false);
  const [cbabiertosn, setCbabiertosn] = useState(false);
  const [domicilio, setDomicilio] = useState(0);
  const [abierto, setAbierto] = useState(0);
  const [naturaleza1, setNaturaleza1] = useState(0);
  const [idowner, setIdowner] = useState(0);
  const [tarifa, setTarifa] = useState(0);
  const [costoDomicilio, setCostoDomicilio] = useState(0);
  const [index, setIndex] = useState(0);

  // Estados para la posición GPS del mapa
  const [zoom, setZoom] = useState(12.0);
  const [showMap, setShowMap] = useState(false);

  // Estados para la posición GPS del mapa
  const [lng, setLng] = useState();
  const [lat, setLat] = useState();
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();

  //
  // Ubicacion
  //
  let mprovincia = sessionStorage.getItem("provincia");
  let mmunicipio = sessionStorage.getItem("municipio");
  //
  // Naturaleza
  //
  let mnaturaleza = sessionStorage.getItem("naturaleza");

  //
  // Negocio-Productos
  //
  let mtnegocio = sessionStorage.getItem("tnegocio");
  let mnegocio = sessionStorage.getItem("negocio");
  let mproducto = sessionStorage.getItem("producto");
  //
  // Atributos
  //
  let mdesc = sessionStorage.getItem("desc");
  let mprecio = sessionStorage.getItem("precio");
  let mdomicilio = sessionStorage.getItem("domicilio");
  let mabierto = sessionStorage.getItem("abierto");
  // Fin estados del filtro

  const geocodeAddress = async (address) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${config.mapBoxAPI}`
    );
    const data = await response.json();

    if (data.features.length > 0) {
      const [longitude, latitude] = data.features[0].geometry.coordinates;
      return { longitude, latitude };
    } else {
      throw new Error("No se encontraron resultados.");
    }
  };

  const centerMapOnAddress = async (address) => {
    try {
      const { longitude, latitude } = await geocodeAddress(address);
      setLatitude(latitude);
      setLongitude(longitude);
      setLat(latitude);
      setLng(longitude);
      setZoom(12.5);
      setToFly({ latitude: latitude, longitude: longitude, zoom: 14.5 });
    } catch (error) {
      console.error(error);
    }
  };

  function parser(expresion, tabla, campo, tipo) {
    // analizar la expresion para formar la condicion
    let cual = 1;
    let rango = false;
    let simbolo1 = "";
    let simbolo2 = "";
    let condicion = "";
    for (let i = 0; i < expresion.length; i += 1) {
      if (i > 100) return "";
      if (expresion[i] === ",") {
        if (rango === true) {
          if (simbolo1 !== "" && simbolo2 !== "") {
            // armar el rango  r1-r2
            // precio>=r1 && precio<=r2
            if (condicion !== "") {
              condicion = condicion + " or ";
            } else {
              condicion = "";
            }
            condicion =
              condicion +
              "(" +
              tabla +
              "." +
              campo +
              ">=" +
              tipo +
              simbolo1 +
              tipo +
              " and " +
              tabla +
              "." +
              campo +
              "<=" +
              tipo +
              simbolo2 +
              tipo +
              ")";
            simbolo1 = "";
            simbolo2 = "";
            cual = 1;
            rango = false;
          } else {
            return "Sintaxis error posición " + i;
          }
        } else {
          // no es un rango
          if (simbolo1 !== "") {
            if (condicion !== "") {
              condicion = condicion + " or ";
            } else {
              condicion = "";
            }
            condicion =
              condicion +
              "(" +
              tabla +
              "." +
              campo +
              "=" +
              tipo +
              simbolo1 +
              tipo +
              ")";
            simbolo1 = "";
            simbolo2 = "";
            cual = 1;
          } else {
            return "Sintaxis error posición " + i;
          }
        }
      }
      if (expresion[i] === "-") {
        if (simbolo1 !== "" && simbolo2 === "") {
          cual = 2;
          rango = true;
        } else {
          return "Error de sintáxis en la posición " + i;
        }
      }
      if (expresion[i] !== "," && expresion[i] !== "-") {
        if (expresion[i].indexOf("0123456789") !== 0) {
          if (cual === 1) {
            simbolo1 = simbolo1 + expresion[i];
          } else {
            simbolo2 = simbolo2 + expresion[i];
          }
        } else {
          return "Error de sintáxis en la posición " + i;
        }
      }
    }
    // final de la cadena ver que hay pendiente
    if (rango === true) {
      if (simbolo1.length !== 0 && simbolo2.length !== 0) {
        if (condicion.length !== 0) {
          condicion =
            condicion +
            " or ((" +
            tabla +
            "." +
            campo +
            ">=" +
            simbolo1 +
            ") and (" +
            tabla +
            "." +
            campo +
            "<=" +
            simbolo2 +
            "))";
        } else {
          condicion =
            "((" +
            tabla +
            "." +
            campo +
            ">=" +
            tipo +
            simbolo1 +
            tipo +
            ") and (" +
            tabla +
            "." +
            campo +
            "<=" +
            tipo +
            simbolo2 +
            tipo +
            "))";
        }
      } else return "Error de sintáxis en la última posición ";
    } else {
      if (simbolo1.length !== 0) {
        if (condicion.length !== 0) {
          condicion =
            condicion +
            " or (" +
            tabla +
            "." +
            campo +
            "=" +
            tipo +
            simbolo1 +
            tipo +
            ")";
        } else {
          condicion =
            "(" + tabla + "." + campo + "=" + tipo + simbolo1 + tipo + ")";
        }
      } else {
        return "Error de sintáxis en la última posición ";
      }
    }
    if (condicion.length !== 0) condicion = " and " + condicion;
    return condicion;
  }

  function forma_condicion() {
    condicion_filter = "";
    if (
      sessionStorage.getItem("filtro_productos") !== null &&
      sessionStorage.getItem("filtro_productos") !== undefined
    ) {
      //
      // Provincia
      //
      if (mprovincia !== null && mprovincia !== "") {
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter +
            " and (tablacatnegocios.provinvia=" +
            mprovincia +
            ")";
        } else {
          condicion_filter =
            " and (tablacatnegocios.provincia=" + mprovincia + ")";
        }
      }
      //
      // Naturaleza
      //
      if (mmunicipio !== null && mmunicipio !== "") {
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter +
            " and (tablacatnegocios.municipio=" +
            mmunicipio +
            ")";
        } else {
          condicion_filter =
            " and (tablacatnegocios.municipio=" + mmunicipio + ")";
        }
      }

      //
      // Naturaleza
      //
      if (mnaturaleza !== null && mnaturaleza !== "") {
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter + " and (naturaleza=" + mnaturaleza + ")";
        } else {
          condicion_filter = " and (naturaleza=" + mnaturaleza + ")";
        }
      }

      //
      // Hasta aqui Ubicación
      // Inicia Negocios
      //
      if (mtnegocio !== null && mtnegocio !== "") {
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter +
            " and (tablacatnegocios.categorianegocio=" +
            mtnegocio +
            ")";
        } else {
          condicion_filter =
            " and (tablacatnegocios.categorianegocio=" + mtnegocio + ")";
        }
      }
      if (mnegocio !== null && mnegocio !== "") {
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter +
            " and (tablacatnegocios.idnegocio=" +
            mnegocio +
            ")";
        } else {
          condicion_filter =
            " and (tablacatnegocios.idnegocio=" + mnegocio + ")";
        }
      }

      if (mproducto !== null && mproducto !== "") {
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter +
            " and (tablacatproductos.idproducto=" +
            mproducto +
            ")";
        } else {
          condicion_filter =
            " and (tablacatproductos.idproducto=" + mproducto + ")";
        }
      }
      //
      // Atributos
      //
      if (mdesc !== null && mdesc !== "") {
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter +
            " and instr(tablacatproductos.`desc`,'" +
            mdesc +
            "')>0";
        } else {
          condicion_filter =
            " and instr(tablacatproductos.`desc`,'" + mdesc + "')>0";
        }
      }
      if (mprecio !== null && mprecio !== "") {
        let tprecio = parser(mprecio, "tablacatproductos", "precio", "");
        if (condicion_filter.length !== 0) {
          condicion_filter = condicion_filter + tprecio;
        } else {
          condicion_filter = tprecio;
        }
      }

      //
      if (mdomicilio !== null && mdomicilio !== "") {
        let tcondicion = Number(mdomicilio) === 0 ? true : false;
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter +
            " and (tablacatproductos.domicilio=" +
            tcondicion +
            ")";
        } else {
          condicion_filter =
            " and (tablacatproductos.domicilio=" + tcondicion + ")";
        }
      }

      if (mabierto !== null && mabierto !== "") {
        let tabierto = Number(mabierto) === 0 ? 0 : 1;
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter +
            " and (tablacatproductos.ocupado=" +
            tabierto +
            ")";
        } else {
          condicion_filter = " and (tablacatproductos.ocupado=" + tabierto + ")";
        }
      }
    }
    return condicion_filter;
  }


  //************************/
  //  Código de filtrar     /
  //************************/
  async function init_filtrar() {
    setInicia(true);
    setShow1(true);


    // Tipos de Negocios
    
    let ttarraytnegocios = [];
    let resulttnegocios = await getcategoriasnegocios({negocio: ""});
    resulttnegocios = await resulttnegocios.json();

    if (resulttnegocios.error || resulttnegocios.length === 0) {
      setArraytnegocios(arraynotnegocios);
      ttarraytnegocios = arraynotnegocios;
    } else {
      setArraytnegocios(resulttnegocios);
      ttarraytnegocios = resulttnegocios;
    }
    setTnegocio(0);

    // Negocios del primer tipo  de negocio
    let ttarraynegocios = [];
    let resultnegocios = await getnegocios1({negocio: ""});
    resultnegocios = await resultnegocios.json();
    if (resultnegocios.error || resultnegocios.length === 0) {
      setArraynegocios(arraynonegocios);
      setTnegocios(arraynonegocios);
      ttarraynegocios = arraynonegocios;
    } else {
      setArraynegocios(resultnegocios);
      // filtrar los negocios del tipo de negocio activo.
      ttarraynegocios = resultnegocios.filter((item) => {
        if (item.categorianegocio === ttarraytnegocios[0].categorianegocio) {
          return item;
        }
      });
      if (ttarraynegocios.length !== 0) {
        setTnegocios(ttarraynegocios);
      } else {
        setTnegocios(arraynonegocios);
        ttarraynegocios = arraynonegocios;
      }
    }
    setNegocio(0);
    //**************************************************/
    // Productos del primer negocio                     /
    //**************************************************/
    
    let resultproductos = await getproductoscategoria({negocio: ""});
    resultproductos = await resultprovincias.json();

    if (resultproductos.error || resultproductos.length === 0) {
      setArrayproductos(arraynoproductos);
      setTproductos(arraynoproductos);
    } else {
      setArrayproductos(resultproductos);
      // filtrar los productos del primer negocio
      let ttarrayproductos = [];
      ttarrayproductos = resultproductos.filter((item) => {
        if (item.idnegocio === ttarraynegocios[0].idnegocio) {
          return item;
        }
      });
      if (ttarrayproductos.length !== 0) {
        setTproductos(ttarrayproductos);
      } else {
        setTproductos(arraynoproductos);
        ttarrayproductos = arraynoproductos;
      }
    }
    setProducto(0);

    //*****************/
    // Provincias      /
    //*****************/
    let resultprovincias = await getprovincias({});
    resultprovincias = await resultprovincias.json();
    if (!resultprovincias.error && resultprovincias.length !== 0) {
      setArrayprovincias(resultprovincias.data);
    }
    setProvincia(0);

    //*****************/
    // Municipios      /
    //*****************/
    let ttmunicipios = [];
    let resultmunicipios = await getmunicipios({});
    resultmunicipios = await resultmunicipios.json(); 
    
    if (resultmunicipios.error || resultmunicipios.length === 0) {
      setArraymunicipios(arraynomunicipios);
      setTmunicipios(arraynomunicipios);
      ttmunicipios = arraynomunicipios;
    } else {
      setArraymunicipios(resultmunicipios);
      ttmunicipios = resultmunicipios.filter((item, i) => {
        if (item.provincia === resultprovincias[0].provincia) {
          return item;
        }
      });
      if (ttmunicipios.length !== 0) {
        setTmunicipios(ttmunicipios);
      } else {
        setTmunicipios(arraynomunicipios);
      }
    }
    setMunicipio(0);
    setShow(filterState.show);
    setInicia(false);
  }

  async function calculateDistance(start, end) {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.join(
      ","
    )};${end.join(",")}?geometries=geojson&access_token=${config.mapBoxAPI}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data) {
        const distance = data.routes[0].distance;
        const duration = data.routes[0].duration;
        return { distancia: distance / 1000, duracion: duration / 60 };
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const lngLatSelected = async (point, lngLat) => {
    setLng(lngLat.lng);
    setLat(lngLat.lat);
    let lat1 = puntos[puntos.length - 1].lat;
    let lng1 = puntos[puntos.length - 1].lng;
    let ppuntos = puntosState + 1;
    if (puntosState === 0 || puntosState === 1) {
      setPuntosState(puntosState + 1);
      let info = puntosState === 0 ? "Origen" : "Destino";
      setPuntos([
        ...puntos,
        {
          lat: lngLat.lat,
          lng: lngLat.lng,
          image: marker,
          info: info,
          imageClassName: "",
        },
      ]);

      if (ppuntos === 1) {
        // Primer punto calcular distancia del producto al cliente
        //         const { distancia, duracion } = await calculateDistance([lng1,lat1], [lngLat.lng,lngLat.lat]);
        //         setCarrera(distancia.toFixed(2));
        //         setDuracion1((duracion+5).toFixed(2));
      }

      if (ppuntos === 2) {
        // Tengo los dos puntos calculo la distancia entre ellos (Desde Origen hasta Destino)
        const { distancia, duracion } = await calculateDistance(
          [lng1, lat1],
          [lngLat.lng, lngLat.lat]
        );
        setCarrera(distancia.toFixed(2));
        setDuracion(duracion.toFixed(2));
      }
    }

    if (puntosState === 2) {
      setCarrera(0);
      setPuntosState(1);
      puntos.splice(puntos.length - 2, 2);
      setPuntos([
        ...puntos,
        {
          lat: lngLat.lat,
          lng: lngLat.lng,
          image: marker,
          info: "Origen",
          imageClassName: "",
        },
      ]);
    }
  };

  const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };

  function handleInput(e) {
    switch (e.target.id) {
      case "cbubicacion":
        setCbubicacion(e.target.checked);
        break;
      case "cbprovincia":
        setCbprovincia(e.target.checked);
        cambia_provincia_cb(e.target.checked);
        break;
      case "provincia":
        setProvincia(e.target.value);
        cambia_provincia(e.target.value);
        break;
      case "cbmunicipio":
        setCbmunicipio(e.target.checked);
        cambia_municipio_cb(e.target.checked);
        break;
      case "municipio":
        setMunicipio(e.target.value);
        {
          /*}        cambia_municipio(e.target.value);*/
        }
        break;
      case "cbnaturaleza":
        setCbnaturaleza(e.target.checked);
        break;
      case "naturaleza":
        setNaturaleza(e.target.value);
        break;
      case "cbnegocioproducto":
        setCbnegocioproducto(e.target.checked);
        break;
      //*
      case "tnegocio":
        setTnegocio(e.target.value);
        cambia_tipo_tnegocio(
          arraytnegocios[Number(e.target.value)].categorianegocio
        );
        break;
      case "cbtnegocio":
        setCbtnegocio(e.target.checked);
        cambia_tipo_tnegocio_cb(e.target.checked);
        break;
      //*
      case "negocio":
        setNegocio(e.target.value);
        cambia_negocio(tnegocios[Number(e.target.value)].idnegocio);
        break;
      case "cbnegocio":
        setCbnegocio(e.target.checked);
        cambia_negocio_cb(e.target.checked);
        break;
      //*
      case "producto":
        setProducto(e.target.value);
        break;
      case "cbproducto":
        setCbproducto(e.target.checked);
        cambia_producto_cb(e.target.checked);
        break;
      case "cbatributos":
        setCbatributos(e.target.checked);
        break;
      case "cbprecio":
        setCbprecio(e.target.checked);
        break;
      case "precio":
        setPrecio(e.target.value);
        centerMapOnAddress(e.target.value);
        break;
      case "desc":
        setDesc(e.target.value);
        break;
      case "cbdomicilio":
        setCbdomicilio(e.target.checked);
        break;
      case "domicilio":
        setDomicilio(e.target.value);
        break;
      case "verOtraVez":
        setVerOtraVez(e.target.checked);
        break;
      case "cbabiertosn":
        setCbabiertosn(e.target.checked);
        break;
      case "abierto":
        setAbierto(e.target.value);
        break;
      case "cbdesc":
        setCbdesc(e.target.checked);
        break;
      default:
        break;
    }
  }

  //
  //
  function cambia_tipo_tnegocio(tnegocio) {
    let ttarraynegocios = [];
    setTnegocios(
      arraynegocios.filter((item, i) => {
        if (item.categorianegocio === tnegocio) {
          return item;
        }
      })
    );
    ttarraynegocios = arraynegocios.filter((item, i) => {
      if (item.categorianegocio === tnegocio) {
        return item;
      }
    });
    setTproductos(
      arrayproductos.filter((item, i) => {
        if (item.idnegocio === ttarraynegocios[0].idnegocio) {
          return item;
        }
      })
    );
  }

  function cambia_negocio(negocio) {
    setTproductos(
      arrayproductos.filter((item, i) => {
        if (item.idnegocio === negocio) {
          return item;
        }
      })
    );
  }
  //**************************//
  //  cambia_tipo_tnegocio_cb //
  //**************************//
  async function cambia_tipo_tnegocio_cb(cbtnegocio) {
    let ttarraynegocios = [];
    if (cbtnegocio) {
      // tnegocio true
      setTnegocio(0);
      if (cbnegocio) {
        // cbtnegocio y cbnegocio en true, mostrar negocios del primer tnegocio
        ttarraynegocios = arraynegocios.filter((item, i) => {
          if (item.categorianegocio === arraytnegocios[0].categorianegocio) {
            return item;
          }
        });
        if (ttarraynegocios.length !== 0) {
          setTnegocios(
            arraynegocios.filter((item) => {
              if (
                item.categorianegocio === arraytnegocios[0].categorianegocio
              ) {
                return item;
              }
            })
          );
        } else {
          setTnegocios(arraynonegocios);
        }
        setNegocio(0);
      }

      if (cbproducto) {
        //  producto en true
       
      }
    } else {
      // tipo de negocio se apaga
      // comprobar cbnegocio,cbcproducto, cbproduco
      if (cbnegocio) {
        // tiponegocio false y cbnegocio en true
        // mostrar todos los negocios
        setTnegocios(arraynegocios);
        ttarraynegocios = arraynegocios;
        setNegocio(0);
      } //cbnegocio true
      if (cbproducto) {
        //tnegocio false producto true

      }
    }
    setTnegocio(0);
  } // cambia_tipo_negocio_cb
  //****************************//
  // cambia_negocio_cb          //
  //****************************//
  async function cambia_negocio_cb(cbnegocio) {
    let ttarraynegocios = [];
    if (cbnegocio) {
      // cbnegocio cambia a true
      if (cbtnegocio) {
        // cbnegocio en true y cbtnegocio en true los negocios dependen
        // del tipo de negocio
        ttarraynegocios = arraynegocios.filter((item) => {
          if (
            item.categorianegocio === arraytnegocios[tnegocio].categorianegocio
          ) {
            return item;
          }
        });
        if (ttarraynegocios.length !== 0) {
          setTnegocios(
            arraynegocios.filter((item) => {
              if (
                item.categorianegocio ===
                arraytnegocios[tnegocio].categorianegocio
              ) {
                return item;
              }
            })
          );
        } else {
          setTnegocios(arraynonegocios);
        }
      } else {
        // tnegocio false mostrar todos los negocios
        setTnegocios(arraynegocios);
        ttarraynegocios = arraynegocios;
      }
      setNegocio(0);
      if (cbproducto) {
        // cbproducto a true verificar cbcproducto
        
      }
    } // cbnegocio cambia a true
    else {
      // cbnegocio cambia a false

      if (cbproducto) {
        // negocio false, producto true verificar cproducto y tnegocio

      }
    }
  }

  ///////////////////////
  // cambia_producto_cb /
  ///////////////////////
  async function cambia_producto_cb(cbproducto) {
    if (cbproducto) {
      // producto true;
      // verificar cbcproducto, cbnegocio, cbtnegocio
    }
  } // cambia_producto_cb

  function cambia_provincia(provincia) {
    let ttmunicipios = [];
    ttmunicipios = arraymunicipios.filter((item, i) => {
      if (item.provincia === arrayprovincias[provincia].provincia) {
        return item;
      }
    });
    if (ttmunicipios.length !== 0) {
      setTmunicipios(ttmunicipios);
    } else {
      setTmunicipios(arraynomunicipios);
      ttmunicipios = arraynomunicipios;
    }
    setMunicipio(0);
  }

  function cambia_provincia_cb(cbprovincia) {
    if (cbprovincia === false) {
      setCbmunicipio(false);
    }
  }

  function cambia_municipio_cb(cbmunicipio) {
    if (cbmunicipio !== false) {
      setCbprovincia(true);
    }
  }

  function ayuda1() {
    setContenido("Varios precios: 550,600,650 rango de precios: 700-1000");
    setShow(true);
  }

  function confirmar() {
    let filtro = false;
    // Ubicación
    if (cbprovincia === true) {
      sessionStorage.setItem("provincia", arrayprovincias[provincia].provincia);
      mprovincia = arrayprovincias[provincia].provincia;
      filtro = true;
    } else {
      sessionStorage.removeItem("provincia");
      mprovincia = "";
    }
    if (cbmunicipio === true) {
      sessionStorage.setItem("municipio", tmunicipios[municipio].municipio);
      mmunicipio = tmunicipios[municipio].municipio;
      filtro = true;
    } else {
      sessionStorage.removeItem("municipio");
      mmunicipio = "";
    }
    //*********************/
    // Naturalezas         /
    //*********************/
    if (cbnaturaleza === true) {
      sessionStorage.setItem(
        "naturaleza",
        arraynaturalezas[naturaleza].idnaturaleza
      );
      mnaturaleza = arraynaturalezas[naturaleza].idnaturaleza;
      filtro = true;
    } else {
      sessionStorage.removeItem("naturaleza");
      mnaturaleza = "";
    }

    //*********************/
    // Negocio-Productos   /
    //*********************/
    if (cbtnegocio === true) {
      sessionStorage.setItem(
        "tnegocio",
        arraytnegocios[tnegocio].categorianegocio
      );
      mtnegocio = arraytnegocios[tnegocio].categorianegocio;
      filtro = true;
    } else {
      sessionStorage.removeItem("tnegocio");
      mtnegocio = "";
    }
    if (cbnegocio === true) {
      sessionStorage.setItem("negocio", tnegocios[negocio].idnegocio);
      mnegocio = tnegocios[negocio].idnegocio;
      filtro = true;
    } else {
      sessionStorage.removeItem("negocio");
      mnegocio = "";
    }
    if (cbproducto === true) {
      sessionStorage.setItem("producto", tproductos[producto].idproducto);
      mproducto = tproductos[producto].idproducto;
      filtro = true;
    } else {
      sessionStorage.removeItem("producto");
      mproducto = "";
    }
    if (cbdesc === true) {
      sessionStorage.setItem("desc", desc);
      mdesc = desc;
      filtro = true;
    } else {
      sessionStorage.removeItem("desc");
      mdesc = "";
    }
    if (cbprecio === true) {
      sessionStorage.setItem("precio", precio);
      mprecio = precio;
      filtro = true;
    } else {
      sessionStorage.removeItem("precio");
      mprecio = "";
    }
    if (cbdomicilio === true) {
      sessionStorage.setItem("domicilio", cbdomicilio);
      mdomicilio = domicilio;
      filtro = true;
    } else {
      sessionStorage.removeItem("domicilio");
      mdomicilio = "";
    }
    if (cbabiertosn === true) {
      sessionStorage.setItem("abierto", abierto);
      mabierto = abierto;
      filtro = true;
    } else {
      sessionStorage.removeItem("abierto");
      mabierto = "";
    }
    if (filtro) {
      sessionStorage.setItem("filtro_productos", true);
      condicion_filter = forma_condicion();
      sessionStorage.setItem("condicion_filter", condicion_filter);
    } else {
      sessionStorage.removeItem("filtro_productos");
      sessionStorage.setItem("condicion_filter", "");
      condicion_filter = "";
    }
    setFilterState({ type: "set", newvalue: false });
    init1();
  }

  function borrarfiltro() {
    setCbubicacion(false);
    setCbprovincia(false);
    setCbmunicipio(false);
    setCbnegocioproducto(false);
    setCbtnegocio(false);
    setCbnegocio(false);
    setCbproducto(false);
    setCbatributos(false);
    setCbdesc(false);
    setDesc("");
    setCbprecio(false);
    setCbdomicilio(false);
    setCbabiertosn(false);
    sessionStorage.removeItem("filtro_productos");
    sessionStorage.setItem("condicion_filter", "");
    condicion_filter = "";
    setFilterState({ type: "set", newvalue: false });
    init1();
  }
  //
  async function paresGps() {
    let resultgps = await getparesgpsnaturaleza({ naturaleza: naturaleza1});
    resultgps = await resultgps.json();

    let paresgps = [];
    let itemst = [];
    resultgps.data.forEach((item) => {
      paresgps.push({
        lat: item.latitud,
        lng: item.longitud,
        image: libre,
        info: item.nombre,
        imageClassName: "",
      });
      itemst.push({
        idproducto: item.idproducto,
        tarifa: item.tarifa,
        costoDomicilio: item.costoDomicilio,
      });
      setPuntos(paresgps);
      setItems(itemst);
    });
    setViewCarrito(paresgps.length > 0);
  }
  //

  function init() {
    setNivel(parsedParams.nivel !== undefined ? parsedParams.nivel : nivel);
    setNaturaleza1(
      parsedParams.naturaleza !== undefined
        ? parsedParams.naturaleza
        : naturaleza1
    );
    setIdowner(
      parsedParams.idowner === "undefined"
        ? parsedParams.owner
        : parsedParams.idowner
    );
    if (
      sessionStorage.getItem("pnaturaleza") === "" ||
      sessionStorage.getItem("pnaturaleza") === undefined ||
      sessionStorage.getItem("pnaturaleza") === null
    ) {
      sessionStorage.setItem(
        "pnaturaleza",
        parsedParams.naturaleza === "26" ? 0 : parsedParams.naturaleza
      );
      sessionStorage.setItem("pdesc", parsedParams.nombre);
      sessionStorage.setItem(
        "pcondicion",
        parsedParams.condicion === "" ? "" : parsedParams.condicion
      );
      sessionStorage.setItem("ptipo", parsedParams.campo1);
      sessionStorage.setItem("pnohay", parsedParams.nohay);
      sessionStorage.setItem("pnaturalezas", parsedParams.naturalezas);
    }
    sessionStorage.setItem("carditem", 0);
    sessionStorage.setItem("naturaleza", parsedParams.naturaleza);
    sessionStorage.setItem("idowner", parsedParams.idowner);
    sessionStorage.setItem("nivel", parsedParams.nivel);

    init_filtrar();
    init1();
  }

  function verproducto(i) {
    //setShowproducto(true);
    navigate(
      `/infoproducto?idproducto=${result[i].keyproducto}&naturaleza=${naturaleza1}`
    );
  }

  function vernegocio(i) {
    //    setShownegocio(true);
    navigate(`/infonegocio?idnegocio=${result[i].idnegocio}`);
  }

  function selectcard(i) {
    document.getElementById(
      `card-${sessionStorage.getItem("carditem")}`
    ).className = "card-row card-selec";
    document.getElementById(`card-${i}`).className =
      "card-row card-selec-border";
    sessionStorage.setItem("carditem", i);
    setBotones(!botones);
  }

  async function init1() {
    setShow1(true);
    setInicia(true);
    //
    // poner nombre en cooki
    //
    setNombre(sessionStorage.getItem("pdesc"));
    sessionStorage.setItem("filtro", "Productos");
    if (
      sessionStorage.getItem("filtro_productos") === null ||
      sessionStorage.getItem("filtro_productos") === "" ||
      sessionStorage.getItem("filtro_productos") === undefined
    ) {
      condicion_filter = "";
      sessionStorage.removeItem("provincia");
      sessionStorage.removeItem("municipio");
      sessionStorage.removeItem("poblado");
      sessionStorage.removeItem("reparto");
      sessionStorage.removeItem("cercade");
      sessionStorage.removeItem("tnegocio");
      sessionStorage.removeItem("negocio");
      sessionStorage.removeItem("producto");
      sessionStorage.removeItem("desc");
      sessionStorage.removeItem("precio");
      sessionStorage.removeItem("domicilio");
      sessionStorage.removeItem("abierto");
    } else {
      condicion_filter = forma_condicion();
    }
    //poner en cooki todos los parametros y pasar las cookis no los param,
    //pasar la condicion del filtro

    let result1 = await getproductos({naturaleza: sessionStorage.getItem("pnaturaleza"), desc: sessionStorage.getItem("pdesc"),condicion: sessionStorage.getItem("pcondicion"),
                                     tipo: sessionStorage.getItem("ptipo"), condicion_filter, naturalezas: sessionStorage.getItem("pnaturalezas")});
    result1 = await result1.json();

    const newResult = [];
    if (result1.error || result1.length === 0) {
      newResult.push({
        descnaturaleza: "",
        keyproducto: 0,
        negocio: "",
        categoria: "",
        Producto: result1.data.error,
        photo: "./galerias/app_images/destodo/logo.jpg",
      });
      setResult(newResult);
      setNoproducto(true);
    } else {
      setNoproducto(false);
      result1.forEach((item, i) => {
        const obj = {
          keyproducto: item.keyproducto,
          idnegocio: item.idnegocio,
          xxxNegocio: item.negocio,
          Producto: item.descripcion,
          photo:
            "./galerias/app_images/productos/" +
            item.keyproducto +
            "/foto-1.jpg",
          user: item.iduser,
          tipouser: item.tipouser,
          ocupado: item.ocupado,
          tarifa: item.tarifa,
          costoDomicilio: item.costoDomicilio,
        };
        if (result1[0].idnaturaleza === 62) {
          obj.Habilidades = item.adicional;
        } else {
          obj.Requisitos = item.adicional;
        }
        newResult.push(obj);
      });
      setCantidadproductos(result1.length);
      setResult(newResult);
    }

    // Obtener el contenido de la foto de perfil
    contenidofoto.splice(0, contenidofoto.length);
    for (let i = 0; i < newResult.length; i += 1) {
        let resultado = await getJpgFile({ file: newResult[i].photo, i });
        resultado = await resultado.text();

      if (resultado.length !== 0 && resultado.error === undefined) {
        contenidofoto.push(resultado);
      }
    }
    sessionStorage.setItem("carditem", 0);
    let natura =
      parsedParams.naturaleza === undefined
        ? naturaleza1
        : parsedParams.naturaleza;

        let resultgps = await getparesgpsnaturaleza({ naturaleza: natura});
        resultgps = await resultgps.json();
        
    let paresgps = [];
    let itemst = [];
    resultgps.forEach((item) => {
      paresgps.push({
        lat: item.latitud,
        lng: item.longitud,
        image: libre,
        info: item.nombre,
        imageClassName: "",
      });
      itemst.push({
        idproducto: item.idproducto,
        tarifa: item.tarifa,
        costoDomicilio: item.costoDomicilio,
      });
      setPuntos(paresgps);
      setItems(itemst);
    });
    setViewCarrito(paresgps.length > 0);
    setInicia(false);
    setShow1(false);
  }

  async function shooping() {
    if (showMap === true) {
      // Insertar el movimiento y poner showmap en false
      let tindex = puntos.length;

        setMovimientosNew({ idmovimiento: 1, idproducto: idproductot, latOrigen: puntos[tindex - 2].lat, latDestino: puntos[tindex - 1].lat, lngOrigen: puntos[tindex - 2].lng,
        lngDestino: puntos[tindex - 1].lng, precio: carrera * items[index].tarifa + items[index].costoDomicilio, kms: carrera,});
        await updateOcupado({idproducto: idproductot, ocupado: 1 });
  
    }

    setPuntosState(0);
    init();
    setShowMap(!showMap);
  }

  function onModalClose9() {}

  async function otroPunto() {
    let menor = 999999;
    let esta = 0;
    let dura = 0;
    let tpuntos = [...puntos];
    for (let i = 0; i < tpuntos.length - 1; i += 1) {
      let tindex = 0;
      if (puntosState !== 0 && i <= tpuntos.length - (puntosState + 1)) {
        tindex = puntosState;
        //esta = distanciaEnKilometros(puntos[puntos.length - tindex].lat, puntos[puntos.length - tindex].lng, item.lat, item.lng).toFixed(2);
        const { distancia, duracion } = await calculateDistance(
          [
            tpuntos[tpuntos.length - tindex].lng,
            tpuntos[tpuntos.length - tindex].lat,
          ],
          [tpuntos[i].lng, puntos[i].lat]
        );
        esta = distancia.toFixed(2);
        dura = duracion;
      }
      if (Number(esta) < Number(menor)) {
        menor = esta;
        setProductot(tpuntos[i].info);
        setIdroductot(items[i].idproducto);
        setTarifa(items[i].tarifa);
        setCostoDomicilio(items[i].costoDomicilio);
        tpuntos.forEach((item, i) => {
          tpuntos[i].imageClassName = "";
        });
        tpuntos[i].imageClassName = "iconoGrande";
        setDuracion1(dura.toFixed(2));
        setIndex(i);
      }
    }
    setPuntos(tpuntos);
    setMascerca(menor);
  }
  
  useEffect(() => {
    if (puntos.length !== 0) {
      otroPunto();
    }
  }, [lng]);

  function onModalClose() {
    setFilterState({ type: "set", newvalue: false });
  }

  useEffect(() => {
    setShow(filterState.show);
  }, [filterState]);

  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location]);

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Modal
        visible={show}
        onClose={onModalClose9}
        className="cmodal wmodal"
        classContainer="modal-productos"
      >
        {inicia === false ? (
          <>
            <div className="cerrar-button">
              <button className="cerrar" onClick={onModalClose}>
                X
              </button>
            </div>
            <div className="modal-filter-title">
              <label className="label-filter-title">Filtrar</label>
            </div>
            <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
              <div className="check-ubicacion">
                <Checkbox
                  className="cbox-ubicacion"
                  id="cbubicacion"
                  color="checkbox"
                  defaultChecked
                  checked={cbubicacion}
                  onClick={handleInput}
                />
                <label className="check-ubi">Ubicacion</label>
              </div>
              {cbubicacion ? (
                <>
                  <div className="check-ubicacion-provincia">
                    <Checkbox
                      className="cbox-ubicacion-provincia"
                      id="cbprovincia"
                      color="checkbox"
                      defaultChecked
                      checked={cbprovincia}
                      onClick={handleInput}
                    />
                    <label className="check-label-ubicacion-provincia">
                      Provincia
                    </label>
                    {cbprovincia ? (
                      <select
                        className="select-ubicacion-provincia"
                        id="provincia"
                        onChange={handleInput}
                        value={provincia}
                      >
                        {arrayprovincias.map((item, i) => {
                          return (
                            <option key={i} value={i}>
                              {item.desc}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="check-ubicacion-provincia">
                    <Checkbox
                      className="cbox-ubicacion-municipio"
                      id="cbmunicipio"
                      color="checkbox"
                      defaultChecked
                      checked={cbmunicipio}
                      onClick={handleInput}
                    />
                    <label className="check-label-ubicacion-municipio">
                      Municipio
                    </label>
                    {cbmunicipio ? (
                      <select
                        className="select-ubicacion-municipio"
                        id="municipio"
                        onChange={handleInput}
                        value={municipio}
                      >
                        {tmunicipios.map((item, i) => {
                          return (
                            <option key={i} value={i}>
                              {item.desc}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              ) : (
                ""
              )}

              <div>
                <Checkbox
                  className="cbox-negocio-producto"
                  id="cbnegocioproducto"
                  color="checkbox"
                  defaultChecked
                  checked={cbnegocioproducto}
                  onClick={handleInput}
                />
                <label className="check-neg-prod">Negocio-Productos</label>
              </div>
              {cbnegocioproducto ? (
                <>
                  <div className="cbox-negocioproducto">
                    <Checkbox
                      className="cbox-Tnegocio"
                      id="cbtnegocio"
                      color="checkbox"
                      defaultChecked
                      checked={cbtnegocio}
                      onClick={handleInput}
                    />
                    <label className="check-ubi">Tipo Negocio:</label>
                    {cbtnegocio ? (
                      <select
                        className="select-tnegocio"
                        id="tnegocio"
                        onChange={handleInput}
                        value={tnegocio}
                      >
                        {arraytnegocios.map((item, i) => {
                          return (
                            <option key={i} value={i}>
                              {item.desc}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="cbox-negocioproducto">
                    <Checkbox
                      className="cbox-negocio"
                      id="cbnegocio"
                      color="checkbox"
                      defaultChecked
                      checked={cbnegocio}
                      onClick={handleInput}
                    />
                    <label className="check-ubi">Negocios:</label>
                    {cbnegocio ? (
                      <select
                        className="select-negocio"
                        id="negocio"
                        onChange={handleInput}
                        value={negocio}
                      >
                        {tnegocios.map((item, i) => {
                          return (
                            <option key={i} value={i}>
                              {item.desc}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="cbox-negocioproducto">
                    <Checkbox
                      className="cbox-producto"
                      id="cbproducto"
                      color="checkbox"
                      defaultChecked
                      checked={cbproducto}
                      onClick={handleInput}
                    />
                    <label className="check-ubi">Productos:</label>
                    {cbproducto ? (
                      <select
                        className="select-productos"
                        id="producto"
                        onChange={handleInput}
                        value={producto}
                      >
                        {tproductos.map((item, i) => {
                          return (
                            <option key={i} value={i}>
                              {item.desc}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              ) : (
                ""
              )}
              <div>
                <Checkbox
                  className="cbox-atributos"
                  id="cbatributos"
                  color="checkbox"
                  defaultChecked
                  checked={cbatributos}
                  onClick={handleInput}
                />
                <label className="check-neg-prod">Atributos-Productos</label>
              </div>
              {cbatributos ? (
                <>
                  <div className="atributos">
                    <Checkbox
                      className="cbox-desc"
                      id="cbdesc"
                      color="checkbox"
                      defaultChecked
                      checked={cbdesc}
                      onClick={handleInput}
                    />
                    <label className="check-ubi">Descripción</label>
                    {cbdesc ? (
                      <>
                        <input
                          className="input-desc"
                          id="desc"
                          value={desc}
                          onChange={handleInput}
                          type="text"
                          placeholder="<disco duro>"
                          required
                        />
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="atributos">
                    <Checkbox
                      className="cbox-precio"
                      id="cbprecio"
                      color="checkbox"
                      defaultChecked
                      checked={cbprecio}
                      onClick={handleInput}
                    />
                    <label className="check-ubi">Precio</label>
                    {cbprecio ? (
                      <>
                        <input
                          className="input-precio"
                          id="precio"
                          value={precio}
                          onChange={handleInput}
                          type="text"
                          placeholder="550,600,650,700-1000"
                          required
                        />
                        <Tippy content="Ayuda">
                          <button
                            type="button"
                            className="button-filtrar-?1 primary"
                            onClick={ayuda1}
                          >
                            ?
                          </button>
                        </Tippy>
                      </>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="atributos">
                    <Checkbox
                      className="check-domicilio"
                      id="cbdomicilio"
                      color="checkbox"
                      defaultChecked
                      checked={cbdomicilio}
                      onClick={handleInput}
                    />
                    <Tippy content="Filtrar las ofertas con entraga a domicilio">
                      <label className="label-domicilio">¿Domicilio?</label>
                    </Tippy>
                    {cbdomicilio === true ? (
                      <select
                        className="select-filtrar-domicilio"
                        id="domicilio"
                        onChange={handleInput}
                        value={domicilio}
                      >
                        {opciones.map((item, i) => {
                          return (
                            <option key={i} value={i}>
                              {item.desc}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="atributos">
                    <Checkbox
                      className="check-abiertosn"
                      id="cbabiertosn"
                      color="checkbox"
                      defaultChecked
                      checked={cbabiertosn}
                      onClick={handleInput}
                    />
                    <Tippy content="Filtrar los establecimientos abiertos">
                      <label className="label-abiertosn">¿Abierto/Libre?</label>
                    </Tippy>
                    {cbabiertosn === true ? (
                      <select
                        className="select-filtrar-abierto"
                        id="abierto"
                        onChange={handleInput}
                        value={abierto}
                      >
                        {opciones.map((item, i) => {
                          return (
                            <option key={i} value={i}>
                              {item.desc}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              ) : (
                ""
              )}
            </Box>

            <div className="grupo-button-filtrar">
              <Tippy content="Aplicar el filtro">
                <button
                  type="button"
                  className="button-filtrar-1 primary"
                  onClick={confirmar}
                >
                  <Check />
                </button>
              </Tippy>
              <Tippy content="Eliminar todos los filtros">
                <button
                  type="button"
                  className="button-filtrar-2 primary"
                  onClick={borrarfiltro}
                >
                  <FilterAltOff />
                </button>
              </Tippy>
              <Tippy content="Clic para volver">
                <button
                  type="button"
                  className="button-filtrar-3 primary"
                  onClick={onModalClose}
                >
                  <ArrowBack />
                </button>
              </Tippy>
            </div>
          </>
        ) : (
          ""
        )}
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
                  : "Cerrar la sesión de " +
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
          nivel={1}
        />
        <Hero>
          <div className={"productos-cabeza"}>
            <IconButton
              color="primary"
              onClick={() => {
                navigate(
                  `/?naturaleza=${41}&idowner=${idowner}&nivel=${nivel}`
                );
              }}
            >
              <ArrowBack />
            </IconButton>

            <h3 className="h1-cabeza-productos">DesTodo</h3>
            <h4 className="h3-cabeza-productos-1">
              {" "}
              - {nombre.replaceAll("%20", " ")} - ({cantidadproductos})
            </h4>
            {(puntosState === 2 && viewCarrito) ||
            (showMap !== true && puntos.length !== 0 && viewCarrito) ? (
              <Tippy content={`Ordenar un producto`}>
                <button
                  type="button"
                  className="car negocio-button primary"
                  onClick={shooping}
                >
                  <ShoppingCartOutlinedIcon />
                </button>
              </Tippy>
            ) : (
              ""
            )}
            {showMap !== true && mascerca > 0 ? (
              <div className="verOtraVez">
                <label className="label-datos-productos input-productos-12">
                  Ver otra vez:
                </label>
                <Checkbox
                  sx={{ padding: 0 }}
                  id="verOtraVez"
                  color="checkbox"
                  defaultChecked
                  checked={verOtraVez}
                  onClick={handleInput}
                />
              </div>
            ) : (
              ""
            )}

          </div>
          {show1 ? (
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

          {(showMap === true && mascerca > 0 && mascerca != 999999) ||
          (verOtraVez === true && mascerca > 0 && mascerca != 999999) ? (
            <>
              <div className="result">
                {productot}
                {" esta a "}
                {mascerca}
                {" Kms y "}
                {duracion1}
                {" minutos,"}
                {" la carrera es de "}
                {carrera}
                {" Kms y "}
                {duracion}
                {" minutos, precio: "}
                {(carrera * tarifa + costoDomicilio).toFixed(2)}
              </div>
            </>
          ) : (
            ""
          )}

          {inicia === false && showMap !== true ? (
            <div className="product-flex">
              {result.map((item, i) => (
                <CardRow
                  tipouser={sessionStorage.getItem("tipouser")}
                  user={sessionStorage.getItem("user")}
                  mapLoading={mapLoading}
                  noproducto={noproducto}
                  onMapClick={() => {
                    setLat(item.latitud);
                    setLng(item.longitud);
                    setShowrow3(true);
                  }}
                  verproducto={verproducto}
                  vernegocio={vernegocio}
                  paresGps={paresGps}
                  key={i}
                  i={i}
                  selectcard={selectcard}
                  contenidofoto={contenidofoto[i]}
                  item={item}
                />
              ))}
            </div>
          ) : (
            ""
          )}
          <div className="mapa-productos">
            {showMap === true ? (
              <>
                <Tippy content={`Cerrar mapa`}>
                  <button
                    className="offon-info-producto"
                    onClick={() => setShowMap(!showMap)}
                  >
                    <Close />
                  </button>
                </Tippy>
                <Map
                  points={puntos}
                  sx={{ height: "900px", width: "100%" }}
                  onMapClick={lngLatSelected}
                  remoteshowMap={showMap}
                  flyTo={toFly}
                  tindex={index}
                  lat={lat}
                  lng={lng}
                  onChange={onChangeMap}
                  remoteZoom={zoom}
                />
              </>
            ) : (
              ""
            )}
          </div>
        </Hero>
      </div>
    </>
  );
};

export default Productos;
