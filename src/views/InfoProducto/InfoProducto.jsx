import Tippy from "@tippyjs/react";
// components
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../layouts/Hero/Hero";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import ComGalerias from "../../components/ComGalerias/ComGalerias";
import Map from "../../components/Map/MapBox";
import { useLocation } from "react-router-dom";

// styles
import "./styles.css";
import libre from "../../assets/images/libre.png";
import off from "../../assets/images/ocupado.png";

const InfoProducto = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {};
  const [desctmp, setdesctmp] = useState("Galerias");
  const [showMap, setShowMap] = useState(true);
  // Estados para la posición GPS del mapa
  const [lng, setLng] = useState(-75.829090519);
  const [lat, setLat] = useState(20.0217583);
  const [zoom, setZoom] = useState(12.5);
  const [contenidofoto, setContenidofoto] = useState();
  const [idproducto, setIdproducto] = useState("");
  const [negocio, setNegocio] = useState("");
  const [producto, setProducto] = useState("");
  const [precio, setPrecio] = useState("");
  const [ocupado, setOcupado] = useState(9);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [inicio, setInicio] = useState(true);
  const [gps, setGps] = useState(true);
  const [puntos, setPuntos] = useState([]);
  const [naturaleza1, setNaturaleza1] = useState(0);
  const [distancia, setDistancia] = useState(0);
  const [tarifa, setTarifa] = useState(1);
  const [domicilio, setDomicilio] = useState(50);

  async function init() {
    setNaturaleza1(parsedParams.naturaleza);
    const result = await axios.post(
      "http://localhost:3001/get-info-producto",
      { idproducto: parsedParams.idproducto },
      {}
    );
    if (result.data.length !== 0 && result.error === undefined) {
      console.log(result.data);
      setIdproducto(parsedParams.idproducto);
      setNegocio(result.data[0].negocio);
      setProducto(result.data[0].producto);
      setPrecio(result.data[0].precio);
      setOcupado(result.data[0].ocupado);
      setFecha(result.data[0].fecha);
      setHora(result.data[0].hora);
      setGps(result.data[0].gpsSN);
      setTarifa(result.data[0].tarifa);
    }

    const resultgps = await axios.post(
      "http://localhost:3001/get-pares-gps-naturaleza-new",
      {
        naturaleza: parsedParams.naturaleza,
        idproducto: parsedParams.idproducto,
      },
      {}
    );
    let paresGps = [];
    resultgps.data.forEach((item) => {
      paresGps.push({
        lat: item.latitud,
        lng: item.longitud,
        image: item.ocupado === 0 ? libre : off,
        info: item.nombre,
      });
    });
    setPuntos(paresGps);

    const resultado = await axios.post(
      "http://localhost:3001/getjpg-file",
      //    { file: "./galerias/app_images/productos" + "/" + parsedParams.idproducto + "/" + parsedParams.idproducto + ".jpg" },
      {
        file:
          "./galerias/app_images/productos" +
          "/" +
          parsedParams.idproducto +
          "/foto-1.jpg",
      },
      {}
    );
    if (resultado.data.length !== 0 && resultado.error === undefined) {
      setContenidofoto(resultado.data);
    }
    setInicio(false);
  }

  const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };

  const lngLatSelected = (point, lngLat) => {
    setLng(lngLat.lng);
    setLat(lngLat.lat);
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

  function ordenar() {}

  useEffect(() => {
    if (puntos.length !== 0) {
      setDistancia(
        distanciaEnKilometros(lat, lng, puntos[0].lat, puntos[0].lng).toFixed(2)
      );
    }
  }, [lng]);

  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item, i) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location]);

  useEffect(() => {
    init();
  }, []);

  return (
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
            tooltips: "Acerca de Destodo",
          },
        ]}
      />
      <Hero>
        <div className="cabeza">
          <IconButton
            color="primary"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowBack />
          </IconButton>
          <h3 className="main-title">M2G-Destodo</h3>
          <h4 className="registrarse-cabeza-1"> - Informacion del producto</h4>
        </div>

        <main className="main-info-producto">
          {showMap === true ? (
            <>
              <section className="perfil-info-producto">
                <div className="img-class-info-producto">
                  <img
                    className="img-info-producto"
                    src={contenidofoto}
                    alt="Imagen del producto"
                  />
                  <Tippy content={`Libre/Ocupado`}>
                    <button
                      className={`${
                        ocupado === 0 ? "info-image-onoff" : "info-image-offon"
                      }`}
                      disabled={true}
                    >
                      <PowerSettingsNewIcon />
                    </button>
                  </Tippy>
                </div>

                <div className="product-info">
                  <div className="parrafo">
                    <p>Negocio:</p>
                    <p>{negocio}</p>
                  </div>
                  <div className="parrafo">
                    <p>Producto:</p>
                    <p>{producto}</p>
                  </div>

                  {precio !== 0 ? (
                    <div className="parrafo">
                      <p>Precio:</p>
                      <p>{precio}</p>
                    </div>
                  ) : (
                    ""
                  )}
                  {fecha !== "undefined" ? (
                    <div className="parrafo">
                      <p>Fecha:</p>
                      <p>{fecha}</p>
                    </div>
                  ) : (
                    ""
                  )}

                  {hora !== "undefined" ? (
                    <div className="parrafo">
                      <p>Hora:</p>
                      <p>{hora}</p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </section>
            </>
          ) : (
            ""
          )}

          {gps === 1 && showMap === true ? (
            <section className="mapa">
              <div className="parrafo distancia">
                <p>Distancia:</p>
                <p>
                  {distancia}
                  {" KMS"}
                  {" Precio: "}
                  {(distancia * tarifa + domicilio).toFixed(0)}
                </p>
                {distancia !== 0 ? (
                  <Tippy content="Ordenar este producto">
                    <button
                      type="button"
                      className="car negocio-button primary"
                      onClick={() => ordenar}
                    >
                      <ShoppingCartOutlinedIcon />
                    </button>
                  </Tippy>
                ) : (
                  ""
                )}
              </div>
              <Map
                points={puntos}
                sx={{ height: "600px", width: "100%" }}
                onMapClick={lngLatSelected}
                remoteshowMap={showMap}
                lat={lat}
                lng={lng}
                point={{ lat, lng }}
                onChange={onChangeMap}
                remoteZoom={zoom}
              />
              :
            </section>
          ) : (
            ""
          )}

          {inicio === false && showMap === true ? (
            <section className="galeria">
              <ComGalerias
                rutatmp={"productos/" + idproducto}
                desctmp={desctmp}
                perfil={idproducto}
                deQuien="del producto"
              />
            </section>
          ) : (
            ""
          )}
        </main>
      </Hero>
    </div>
  );
};

export default InfoProducto;
