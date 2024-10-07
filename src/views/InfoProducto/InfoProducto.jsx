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

import ComGalerias from "../../components/ComGalerias/ComGalerias";
import Map from "../../components/Map/MapBox";
import { useLocation } from "react-router-dom";

// styles
import "./styles.css";
import marker from "../../assets/images/custom_marker.png";
import libre from "../../assets/images/libre.png";
import off from "../../assets/images/ocupado.png";
import { getinfoproducto, setMovimientosNew, updateOcupado } from "../../servicios/productos";
import { getJpgFile } from "../../servicios/imagenes";
import { getParesGpsNaturalezaNew } from "../../servicios/naturalezas";


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
  const [categoria, setCategoria] = useState(0);
  const [distancia, setDistancia] = useState(0);
  const [tarifa, setTarifa] = useState(1);
  const [costoDomicilio, setCostoDomicilio] = useState(50);
  const [domicilio, setDomicilio] = useState(50);
  const [puntosState, setPuntosState] = useState(0);
  const [carrera, setCarrera] = useState(0);
  const [productot, setProductot] = useState("");

  async function init() {
    console.log(parsedParams);
    setCategoria(parsedParams.categoria);
    let result = await getinfoproducto({idproducto: parsedParams.idproducto});
    result = await result.json();
    console.log(result);
    if (result.length !== 0 && result.error === undefined) {
      setIdproducto(parsedParams.idproducto);
      setNegocio(result[0].negocio);
      setProducto(result[0].producto);
      setPrecio(result[0].precio);
      setOcupado(result[0].ocupado);
      setFecha(result[0].fecha);
      setHora(result[0].hora);
      setGps(result[0].gpsSN);
      setTarifa(result[0].tarifa);
      setCostoDomicilio(result[0].costoDomicilio);
      setDomicilio(result[0].domicilio);
    }

    result = await getParesGpsNaturalezaNew({categoria: parsedParams.categoria,  idproducto: parsedParams.idproducto});
    result = await result.json();

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

    result = await getJpgFile({file: "./galerias/app_images/productos" + "/" + parsedParams.idproducto + "/foto-1.jpg"});
    result = await result.text();

    if (result.length !== 0 && result.error === undefined) {
      setContenidofoto(result);
    }
    setInicio(false);
  }

  const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };


  const lngLatSelected = (point, lngLat) => {
    if (ocupado===1) 
      {
        return;
      }
setLng(lngLat.lng);
setLat(lngLat.lat);
let ppuntos=puntosState+1;
if (puntosState===0 || puntosState===1){
  setPuntosState(puntosState+1);
  let info= puntosState===0?"Origen":"Destino";
  setPuntos([...puntos,{lat: lngLat.lat, lng: lngLat.lng, image: marker, info: info}])
  if (ppuntos===2){
    // Tengo los dos puntos calculo la distancia entre ellos (Desde Origen hasta Destino)
    setCarrera(distanciaEnKilometros(puntos[1].lat, puntos[1].lng, lngLat.lat, lngLat.lng).toFixed(2));
  }
}
if (puntosState===2){
  setCarrera(0);
  setPuntosState(1);
  puntos.splice(puntos.length-2,2);
  setPuntos([...puntos,{lat: lngLat.lat, lng: lngLat.lng, image: marker, info: "Origen"}])
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

  async function shooping(){
    if (showMap===true) {
      // Insertar el movimiento y poner showmap en false
      let tindex=puntos.length
      await setMovimientosNew({idmovimiento: 1, idproducto: idproducto, latOrigen: puntos[tindex-2].lat, latDestino: puntos[tindex-1].lat, 
                          lngOrigen: puntos[tindex-2].lng, lngDestino: puntos[tindex-1].lng, precio: (carrera*tarifa)+costoDomicilio, kms: carrera});

      setOcupado(true);

      await updateOcupado({idproducto: idproducto, ocupado: 1});
    }

    setPuntos([]);
    setPuntosState(0);

  }

  useEffect(() => {
    if (ocupado===1) {
      return;
    }
    if (puntos.length !== 0 && puntosState==1) {
      setDistancia(distanciaEnKilometros(lat, lng, puntos[0].lat, puntos[0].lng).toFixed(2));
      setProductot(puntos[0].info);
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
         nivel={1}
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
          <h4 className="registrarse-cabeza-1">Informacion del producto</h4>
          {(distancia !== 0) && (showMap===true && puntosState===2 && domicilio===1) || (domicilio===0 && ocupado===0)? (
                  <Tippy content="Ordenar este producto">
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
          {gps === 1 && showMap === true && puntos.length!==0 ? (
            <section className="mapa">
              {domicilio===1?
              <div className="parrafo distancia">
                <p>{puntos[0].info}</p>
                <p>{" esta a "}</p>
                <p>
                  {distancia}
                  {" KMS carrera "}{carrera}{" Kms "}
                  {" Precio: "}
                  {((carrera * tarifa) + costoDomicilio).toFixed(0)}
                </p>
              </div>:""
              }
              <Map
                points={puntos}
                sx={{ height: "600px", width: "100%" }}
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
{/*                point={{ lat, lng }} 
*/}
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
