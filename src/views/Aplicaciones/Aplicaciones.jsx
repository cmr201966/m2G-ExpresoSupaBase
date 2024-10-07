import Tippy from "@tippyjs/react";
//import Checkbox from '@mui/material/Checkbox';
// components
import Navbar from "../../components/Navbar/Navbar"
// layouts
import Hero from "../../layouts/Hero/Hero";
//
//
// styles
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
import { getAplicaciones, setAplicaciones } from "../../servicios/aplicaciones";
import { getcategoriasnegocios } from "../../servicios/negocios";
import { getJpgFile  } from "../../servicios/imagenes";


const Aplicaciones = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {}
  const [show, setShow] = useState(false);
  const [nick, setNick] = useState("");
  const [desc, setDesc] = useState("");
  const [ttip, setTtip] = useState("");
  const [arrayCategorias, setArrayCategorias] = useState([]);
  const arraynoCategorias = [{ idcategoria: 8, desc: "Desconocida" }];
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
  const [categoriat, setCategoriat] = useState(9999);
  const [nombrefoto, setNombrefoto] = useState("");
  const [contenidofoto, setContenidofoto] = useState();
  const [cbvista, setCbvista] = useState(false);
  const [foto] = useState();

  function guardaDatosAplicacion(data, i)
  {
    setArrayAplicaciones(data);
    recuperardatosproducto(data, 0);
    setNick(data[0].idapp);
    setDesc(data[0].desc);
    setTtip(data[0].tooltip);
    setCategoria(data[0].idcategoria);
    setAplicacion(0);

  }
  async function init() {
    setContenido("Preparando condiciones...");
    setShow(true);
    let result = await getAplicaciones({});
    result = await result.json();

    if (result.error || result.length === 0) 
    {
      setArrayAplicaciones(arraynoaplicaciones);
      setAplicacion(arraynoaplicaciones[0].id);
    }
    else 
    {
      guardaDatosAplicacion(result, 0)
      setCategoria(result[0].idcategoria);
  
    }
     let resultcategorias = await getcategoriasnegocios({});
     resultcategorias = await resultcategorias.json();

      if (resultcategorias.error || resultcategorias.length === 0) 
      {
        setArrayCategorias(arraynoCategorias);
      }
      else 
      {
        setArrayCategorias(resultcategorias);
        if (result.length>0){
           setCategoriat(buscaCategoria(resultcategorias, result[0].idcategoria));
           let resultado = await getJpgFile({ file: "./galerias/app_images/aplicaciones/" + result[0].id + "/" + result[0].id + ".jpg"});
           resultado = await resultado.text();
     
           if (resultado.length !== 0) {
             setContenidofoto(resultado);
             setNombrefoto("");
           } else {
             setNombrefoto("");
           }
 
        }        
          }
  
      
    setShow(false);
    setInicia(false);
  } // init

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
    {/*
    setNaturalezat(data[i].idnaturaleza);
    setCbocultart(data[i].ocultar);
    setCbrlogint(data[i].rlogin);
    setCbadmint(data[i].admin);*/}
    
  }

  function restaurardatosproductos() 
  {
    //setNegocio(negociot);
    setNick(nickt);
    setDesc(desct);
    setTtip(ttipt);
    setCategoria(categoriat);
    {/*etCbocultar(cbocultart);
    setCbrlogin(cbrlogint);
    setCbadmin(cbadmint);*/}
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
       {/*
       setCbocultar(false);
       setCbrlogin(false);
       setCbadmin(false);*/}

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
      //setMarca(2);
    }
  
    const eliminar = () => 
    {
      setEliminarsn(true);
      setContenido("¿Está seguro que desea eliminar a " + arrayAplicaciones[aplicacion].desc + "?");
      //setShow1(true);
    }

    async function confirmar() {
      let result = await setAplicaciones({id: arrayAplicaciones[aplicacion].id, iduser: sessionStorage.getItem("user"), nick, desc, tooltip: ttip, 
                                          categoria: arrayCategorias[categoria].categorianegocio, agregarsn, editarsn, contenidofoto});
      result = await result.json();

    if (result.ok!=="ok"){
        setContenido("Error al agregar la aplicacion");
        setShow(true);
  
    }
    else{
        setContenido("La aplicacion se agrego correctamente.");
        setShow(true);
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
          setCategoriat(buscaCategoria(arrayCategorias, arrayAplicaciones[e.target.value].idcategoria));
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


  useEffect(() => {
    init()
  }, [])

  return (

    <>    
    <Modal visible={show} onClose={onModalClose} className="cmodal wmodal" classContainer="modal-catprod">
      <div className="cerrar-button">
        <button className="cerrar" onClick={onModalClose}>X</button>
      </div>
      <div className="main-modal">
           <label>{contenido}</label>
      </div>
    </Modal>

    <div>
      <Navbar
        links={[
          { label: "Inicio", to: "/",tooltips: "Ir a la página principal" },
          { label: sessionStorage.getItem("user") === null ? "Iniciar sesión" : "Cerrar sesión", to: sessionStorage.getItem("user") === null ? "/login" : "/cerrarsesion", tooltips: sessionStorage.getItem("user") === null ? "Abrir sesión" : "/Cerrar la sesión de " + sessionStorage.getItem("usernombre") },
          { label: "Registrarse", to: "/registrarse?inserta=true", tooltips: "Crear una cuenta de usuario" },
          { label: "Acerca de", to: "/Acercade", tooltips: "Acerca de Destodo" },
        ]}
      />
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
                    <Tippy content="Añadir Producto">
                      <button type="button" className="producto-button primary" onClick={agregar}>
                      <Add />
                      </button>
                    </Tippy> : ""
                  }
                  {inicia===false?
                  <>
                  {(agregarsn === false && editarsn === false && arrayAplicaciones[aplicacion].desc!=="Desconocida") ?
                    <Tippy content="Clic para editar el producto">
                      <button type="button" className="producto-button primary" disabled={arrayAplicaciones[aplicacion].desc === "Desconocida"} onClick={editar}>
                      <Edit />
                      </button>
                    </Tippy> : ""
                  }

                  {(agregarsn === false && editarsn === false  && arrayAplicaciones[aplicacion].desc!=="Desconocida") ?
                    <Tippy content="Clic para eliminar el producto">
                      <button type="button" className="producto-button primary" disabled={arrayAplicaciones[aplicacion].desc === "Desconocida"} onClick={eliminar}>
                      <Delete />
                      </button>
                    </Tippy> : ""
                  }

                  </>:""}
                  {inicia===false && (agregarsn || editarsn) && (nick?.length!==0 && desc?.length!==0) ?
                    <Tippy content={nick.length !== 0 && desc.length !== 0 ? "Registrar el producto" : "Complete los datos necesarios"}>
                      <button type="button" className="producto-button primary" onClick={nick.length !== 0 && desc.length !== 0 ? confirmar : ""}>
                      <Check />
                      </button>
                    </Tippy> : ""
                  }

                  {inicia===false && (agregarsn || editarsn) ?
                    <Tippy content="Cancelar, agregar ó editar producto">
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
