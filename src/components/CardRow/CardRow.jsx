import Tippy from "@tippyjs/react";
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';            
import { useEffect, useState, useRef } from "react";
import { isValid } from "../../Utiles/Utiles";
import { updateOcupadoCM } from "../../Utiles/apiBaseDatos";


// styles
import "./styles.css";

const CardRow = (props) => {
  const { tipouser, user, mapLoading, noproducto, i, item, selectcard, contenidofoto, 
          verproducto, vernegocio, paresGps, onMapClick, pagina, link } = props
  const [ocupado, setOcupado]=useState(item.ocupado);
  const linkRef = useRef(null);
  async function powerSettings(){
    if (user!=="" && isValid(user)===true){
        setOcupado(ocupado===0?1:0);
    }
    updateOcupadoCM(item.idproducto, ocupado===0?1:0);
//    apiBaseDatos("updateOcupado", item.idproducto, ocupado===0?1:0)
    paresGps();

  }
  useEffect(() => {
    // Simula un clic en el <a>
    if (linkRef.current) {
      linkRef.current.click();
    }
  }, []);

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
             <PowerSettingsNewIcon className="onOff" />
           </button>
        </Tippy>:""
        }
      </div>
      
      <div className="info">
        <div className="card-texts">
          {item.xxxNegocio !== "" && item.xxxNegocio !== undefined ?
            <div>
              {/*<label className="parrafo_label"><strong>Negocio:</strong></label>*/}
              <label className="texto-1">{item.xxxNegocio}</label>
            </div> : ""}
          <div>
            {/*<label className="parrafo_label"><strong>Producto:</strong></label>*/}
            <label className="texto-1">{item.Producto}</label>
          </div>
        </div>
      </div>
      <div className="button-container" id={`boton${i}`}>
      {
        noproducto === false ? (
          <>
            <Tippy content={`${ocupado===0?"Datos del producto y ordenar":"Datos del producto"}`}>
              <button onClick={() => verproducto(i, item)}>
                <ShoppingCartCheckoutOutlinedIcon /> 
              </button>
            </Tippy>
            <Tippy content={`Más datos del negocio`}>
              <button onClick={() => vernegocio(i, item)}>
                <BusinessCenterOutlinedIcon  />
              </button>
            </Tippy>
            <Tippy content={`Ir a ${pagina}`}>
              <a className="irA" ref={linkRef} href={item.link} target="_blank" rel="noopener noreferrer">
                <OpenInBrowserIcon />
              </a>  
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
