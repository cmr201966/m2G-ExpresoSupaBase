import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import { useNavigate } from "react-router-dom";

// components
import Map from "../../components/Map/MapBox";
import Navbar from "../../components/Navbar/Navbar";
import Encabezado from "../../components/Encabezado/Encabezado";

// layouts
import Hero from "../../layouts/Hero/Hero";

// @mui/material
import { Box, CircularProgress, IconButton } from "@mui/material";
// @mui/icons
import {
  WhatsApp,
  ShoppingCartOutlined,
  PowerSettingsNew,
} from "@mui/icons-material";

// assets
import marker from "../../assets/images/custom_marker.png";
import libre from "../../assets/images/libre.png";
import off from "../../assets/images/ocupado.png";

// utils
import { isValid, getFilesInFolderSB, getJpgFileSB } from "../../Utiles/Utiles";
import {
  getInfoProductoCM,
  getParesGpsProductoCM,
  setMovimientosNewCM,
  updateOcupadoCM,
  registraWS,
} from "../../Utiles/apiBaseDatos";

// config
import config from "../../config";

// styles
import "./styles.css";

const InfoProducto = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {};
  const [showcircularProgress, setshowCircularProgress] = useState(true);
  const [showMap] = useState(true);
  // Estados para la posición GPS del mapa
  const [lng, setLng] = useState(-75.829090519);
  const [lat, setLat] = useState(20.0217583);
  const [zoom] = useState(12.5);
  const [contenidofoto, setContenidofoto] = useState();
  const [idproducto, setIdproducto] = useState("");
  const [negocio, setNegocio] = useState("");
  const [producto, setProducto] = useState("");
  const [precio, setPrecio] = useState("");
  const [ocupado, setOcupado] = useState(9);
  const [marca, setMarca] = useState("");
  const [color, setColor] = useState("");
  const [chapa, setChapa] = useState("");
  const [celular, setCelular] = useState("");
  const [accion, setAccion] = useState("");
  const [inicio, setInicio] = useState(true);
  const [gps, setGps] = useState(true);
  const [puntos, setPuntos] = useState([]);
  const [distancia, setDistancia] = useState(0);
  const [tarifa, setTarifa] = useState(1);
  const [info, setInfo] = useState("");
  const [costoDomicilio, setCostoDomicilio] = useState(50);
  const [domicilio, setDomicilio] = useState(50);
  const [puntosState, setPuntosState] = useState(0);
  const [carrera, setCarrera] = useState(0);
  const [usert, setUsert] = useState("");
  const [arrayFotos, setArrayFotos] = useState([]);
  const [arrayFotoInfo, setArrayFotoInfo] = useState([]);
  const url = `https://wa.me/${celular}?text=`;
  //  const [duracion, setDuracion] = useState(0);

  async function init() {
    let idsb = "";
    let result = await getInfoProductoCM(parsedParams.idproducto);
    if (isValid(result) === true) {
      setIdproducto(parsedParams.idproducto);
      setUsert(result[0].idnegocio);
      setNegocio(result[0].negocio);
      setProducto(result[0].producto);
      setPrecio(result[0].precio);
      setOcupado(result[0].ocupado);
      setMarca(result[0].marca);
      setColor(result[0].color);
      setChapa(result[0].chapa);
      setCelular(result[0].celular);
      setGps(result[0].gpssn);
      setTarifa(result[0].tarifa);
      setCostoDomicilio(result[0].costodomicilio);
      setDomicilio(result[0].domicilio);
      setAccion(result[0].accion);
      setLat(result[0].latitud);
      setLng(result[0].longitud);
      setInfo(result[0].info);
      idsb = result[0].idsb;
    }
    result = await getParesGpsProductoCM(
      parsedParams.categoria,
      parsedParams.idproducto
    );
    //    result= await getParesGpsProducto(parsedParams.categoria,  parsedParams.idproducto);
    let paresGps = [];
    result.forEach((item) => {
      paresGps.push({
        lat: item.latitud,
        lng: item.longitud,
        image: item.ocupado === 0 ? libre : off,
        info: item.nombre,
      });
    });
    setPuntos(paresGps);

    //    sessionStorage.setItem("categoria",parsedParams.categoria);
    let resultFiles = await getFilesInFolderSB(
      "./galerias/app_images/productos/" + parsedParams.idproducto,
      "productos/" + parsedParams.idproducto,
      "galerias"
    );
    setArrayFotos(resultFiles);
    let tarray = [];
    for (let i = 0; i < resultFiles.length; i += 1) {
      if (resultFiles[i].indexOf(".jpg") === -1) resultFiles.splice(i, 1);
    }

    for (let i = 0; i < resultFiles.length; i += 1) {
      let resultimg = await getJpgFileSB(
        resultFiles[i],
        "./galerias/app_images/productos/" + parsedParams.idproducto,
        "productos/" + parsedParams.idproducto,
        idsb
      );
      if (isValid(resultimg.url) === false || resultimg.url === "")
        tarray.push(resultimg);
      if (isValid(resultimg.url) === true) tarray.push(resultimg.url);
      setArrayFotoInfo(tarray);
    }
    setContenidofoto(tarray[0]);
    setInicio(false);
    setshowCircularProgress(false);
  }

  const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };

  async function calculateDistance(start, end) {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.join(
      //    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start.join(
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
    if (ocupado === 1) return;
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
        { lat: lngLat.lat, lng: lngLat.lng, image: marker, info: info },
      ]);
      if (ppuntos === 2) {
        // Tengo los dos puntos calculo la distancia entre ellos (Desde Origen hasta Destino)
        const { distancia, duracion } = await calculateDistance(
          [lng1, lat1],
          [lngLat.lng, lngLat.lat]
        );
        setCarrera(distancia.toFixed(2));
        //setDuracion(duracion.toFixed(2));
      }
    }
    if (puntosState === 2) {
      setCarrera(0);
      setPuntosState(1);
      puntos.splice(puntos.length - 2, 2);
      setPuntos([
        ...puntos,
        { lat: lngLat.lat, lng: lngLat.lng, image: marker, info: "Origen" },
      ]);
    }
  };

  const calcularDistanciaEntreDosCoordenadas = (lat1, lon1, lat2, lon2) => {
    // Convertir todas las coordenadas a radianes
    lat1 = gradosARadianes(lat1);
    lon1 = gradosARadianes(lon1);
    lat2 = gradosARadianes(lat2);
    lon2 = gradosARadianes(lon2);
    // Aplicar fórmula
    const RADIO_TIERRA_EN_KILOMETROS = 6371;
    let diferenciaEntreLongitudes = lon2 - lon1;
    let diferenciaEntreLatitudes = lat2 - lat1;
    let a =
      Math.pow(Math.sin(diferenciaEntreLatitudes / 2.0), 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.pow(Math.sin(diferenciaEntreLongitudes / 2.0), 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return RADIO_TIERRA_EN_KILOMETROS * c;
  };

  const gradosARadianes = (grados) => {
    return (grados * Math.PI) / 180;
  };

  const distanciaEnKilometros = (latitud1, longitud1, latitud2, longitud2) => {
    return calcularDistanciaEntreDosCoordenadas(
      latitud1,
      longitud1,
      latitud2,
      longitud2
    );
  };

  async function shooping() {
if (sessionStorage.getItem("idapp") === "Expreso"){
      if (showMap === true) {
         let tindex = puntos.length;
         // hay que pasar el user del chofer
         let latOrigen = tindex < 3 ? 0 : puntos[tindex - 2].lat;
         let latDestino = tindex < 3 ? 0 : puntos[tindex - 1].lat;
         let lngOrigen = tindex < 3 ? 0 : puntos[tindex - 2].lng;
         let lngDestino = tindex < 3 ? 0 : puntos[tindex - 1].lng;
         setMovimientosNewCM(
            1,
            idproducto,
            latOrigen,
            latDestino,
            lngOrigen,
            lngDestino,
            carrera * tarifa + costoDomicilio,
            carrera,
            usert
        );
        setOcupado(true);
        updateOcupadoCM(idproducto, 1);
      }
      setPuntos([]);
      setPuntosState(0);
    }
    else{ 
      ordenar();
    }
  }

  function viewPhoto(i) {
    setContenidofoto(arrayFotoInfo[i]);
  }

  function registraws(){
    registraWS("P" + idproducto);
  }

  function ordenar(){
    navigate(`/contrato?keyproducto=${idproducto}&dueno=${sessionStorage.getItem("user")}`);
  }

  useEffect(() => {
    if (ocupado === 1) {
      return;
    }
    if (puntos.length !== 0 && puntosState == 1) {
      setDistancia(
        distanciaEnKilometros(lat, lng, puntos[0].lat, puntos[0].lng).toFixed(2)
      );
    }
  }, [lng]);

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
    <div className="Info-Productos">
      <Navbar nivel={1} />
      <Hero>
        {showcircularProgress ? (
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
          <Encabezado />
        )}

        {inicio === false ? (
          <div className="div-papa-info">
            <section className="main-info">
              {showMap === true ? (
                <>
                  <span className="encabezado-info">{producto}</span>
                  <div className="info-content">
                    <div className="perfil-info-1">
                      <div className="img-class-info">
                        <img
                          className="img-info"
                          src={contenidofoto}
                          alt="Imagen del producto"
                        />
                        <Tippy content={`Libre/Ocupado`}>
                          <button
                            className={`info-image ${
                              ocupado === 0 ? "info-image-on" : "info-image-off"
                            }`}
                            disabled={true}
                          >
                            <PowerSettingsNew />
                          </button>
                        </Tippy>
                      </div>

                      <div className="sliderVertical">
                        {arrayFotos.map((item, i) => (
                          <div key={i} className="producto-fotos">
                            <img
                              className="img-info-lateral"
                              src={arrayFotoInfo[i]}
                              alt="Imagen del producto"
                              onClick={() => viewPhoto(i)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="agrupa-info">
                      <div className="info-1">
                        <div className="ws">
                          <span className="strong font-size1">
                            Datos del producto
                          </span>
                          <Tippy content={`${accion} via WhatsApp`}>
                            <a
                              href={url}
                              onClick={registraws}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <WhatsApp className="ws-1" />
                            </a>
                          </Tippy>
                          {((distancia !== 0 &&
                          showMap === true &&
                          puntosState === 2 &&
                          domicilio === 1) ||
                          (domicilio === 1 && ocupado === 0)) &&
                          (sessionStorage.getItem("sgbd").toLocaleUpperCase() ===
                          "MYSQL") || (ocupado===0 && info===false)  ? (
                          <>
                            <Tippy content={`${accion}`}>
                              <IconButton
                                sx={{
                                  padding: 0,
                                }}
                                id="tool"
                                color="inherit"
                                onClick={shooping}
                              >
                                <ShoppingCartOutlined />
                              </IconButton>
                            </Tippy>
                          </>
                        ) : (
                          ""
                        )}
                        </div>                       
                        <span>{negocio}</span>
                        {isValid(precio) === true && precio !== 0 ? (
                          <span>{precio}</span>
                        ) : (
                          ""
                        )}
                        {isValid(marca) === true && marca !== "" ? (
                          <span>{marca}</span>
                        ) : (
                          ""
                        )}

                        {isValid(color) === true && color !== "" ? (
                          <p>{color}</p>
                        ) : (
                          ""
                        )}
                        {isValid(chapa) === true && chapa !== "" ? (
                          <p>{chapa}</p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </section>
            <div className="mapa-1">
              {inicio === false &&
              gps === 1 &&
              showMap === true &&
              puntos.length > 0 ? (
                <section className="mapa">
                  {domicilio === 1 && puntos.length > 1 ? (
                    <div className="parrafo distancia">
                      <p>{puntos[0].info}</p>
                      <p>{" esta a "}</p>
                      <p>
                        {distancia}
                        {" KMS carrera "}
                        {carrera}
                        {" Kms "}
                        {" Precio: "}
                        {(carrera * tarifa + costoDomicilio).toFixed(0)}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                  <Map
                    points={puntos}
                    sx={{ height: "340px", width: "100%" }}
                    onMapClick={lngLatSelected}
                    remoteshowMap={showMap}
                    lat={lat}
                    lng={lng}
                    onChange={onChangeMap}
                    remoteZoom={zoom}
                  />
                  :
                </section>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </Hero>
    </div>
  );
};

export default InfoProducto;
