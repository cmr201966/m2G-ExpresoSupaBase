import { useCallback, useState, useRef, useEffect } from "react";
import { css } from "@emotion/css";
import "./styles.css";

const MultipleSlider = ({ imgs = [] }) => {
  const visible = 5; // siempre 5 visibles
  const sliderRef = useRef(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // calcula dimensiones (ancho visible y ancho de item) y número de páginas
  const measure = () => {
    if (!sliderRef.current) return;
    const computed = getComputedStyle(sliderRef.current);
    const gap = parseFloat(computed.gap) || 20; // coincide con tu CSS gap
    const w = sliderRef.current.clientWidth || 0;
    setSliderWidth(w);

    // ancho de cada tarjeta para que entren exactamente `visible` en `w`
    const itemW = visible > 0 ? Math.max(0, (w - gap * (visible - 1)) / visible) : 0;
    setItemWidth(itemW);

    // ajustar currentPage si las páginas disminuyeron
    const pageCount = Math.max(1, Math.ceil(imgs.length / visible));
    setCurrentPage((p) => Math.min(p, pageCount - 1));
  };

  useEffect(() => {
    // medir tras render + un pequeño retardo (para cuando las imágenes cambian layout)
    measure();
    const t = setTimeout(measure, 120);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgs.length]);

  // avanzar página (derecha visual = next)
  const nextPage = useCallback(() => {
    const pageCount = Math.max(1, Math.ceil(imgs.length / visible));
    setCurrentPage((p) => Math.min(p + 1, pageCount - 1));
  }, [imgs.length]);

  // retroceder página (izquierda visual = prev)
  const prevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(p - 1, 0));
  }, []);

  // si no hay ancho calculado aún, no aplicamos transform para evitar saltos
  const translate = sliderWidth ? -currentPage * sliderWidth : 0;

  return (
    <div className="sacar-flecha">
      {currentPage > 0 && (
        <button className="multiple-slider-nav left" onClick={prevPage}>
          {"<"}
        </button>
      )}

      <div className="multiple-slider" ref={sliderRef}>
        <div
          className={`multiple-slider-content transition ${css({
            transform: `translateX(${translate}px)`,
          })}`}
          // no overflow-x: auto en CSS => no scroll manual
        >
          {imgs.map((item, i) => (
            <div
              key={i}
              className="multiple-slider-item"
              style={{ width: itemWidth ? `${itemWidth}px` : "auto" }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {currentPage < Math.ceil(imgs.length / visible) - 1 && (
        <button className="multiple-slider-nav right" onClick={nextPage}>
          {">"}
        </button>
      )}
    </div>
  );
};

export default MultipleSlider;
