import Tippy from "@tippyjs/react";
import Navbar from "../../components/Navbar/Navbar"
import Hero from "../../layouts/Hero/Hero";
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
import { useNotification } from "../../context/NotificationProvider";
import Modal from "../../components/Modal/Modal";
import { useLocation } from "react-router-dom";
import { setCategoriasNegocios, delCategoria } from "../../servicios/catalogos";
import "./styles.css";
import { isValid, obtenerImagen, apiBaseDatos, buscaFoto } from "../../Utiles/Utiles";
import { Box, CircularProgress } from "@mui/material";

const CatCategorias = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {}
  const {setOpen, setMessage} = useNotification();
  const [show, setShow] = useState(false);
  const [desc, setDesc] = useState("");
  const [desct, setDesct] = useState("");
  const [descold, setDescold] = useState("");
  const [inicia, setInicia] = useState(true);
  const [agregarsn, setAgregarsn] = useState(false);
  const [editarsn, setEditarsn] = useState(false);
  const [eliminarsn, setEliminarsn] = useState(false);
  const [categoria, setCategoria] = useState(0);
  const [arrayCategorias, setArrayCategorias] = useState([]);
  const arraynoCategorias = [{ categorianegocio: 99999999, desc: "Desconocida" }];
  // Estados para almacenar los datos del negocio activo
  const [contenido, setContenido] = useState("");
  const [nombrefoto, setNombrefoto] = useState("");
  const [contenidofoto, setContenidofoto] = useState();
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
    let resultcategorias = await apiBaseDatos("getCategoriasNegocios")
    

    if (resultcategorias.err || resultcategorias.length === 0)
    {
      setArrayCategorias(arraynoCategorias);
      setCategoria(arraynoCategorias[0].categorianegocio);
    }
    else 
    {
      guardaDatosCategoria(resultcategorias, 0)
      setArrayCategorias(resultcategorias);
      setCategoria(buscaCategoria(resultcategorias, resultcategorias[0].categorianegocio));
      if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
        let resultado= await buscaFoto("./galerias/app_images/categorias_de_negocios/" + resultcategorias[0].categorianegocio + "/" + resultcategorias[0].categorianegocio + ".jpg");
        resultado = await resultado.text();
        if (resultado.length !== 0) {
          setContenidofoto(resultado);
          setNombrefoto("Foto");
        } else {
          setNombrefoto("");
        }        

      }
      else{
        const resultado = await obtenerImagen('galerias', "categorias_de_negocios/" + resultcategorias[0].categorianegocio + "/" + resultcategorias[0].categorianegocio + ".jpg" )
        if (isValid(resultado.error)===false){
          setNombrefoto("1235");
          setContenidofoto(resultado.url);
        }
        else{
          setMessage('Error al recuperar la imagen de la categoria de negocio');
          setOpen(true);
        }
  
      }   

    }
      
    setShow(false);
    setInicia(false);
  } 

  function guardaDatosCategoria(data, i)
  {setDesct(data[i].desc)}


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
  function recuperarDatosCategoria() 
  {
    setDesc(desct);
    setDescold(desct);
    
  }
    
  function tcancelar() 
  {
    setCbvista(false)
    setAgregarsn(false);
    setEditarsn(false);
    setDesc("");
  }

    function limpiardatosCategoria() {
       setDesc(""); 
       setAgregarsn(true);
       setEditarsn(false);
       }

    const onModalClose = () => 
    {
    setShow(false)
    }
  
    function editar() 
    {
      recuperarDatosCategoria();
      setEditarsn(true);
      setTimeout(() => {
        if (document.getElementById("desc")) document.getElementById("desc").focus();
        
      }, 50);
    }
  
    function agregar() 
    {
      limpiardatosCategoria();
      setAgregarsn(true);
      setTimeout(() => {
        if (document.getElementById("desc")) document.getElementById("desc").focus();
        
      }, 50);
    }
  
    const eliminar = () => 
    {
      setEliminarsn(true);
      setContenido("¿Está seguro que desea eliminar a " + arrayCategorias[categoria].desc + "?");
      setShow(true);
    }

    async function confirmar() {
    let result;
    let err="";
    if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
       result = await setCategoriasNegocios({categorianegocio: arrayCategorias[categoria].categorianegocio, desc: desc, descold, link: "productos", inserta: agregarsn, modifica: editarsn, contenidofoto });
       result = await result.json();
       err=result.error;
      }
    else{
      err= await apiBaseDatos("CategoriasInsertUpdate", agregarsn, desc, "productos", arrayCategorias[categoria].categorianegocio, contenidofoto);

    }   
    if (isValid(err)===true){
        setMessage("Ocurrido un error al registrar la categoria");
        setOpen(true);
    }
    else{      
        setMessage("La categoria se agrego correctamente.");
        setOpen(true);
    }
    tcancelar();
  }

  /*
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
*/
  async function handleInput(e) {
    switch (e.target.id) {
      case "categorianegocio":
          setCategoria(e.target.value);
          guardaDatosCategoria(arrayCategorias, e.target.value)
          setCbvista(false);
          if (sessionStorage.getItem("sgbd").toUpperCase()==='MYSQL'){
             let resultado= await buscaFoto("./galerias/app_images/categorias_de_negocios/" + arrayCategorias[e.target.value].categorianegocio + "/" + arrayCategorias[e.target.value].categorianegocio + ".jpg");
             resultado = await resultado.text();
             if (resultado.length !== 0) {
               setContenidofoto(resultado);
               setNombrefoto("Foto");
             } else {
               setNombrefoto("");
             }        
            }
            else{
              const resultado = await obtenerImagen('galerias', "categorias_de_negocios/" + arrayCategorias[e.target.value].categorianegocio + "/" + arrayCategorias[e.target.value].categorianegocio + ".jpg" )
              if (isValid(resultado.error)===false){
                setNombrefoto("1235");
                setContenidofoto(resultado.url);
              }
              else{
                setNombrefoto("");
                setMessage('Error al recuperar la imagen de la categoria de negocio');
                setOpen(true);
              }
        
            }   
      
          break;
       case "desc":
            setDesc(e.target.value);
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
    await delCategoria({ categorianegocio: arrayCategorias[categoria].categorianegocio });
    setMessage("Se eliminó la categoria " + arrayCategorias[categoria].desc);
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

        <div className="div-papa-categorias">
        <div className="cabeza">
            <IconButton color="primary" onClick={() => {
              navigate(`/?nivel=${0}`);
            }}>
            <ArrowBack className="flecha-categoria" />
            </IconButton>
            <h4 className="h3-1-cabeza-negocios">Atrás</h4>
        </div>

        <div className="categorias">
          <p className="strong"> Categorias de Negocios</p>
          <div className="container-categorias">
            <div className="grip-categorias">
                <div className="flex-categorias flex-gap-categorias">
                     <label>Categoria:</label>
                 </div>
                 <div className="flex-categorias">
                      {agregarsn===true || editarsn===true?
                      <input className="input-area-categorias"
                               id="desc"
                               value={desc}
                               onChange={handleInput}
                               type="text"
                               required
                       />:""}
                       
                    {(agregarsn===false && editarsn===false)?
                      <div className="">
                        <select className="select-categorias" disabled={editarsn===true?true:false} id="categorianegocio" onChange={handleInput} value={categoria}>
                          {arrayCategorias.map((item, i) => {
                            return <option key={i} value={i} >{item.desc}</option>
                          })}
                        </select>
                      </div>:""}
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

             <div className="grupo-button-categorias">
                   {(agregarsn === true || editarsn === true) && nombrefoto !== "" && desc!==""? (
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
                  {(agregarsn === true || editarsn === true) && desc!==""? (
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
                  {(agregarsn === false && editarsn === false && arrayCategorias[categoria].desc!=="Desconocida") ?
                    <Tippy content="Clic para editar el producto">
                      <button type="button" className="producto-button primary" disabled={arrayCategorias[categoria].desc === "Desconocida"} onClick={editar}>
                      <Edit />
                      </button>
                    </Tippy> : ""
                  }

                  {(agregarsn === false && editarsn === false  && arrayCategorias[categoria].desc!=="Desconocida") ?
                    <Tippy content="Clic para eliminar el producto">
                      <button type="button" className="producto-button primary" disabled={arrayCategorias[categoria].desc === "Desconocida"} onClick={eliminar}>
                      <Delete />
                      </button>
                    </Tippy> : ""
                  }

                  </>:""}
                  {inicia===false && (agregarsn || editarsn) && desc?.length!==0 ?
                    <Tippy content={desc.length !== 0 ? "Registrar el producto" : "Complete los datos necesarios"}>
                      <button type="button" className="producto-button primary" onClick={desc.length !== 0 ? confirmar : ""}>
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

export default CatCategorias;
