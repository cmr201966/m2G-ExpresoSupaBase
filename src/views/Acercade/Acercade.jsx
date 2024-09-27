

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
      <Navbar nivel={1}/>
      <Hero>
        <div className="cabeza">
            {parsedParams.nivel === 0 ? "" :
              <IconButton color="primary" onClick={() => {
                navigate(`/?naturaleza=${sessionStorage.getItem("naturaleza")}&owner=${sessionStorage.getItem("idowner")}&nivel=${sessionStorage.getItem("nivel")}`);
              }}>
                <ArrowBack />
              </IconButton>
            }

            <h3 className="acercade-title">Atrás</h3>
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
              <p1>m2G-Destodo Versión 1.0</p1>
              <p1>Desarrollado por m2G-Software.</p1>
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


/*
import React from 'react';
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';

const FIRST_IMAGE = {
  imageUrl: 'https://example.com/.../some-image.jpg'
};
const SECOND_IMAGE = {
  imageUrl: 'https://example.com/.../some-image-2.jpg'
};
<ReactBeforeSliderComponent
    firstImage={FIRST_IMAGE}
    secondImage={SECOND_IMAGE}
/>
*/