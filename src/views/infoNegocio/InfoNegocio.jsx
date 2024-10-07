// components
import Navbar from "../../components/Navbar/Navbar"
import Hero from "../../layouts/Hero/Hero";
import IconButton from "@mui/material/IconButton"
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import ComGalerias from "../../components/ComGalerias/ComGalerias";
import Map from "../../components/Map/MapBox";
import { useLocation } from "react-router-dom";

// styles
import "./styles.css";
//import { Paragliding } from "@mui/icons-material";
import {getinfonegocio  } from "../../servicios/negocios";
import {getJpgFile  } from "../../servicios/imagenes";


const InfoNegocio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {}
  const [desctmp, setdesctmp]=useState("Galerias");
  const [showMap, setShowMap] = useState(false);
  // Estados para la posición GPS del mapa
  const [lng, setLng] = useState(-75.829090519);
  const [lat, setLat] = useState(20.0217583);
  const [zoom, setZoom] = useState(15.50);
  const [contenidofoto, setContenidofoto] = useState();
  const [idnegocio, setIdnegocio]=useState("");
  const [negocio, setNegocio]=useState("");
  const [nombreDueno, setNombreDueno]=useState("");
  const [email, setEmail]=useState("");
  const [celular, setCelular]=useState("");
  const [fijo, setFijo]=useState("");
  const [provincia, setProvincia]=useState("");
  const [municipio, setMunicipio]=useState("");
  const [sede, setSede]=useState("");
  const [inicio, setInicio]=useState(true);
  const [gps, setGps]=useState(true);
  

  const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };


  const lngLatSelected = (point, lngLat) => {
    setLng(lngLat.lng);
    setLat(lngLat.lat);
  };

  async function init(){
    let result = await getinfonegocio({ idnegocio: parsedParams.idnegocio });
    result = await result.json();

    if (result.length !== 0 && result.error === undefined) {
      setIdnegocio(parsedParams.idnegocio);
      setNegocio(result[0].negocio);
      setNombreDueno(result[0].nombre);
      setEmail(result[0].email);
      setCelular(result[0].celular);
      setFijo(result[0].fijo);
      setProvincia(result[0].provincia);
      setMunicipio(result[0].municipio);
      setSede(result[0].sede);
      setLat(result[0].latitud);
      setLng(result[0].longitud);
      setGps(result[0].gpsSN);
    //
    }
   result = await getJpgFile({ file: "./galerias/app_images/usuarios" + "/" + parsedParams.idnegocio + "/foto-1.jpg"});
   result = await result.text();


  if (result.length !== 0 && result.error === undefined) {
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
    <div>
      <Navbar
         nivel={1}
      />
      <Hero>
      <div className="cabeza">
         <IconButton color="primary" onClick={() => 
          {
             navigate(-1);
          }}>
             <ArrowBack />
            </IconButton>
        <h4 className="registrarse-cabeza-1">Informacion del negocio</h4>
        </div>

        <main className="main">
          <section className="perfil-info-producto">
             <div className="img-class-info-producto">
                  <img className="img-info-producto" src={contenidofoto} alt="Imagen del producto" />
             </div> 

             <div className="product-info">
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
                     Dueño:
                     </p>                    
                     <p>
                       {nombreDueno}
                     </p>
                 </div>
                 <div className="parrafo">
                     <p>
                       Email:
                     </p>
                     <p>
                       {email}
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
                        Fijo:
                     </p>
                     <p>
                        {fijo}
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
                  <div className="parrafo">
                     <p>
                        Sede:
                     </p>
                     <p>
                        {sede}
                     </p>
                  </div>              
              </div>

          </section>
          {gps===1 || gps===true?
          <section className="mapa-negocio">
             <Map sx={{ height: "400px", width: "100%" }} onMapClick={lngLatSelected} remoteshowMap={showMap} lat={lat} lng={lng} point={{ lat, lng }} onChange={onChangeMap} remoteZoom={zoom} /> 
          </section>:""
          }
          {inicio===false?
             <section className="galeria">
                <ComGalerias rutatmp={"usuarios/" + idnegocio} desctmp={desctmp} perfil={idnegocio} deQuien="del negocio" />
             </section>:""
          }

        </main>

      </Hero>
    </div>
  );
};

export default InfoNegocio;
