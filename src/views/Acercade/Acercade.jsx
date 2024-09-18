
/*
// components
import Navbar from "../../components/Navbar/Navbar"
import Tippy from "@tippyjs/react";
// layouts
import Hero from "../../layouts/Hero/Hero";
// 
//import { Link } from "react-router-dom"
// styles
import "./styles.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
//import Modal from "../../components/Modal/Modal";
import ChatDialogo from "../../components/ChatDialogo/ChatDialogo";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom"
import { getJpgFile } from "../../servicios/imagenes";


const Acercade = () => {
  const [contenidofoto, setContenidofoto] = useState();
  const [showchat, setShowchat] = useState(false);
  const [chatuser, setChatuser] = useState("root");
  const [chatnombre, setChatnombre] = useState("Destodo");
  const [indexChat, setIndexChat] = useState(0);
  const parsedParams = {}
  const navigate = useNavigate();

  async function contenidofile(file) 
  {

    let result = await getJpgFile({file: file});
    result = await result.text();

    if (result.length !== 0 && result.error === undefined) {
       setContenidofoto(result);
    }
  }
function init()
{
  contenidofile("./galerias/app_images/destodo/logo.jpg");
}

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
            {parsedParams.nivel === 0 ? "" :
              <IconButton color="primary" onClick={() => {
                navigate(`/?naturaleza=${sessionStorage.getItem("naturaleza")}&owner=${sessionStorage.getItem("idowner")}&nivel=${sessionStorage.getItem("nivel")}`);
              }}>
                <ArrowBack />
              </IconButton>
            }

            <h3 className="acercade-title">M2G-Destodo</h3>
        </div>
        <div className="acercade">
          <div className="logo-acerca">
            <Link to="/">
               <Tippy content="Inicio" >
                  <img className="logo-acerca-img" src={contenidofoto} />
               </Tippy>
            </Link>
            <h3>Acerca de</h3>
          </div>
              <p1>M2G-Destodo Versión 1.0</p1>
              <p1>Desarrollado por M2G Software.</p1>
              <p1>Celular: +5352675359 Fijo: +5322657241 </p1>
              <p1>Email: cmr201966@gmail.com </p1>
              <p1>WhatsApp: 5352675359 </p1>
              <p1>Santiago de Cuba.</p1>
              <p1>Todos los derechos reservados. 2024</p1>
        </div>
        {showchat===true?
          <ChatDialogo user={chatuser} nombre={chatnombre} indexChat={indexChat} />
        :""}
      </Hero>
    </div>
  );
};

export default Acercade;
*/

const kmToDegrees = (km) => {
    return km / 111.32; // Aproximación para convertir km a grados
};

const createBoundingBox = (centerPoint, distanciaArriba, distanciaAbajo, distanciaIzquierda, distanciaDerecha) => {
    const [lat, lon] = centerPoint;

    const deltaLatArriba = kmToDegrees(distanciaArriba);
    const deltaLatAbajo = kmToDegrees(distanciaAbajo);
    const deltaLonIzquierda = kmToDegrees(distanciaIzquierda / Math.cos(lat * (Math.PI / 180))); // Ajustar por latitud
    const deltaLonDerecha = kmToDegrees(distanciaDerecha / Math.cos(lat * (Math.PI / 180))); // Ajustar por latitud

    const bbox = {
        xmin: lon - deltaLonIzquierda,
        ymin: lat - deltaLatAbajo,
        xmax: lon + deltaLonDerecha,
        ymax: lat + deltaLatArriba,
    };

    return bbox;
};

const BoundingBoxComponent = () => {
    const centerPoint = [20.0217583, -75.829090519]; 
    const distanciaArriba = 2; // en km
    const distanciaAbajo = 2; // en km
    const distanciaIzquierda = 2; // en km
    const distanciaDerecha = 2; // en km

    const bbox = createBoundingBox(centerPoint, distanciaArriba, distanciaAbajo, distanciaIzquierda, distanciaDerecha);

    return (
        <div>
            <h2>Bounding Box</h2>
            <p>Xmin: {bbox.xmin}</p>
            <p>Ymin: {bbox.ymin}</p>
            <p>Xmax: {bbox.xmax}</p>
            <p>Ymax: {bbox.ymax}</p>
        </div>
    );
};

export default BoundingBoxComponent;
