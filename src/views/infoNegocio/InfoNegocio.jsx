import Navbar from "../../components/Navbar/Navbar"
import Hero from "../../layouts/Hero/Hero";
import IconButton from "@mui/material/IconButton"
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import ComGalerias from "../../components/ComGalerias/ComGalerias";
import Map from "../../components/Map/MapBox";
import { useLocation } from "react-router-dom";
import { isValid, getFilesInFolderSB, getJpgFileSB, getInfoNegocio } from "../../Utiles/Utiles";
import "./styles.css";

const InfoNegocio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {}
  const [desctmp]=useState("Galerias");
  const [showMap] = useState(false);
  const [showGalerias, setShowGalerias] = useState(false);
  const [lng, setLng] = useState(-75.829090519);
  const [lat, setLat] = useState(20.0217583);
  const [zoom] = useState(15.50);
  const [contenidofoto, setContenidofoto] = useState();
  const [idnegocio, setIdnegocio]=useState("");
  const [negocio, setNegocio]=useState("");
  const [celular, setCelular]=useState("");
  const [tipoUser, setTipoUser]=useState("Desconocido");
  const [provincia, setProvincia]=useState("");
  const [municipio, setMunicipio]=useState("");
  const [inicio, setInicio]=useState(true);
  const [gps, setGps]=useState(true);
  const [arrayFotos, setArrayFotos] = useState([]);
  const [arrayFotoInfo, setArrayFotoInfo] = useState([]); 

  const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };

  const lngLatSelected = (point, lngLat) => {
    setLng(lngLat.lng);
    setLat(lngLat.lat);
  };

  async function init(){

    let result = await getInfoNegocio(parsedParams.idnegocio);
    if (result[0].idnegocio===sessionStorage.getItem("user")){
      setShowGalerias(true)
    }
    let resultFiles = await getFilesInFolderSB("./galerias/app_images/usuarios/" + parsedParams.idnegocio, "galerias");
    setArrayFotos(resultFiles);
    let tarray=[];
    for(let i=0; i<resultFiles.length; i+=1){
      let result= await getJpgFileSB("./galerias/app_images/usuarios" + "/" + parsedParams.idnegocio + "/" +  resultFiles[i], "usuarios/" + parsedParams.idnegocio + "/" +  resultFiles[i]);
      if (result.url === "") tarray.push(result);
      setArrayFotoInfo(tarray);
    }
    if (result.length !== 0 && result.error === undefined) {
      if (result[0].tipouser===0) setTipoUser("Gratis");
      if (result[0].tipouser===1) setTipoUser("Estandar")
      if (result[0].tipouser===2) setTipoUser("Premiun");
      if (result[0].tipouser===3) setTipoUser("Administrador");

      setIdnegocio(parsedParams.idnegocio);
      setNegocio(result[0].negocio);
      setCelular(result[0].celular);
      setProvincia(result[0].provincia);
      setMunicipio(result[0].municipio);
      setLat(result[0].latitud);
      setLng(result[0].longitud);
      setGps(result[0].gpsSN);
    }
   result = await getJpgFileSB("./galerias/app_images/usuarios" + "/" + parsedParams.idnegocio + "/foto-1.jpg", "usuarios" + "/" + parsedParams.idnegocio + "/foto-1.jpg")   
   if (result.length !== 0 && isValid(result.error) === false) {
      setContenidofoto(result);
   }
   setInicio(false);
}

useEffect(() => {
  const localParams = location.search.substring(1).split("&");
  localParams.forEach((item, i) => {
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
      <div className="div-papa">
       <div className="cabeza">
         <IconButton color="primary" onClick={() => 
          {
             navigate(-1);
          }}>
             <ArrowBack className="flecha"/>
            </IconButton>
        <h4 className="registrarse-cabeza-1">Atrás</h4>

       </div>

        <main className="main">
          <section className="perfil-info-producto">
             <div className="imagenes-laterales-del-negocio">
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
                  <img className="img-info-negocio" src={contenidofoto} alt="Imagen del producto" />
             </div> 

             <div className="negocio-info">
                 <p className="strong font-size1"> Datos del negocio</p>
                 <div className="parrafo">
                     <p>
                        Negocio:
                     </p>
                     <p>
                       {negocio}
                     </p>
                 </div>
                 <div className="parrafo">
                     <p>
                       Plan:
                     </p>
                     <p>
                       {tipoUser}
                     </p>
                 </div>
                 <div className="parrafo">
                     <p>
                       Celular:
                     </p>
                     <p>
                       {celular}
                     </p>
                 </div>
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

          </section>
          {inicio===false && showGalerias===true?
             <section className="galeria">
                <ComGalerias rutatmp={"usuarios/" + idnegocio} desctmp={desctmp} perfil={idnegocio} permiso={true} deQuien="del negocio" />
             </section>:""
          }
          {gps===1 || gps===true?
          <section className="mapa-negocio">
             <Map sx={{ height: "400px", width: "100%" }} onMapClick={lngLatSelected} remoteshowMap={showMap} lat={lat} lng={lng} point={{ lat, lng }} onChange={onChangeMap} remoteZoom={zoom} /> 
          </section>:""
          }

        </main>
      </div>
     </Hero>
   </div>
  );
};

export default InfoNegocio;
