import Tippy from "@tippyjs/react";
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

import marker from "../../assets/images/custom_marker.png";
import libre from "../../assets/images/libre.png";
import off from "../../assets/images/ocupado.png";
import { apiBaseDatos, getFilesInFolderSB, getJpgFileSB, getInfoProducto, getParesGpsProducto  } from "../../Utiles/Utiles";
import config from "../../config";
// styles
import "./styles.css";


const InfoProducto = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {};
  const [desctmp] = useState("Galerias");
  const [showMap] = useState(true);
  const [showGalerias, setShowGalerias] = useState(false);
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
  const [inicio, setInicio] = useState(true);
  const [gps, setGps] = useState(true);
  const [puntos, setPuntos] = useState([]);
  const [distancia, setDistancia] = useState(0);
  const [tarifa, setTarifa] = useState(1);
  const [costoDomicilio, setCostoDomicilio] = useState(50);
  const [domicilio, setDomicilio] = useState(50);
  const [puntosState, setPuntosState] = useState(0);
  const [carrera, setCarrera] = useState(0);
//  const [productot, setProductot] = useState("");
  const [arrayFotos, setArrayFotos] = useState([]);
  const [arrayFotoInfo, setArrayFotoInfo] = useState([]);
//  const [duracion, setDuracion] = useState(0);
    
  async function init() {
    let resultFiles = await getFilesInFolderSB("./galerias/app_images/productos/" + parsedParams.idproducto, "");
    setArrayFotos(resultFiles);
    let tarray=[];
    for(let i=0; i<resultFiles.length; i+=1){
      /* param1 file para MYSQL, param2 file para SUPABASE*/
      let result= await getJpgFileSB("./galerias/app_images/productos/" + parsedParams.idproducto + "/" +  resultFiles[i], "productos/" + parsedParams.idproducto + "/" +  resultFiles[i]);
      if (result.url === "") {
        tarray.push(result);
      }
      setArrayFotoInfo(tarray);
    }

    let result= await getInfoProducto(parsedParams.idproducto);
    console.log(result);


    if (result.length !== 0 && result.error === undefined) {
      if (result[0].idnegocio===sessionStorage.getItem("user")){
        setShowGalerias(true)
      }
      else setShowGalerias(false);
      setIdproducto(parsedParams.idproducto);
      setNegocio(result[0].negocio);
      setProducto(result[0].producto);
      setPrecio(result[0].precio);
      setOcupado(result[0].ocupado);
      setMarca(result[0].marca);
      setColor(result[0].color);
      setChapa(result[0].chapa);
      setCelular(result[0].celular);
      setGps(result[0].gpsSN);
      setTarifa(result[0].tarifa);
      setCostoDomicilio(result[0].costoDomicilio);
      setDomicilio(result[0].domicilio);
    }

    result= getParesGpsProducto(parsedParams.categoria,  parsedParams.idproducto);

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


    result = getJpgFileSB("./galerias/app_images/productos" + "/" + parsedParams.idproducto + "/foto-1.jpg", "productos" + "/" + parsedParams.idproducto + "/foto-1.jpg")

    if (result.length !== 0 && result.error === undefined) {
      setContenidofoto(result);
    }
    setInicio(false);
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
    if (ocupado===1) 
      {
        return;
      }
setLng(lngLat.lng);
setLat(lngLat.lat);
let lat1 = puntos[puntos.length - 1].lat;
let lng1 = puntos[puntos.length - 1].lng;
let ppuntos=puntosState+1;
if (puntosState===0 || puntosState===1){
  setPuntosState(puntosState+1);
  let info= puntosState===0?"Origen":"Destino";
  setPuntos([...puntos,{lat: lngLat.lat, lng: lngLat.lng, image: marker, info: info}])
  if (ppuntos===2){
    // Tengo los dos puntos calculo la distancia entre ellos (Desde Origen hasta Destino)
      const { distancia, duracion } = await calculateDistance(
        [lng1, lat1],
        [lngLat.lng, lngLat.lat]
      );
      setCarrera(distancia.toFixed(2));
      //setDuracion(duracion.toFixed(2));

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
      let tindex=puntos.length
      // hay que pasar el user del chofer
      apiBaseDatos("setMovimientosNew", 1, idproducto, puntos(tindex-2).lat, puntos[tindex-1].lat, puntos[tindex-2].lng, puntos[tindex-1], (carrera*tarifa)+costoDomicilio, carrera)

                         
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
      //setProductot(puntos[0].info);
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
    <div className="Info-Productos">
      <Navbar
         nivel={1}
      />
      <Hero>
        <div className="div-papa-1">
          <div className="cabeza">
          <IconButton
            color="primary"
            onClick={() => {
              navigate(-1);
            }}
          >
          
           <ArrowBack className="flecha" />
          </IconButton>
          <h4 className="registrarse-cabeza-1">Atrás</h4>
         </div>
        
         <main className="main-info-producto">
          {showMap === true ? (
            <>
              <section className="perfil-info-producto-1">
                <div>
                {arrayFotos.map((item, i) => (
                  item!=="foto-1.jpg" &&
                  <div key={i} className="producto-fotos">
                      <img
                        className="img-info-producto-lateral"
                        src={arrayFotoInfo[i]}
                        alt="Imagen del producto"
                      />
                </div>
                ))}
                </div>
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

                <div className="product-info-1">
                  <p className="strong font-size1"> Datos del producto</p>
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
                  {marca !== "undefined" ? (
                    <div className="parrafo">
                      <p>Marca:</p>
                      <p>{marca}</p>
                    </div>
                  ) : (
                    ""
                  )}

                 {color !== "undefined" && color !== undefined && color !== "null" && color !== null && color !== "" ? (
                    <div className="parrafo">
                      <p>Color:</p>
                      <p>{color}</p>
                    </div>
                  ) : (
                    ""
                  )}
                 {chapa !== "undefined" && chapa !== undefined && chapa !== "null" && chapa !== null && chapa !== "" ? (
                    <div className="parrafo">
                      <p>Chapa:</p>
                      <p>{chapa}</p>
                    </div>
                  ) : (
                    ""
                  )}

                  {celular !== "undefined" ? (
                    <div className="parrafo">
                      <p>Celular:</p>
                      <p>{celular}</p>
                    </div>
                  ) : (
                    ""
                  )}
                 {(distancia !== 0) && (showMap===true && puntosState===2 && domicilio===1) || (domicilio===1 && ocupado===0)? (
                  <>
                  <Tippy content="Ordenar este producto">
                    <IconButton
                      sx={{ padding: 0, marginTop: "20px", marginLeft: "50px" }}
                      id="tool"
                      color="inherit"
                      onClick={shooping}
                    >
                      <ShoppingCartOutlinedIcon />
                    </IconButton>                    
                  </Tippy>
                  </>
                ) : (
                  ""
          )}
                   </div>
              </section>
             </>
            
          ) : 
          (
            ""
          )}      

          {inicio === false && showGalerias === true ? (
            <section className="galeria">
              <ComGalerias
                rutatmp={"productos/" + idproducto}
                desctmp={desctmp}
                perfil={idproducto}
                permiso={true}
                deQuien="del producto"
              />
            </section>
          ) : (
            ""
          )}

        </main>
        <div className="mapa-1">
          {inicio===false && gps === 1 && showMap === true && puntos.length!==0 ? (
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
                sx={{ height: "400px", width: "100%" }}
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
          )
          }
          </div>
        </div>
      </Hero>
    </div>
  );
};

export default InfoProducto;
