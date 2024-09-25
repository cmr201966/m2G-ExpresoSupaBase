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

  {/*
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
*/}
{/*
  useEffect(() => {
    setTimeout(() => {
      toLeft();
    }, 3000);
  }, [currentIndex, toLeft]);

          transform: `translateX(${currentIndex * -1 * 100}vw)`,


  */}
  return (
    <div className={`multiple-slider`}>
        <button onClick={() => toRight()} className="multiple-slider-nav left">
          {"<"}
        </button>
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
{/*        {imgs?.length && <div className="multiple-slider-item">{imgs[0]}</div>}*/}
      </div>
        <button onClick={() => toLeft()} className="multiple-slider-nav right">
          {">"}
        </button>
    </div>
  );
};

export default BigSlider;
