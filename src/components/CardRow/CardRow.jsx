import { useEffect, useState, useRef } from "react";
import Tippy from "@tippyjs/react";

// @mui/icons
import {
  ShoppingCartCheckoutOutlined,
  BusinessCenterOutlined,
  PowerSettingsNew,
  OpenInBrowser,
} from "@mui/icons-material/";

// utils
import { isValid } from "../../Utiles/Utiles";
import { updateOcupadoCM } from "../../Utiles/apiBaseDatos";

// styles
import "./styles.css";

const CardRow = (props) => {
  const {
    tipouser,
    user,
    mapLoading,
    noproducto,
    i,
    item,
    selectcard,
    contenidofoto,
    verproducto,
    vernegocio,
    paresGps,
    onMapClick,
  } = props;
  const [ocupado, setOcupado] = useState(item.ocupado);
  const [inicia, setInicia] = useState(true);
  const linkRef = useRef(null);
  async function powerSettings() {
    if (user !== "" && isValid(user) === true) {
      setOcupado(ocupado === 0 ? 1 : 0);
    }
    updateOcupadoCM(item.idproducto, ocupado === 0 ? 1 : 0);
    //    apiBaseDatos("updateOcupado", item.idproducto, ocupado===0?1:0)
    paresGps();
  }
  useEffect(() => {
    // Simula un clic en el <a>
    if (linkRef.current && inicia === false) {
      linkRef.current.click();
    }
    setInicia(false);
  }, []);

  return (
    <div
      key={i}
      id={`card-${i}`}
      onClick={() => selectcard(i)}
      className={"card-row"}
    >
      <img src={contenidofoto} alt="Imagen" />
      {noproducto === false ? (
        <Tippy content={`${item.estado}`}>
          <button
            className={`card-image-button ${ocupado === 1 ? "off" : "on"}`}
            disabled={tipouser === null || tipouser === 0 ? true : false}
            onClick={powerSettings}
          >
            <PowerSettingsNew className="onOff" />
          </button>
        </Tippy>
      ) : (
        ""
      )}

      <div className="info">
        <div className="card-texts">
          {item.xxxNegocio !== "" && item.xxxNegocio !== undefined ? (
            <label className="texto-1">{item.xxxNegocio}</label>
          ) : (
            ""
          )}
          <label className="texto-1">{item.Producto}</label>
        </div>
      </div>
      <div className="button-container" id={`boton${i}`}>
        {noproducto === false ? (
          <>
            <Tippy
              content={`${
                ocupado === 0
                  ? "Datos del producto y ordenar"
                  : "Datos del producto"
              }`}
            >
              <button onClick={() => verproducto(i, item)}>
                <ShoppingCartCheckoutOutlined />
              </button>
            </Tippy>
            <Tippy content={`Más datos del negocio`}>
              <button onClick={() => vernegocio(i, item)}>
                <BusinessCenterOutlined />
              </button>
            </Tippy>
            {isValid(item.link)===true && item.link!== "" ? (
              <Tippy content={`Ir a ${item.idnegocio}`}>
                <a
                  className="irA"
                  ref={linkRef}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <OpenInBrowser />
                </a>
              </Tippy>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CardRow;
