import { Link } from "react-router-dom";

// styles
import "./styles.css";

const CardMultipleSlider = (props) => {
  const { titulo, imagen, descripcion } = props

console.log(titulo, descripcion);
  return (
    <div className="card-slider">    
         <p className="card-slider-titulo"><b>{titulo}</b></p>
         <img className="card-slider-img" src={imagen} alt={`Foto de ${titulo}`}  />
         <p className="card-slider-descripcion">{descripcion}</p>
    </div>
  );
};

export default CardMultipleSlider;
