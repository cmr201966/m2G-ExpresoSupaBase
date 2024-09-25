// styles
import { useCallback, useEffect, useState } from "react";
import { css } from "@emotion/css";
import "./styles.css";

const BigSlider = (props) => {
  const { imgs = [] } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition, setTransition] = useState(true);

  const toLeft = useCallback(() => {
    if (currentIndex < imgs.length) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, imgs.length]);

  const toRight = useCallback(
    () => (currentIndex > 0 ? setCurrentIndex(currentIndex - 1) : null),
    [currentIndex]
  );

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
    }, 10000);
  }, [currentIndex, toLeft]);

  return (
    <div className={`big-slider`}>
      {/*
        <button onClick={() => toRight()} className="big-slider-nav left">
          L
        </button>
     */}
      <div
        className={`big-slider-content ${transition ? "transition" : ""} ${css({
          transform: `translateX(${currentIndex * -1 * 100}vw)`,
        })}`}
      >
        {imgs?.map((item, i) => (
          <div key={i} className="big-slider-item">
          <img className="img-slider"
            src={item}
            alt="Foto"
          />

          </div>
        ))}
        {imgs?.length && <div className="big-slider-item">
          <img className="img-slider"
            src={imgs[0]}
            alt="Foto"
          />
</div>}
      </div>
      {/*
        <button onClick={() => toLeft()} className="big-slider-nav right">
          R
        </button>
      */}
    </div>
  );
};

export default BigSlider;
