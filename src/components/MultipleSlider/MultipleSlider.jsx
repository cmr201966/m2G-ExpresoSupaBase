// styles
import { useCallback, useState } from "react";
import { css } from "@emotion/css";
import "./styles.css";

const BigSlider = (props) => {
  //console.log(window.innerWidth);
  const { imgs = [] } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition] = useState(true);
  const [movil] = useState(window.innerWidth <= 600);
  let w1=Math.ceil((window.innerWidth*80)/100);
  let w2=Math.ceil(w1/180)-3;
  let w3=imgs.length-(w2);
  const [cantidad, setCantidad] = useState(
    window.innerWidth <= 600 ? imgs.length - 2 : w3);
//    console.log(window.innerWidth);
//    console.log(w1);
//    console.log(w2);
//    console.log(w3);
    /*alert(window.innerWidth);
    alert(w1);
    alert(w2);
    alert(w3);*/
//    console.log(window.innerWidth <=600 ? imgs.length - 2 : (imgs.length-Math.ceil(window.innerWidth/180))+1)
//  console.log(window.innerWidth <= 600 ? imgs.length - 2 : imgs.length - 6);
  const toLeft = useCallback(() => {
    console.log(cantidad, currentIndex);
    setCantidad(cantidad - 1);
    if (currentIndex < imgs.length) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, imgs.length]);

  const toRight = useCallback(() => {
    console.log(cantidad, currentIndex);
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
          <div className={`${movil?"multi-slider-movil":""} multiple-slider-content ${transition ? "transition" : ""} ${css({transform: `translateX(${currentIndex * -1 * 179}px)`,})}`}>
             {imgs?.map((item, i) => (
             <div key={i} className={"multiple-slider-item"}>
               {item}
             </div>
             ))}
          </div>

          {movil===false && imgs.length > 7 && cantidad>0? (
            <button onClick={() => toLeft()} className="multiple-slider-nav right">
               {">"}
            </button>):("")}
        </div>
    </div>
  );
};

export default BigSlider;
