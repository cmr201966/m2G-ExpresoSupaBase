import { Link } from "react-router-dom";

// styles
import "./styles.css";

const CardMultipleSlider = (props) => {
  const {
    categoria,
    link,
    titulo,
    imagen,
    rutatmp,
    desctmp,
    nivel,
    descripcion,
  } = props;
  return (
    <>
      {link.toLowerCase().indexOf("https") >= 0 ? (
        <a className="card-slider" href={link} target="_blank" rel="noopener noreferrer">
          <p className="card-slider-titulo">
            <b>{titulo}</b>
          </p>
          <img
            className="card-slider-img"
            src={imagen}
            alt={`Foto de ${titulo}`}
          />
          <p className="card-slider-descripcion">{descripcion}</p>
        </a>
      ) : (
        <Link
          className="card-slider"
          to={`/${link}?nombre=${titulo}&categoria=${categoria}&rutatmp=${rutatmp}&desctmp=${desctmp}&nivel=${nivel}&
              deQuien=${
                sessionStorage.getItem("user") === null
                  ? "Invitado"
                  : sessionStorage.getItem("usernombre")
              }&user=${sessionStorage.getItem("user")}`}
        >
          <p className="card-slider-titulo">
            <b>{titulo}</b>
          </p>
          <img
            className="card-slider-img"
            src={imagen}
            alt={`Foto de ${titulo}`}
          />
          <p className="card-slider-descripcion">{descripcion}</p>
        </Link>
      )}
    </>
  );
};

export default CardMultipleSlider;
