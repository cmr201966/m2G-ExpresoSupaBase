// styles
import { useCallback, useState } from "react";
import { css } from "@emotion/css";
import "./styles.css";

const BigSlider = (props) => {
  const { imgs = [] } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition] = useState(true);
  const [movil] = useState(window.innerWidth < 768);
  const [cantidad, setCantidad] = useState(
    window.innerWidth <= 768 ? imgs.length - 2 : imgs.length - 6
  );

  const toLeft = useCallback(() => {
    setCantidad(cantidad - 1);
    if (currentIndex < imgs.length) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, imgs.length]);

  const toRight = useCallback(() => {
    setCantidad(cantidad+1);
    currentIndex > 0 ? setCurrentIndex(currentIndex - 1) : null;
  }, [currentIndex]);

  return (
    <div className="sacar-flecha">
        <div className={`multiple-slider`}>
          {movil===false && imgs.length >= 3 ? (
          <button onClick={() => toRight()} className="multiple-slider-nav left">
             {"<"}
          </button>):("")}
          <div className={`${movil?"multi-slider-movil":""} multiple-slider-content ${transition ? "transition" : ""} ${css({transform: `translateX(${currentIndex * -1 * 129}px)`,})}`}>
             {imgs?.map((item, i) => (
             <div key={i} className={"multiple-slider-item"}>
               {item}
             </div>
             ))}
          </div>

          {movil===false && ((window.innerWidth <= 768 && imgs.length >= 3) ||
          (window.innerWidth > 768 && imgs.length > 6)) && cantidad>0? (
            <button onClick={() => toLeft()} className="multiple-slider-nav right">
               {">"}
            </button>):("")}
        </div>
    </div>
  );
};

export default BigSlider;
