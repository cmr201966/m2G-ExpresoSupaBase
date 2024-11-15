import Navbar from "../../components/Navbar/Navbar"
import Hero from "../../layouts/Hero/Hero";
import { useEffect, useState } from "react";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Map from "../../components/Map/MapBox";
import { useLocation } from "react-router-dom";
import Tippy from "@tippyjs/react";
import { isValid, getFilesInFolderSB, getJpgFileSB } from "../../Utiles/Utiles";
import { getInfoNegocioCM } from "../../Utiles/apiBaseDatos";

import Encabezado from "../../components/Encabezado/Encabezado";
import { Box, CircularProgress } from "@mui/material";

import "./styles.css";

const InfoNegocio = () => {
  const location = useLocation();
  const parsedParams = {}
  const [showMap] = useState(false);
  const [showcircularProgress, setshowCircularProgress] = useState(true); 
  const [lng, setLng] = useState(-75.829090519);
  const [lat, setLat] = useState(20.0217583);
  const [zoom] = useState(15.50);
  const [contenidofoto, setContenidofoto] = useState();
  const [negocio, setNegocio]=useState("");
  const [celular, setCelular]=useState("");
  const [tipoUser, setTipoUser]=useState("Desconocido");
  const [provincia, setProvincia]=useState("");
  const [municipio, setMunicipio]=useState("");
  const [inicio, setInicio]=useState(true);
  const [gps, setGps]=useState(true);
  const [arrayFotos, setArrayFotos] = useState([]);
  const [arrayFotoInfo, setArrayFotoInfo] = useState([]); 
  const url = `https://wa.me/${celular}?text=`

  const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };

  const lngLatSelected = (point, lngLat) => {
    setLng(lngLat.lng);
    setLat(lngLat.lat);
  };

  async function init(){
    let result = await getInfoNegocioCM(parsedParams.idnegocio);
//    let result = await getInfoNegocio(parsedParams.idnegocio);
    let resultFiles = await getFilesInFolderSB("./galerias/app_images/usuarios/" + parsedParams.idnegocio, "usuarios/" + parsedParams.idnegocio, "galerias");
    setArrayFotos(resultFiles);
    let tarray=[];

    for(let i=0; i<resultFiles.length; i+=1)
      if (resultFiles[i].indexOf(".jpg") === -1) resultFiles.splice(i, 1)

    for(let i=0; i<resultFiles.length; i+=1){
        let result= await getJpgFileSB(resultFiles[i], "./galerias/app_images/usuarios/" + parsedParams.idnegocio, "usuarios/" + parsedParams.idnegocio);
        if (isValid(result.url)===false || result.url === "") tarray.push(result);
        if (isValid(result.url)===true) tarray.push(result.url);
        setArrayFotoInfo(tarray);
    }
    if (isValid(result)===true) {
      if (result[0].tipouser===0) setTipoUser("Gratis");
      if (result[0].tipouser===1) setTipoUser("Estandar")
      if (result[0].tipouser===2) setTipoUser("Premiun");
      if (result[0].tipouser===3) setTipoUser("Administrador");
      setNegocio(result[0].negocio);
      setCelular(result[0].celular);
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

function viewPhoto(i){
  setContenidofoto(arrayFotoInfo[i])
}
useEffect(() => {
  const localParams = location.search.substring(1).split("&");
  localParams.forEach((item) => {
    const [paramName, paramValue] = item.split("=");
    parsedParams[paramName] = paramValue;
  });
}, [location]);

useEffect(() => {
  init()
}, [])

  return (
    <div className="Info-Negocios">
      <Navbar
         nivel={1}
      />
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
          ) : null
      }

        {inicio===false?
      <div className="div-Papa-InfoNegocio">
        <Encabezado/>
        <main className="main">
        <span className="encabezado-Info-Producto">{negocio}</span>
          <section className="perfil-info-producto">
             <div className="imagenes-laterales-del-negocio">
                {arrayFotos.map((item, i) => (                  
                  <div key={i} className="producto-fotos">
                      <img
                        className="img-info-producto-lateral"
                        src={arrayFotoInfo[i]}
                        alt="Imagen del negocio"
                        onClick={()=>viewPhoto(i)}
                        />
                </div>
                ))}
            </div>

             <div className="img-class-info-producto">
                  <img className="img-info-negocio" src={contenidofoto} alt="Imagen del producto" />
             </div> 
          </section>


          <div className="negocio-info">
                 <div className="ws">
                      <p className="strong font-size1"> Datos del negocio</p>
                      <Tippy content={`Contactar via WhatsApp`}>
                         <a href={url} target="_blank" rel="noopener noreferrer"><WhatsAppIcon  className="ws-1" /></a>
                      </Tippy>
                 </div>
                 <div className="parrafo">
                     <p>
                       Plan:
                     </p>
                     <p>
                       {tipoUser}
                     </p>
                 </div>
                 { sessionStorage.getItem("sgbd").toLocaleUpperCase()!=='MYSQL'?
                 <div className="parrafo">
                     <p>Celular:</p>
                     <p>{celular}</p>
                 </div>:""}

                 <div className="parrafo">
                     <p>
                        Provincia:
                     </p>
                     <p>
                        {provincia}
                     </p>   
                 </div>
                 <div className="parrafo">
                     <p>
                        Municipio:
                     </p>
                     <p>
                        {municipio}
                     </p>
                  </div>

          </div>

          {gps===1?
          <section className="mapa-1 mapa-9">
             <Map 
             sx={{ height: "340px", width: "345px" }}
             onMapClick={lngLatSelected} 
             remoteshowMap={showMap} 
             lat={lat} 
             lng={lng} 
             point={{ lat, lng }} 
             onChange={onChangeMap} 
             remoteZoom={zoom} /> 
          </section>:""
          }

        </main>
      </div>:""
      }
     </Hero>
   </div>
  );
};

export default InfoNegocio;
