import Tippy from "@tippyjs/react";
import InfoIcon from "@mui/icons-material/Info";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useState } from "react";
import { updateOcupado } from "../../servicios/productos";

// styles
import "./styles.css";

const CardRow = (props) => {
  const { tipouser, user, mapLoading, noproducto, i, item, selectcard, contenidofoto, verproducto, vernegocio, paresGps, onMapClick } = props
  const [ocupado, setOcupado]=useState(item.ocupado);


  async function powerSettings(){
    if (user!=="" && user!==null && user!==undefined){
        setOcupado(ocupado===0?1:0);
    }

    await updateOcupado({idproducto: item.keyproducto, ocupado: ocupado===0?1:0});

    paresGps();

  }
``
  return (
    <div
      key={i}
      id={`card-${i}`}
      onClick={() => selectcard(i)}
      className={"card-row"}
    >
      <div className="card-image">
        <img src={contenidofoto} alt="Imagen" />
        {noproducto===false?
        <Tippy content={`Libre/Ocupado`}>
           <button className={`${ocupado===0?"card-image-onoff":"card-image-offon"}`}  disabled={tipouser===null ||tipouser===0?true:false} onClick={powerSettings}>
             <PowerSettingsNewIcon />
           </button>
        </Tippy>:""
        }
      </div>
      
      <div className="info">
        <div className="card-texts">
          {item.xxxNegocio !== "" && item.xxxNegocio !== undefined ?
            <div>
              <label className="parrafo_label">Negocio:</label>
              <label className="parrafo_texto1">{item.xxxNegocio}</label>
            </div> : ""}
          <div>
            <label className="parrafo_label">Producto:</label>
            <label className="parrafo_texto3">{item.Producto}</label>
          </div>
        </div>
      </div>
      <div className="button-container" id={`boton${i}`}>
      {
        noproducto === false ? (
          <>
            <Tippy content={`${ocupado===0?"Datos del producto y ordenar":"Datos del producto"}`}>
              <button onClick={() => verproducto(i, item)}>
                <InfoIcon /> <span>Producto</span>
              </button>
            </Tippy>
            <Tippy content={`Más datos del negocio`}>
              <button onClick={() => vernegocio(i, item)}>
                <InfoIcon /><span>Negocio</span>
              </button>
            </Tippy>
          </>
        ) : (
          ""
        )
      }
      </div>
    </div >
  );
};

export default CardRow;
