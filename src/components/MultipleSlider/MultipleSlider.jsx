// styles
import { useCallback, useState } from "react";
import { css } from "@emotion/css";
import "./styles.css";

const BigSlider = (props) => {
  const { imgs = [] } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition] = useState(true);
  const [cantidad, setCantidad] = useState(
    window.innerWidth <= 375 ? imgs.length - 2 : imgs.length - 6
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
    <div className={`multiple-slider`}>
      {imgs.length >= 3 ? (
        <button onClick={() => toRight()} className="multiple-slider-nav left">
          {"<"}
        </button>
      ) : (
        ""
      )}
      <div
        className={`multiple-slider-content ${
          transition ? "transition" : ""
        } ${css({
          transform: `translateX(${currentIndex * -1 * 125}px)`,
        })}`}
      >
        {imgs?.map((item, i) => (
          <div key={i} className="multiple-slider-item">
            {item}
          </div>
        ))}
      </div>
      {console.log(cantidad)}
      {console.log((window.innerWidth <= 375 && imgs.length >= 3) ||
      (window.innerWidth > 375 && imgs.length > 6) && cantidad>0)}

      {((window.innerWidth <= 375 && imgs.length >= 3) ||
      (window.innerWidth > 375 && imgs.length > 6)) && cantidad>0? (
        <button onClick={() => toLeft()} className="multiple-slider-nav right">
          {">"}
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default BigSlider;
