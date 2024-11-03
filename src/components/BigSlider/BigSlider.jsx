// styles
import { useCallback, useEffect, useState } from "react";
import { css } from "@emotion/css";
import "./styles.css";
import { Link } from "react-router-dom";
import {  getJpgFileSB } from "../../Utiles/Utiles";
import { useNotification } from "../../context/NotificationProvider";


const BigSlider = (props) => {
  const { imgs = [] } = props;
  const { categorias = [] } = props;
  const { users = [] } = props;
  const { nombres = [] } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition, setTransition] = useState(true);
  const [inicia, setInicia] = useState(true);
  const [imagenes] = useState([]);
  const {setOpen, setMessage} = useNotification();
  const toLeft = useCallback(() => {
    if (currentIndex < imgs.length) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, imgs.length]);

  const toRight = useCallback(
    () => (currentIndex > 0 ? setCurrentIndex(currentIndex - 1) : null),
    [currentIndex]
  );

  async function init() {
    setInicia(true);
    for (let i=0; i<imgs.length; i += 1)  {
      let resultado = await getJpgFileSB(imgs[i], imgs[i]);
     if (resultado!== undefined && resultado!==null) {
        imagenes.push(resultado)
     } else {
       setMessage('Error al recuperar la imagen del anuncio');
       setOpen(true);
     }   
    }
    setInicia(false);
  }
  
  useEffect(() => {
    init();
   }, []);
   
  useEffect(() => {
    if (currentIndex === imgs.length) {
      setTimeout(() => {
        setTransition(false);
        setCurrentIndex(0);
        setTimeout(() => {
          setTransition(true);
        }, 100);
      }, 700);
    }
  }, [currentIndex, imgs.length]);

  useEffect(() => {
    setTimeout(() => {
      toLeft();
    }, 3000);
  }, [currentIndex, toLeft]);

  return (
    <div className={`big-slider`}>
      {/*
        <button onClick={() => toRight()} className="big-slider-nav left">
          L
        </button>
     */}
      {inicia===false?
      <div
        className={`big-slider-content ${transition ? "transition" : ""} ${css({
          transform: `translateX(${currentIndex * -1 * 100}vw)`, })}`}
      >
        {imgs?.map((item, i) => (
         <Link  key={i} to={`/productos?userAnuncio=${users[i]}&categoria=${categorias[i]}&user=${sessionStorage.getItem("user")}&nombre=${nombres[i]}`}>
            <div key={i} className="big-slider-item">
            <img className="img-slider"
              src={imagenes[i]}
              alt="Foto"
            />
            </div>
        </Link>
        ))}
        {imgs?.length && 
         <Link  key={0} to={`/productos?userAnuncio=${users[0]}&categoria=${categorias[0]}&user=${sessionStorage.getItem("user")}&nombre=${nombres[0]}`}>
            <div className="big-slider-item">
               <img className="img-slider"
               src={imagenes[0]}
               alt="Foto"
             />
         </div>
         </Link>
         }
      </div>:""
      }

      {/*
        <button onClick={() => toLeft()} className="big-slider-nav right">
          R
        </button>
      */}
    </div>
  );
};

export default BigSlider;
