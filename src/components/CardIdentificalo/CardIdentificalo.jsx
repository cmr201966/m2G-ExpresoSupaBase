
import Modal from "../../components/Modal/Modal";
import axios from "axios";
import { useEffect, useState } from "react";

// styles
import "./styles.css"
const CardIdentificalo = (props) => {
    const { item, action, mal, bien, categoria, index,respuestas, puntos } = props;
    const [disable, setDisable] = useState(false);
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [inicia, setInicia] = useState(true);
    const [contenidofotos, setContenidofotos] = useState("");
    const [contenido, setContenido] = useState("");

    async function init()
    {
        const resultado = await axios.post(
            "http://localhost:3001/getjpg-file",
            { file: item.photo },
            {}
          );
        setContenidofotos(resultado.data);
        setInicia(false);
    }

    async function navegar(e)
    {
        const { id } = e.target;
        const [, respuesta] = id.split("-")
        setDisable(true);
        if (respuesta === item.answer) 
        {
            bien()
            e.target.classList.add("correcto");
        }
        else 
        {
            mal()
            document.getElementById(`${index}-${item.answer}`).classList.add("correcto");
            e.target.classList.add("incorrecto");
        }
        let acreditar=false;
        let ptos=0;
        if (respuesta === item.answer) 
        {
            if (respuestas===5)
            {
                ptos=Number(puntos)+2;
                acreditar=true;
            }
        }
        else
        if (respuestas===5)
        {
            if (Number(puntos)>0)
            {
               ptos=Number(puntos)-1;
            }
            acreditar=true;
        }
        if (acreditar)
        {
            const resultado1 = await axios.post(
                "http://localhost:3001/addscore",
                { user: "cmr" , idApp: item.idApp, cantidad: ptos },
                {}
              );
              setContenido(item.info + " : " + resultado1.data.ok);
              setShow1(true);
        }
        else
        {
            setContenido(item.answer + " - " + item.info);
            setShow1(true);
        }
    }

    function img_view() 
    {
       setShow(true);
    }
  
    function onModalClose() 
    {
      setShow(false);
    }

    function onModalClose1() 
    {
      setShow1(false);
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <>
        <Modal visible={show} onClose={onModalClose} className="cmodal" classContainer="modal-lugares">
            <div className="cerrar-button">
               <button className="cerrar" onClick={onModalClose}>X</button>
            </div>
            <div className="img_zoom">
               <img src={contenidofotos} alt="Identificar imagenes" />
            </div>
         </Modal>
         <Modal visible={show1} onClose={onModalClose1} className="cmodal" classContainer="modal-lugares">
            <div className="cerrar-button">
               <button className="cerrar" onClick={onModalClose1}>X</button>
            </div>
            <div className="img_zoom">
              <label>{contenido}</label>
            </div>
         </Modal>
        {inicia===false?
        <div className="card-identificalo">
            <div >
                <div style={{ height: categoria === 1 ? "163px" : "250px" }} className="card-identificalo-image">
                    <img src={contenidofotos} onClick={img_view} alt="card" />
                </div>
            </div>

            <div className="card-identificalo-button">
                <button id={`${index}-${item.respuesta1}`} onClick={navegar} disabled={disable}>{item.respuesta1} </button>
                <button id={`${index}-${item.respuesta2}`} onClick={navegar} disabled={disable}>{item.respuesta2} </button>
                <button id={`${index}-${item.respuesta3}`} onClick={navegar} disabled={disable}>{item.respuesta3} </button>
                <button id={`${index}-${item.respuesta4}`} onClick={navegar} disabled={disable}>{item.respuesta4} </button>
                <button id={`${index}-${item.respuesta5}`} onClick={navegar} disabled={disable}>{item.respuesta5} </button>
            </div>

        </div>:""}

        </>
    );
};

export default CardIdentificalo
