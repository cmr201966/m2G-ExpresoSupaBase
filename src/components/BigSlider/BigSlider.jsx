import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// styles
import "./styles.css";

// @emotion
import { css } from "@emotion/css";

// utils
import { getJpgFileSB, isValid } from "../../Utiles/Utiles";

// context
import { useNotification } from "../../context/NotificationProvider";

const BigSlider = (props) => {
  const {
    imgsFileName = [],
    imgsFolder = [],
    imgsId = [],
    categorias = [],
    users = [],
    nombres = [],
    links = [],
  } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition, setTransition] = useState(true);
  const [inicia, setInicia] = useState(true);
  const [imagenes] = useState([]);
  const { setOpen, setMessage } = useNotification();
  const toLeft = useCallback(() => {
    if (currentIndex < imgsFileName.length) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, imgsFileName.length]);

  const toRight = useCallback(
    () => (currentIndex > 0 ? setCurrentIndex(currentIndex - 1) : null),
    [currentIndex]
  );

  async function init() {
    setInicia(true);
    for (let i = 0; i < imgsFileName.length; i += 1) {
      let resultado = await getJpgFileSB(
      imgsFileName[i],
      imgsFolder[i],
      imgsFolder[i],
      imgsId[i],
      );
      if (isValid(resultado) === true) {
        imagenes.push(resultado);
      } else {
        setMessage("Error al recuperar la imagen del anuncio");
        setOpen(true);
      }
    }
    setInicia(false);
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (currentIndex === imgsFileName.length) {
      setTimeout(() => {
        setTransition(false);
        setCurrentIndex(0);
        setTimeout(() => {
          setTransition(true);
        }, 100);
      }, 700);
    }
  }, [currentIndex, imgsFileName.length]);

  useEffect(() => {
    setTimeout(() => {
      toLeft();
    }, 6000);
  }, [currentIndex, toLeft]);

  return (
    <div className={`big-slider`}>
      {/*
        <button onClick={() => toRight()} className="big-slider-nav left">
          L
        </button>
     */}
      {inicia === false ? (
        <div
          className={`big-slider-content ${
            transition ? "transition" : ""
          } ${css({
            transform: `translateX(${currentIndex * -1 * 100}vw)`,
          })}`}
        >
          {imgsFileName?.map((item, i) => (
            links[i]?.indexOf("https:") === -1 && links[i]?.length!==0 ?
            <Link
              key={i}
              to={`/productos?categoria=${
                categorias[i]
              }&user=${sessionStorage.getItem("user")}&nombre=${nombres[i]}`}
            >
            <div key={i} className="big-slider-item">
                <img className="img-slider" src={imagenes[i]} alt={nombres[i]} />
              </div>
            </Link>:
            links[i]?.indexOf("https:") !== -1 ?
                <a key={i}
                  href={links[i]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div key={i} className="big-slider-item">
                       <img className="img-slider" src={imagenes[i]} alt={nombres[i]} />
                  </div>
                </a>:""
            ))}
          {imgsFileName?.length && (
            links[0]?.indexOf("https:") === -1 && links[0]?.length!==0 ?
            <Link
              key={0}
              to={`/productos?categoria=${
                categorias[0]
              }&user=${sessionStorage.getItem("user")}&nombre=${nombres[0]}`}
            >
              <div className="big-slider-item">
                <img className="img-slider" src={imagenes[0]} alt={nombres[0]} />
              </div>
            </Link>:
            links[0]?.indexOf("https:") !== -1 ?
            <a key={0}
                href={links[0]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div key={0} className="big-slider-item">
                     <img className="img-slider" src={imagenes[0]} alt={nombres[0]} />
                </div>
              </a>:
                <div key={0} className="big-slider-item">
                   <img className="img-slider" src={imagenes[0]} alt={nombres[0]} />
                </div>

          )}
        </div>
      ) : (
        ""
      )}

      {/*
        <button onClick={() => toLeft()} className="big-slider-nav right">
          R
        </button>
      */}
    </div>
  );
};

export default BigSlider;
