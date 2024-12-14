import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";
import BigSlider from "../../components/BigSlider/BigSlider";

// components
import CardRow from "../../components/CardRow/CardRow";
import Encabezado from "../../components/Encabezado/Encabezado";
import Navbar from "../../components/Navbar/Navbar";
import Map from "../../components/Map/MapBox";

// layouts
import Hero from "../../layouts/Hero/Hero";

// @mui/icons
import { PlaceOutlined, WhatsApp, Close } from "@mui/icons-material";
// @mui/material
import { Box, CircularProgress } from "@mui/material";

// assets
import libre from "../../assets/images/libre.png";
import ocupado from "../../assets/images/ocupado.png";
import marker from "../../assets/images/custom_marker.png";

// utils
import { isValid, getJpgFileSB } from "../../Utiles/Utiles";
import {
  getparesgpscategoriaCM,
  getProductosCM,
  updateOcupadoCM,
  setMovimientosNewCM,
  getProductosNewCM,
  getanunciosCM,
} from "../../Utiles/apiBaseDatos";

// config
import config from "../../config";

// styles
import "./styles.css";

const Productos = () => {
  let bbox;
  const navigate = useNavigate();
  const [mapLoading] = useState(true);
  const [puntos, setPuntos] = useState([]);
  const location = useLocation();
  const parsedParams = {};
  const [nivel, setNivel] = useState(0);
  const [noproducto, setNoproducto] = useState(false);
  const [result, setResult] = useState([]);
  const [cantidadproductos, setCantidadproductos] = useState(0);
  const [nombre, setNombre] = useState("");
  const [inicia, setInicia] = useState(true);
  const [show1, setShow1] = useState(false);
  const [botones, setBotones] = useState(false);
  const [contenidofoto] = useState([]);
  const [mascerca, setMascerca] = useState(0);
  const [idproductot, setIdroductot] = useState();
  const [items, setItems] = useState([]);
  const [puntosState, setPuntosState] = useState(0);
  const [carrera, setCarrera] = useState(0);
  const [duracion, setDuracion] = useState(0);
  const [duracion1, setDuracion1] = useState(0);
  const [verOtraVez] = useState(true);
  const [viewCarrito, setViewCarrito] = useState(false);
  let pcMovil= window.innerWidth<=600?"movil":"pc";
  const [toFly] = useState(null);
  const url = `https://wa.me/${52675359}?text=`;
  let user =
    sessionStorage.getItem("user") === null
      ? ""
      : sessionStorage.getItem("user");

  //  const [categoria, setCategoria] = useState(0);
  const [tarifa, setTarifa] = useState(0);
  const [costoDomicilio, setCostoDomicilio] = useState(0);
  const [index, setIndex] = useState(0);
  const [nick, setNick] = useState(0);
  const [hayAnuncios, setHayAnuncios] = useState(false);
/*  const [marca, setMarca] = useState(0);
  const [color, setColor] = useState(0);
  const [chapa, setChapa] = useState(0);*/
  const [celular, setCelular] = useState(0);

  // Estados para la posición GPS del mapa
  const [zoom] = useState(14.0);
  const [showMap, setShowMap] = useState(false);

  // Estados para la posición GPS del mapa
  const [lng, setLng] = useState();
  const [lat, setLat] = useState();

  // BigSlider
  const [imgsFileName, setImgsFileName] = useState([]);
  const [imgsFolder, setImgsFolder] = useState([]);
  const [imgsId, setImgsId] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [users, setUsers] = useState([]);
  const [nombres, setNombres] = useState([]);
  const [links, setLinks] = useState([]);
  const screenWidth = window.innerWidth;


  function sessionSet(parsedParams, objeto) {
    objeto.forEach((element) => {
      if (
        isValid(parsedParams[element]) === true &&
        parsedParams[element] !== ""
      )
        sessionStorage.setItem(
          element,
          decodeURIComponent(parsedParams[element])
        );
      else sessionStorage.setItem(element, null);
    });
  }
  function init() {
    setShowMap(
      isValid(parsedParams.mapa) === true
        ? parsedParams.mapa
        : setShowMap(false)
    );
    setNivel(
      isValid(parsedParams.nivel) === true
        ? parsedParams.nivel
        : sessionStorage.getItem("nivel")
    );
    setNombre(
      isValid(parsedParams.nombre) === true
        ? decodeURIComponent(parsedParams.nombre)
        : sessionStorage.getItem("nombre")
    );
    if (sessionStorage.getItem("deDonde") !== "Home") {
      sessionStorage.setItem("deDonde", "Home");
    } else {
      sessionSet(parsedParams, [
        "categoria",
        "user",
        "nombre",
        "nivel",
        "mapa",
        "userAnuncio",
        "buscar",
      ]);
      if (
        isValid(parsedParams.latitud) === true &&
        parsedParams.latitud !== "0"
      ) {
        sessionStorage.setItem(
          "latitud",
          decodeURIComponent(parsedParams.latitud)
        );
        setLat(Number(parsedParams.latitud));
      } else sessionStorage.setItem("latitud", null);

      if (
        isValid(parsedParams.longitud) === true &&
        parsedParams.longitud !== "0"
      ) {
        sessionStorage.setItem(
          "longitud",
          decodeURIComponent(parsedParams.longitud)
        );
        setLng(Number(parsedParams.longitud));
      } else sessionStorage.setItem("longitud", null);
    }
    sessionStorage.setItem("directo","1")
    init1();
  }

  const kmToDegrees = (km) => {
    return km / 111.32; // Aproximación para convertir km a grados
  };

  const createBoundingBox = (
    centerPoint,
    distanciaArriba,
    distanciaAbajo,
    distanciaIzquierda,
    distanciaDerecha
  ) => {
    const [lat, lon] = centerPoint;
    const deltaLatArriba = kmToDegrees(distanciaArriba);
    const deltaLatAbajo = kmToDegrees(distanciaAbajo);
    const deltaLonIzquierda = kmToDegrees(
      distanciaIzquierda / Math.cos(lat * (Math.PI / 180))
    ); // Ajustar por latitud
    const deltaLonDerecha = kmToDegrees(
      distanciaDerecha / Math.cos(lat * (Math.PI / 180))
    ); // Ajustar por latitud

    const bbox = {
      xmin: lon - deltaLonIzquierda,
      ymin: lat - deltaLatAbajo,
      xmax: lon + deltaLonDerecha,
      ymax: lat + deltaLatArriba,
    };

    return bbox;
  };

  function contains(lat, lon, bbox) {
    return (
      lon >= bbox.xmin &&
      lon <= bbox.xmax &&
      lat >= bbox.ymin &&
      lat <= bbox.ymax
    );
  }

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
    if ((puntosState===1 || puntos.length===0) && sessionStorage.getItem("idapp")!=="Expreso") return;
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

      if (ppuntos === 2) {
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
      default:
        break;
    }
  }

  async function paresGps() {
    let resultgps = await getparesgpscategoriaCM(
      sessionStorage.getItem("categoria"),
      ""
    );
    //    let resultgps = await apiBaseDatos("getparesgpscategoria", sessionStorage.getItem("categoria"),"");
    let paresgps = [];
    let itemst = [];
    resultgps.forEach((item) => {
      paresgps.push({
        lat: item.latitud,
        lng: item.longitud,
        image: libre,
        info: item.celular,
        distanciamax: item.distanciamax,
        sciudad: item.sciudad,
        imageClassName: "",
      });
      itemst.push({
        idproducto: item.idproducto,
        tarifa: item.tarifa,
        costodomicilio: item.costodomicilio,
        domicilio: item.domicilio,
      });
      setPuntos(paresgps);
      setItems(itemst);
    });
    setViewCarrito(paresgps.length > 0);
  }

  function verproducto(i) {
    sessionStorage.setItem("deDonde", "infoProducto");
    navigate(
      `/infoproducto?idproducto=${
        result[i].idproducto
      }&categoria=${sessionStorage.getItem("categoria")}`
    );
  }

  function vernegocio(i) {
    sessionStorage.setItem("deDonde", "infoNegocio");
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
    sessionStorage.setItem("categoria", parsedParams.categoria);
    let result1 = await getProductosCM(
      sessionStorage.getItem("categoria"),
      sessionStorage.getItem("userAnuncio"),
      sessionStorage.getItem("buscar")
    );
    //    let result1 = await apiBaseDatos("getProductos", sessionStorage.getItem("categoria"),
    //                                     sessionStorage.getItem("userAnuncio"),
    //                                     sessionStorage.getItem("buscar"));
    const newResult = [];
    if (isValid(result1) === false || result1.length === 0) {
      newResult.push({
        descnaturaleza: "",
        idproducto: 0,
        negocio: "",
        categoria: "",
        Producto: " No hay productos",
        photo: "./galerias/app_images/destodo/logo.jpg",
      });
      setResult(newResult);
      setNoproducto(true);
    } else {
      setNoproducto(false);
      result1.forEach((item) => {
        const obj = {
          idproducto: item.idproducto,
          idnegocio: item.idnegocio,
          xxxNegocio: item.negocio,
          Producto: item.producto,
          photo: item.idproducto + ".jpg",
          folderMYSQL: "./galerias/app_images/productos/" + item.idproducto,
          folderSUPABASE: "productos/" + item.idproducto,
          user: item.iduser,
          tipouser: item.tipouser,
          ocupado: item.ocupado,
          tarifa: item.tarifa,
          costodomicilio: item.costodomicilio,
          domicilio: item.domicilio,
          idsb: item.idsb,
          link: item.link,
          estado: item.estado
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
    contenidofoto.splice(0, contenidofoto.length);
    for (let i = 0; i < newResult.length; i += 1) {
      let resultado = await getJpgFileSB(
        newResult[i].photo,
        newResult[i].folderMYSQL,
        newResult[i].folderSUPABASE,
        newResult[i].idsb
      );
      if (resultado !== undefined && resultado !== null) {
        contenidofoto.push(resultado);
      }
    }
    sessionStorage.setItem("carditem", 0);
    let resultgps = await getparesgpscategoriaCM(
      sessionStorage.getItem("categoria")
    );
    let paresgps = [];
    let itemst = [];
    resultgps.forEach((item) => {
      paresgps.push({
        lat: item.latitud,
        lng: item.longitud,
        image: libre,
        info: item.nick,
        distanciamax: item.distanciamax,
        sciudad: item.sciudad,
        imageClassName: "",
      });
      itemst.push({
        idproducto: item.idproducto,
        tarifa: item.tarifa,
        costodomicilio: item.costodomicilio,
      });
      setPuntos(paresgps);
      setItems(itemst);
    });

    let resultApp = await getanunciosCM("1", sessionStorage.getItem("categoria"));
    setHayAnuncios(false);
    if (isValid(resultApp)===true) setHayAnuncios(resultApp.length!==0)
      else resultApp=[];
          let imgsFileName1 = [];
          let imgsFolder1 = [];
          let imgsId1 = [];
          let category1 = [];
          let users1 = [];
          let nombres1 = [];
          let links1 = [];
          let ruta =
            sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL"
              ? "./galerias/app_images/aplicaciones/productos"
              : "aplicaciones/productos";
          resultApp.forEach((item) => {
            let pcMovil=screenWidth<=600?"-movil":"";
            imgsFileName1.push(item.id + pcMovil + ".jpg");
            imgsFolder1.push(ruta + "/" + item.id);
            imgsId1.push(item.idsb);
            category1.push(item.idcategoria);
            users1.push(item.iduser);
            nombres1.push(item.desc);
            links1.push(item.link);
          });
          setImgsFileName(imgsFileName1);
          setImgsFolder(imgsFolder1);
          setImgsId(imgsId1)
          setCategorys(category1);
          setUsers(users1);
          setNombres(nombres1);
          setLinks(links1);
    

    setViewCarrito(paresgps.length > 0);
    setInicia(false);
    setShow1(false);
  }

  async function shooping() {
    if (isValid(showMap)===false) setShowMap(false);
    if (showMap === true) {
      // Insertar el movimiento y poner showmap en false
      let tindex = puntos.length;
      let latOrigen = tindex < 3 ? 0 : puntos[tindex - 2].lat;
      let latDestino = tindex < 3 ? 0 : puntos[tindex - 1].lat;
      let lngOrigen = tindex < 3 ? 0 : puntos[tindex - 2].lng;
      let lngDestino = tindex < 3 ? 0 : puntos[tindex - 1].lng;
      await setMovimientosNewCM(
        1,
        idproductot,
        latOrigen,
        latDestino,
        lngOrigen,
        lngDestino,
        carrera * items[index].tarifa + items[index].costodomicilio,
        carrera,
        user
      );
      await updateOcupadoCM(idproductot, 1);
      //      await apiBaseDatos("setmovimientosNew", 1, idproductot, latOrigen, latDestino, lngOrigen, lngDestino, carrera * items[index].tarifa + items[index].costodomicilio, carrera, users)
      //      await apiBaseDatos("updateOcupado", idproductot, 1)
      init1();
    }
    setPuntosState(0);
    setShowMap(!showMap);
  }

  async function otroPunto() {
    let tpuntos = [...puntos];
    let menor = 999999;
    let esta = 0;
    let dura = 0;
    let tindex = 0;
    let ok = false;
    let distanciaArriba = 0.2; // en km
    let distanciaAbajo = 0.2; // en km
    let distanciaIzquierda = 0.2; // en km
    let distanciaDerecha = 0.2; // en km
    while (ok === false) {
      menor = 999999;
      esta = 0;
      dura = 0;
      tindex = 0;
      tindex = puntosState;
      bbox = createBoundingBox(
        [
          tpuntos[tpuntos.length - tindex].lat,
          tpuntos[tpuntos.length - tindex].lng,
        ],
        distanciaArriba,
        distanciaAbajo,
        distanciaIzquierda,
        distanciaDerecha
      );
      for (let i = 0; i < tpuntos.length - 1; i += 1) {
        if (contains(tpuntos[i].lat, puntos[i].lng, bbox) === true) {
          tpuntos[i].image = libre;
        } else {
          tpuntos[i].image = ocupado;
          continue;
        }
        if (puntosState !== 0 && i <= tpuntos.length - (puntosState + 1)) {
          tindex = puntosState;
          ``;
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
        if (
          Number(esta) < Number(menor) &&
          (tpuntos[i].distanciamax === 0 || tpuntos[i].distanciamax >= esta)
        ) {
          menor = esta;
          setIdroductot(items[i].idproducto);
          let resultProduct = await getProductosNewCM(items[i].idproducto);
          //          let resultProduct = await apiBaseDatos("getProductoNew", items[i].idproducto);
          if (resultProduct.length !== 0) {
            setNick(resultProduct[0].nick);
            /*setMarca(resultProduct[0].marca);
            setColor(resultProduct[0].color);
            setChapa(resultProduct[0].chapa);*/
            setCelular(resultProduct[0].celular);
          }
          setTarifa(items[i].tarifa);
          setCostoDomicilio(items[i].costodomicilio);
          tpuntos.forEach((item, i) => {
            tpuntos[i].imageClassName = "";
          });
          tpuntos[i].imageClassName = "iconoGrande";
          setDuracion1(dura.toFixed(2));
          setIndex(i);
          ok = true;
        }
      }
      if (ok === false) {
        distanciaArriba = distanciaArriba + 0.2;
        distanciaAbajo = distanciaAbajo + 0.2;
        distanciaIzquierda = distanciaIzquierda + 0.2;
        distanciaDerecha = distanciaDerecha + 0.2;
      }
    }
    setPuntos(tpuntos);
    setMascerca(menor);
  }

  useEffect(() => {
    if (puntos.length !== 0) {
//      if ((puntosState===1) && sessionStorage.getItem("idapp")==="Expreso") otroPunto();
      if ((puntosState===1)) otroPunto();
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
  }, [location]);

  return (
    <>
      <div>
        <Navbar nivel={1} />
        <Hero>
          <Encabezado>
            {inicia === false ? (
              <div className="productos-nombre">
                <p className="p-productos-nombre">
                  ({cantidadproductos}) - {nombre}
                </p>
                <button
                  type="button"
                  className="placeoutlined"
                  onClick={shooping}
                >
                  <PlaceOutlined />
                </button>
              </div>
            ) : (
              ""
            )}
          </Encabezado>
          {inicia===false && hayAnuncios===true?
            <BigSlider
              imgsFolder={imgsFolder}
              imgsFileName={imgsFileName}
              imgsId={imgsId}
              categorias={categorys}
              users={users}
              nombres={nombres}
              links={links}
              sizeClass="chico"
            />
            :""
            }
          <div className={`div-productos margin-negative-productos-${hayAnuncios===true?'anuncio':'noAnuncio'}`}>
              <div className="grid-letf"></div>
              <div className="gradient-background-producto"></div>
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
                  {mascerca !== 0 && <span>{nick} está a {mascerca} Kms </span>}
                  {sessionStorage.getItem("idapp")!=="Expreso" && puntosState===1?
                  <Tippy content={`Ordenar via WhatsApp`}>
                     <a className="ws-productos" href={url} target="_blank" rel="noopener noreferrer">
                        <WhatsApp />
                     </a>
                  </Tippy>:""}

                  {carrera !== 0 && <span>, carrera {carrera} Kms</span>}
                  {(carrera * tarifa).toFixed(2) != 0.0 && (
                    <span>
                      , precio: {(carrera * tarifa + costoDomicilio).toFixed(2)}
                    </span>
                  )}
                  {
                  }
                </div>
              </>
             ) : (
               ""
             )}
 
             {inicia === false && showMap !== true ? (
              <div className={`product-flex-${pcMovil}`}>
                {result.map((item, i) => (
                  <CardRow
                    tipouser={sessionStorage.getItem("tipouser")}
                    user={sessionStorage.getItem("user")}
                    mapLoading={mapLoading}
                    noproducto={noproducto}
                    onMapClick={() => {
                      setLat(item.latitud);
                      setLng(item.longitud);
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
             {showMap === true ? (
              <div className="mapa-productos">
                <Tippy content={`Cerrar mapa`}>
                  <button
                    className="offOn-producto"
                    onClick={() => setShowMap(!showMap)}
                  >
                    <Close />
                  </button>
                </Tippy>
                <Map
                  points={puntos}
                  sx={{ width: "100%", marginBottom: "20px" }}
                  className="product-map"
                  onMapClick={lngLatSelected}
                  remoteshowMap={showMap}
                  flyTo={toFly}
                  tindex={index}
                  lat={lat}
                  lng={lng}
                  init
                  onChange={onChangeMap}
                  remoteZoom={zoom}
                />
              </div>
             ) : (
              ""
             )}
            <div className="grid-rigth"></div>
          </div>
        </Hero>
      </div>
    </>
  );
};

export default Productos;
