import Tippy from "@tippyjs/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// components
import Map from "../../components/Map/MapBox";
import Navbar from "../../components/Navbar/Navbar";
import Encabezado from "../../components/Encabezado/Encabezado";

// layouts
import Hero from "../../layouts/Hero/Hero";

// @mui/icons
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
// @mui/material
import { Box, CircularProgress } from "@mui/material";

// utils
import { isValid, getFilesInFolderSB, getJpgFileSB } from "../../Utiles/Utiles";
import { getInfoNegocioCM, registraWS } from "../../Utiles/apiBaseDatos";

// styles
import "./styles.css";

const InfoNegocio = () => {
  const location = useLocation();
  const parsedParams = {};
  const [showMap] = useState(false);
  const [showcircularProgress, setshowCircularProgress] = useState(true);
  const [lng, setLng] = useState(-75.829090519);
  const [lat, setLat] = useState(20.0217583);
  const [zoom] = useState(15.5);
  const [contenidofoto, setContenidofoto] = useState();
  const [negocio, setNegocio] = useState("");
  const [celular, setCelular] = useState("");
  const [tipoUser, setTipoUser] = useState("Desconocido");
  const [provincia, setProvincia] = useState("");
  const [datos, setDatos] = useState("");
  const [otrosDatos, setOtrosDatos] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [inicio, setInicio] = useState(true);
  const [gps, setGps] = useState(true);
  const [arrayFotos, setArrayFotos] = useState([]);
  const [arrayFotoInfo, setArrayFotoInfo] = useState([]);
  const [idnegocio, setIdnegocio] = useState("");
  const url = `https://wa.me/${celular}?text=`;

  const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };

  const lngLatSelected = (point, lngLat) => {
    setLng(lngLat.lng);
    setLat(lngLat.lat);
  };

  async function init() {
    let result = await getInfoNegocioCM(parsedParams.idnegocio);
    setIdnegocio(parsedParams.idnegocio);
    //    let result = await getInfoNegocio(parsedParams.idnegocio);
    let resultFiles = await getFilesInFolderSB(
      "./galerias/app_images/usuarios/" + parsedParams.idnegocio,
      "usuarios/" + parsedParams.idnegocio,
      "galerias"
    );
    let tarrayfotos = [];
    let cantPhotoT = 1;
    for (const item of resultFiles) {
      if (item.toLowerCase().indexOf(".jpg") >= 0 && cantPhotoT <= 4) {
        tarrayfotos.push(item);
        cantPhotoT = cantPhotoT + 1;
      }
    }
    let index = indexPerfil(tarrayfotos, parsedParams.idnegocio);
    let este = tarrayfotos.splice(index)[0];
    tarrayfotos = [este, ...tarrayfotos];
    setArrayFotos(tarrayfotos);
    let tarray = [];
    for (let i = 0; i < tarrayfotos.length; i += 1) {
      let resultimg = await getJpgFileSB(
        tarrayfotos[i],
        "./galerias/app_images/usuarios/" + parsedParams.idnegocio,
        "usuarios/" + parsedParams.idnegocio,
        result[0].idsb
      );
      if (isValid(resultimg.url) === false || resultimg.url === "")
        tarray.push(resultimg);
      if (isValid(resultimg.url) === true) tarray.push(resultimg.url);
      setArrayFotoInfo(tarray);
    }
    if (isValid(result) === true) {
      if (result[0].tipouser === 0) setTipoUser("Gratis");
      if (result[0].tipouser === 1) setTipoUser("Estandar");
      if (result[0].tipouser === 2) setTipoUser("Premiun");
      if (result[0].tipouser === 3) setTipoUser("Administrador");
      setNegocio(result[0].negocio);
      setCelular(result[0].celular);
      setDatos(result[0].datos);
      setOtrosDatos(result[0].otrosdatos);
      setProvincia(result[0].provincia);
      setMunicipio(result[0].municipio);
      setLat(result[0].latitud);
      setLng(result[0].longitud);
      setGps(result[0].gpssn);
    }
    setContenidofoto(tarray[0]);
    setInicio(false);
    setshowCircularProgress(false);
  }

  function indexPerfil(array, user) {
    let indexperfil = -1;
    array.forEach((item, i) => {
      if (item === user + ".jpg") {
        indexperfil = i;
      }
    });
    return indexperfil;
    //    return {indexPhoto: endArray.length!==0?endArray[endArray.length-1]:0, fp: tfotoPerfil};
  }

  function viewPhoto(i) {
    setContenidofoto(arrayFotoInfo[i]);
  }

  function registraws(){
    registraWS("N" + idnegocio);
  }

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
    <div className="Info-Negocios">
      <Navbar nivel={1} />
      <Encabezado   clase={"encabezado"}/>
      <Hero clase={"hero-section-productos"}>
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
        ) : ("")}

        {inicio === false ? (
          <div className="div-papa-info">
            <section className="main-info">
              <span className="encabezado-info">{negocio}</span>
              <div className="info-content">
                <div className="perfil-info-1">
                  <div className="img-class-info">
                    <img
                      className="img-info"
                      src={contenidofoto}
                      alt="Imagen del negocio"
                    />
                  </div>

                  <div className="sliderVertical">
                    {arrayFotos.map((item, i) => (
                      <div key={i} className="producto-fotos">
                        <img
                          className="img-info-lateral"
                          src={arrayFotoInfo[i]}
                          alt="Imagen del negocio"
                          onClick={() => viewPhoto(i)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="agrupa-info">
                  <div className="info-1">
                    <div className="ws">
                      <p className="strong font-size1">Datos del negocio</p>
                      <Tippy content={`Contactar via WhatsApp`}>
                        <a href={url} onClick={registraws}target="_blank" rel="noopener noreferrer">
                          <WhatsAppIcon className="ws-1" />
                        </a>
                      </Tippy>
                    </div>

                    <div className="parrafo">
                      <p>{datos}</p>
                    </div>

                    <div className="parrafo">
                      <p>{otrosDatos}</p>
                    </div>

                    <div className="parrafo">
                      <p>Plan:</p>
                      <p>{tipoUser}</p>
                    </div>

                    {sessionStorage.getItem("sgbd").toLocaleUpperCase() !==
                    "MYSQL" ? (
                      <div className="parrafo">
                        <p>Celular:</p>
                        <p>{celular}</p>
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="parrafo">
                      <p>Provincia:</p>
                      <p>{provincia}</p>
                    </div>

                    <div className="parrafo">
                      <p>Municipio:</p>
                      <p>{municipio}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {gps === 1 ? (
              <div className="mapa-1">
                <section className="mapa">
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
                </section>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </Hero>
    </div>
  );
};

export default InfoNegocio;
