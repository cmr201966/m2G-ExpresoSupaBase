// components
import Navbar from "../../components/Navbar/Navbar"
import Hero from "../../layouts/Hero/Hero";
import IconButton from "@mui/material/IconButton"
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import ComGalerias from "../../components/ComGalerias/ComGalerias";
import Map from "../../components/Map/MapBox";
import { useLocation } from "react-router-dom";

// styles
import "./styles.css";
import { Paragliding } from "@mui/icons-material";


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
    const result = await axios.post(
      "http://localhost:3001/get-info-negocio",
      { idnegocio: parsedParams.idnegocio }, 
      {}
    );
    if (result.data.length !== 0 && result.error === undefined) {
      setIdnegocio(parsedParams.idnegocio);
      setNegocio(result.data[0].negocio);
      setNombreDueno(result.data[0].nombre);
      setEmail(result.data[0].email);
      setCelular(result.data[0].celular);
      setFijo(result.data[0].fijo);
      setProvincia(result.data[0].provincia);
      setMunicipio(result.data[0].municipio);
      setSede(result.data[0].sede);
      setLat(result.data[0].latitud);
      setLng(result.data[0].longitud);
      setGps(result.data[0].gpsSN);
    //
    }

    const resultado = await axios.post(
    "http://localhost:3001/getjpg-file",
    { file: "./galerias/app_images/negocios" + "/" + parsedParams.idnegocio + "/foto-1.jpg" }, 
    {}
  );
  if (resultado.data.length !== 0 && resultado.error === undefined) {
    setContenidofoto(resultado.data);
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
        links={[
          { label: "Inicio", to: "/",tooltips: "Ir a la página principal" },
          { label: sessionStorage.getItem("user") === null ? "Iniciar sesión" : "Cerrar sesión", to: sessionStorage.getItem("user") === null ? "/login" : "/cerrarsesion", tooltips: sessionStorage.getItem("user") === null ? "Abrir sesión" : "/Cerrar la sesión de " + sessionStorage.getItem("usernombre") },
          { label: "Registrarse", to: "/registrarse?inserta=true", tooltips: "Crear una cuenta de usuario" },
          { label: "Acerca de", to: "/Acercade", tooltips: "Acerca de Destodo" },
        ]}
      />
      <Hero>
      <div className="cabeza">
         <IconButton color="primary" onClick={() => 
          {
             navigate(-1);
          }}>
             <ArrowBack />
            </IconButton>
        <h3 className="main-title">M2G-Destodo</h3>
        <h4 className="registrarse-cabeza-1"> - Informacion del negocio</h4>
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
          <section className="galeria">
            {inicio===false?
             <ComGalerias rutatmp={"negocios/" + idnegocio} desctmp={desctmp} perfil={idnegocio} deQuien="del negocio" />:""
            }
          </section>             
          {gps===1 || gps===true?
          <section className="mapa">
             <Map sx={{ height: "400px", width: "100%" }} onMapClick={lngLatSelected} remoteshowMap={showMap} lat={lat} lng={lng} point={{ lat, lng }} onChange={onChangeMap} remoteZoom={zoom} /> 
          </section>:""
          }

        </main>

      </Hero>
    </div>
  );
};

export default InfoNegocio;
