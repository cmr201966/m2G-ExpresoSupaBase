// styles
import { useCallback, useState } from "react";
import { css } from "@emotion/css";
import "./styles.css";

const BigSlider = (props) => {
  const { imgs = [] } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition] = useState(true);

  const toLeft = useCallback(() => {
    if (currentIndex < imgs.length) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, imgs.length]);

  const toRight = useCallback(
    () => (currentIndex > 0 ? setCurrentIndex(currentIndex - 1) : null),
    [currentIndex]
  );

  return (
    <div className={`multiple-slider`}>
      {imgs.length>=3?
        <button onClick={() => toRight()} className="multiple-slider-nav left">
          {"<"}
        </button>:""
      }
      <div
        className={`multiple-slider-content ${transition ? "transition" : ""} ${css({
          transform: `translateX(${currentIndex * -1 * 230}px)`,
        })}`}
      >
        {imgs?.map((item, i) => (
          <div key={i} className="multiple-slider-item">
            {item}
          </div>
        ))}
      </div>
      {imgs.length>=3?
        <button onClick={() => toLeft()} className="multiple-slider-nav right">
          {">"}
        </button>:""
      }
    </div>
  );
};

export default BigSlider;
