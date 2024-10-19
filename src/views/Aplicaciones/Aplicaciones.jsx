import Tippy from "@tippyjs/react";
import Navbar from "../../components/Navbar/Navbar"
import Hero from "../../layouts/Hero/Hero";
import "./styles.css";
import { useEffect, useState } from "react";
import Check from "@mui/icons-material/Check";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import Snackbar from '@mui/material/Snackbar';
import { useLocation } from "react-router-dom";
import { getAplicaciones, setAplicaciones } from "../../servicios/aplicaciones";
import { getcategoriasnegocios } from "../../servicios/negocios";
import { getJpgFile  } from "../../servicios/imagenes";
import { delAnuncio  } from "../../servicios/catalogos";
import { buscarEnArreglo, buscarEnArregloString } from "../../Utiles/Utiles";


const Aplicaciones = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {}
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [nick, setNick] = useState("");
  const [desc, setDesc] = useState("");
  const [ttip, setTtip] = useState("");
  const [arrayCategorias, setArrayCategorias] = useState([]);
  const arraynoCategorias = [{ categorianegocio: 8, desc: "Desconocida" }];
  const [categoria, setCategoria] = useState("");
  const [inicia, setInicia] = useState(true);
  const [agregarsn, setAgregarsn] = useState(false);
  const [editarsn, setEditarsn] = useState(false);
  const [eliminarsn, setEliminarsn] = useState(false);
  const [aplicacion, setAplicacion] = useState(0);
  const [arrayAplicaciones, setArrayAplicaciones] = useState([]);
  const arraynoaplicaciones = [{ id: 0, desc: "Desconocida" }];
  // Estados para almacenar los datos del negocio activo
  const [nickt, setNickt] = useState("");
  const [desct, setDesct] = useState("");
  const [ttipt, setTtipt] = useState("");
  const [contenido, setContenido] = useState("");
  const [nombrefoto, setNombrefoto] = useState("");
  const [contenidofoto, setContenidofoto] = useState();
  const [cbvista, setCbvista] = useState(false);
  const [foto] = useState();


  async function init() {
    for (let prop in parsedParams) {
      sessionStorage.setItem(prop, parsedParams[prop])
    }

    if ((sessionStorage.getItem("login")===1 || sessionStorage.getItem("login")==='1') && (sessionStorage.getItem("user")==='null' || sessionStorage.getItem("user")===null)){
      navigate(`/login?login=1&regreso=${sessionStorage.getItem("regreso")}`);
  }

    setContenido("Preparando condiciones...");
    setShow(true);

    let result = await getAplicaciones({});
    result = await result.json();
    if (result.error || result.length === 0) 
    {
      setArrayAplicaciones(arraynoaplicaciones);
      setAplicacion(buscarEnArreglo(arraynoaplicaciones, arraynoaplicaciones[0].id, "id"));
    }
    else 
    {
      guardaDatosAplicacion(result, 0)
      setAplicacion(buscarEnArreglo(result, result[0].id, "id"));
  
    }
     let resultcategorias = await getcategoriasnegocios({});
     resultcategorias = await resultcategorias.json();

      if (resultcategorias.error || resultcategorias.length === 0) 
      {
        setArrayCategorias(arraynoCategorias);
        setCategoria(buscarEnArreglo(arraynoCategorias, arraynoCategorias[0].categorianegocio, "categorianegocio"));
      }
      else 
      {
        setArrayCategorias(resultcategorias);
        if (result.length>0){
          console.log(buscarEnArreglo(result, result[0].id, "id"))
          console.log(result[buscarEnArreglo(result, result[0].id, "id")].idcategoria);
          console.log(result);
           setCategoria(buscarEnArreglo(resultcategorias, result[buscarEnArreglo(result, result[0].id, "id")].idcategoria, "categorianegocio"));
           let resultado = await getJpgFile({ file: "./galerias/app_images/aplicaciones/" + result[0].id + "/" + result[0].id + ".jpg"});
           resultado = await resultado.text();
     
           if (resultado.length !== 0) {
             setContenidofoto(resultado);
             setNombrefoto("");
           } else {
             setNombrefoto("123");
           }
 
        }        
          }
        
    setShow(false);
    setInicia(false);
  } // init

  function guardaDatosAplicacion(data, i)
  {
    console.log(data);
    console.log(arrayCategorias)
    setArrayAplicaciones(data);
    recuperardatosproducto(data, i);
    setNick(data[i].idapp);
    setDesc(data[i].desc);
    setTtip(data[i].tooltip);
    setCategoria(buscarEnArreglo(arrayCategorias, data[i].idcategoria, "categorianegocio"));
    setAplicacion(i);

  }


  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location]);


  function buscaCategoria(data, categoria){
    let j=999999;
    for(let i=0; i<data.length; i+=1){
        if (data[i].categorianegocio===categoria){
          j=i;
        }
    }
    return(j);
  }
  function recuperardatosproducto(data, i) 
  {
    setNickt(data[i].idapp);
    setDesct(data[i].desc);
    setTtipt(data[i].tooltip);
    
  }

  function restaurardatosproductos() 
  {
    setNick(nickt);
    setDesc(desct);
    setTtip(ttipt);
    //setCategoria(categoriat);
  }
    
  function tcancelar() 
  {
    setAgregarsn(false);
    setEditarsn(false);
    setEliminarsn(false);
    setDesc("");
  }

    function limpiardatosaplicacion() {
       setNick("");
       setDesc("");
       setTtip("");

    }
    const onModalClose = () => 
    {
    setShow(false)
    }
  
    function editar() 
    {
      restaurardatosproductos();
      setEditarsn(true);
    }
  
    function agregar() 
    {
      limpiardatosaplicacion();
      setAgregarsn(true);
    }
  
    const eliminar = () => 
    {
      setEliminarsn(true);
      setContenido("¿Está seguro que desea eliminar a " + arrayAplicaciones[aplicacion].desc + "?");
      setShow(true);
    }

    async function confirmar() {
      let result = await setAplicaciones({id: arrayAplicaciones[aplicacion].id, iduser: sessionStorage.getItem("user"), nick, desc, tooltip: ttip, 
                                          categoria: arrayCategorias[categoria].categorianegocio, agregarsn, editarsn, contenidofoto});
      result = await result.json();

    if (result.ok!=="ok"){
        setMessage("Error al agregar la aplicacion")
        setOpen(true);
      }
    else{
        setMessage("La aplicacion se agrego correctamente.")
        setOpen(true);       
        limpiardatosaplicacion;
  
    }
  }

  async function buscaFoto(foto){
    let resultado = await getJpgFile({ file: foto});
    resultado = await resultado.text();

    if (resultado.length !== 0) {
      setContenidofoto(resultado);
      setNombrefoto("Foto");
    } else {
      setNombrefoto("");
    }
     return
  }

  async function handleInput(e) {
    switch (e.target.id) {
      case "nick":
          setNick(e.target.value);
          break;
      case "idapp":
          setAplicacion(e.target.value);
          recuperardatosproducto(arrayAplicaciones, e.target.value);
          setCategoria(buscarEnArreglo(arrayCategorias, arrayAplicaciones[e.target.value].idcategoria, "categorianegocio"));
          buscaFoto("./galerias/app_images/aplicaciones/" + arrayAplicaciones[e.target.value].id + "/" + arrayAplicaciones[e.target.value].id + ".jpg");
              break;
       case "desc":
            setDesc(e.target.value);
            break;
      case "ttip":
           setTtip(e.target.value);
           break;
      case "categoria":
           setCategoria(e.target.value);
           break;
      case "vista":
           setCbvista(e.target.checked);
           break;   
     default:
        break;
    }
  }

  const onPhotoChange = (e) => {
    const file = e.target.files[0];
    setNombrefoto(e.target.value);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setContenidofoto(content);
    };
    reader.readAsDataURL(file);
    setCbvista(true);
  };

  async function sino() {
    await delAnuncio({ id: arrayAplicaciones[aplicacion].id });
    setMessage("Se eliminó el anuncio " + arrayAplicaciones[aplicacion].desc);
    setOpen(true);
    setShow(false);
    setEliminarsn(false);
    init;
  }

  useEffect(() => {
    init()
  }, [])

  
  return (

    <>    
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        autoHideDuration={4000}
        open={open}
        onClose={()=>setOpen(!open)}
        message={message}
      />

      <Modal
        visible={show}
        onClose={onModalClose}
        className="cmodal wmodal"
        classContainer="modal-catalogo-productos"
      >
        <div className="cerrar-button">
          <button className="cerrar" onClick={onModalClose}>
            X
          </button>
        </div>
        <div className="main-modal">
          <label>{contenido}</label>
          {eliminarsn ? (
            <>
              <button className="si" onClick={sino}>
                Si
              </button>
              <button className="no" onClick={onModalClose}>
                No
              </button>
            </>
          ) : (
            ""
          )}
        </div>
      </Modal>

    <div>
      <Navbar nivel= {1}/>
      <Hero>
        <div className="div-papa">
        <div className="cabeza">
            <IconButton color="primary" onClick={() => {
              navigate(`/?nivel=${0}`);
            }}>
            <ArrowBack className="flecha" />
            </IconButton>
            <h4 className="h3-1-cabeza-negocios">Atrás</h4>
        </div>

        <div className="aplicaciones">
          <p className="strong"> Publicar anuncio</p>
          <div className="container-aplicaciones">
            <div className="app-grip">
                <div className="app-flex app-flex-gap">
                     <label>Anuncio:</label>
                     {inicia===false && (agregarsn || editarsn)?
                      <>
                     <label>Descripcion:</label>
                     <label>Tooltip:</label>
                     <label className="app-label-naturaleza">Categoria: </label>
                     </>:""
                     }
                 </div>
                 <div className="app-flex">
                    {agregarsn===true?
                      <input className="app-input-area"
                               id="nick"
                               value={nick}
                               onChange={handleInput}
                               type="text"
                               required
                       />:""}
                       
                    {(agregarsn===false && editarsn===false) || editarsn===true?
                      <div className="input-area1-producto">
                        <select className="app-select-naturaleza" disabled={editarsn===true?true:false} id="idapp" onChange={handleInput} value={aplicacion}>
                          {arrayAplicaciones.map((item, i) => {
                            return <option key={i} value={i} >{item.idapp}</option>
                          })}
                        </select>
                      </div>:""}

                      {inicia===false && (agregarsn || editarsn)?
                         <>
                         <input className="app-input-area"
                                id="desc"
                                value={desc}
                                onChange={handleInput}
                                type="text"
                                required
                         />

                         <input className="app-input-area"
                              id="ttip"
                              value={ttip}
                              onChange={handleInput}
                              type="text"
                              required
                         />
                         <div className="input-area1-producto">
                           <select className="app-select-naturaleza" id="categoria" onChange={handleInput} value={categoria}>
                               {arrayCategorias.map((item, i) => {
                                   return <option key={i} value={i} >{item.desc}</option>
                               })}
                           </select>
                         </div>

                       </>:""
                      }
                 </div>                 
              </div> 
              {nombrefoto !== "" && cbvista ? (
                          <div className="img-class">
                              <img
                                className="img-producto"
                                src={contenidofoto}
                              />
                          </div>
                          ) : (
                            ""
                          )}

             <div className="grupo-button-app">
                   {(agregarsn === true || editarsn === true) && nombrefoto !== "" && nick!=="" && desc!=="" && ttip!==""? (
                      <Tippy content="Vista previa">
                        <button
                          type="button"
                          className="producto-button primary"
                          onClick={()=>setCbvista(!cbvista)}>
                          <VisibilityIcon />
                        </button>
                      </Tippy>
                     ) : (
                      ""
                    )}
                  {(agregarsn === true || editarsn === true) && nick!=="" && desc!=="" && ttip!==""? (
                         <label className="producto-button primary label-photo">
                          <input
                            id="foto"
                            value={foto}
                            onChange={onPhotoChange}
                            type="file"
                            required
                            multiple
                          />
                          <Tippy content="Añadir foto">
                            <AddPhotoAlternateIcon />
                          </Tippy>
                        </label>
                    ) : (
                      ""
                    )}
                {(agregarsn === false && editarsn === false) ?
                    <Tippy content="Añadir Anuncio">
                      <button type="button" className="producto-button primary" onClick={agregar}>
                      <Add />
                      </button>
                    </Tippy> : ""
                  }
                  {inicia===false?
                  <>
                  {(agregarsn === false && editarsn === false && arrayAplicaciones[aplicacion].desc!=="Desconocida") ?
                    <Tippy content="Clic para editar el anuncio">
                      <button type="button" className="producto-button primary" disabled={arrayAplicaciones[aplicacion].desc === "Desconocida"} onClick={editar}>
                      <Edit />
                      </button>
                    </Tippy> : ""
                  }

                  {(agregarsn === false && editarsn === false  && arrayAplicaciones[aplicacion].desc!=="Desconocida") ?
                    <Tippy content="Clic para eliminar el anuncio">
                      <button type="button" className="producto-button primary" disabled={arrayAplicaciones[aplicacion].desc === "Desconocida"} onClick={eliminar}>
                      <Delete />
                      </button>
                    </Tippy> : ""
                  }

                  </>:""}
                  {inicia===false && (agregarsn || editarsn) && (nick?.length!==0 && desc?.length!==0) ?
                    <Tippy content={nick.length !== 0 && desc.length !== 0 ? "Registrar el anuncio" : "Complete los datos necesarios"}>
                      <button type="button" className="producto-button primary" onClick={nick.length !== 0 && desc.length !== 0 ? confirmar : ""}>
                      <Check />
                      </button>
                    </Tippy> : ""
                  }

                  {inicia===false && (agregarsn || editarsn) ?
                    <Tippy content="Cancelar, agregar ó editar anuncio">
                      <button type="button" className="producto-button primary" onClick={tcancelar}>
                      <Close />
                      </button>
                    </Tippy> : ""
                  }

                </div>
            </div>
          </div>
        </div>
      </Hero>
    </div>
    </>
);
};

export default Aplicaciones;
