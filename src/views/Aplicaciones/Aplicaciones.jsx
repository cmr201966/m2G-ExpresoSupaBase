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
import { useLocation } from "react-router-dom";
import { useNotification } from "../../context/NotificationProvider";
import { isValid, apiBaseDatos, buscarEnArreglo, getJpgFileSB  } from "../../Utiles/Utiles";
import { Box, CircularProgress } from "@mui/material";

const Aplicaciones = () => {
// Create a single supabase client for interacting with your database
  
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {}
  const [show, setShow] = useState(false);
  const {setOpen, setMessage} = useNotification();
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
  const [isBase64ToBlob, setIsBase64ToBlob]=useState(true);
  // Estados para almacenar los datos del negocio activo
  const [nickt, setNickt] = useState("");
  const [desct, setDesct] = useState("");
  const [ttipt, setTtipt] = useState("");
  const [contenido, setContenido] = useState("");
  const [nombrefoto, setNombrefoto] = useState("");
  const [contenidofoto, setContenidofoto] = useState("");
  const [cbvista, setCbvista] = useState(false);
  const [foto] = useState();


  async function init() {

    for (let prop in parsedParams) {
      sessionStorage.setItem(prop, parsedParams[prop])
    }

    if ((sessionStorage.getItem("login")===1 || sessionStorage.getItem("login")==='1') && (isValid(sessionStorage.getItem("user"))===false)){
      navigate(`/login?login=1&regreso=${sessionStorage.getItem("regreso")}`);
      return
  }
  if (sessionStorage.getItem("tipouser")!=='1' && sessionStorage.getItem("tipouser")!=='2' && sessionStorage.getItem("tipouser")!=='3'){
    setMessage("No tiene derechos para crear, editar o eliminar productos")
    setOpen(true);
    navigate(`/`);
    return
  }
      let result = await apiBaseDatos("getAplicaciones")
      if (result.length === 0) 
      {
         setArrayAplicaciones(arraynoaplicaciones);
         setAplicacion(buscarEnArreglo(arraynoaplicaciones, arraynoaplicaciones[0].id, "id"));
      }
      else 
      {
        guardaDatosAplicacion(result, 0)
        setAplicacion(buscarEnArreglo(result, result[0].id, "id"));  
      }
      let resultcategorias= await apiBaseDatos("getCategoriasNegocios");

      if (resultcategorias.length === 0) 
      {
        setArrayCategorias(arraynoCategorias);
        setCategoria(buscarEnArreglo(arraynoCategorias, arraynoCategorias[0].categorianegocio, "categorianegocio"));
      }
      else 
      {
        setArrayCategorias(resultcategorias);
        if (result.length>0){
           setCategoria(buscarEnArreglo(resultcategorias, result[buscarEnArreglo(result, result[0].id, "id")].idcategoria, "categorianegocio"));
           setIsBase64ToBlob(true);
           let resultado = await getJpgFileSB("./galerias/app_images/aplicaciones/" +  result[0].id + "/" + result[0].id + ".jpg", 
                                          "aplicaciones/" +  result[0].id + "/" + result[0].id + ".jpg");
          if (isValid(resultado)=== true) {
             setIsBase64ToBlob(true);
             setContenidofoto(resultado);
             setNombrefoto(result[0].id);
          } else {
            setIsBase64ToBlob(false);
            setNombrefoto("");
             setMessage('Error al recuperar la imagen del usuario');
             setOpen(true);
          }   
          
          
        }    
      }

    setShow(false);
    setInicia(false);
  } // init

  function guardaDatosAplicacion(data, i)
  {
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
      let result= await apiBaseDatos("setAplicaciones", arrayAplicaciones[aplicacion].id, sessionStorage.getItem("user"), nick, desc,
       ttip, arrayCategorias[categoria].categorianegocio, agregarsn, contenidofoto, isBase64ToBlob);
 
    if (isValid(result.err)===true){
        setMessage("Ocurrio un error al registrar el anuncio")
        setOpen(true);
      }
    else{
        setMessage(agregarsn===true?"El anuncio se agrego correctamente.":"El anuncio se edito correctamente.")
        setOpen(true);       
        limpiardatosaplicacion;
  
    }
  }

  async function handleInput(e) {
    let resultado={};
    switch (e.target.id) {
      case "nick":
          setNick(e.target.value);
          break;
      case "idapp":
          setAplicacion(e.target.value);
          recuperardatosproducto(arrayAplicaciones, e.target.value);
          setCategoria(buscarEnArreglo(arrayCategorias, arrayAplicaciones[e.target.value].idcategoria, "categorianegocio"));



      resultado = await getJpgFileSB("./galerias/app_images/aplicaciones/" + arrayAplicaciones[e.target.value].id + "/" + arrayAplicaciones[e.target.value].id + ".jpg", 
                                    "aplicaciones/" + arrayAplicaciones[e.target.value].id + "/" + arrayAplicaciones[e.target.value].id + "jpg");
      if (isValid(resultado)=== true) {
        setIsBase64ToBlob(true);
        setContenidofoto(resultado);
        setNombrefoto(arrayAplicaciones[e.target.value].id);
      } else {
        setNombrefoto("");
        setMessage('Error al recuperar la imagen del usuario');
        setOpen(true);
      }  
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
      setIsBase64ToBlob(false);
    };
    reader.readAsDataURL(file);
    setCbvista(true);
  };

  async function sino() {

    await apiBaseDatos("delAnuncio", arrayAplicaciones[aplicacion].id);
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
      {inicia===true ? (
            <Box
              sx={{
                width: "100%",
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress color="checkbox" />
            </Box>
          ) : ""}

        {inicia===false?
        <div className="div-papa">
        <div className="cabeza">
            <IconButton color="primary" onClick={() => {
              navigate(`/?nivel=${0}`);
            }}>
            <ArrowBack className="flecha" />
            </IconButton>
            <p className="atras">Atrás</p>
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
        </div>:""}

      </Hero>
    </div>
    </>
);
};

export default Aplicaciones;
