
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
import { isValid, getJpgFileSB  } from "../../Utiles/Utiles";
import { useNotification } from "../../context/NotificationProvider";
import config from "../../config";


const Acercade = () => {
  const [contenidofoto, setContenidofoto] = useState();
  const [showchat, setShowchat] = useState(false);
  const [chatuser, setChatuser] = useState("root");
  const [chatnombre, setChatnombre] = useState("Destodo");
  const [indexChat, setIndexChat] = useState(0);
  const {setOpen, setMessage} = useNotification();
  //const urlMYSQL = config.urlmysql;
  //const urlSUPABASE = config.urlsupabase;
  const parsedParams = {}
  const navigate = useNavigate();

async function init()
{
  let resultado = await getJpgFileSB("logo.jpg", "./galerias/app_images/destodo/", "destodo/");
  if (isValid(resultado)=== true) {
     setContenidofoto(resultado);
  } else {
     setMessage('Error al recuperar la imagen del usuario');
     setOpen(true);
  }                       
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
                navigate(`/?nivel=${sessionStorage.getItem("nivel")}`);
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
{/*                  <img className="logo-acerca-img" src={sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL"? urlMYSQL: urlSUPABASE} />*/}
                  <img className="logo-acerca-img" src={contenidofoto} />
               </Tippy>
            </Link>
            <h3>Acerca de</h3>
          </div>
              <p>m2G-Expreso Versión 1.0</p>
              <p>Desarrollado por m2G-Software.</p>
              <p>Celular: +5352675359 Fijo: +5322657241 </p>
              <p>Email: cmr201966@gmail.com </p>
              <p>WhatsApp: 5352675359 </p>
              <p>Santiago de Cuba.</p>
              <p>Todos los derechos reservados. 2024</p>
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