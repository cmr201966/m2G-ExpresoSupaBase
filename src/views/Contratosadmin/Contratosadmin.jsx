import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useLocation } from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';
//import Map from "../../components/Map/Map";
// @mui/material
//import { IconButton } from "@mui/material"
import ArrowBack from "@mui/icons-material/ArrowBack";
import MapIcon from "@mui/icons-material/Map";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
//
import Tippy from "@tippyjs/react";
import { Link } from "@mui/material"
import Modal from "../../components/Modal/Modal";
import { Box } from "@mui/material";
// components
import Navbar from "../../components/Navbar/Navbar"
// layouts
import Hero from "../../layouts/Hero/Hero";
// 
import { CircularProgress } from "@mui/material";
// styles
import "./styles.css";
import { useEffect, useState } from "react";
//import styledEngineSc from "@mui/styled-engine-sc";
import Encabezado from "../../components/Encabezado/Encabezado";
// utils
import { isValid,} from "../../Utiles/Utiles";
import { 
         getClientesContratos, 
         getContratos, 
         getCategorias, 
         getProductosCategoriaContrato,
         getNegociosContratos,
         getDisponibilidad,
         setEstadoContrato,
         } from "../../Utiles/apiBaseDatos";


const ContratoAdmin = () => {
    const location = useLocation();
    const parsedParams = {}
    const [arraycliente, setArraycliente] = useState([]);
    const [cliente, setCliente] = useState(0);
    const arrayestadoscontratos = [{ estado: 0, desc: "Pendiente"}, { estado: 1, desc: "Ejecutado"}, { estado: 2, desc: "Cancelado"}];
    const arraynocliente = [{ iduser: 99999999, nombre: "No hay clientes"}];
    const arraymycliente = [{ iduser: sessionStorage.getItem("user"), nombre: sessionStorage.getItem("usernombre")}];
    const [arraycontrato, setArraycontrato] = useState([]);
    const arraynocontrato = [{ id: 99999999, idmovimiento:99999999, iduser:99999999, idproducto: 99999999, fechatrabajo: "00/00/0000", 
                               corto: "No hay contratos", largo: "No hay contratos", negocio: "No hay contratos", estado: "Desconocido" }];
    const [contrato, setContrato] = useState(0);
    const [arraynegocios, setArraynegocios] = useState([]);
    const arraynonegocios = [{ idnegocio: 99999999, nick: "No hay negocios"}];
    const [negocio, setNegocio] = useState(0);
    const [arraycategorias, setArraycategorias] = useState([]);
    const arraynocategorias = [{ categorianegocio: 99999999, nick: "No hay categorias"}];
    const [categoria, setCategoria] = useState(0);
    const [inicia, setInicia] = useState(true);
    const tipouser = Number(sessionStorage.getItem("tipouser"));
    const user = sessionStorage.getItem("user");
    const [producto, setProducto] = useState(sessionStorage.getItem("producto"));
    const [estado, setEstado] = useState(0);
    const [findProducto, setFindProducto] = useState("");
    const [findContrato, setFindContrato] = useState("");
    const [findFecha, setFindFecha] = useState("");
    const [cancelar, setCancelar] = useState(false);
    const [evaluar, setEvaluar] = useState(false);
    const [capacidad, setCapacidad] = useState(0);
    const [disponible, setDisponible] = useState(0);
    const [contratoCantidad, setContratoCantidad] = useState(0);
    const [filtrar, setFiltrar] = useState(false);
    const [asumido, setAsumido] = useState(1);
    const [showSubir, setShowSubir] = useState(false);
    // Para el filtro
    const [arrayproductos, setArrayproductos] = useState ([]);
    const arraynoproductos = [{idproducto:999999, nick:"No hay productos"}];
    const [rEstado, setREstado] = useState(0);
    const [estadoDesc, setEstadoDesc] = useState("Pendientes");
    // Evaluar Contrato
    const [rbutton, setRbutton] = useState(0);
    const [comentario, setComentario] = useState("");
    // Ubicar el cliente en el Mapa
    const [cbcontrato, setCbcontrato] = useState([]);
    let tEstado="0";
        
  async function init() 
  {
      /*let resultcliente;*/
      if (tipouser===0)
        {
          // Usuario Gratis puede ver solo sus contratos 
          setArraycliente(arraymycliente);
/*          resultcliente = arraymycliente;*/
        }

      if (tipouser!== 0)
      {
          let resultcliente1 = await getClientesContratos(sessionStorage.getItem("user"), tipouser, 0);
          if (isValid(resultcliente1)===false || resultcliente1.length === 0) {
             setArraycliente(arraynocliente);
/*             resultcliente = arraynocliente;*/
          }
          else
          {
             setArraycliente(resultcliente1);
/*             resultcliente = resultcliente1;*/
          }
      }
      // Ya tengo los clientes, ahora buscar los contratos
      setCliente(0);
      // Negocios que tienen productos con contratos.
      const resultnegocios = await getNegociosContratos(user, tipouser );
      if (isValid(resultnegocios)===false || resultnegocios.length === 0) 
      {
          setArraynegocios(arraynonegocios);
      }
      else 
      {
         setArraynegocios(resultnegocios);
      }     
      setNegocio(0);
      // Categorias del negocio.
      let tresultcategorias=[];
      const resultcategorias = await getCategorias(user, tipouser, resultnegocios[0].idnegocio);
      if (isValid(resultcategorias)===false || resultcategorias.length === 0) 
      {
          setArraycategorias(arraynocategorias);
          tresultcategorias=arraynocategorias;
      }
      else 
      {
         setArraycategorias(resultcategorias);
         tresultcategorias=resultcategorias;
      }
      setCategoria(0);

      // Productos de la categoria.
      const resultproductos = await getProductosCategoriaContrato(user, tipouser, tresultcategorias[0].categorianegocio );
      if (isValid(resultproductos)===false || resultproductos.length === 0) 
      {
          setArrayproductos(arraynoproductos);
      }
      else 
      {
         setArrayproductos(resultproductos);
      }     
      setProducto(0);
      setCapacidad(resultproductos.length===0?0:resultproductos[0].cantidad);
      let tdisponible=0;
      if (resultproductos.length!==0){
         let result9 = await getDisponibilidad(resultproductos[0].idproducto, 1);
         let treservas=isValid(result9[0].reservas)===true?result9[0].reservas:0
         if (result9.length>0) tdisponible = resultproductos[0].cantidad-treservas;
         let result10 = await getDisponibilidad(resultproductos[0].idproducto, 2);
         let tcancela=isValid(result10[0].reservas)===true?result10[0].reservas:0
         if (result10.length>0) tdisponible = tdisponible + tcancela;
      }
      setDisponible(tdisponible);
      // Buscar los contratos de cliente.
      const resultcontrato = await getContratos(user, tipouser, 0, resultproductos[0].idproducto);
      if (isValid(resultcontrato)===false || resultcontrato.length === 0) 
      {
          setArraycontrato(arraynocontrato);
          cbcontrato.push(false);
      }
      else 
      {
         setArraycontrato(resultcontrato);
         cbcontrato.splice(0, cbcontrato.length);
         for (let i=0; i<resultcontrato.length; i +=1){
          cbcontrato.push(resultcontrato[i].idestado===0?false:true);
        }
        }     
      setContrato(0);
      setContratoCantidad(resultcontrato.length===0?0:resultcontrato[0].cantidad); 
      setInicia(false);
   } //init 

   async function handleInput(e) {
    if (e.target.id.includes("contrato-")===true){
      let divide=e.target.id.split("-");
      await setEstadoContrato(cbcontrato[Number(divide[1])]===true?0:1, arraycontrato[Number(divide[1])].id);
      let mcbcontrato=[...cbcontrato];
      mcbcontrato[Number(divide[1])]=!cbcontrato[Number(divide[1])];
      setCbcontrato(mcbcontrato);
      return
    }
    switch (e.target.id) {
            case "producto":
               setProducto(e.target.value);
               getContratosEstado(tEstado, arrayproductos[Number(e.target.value)].idproducto)
               break;
            case "findFecha":
                setFindFecha(e.target.value);
                break;
            case "findContrato":
                setFindContrato(e.target.value);
                break;
            case "findProducto":
                setFindProducto(e.target.value);
                break;
            case "cliente":
                setCliente(e.target.value);
                /*cambiacontratos(e.target.value);*/
                break;
            case "contrato":
                setContrato(e.target.value);
                break;
            case "selectestado":
                  setEstado(e.target.value);
                  break;
            case "comentario":
                  setComentario(e.target.value)
                  break;                           
            default:
                break;      
        }
    }

    async function confirmar() 
    {
      /*
        const result = await axios.post(
            "http://localhost:3001/setcontratosadmin",
            {cliente:arraycliente[cliente].iduser,contrato:arraycontrato[contrato].contrato,estado:estadocontrato,menu:arraymenu,estados:estadoproducto},
            {}
        );
        if (!result.data.ok)
        {
           setContenido(result.data.error);
           setShow(true); 
        }
        else
        {
          setContenido("Se registraron los cambios al contrato .");
          setShow(true);
        }
          */
        }

    function fcancelar()
    {
      if (cancelar===true)
      {
         setCancelar(false);
      }
      else
      {
        if (cancelar===true &&  evaluar===false)
        {
          setCancelar(true);
        }
      }
    }

    function fevaluar()
    {
      if (evaluar===true)
      {
         setEvaluar(false);
      }
      else
      {
        if (cancelar===false && evaluar===false)
        {
          setEvaluar(true);
        }
      }
    }

    function fradio(e)
    {
       setRbutton(e.target.value);
    }

    async function getContratosEstado(estado, producto){
      const resultcontrato = await getContratos(user, tipouser,  estado, producto);
      if (isValid(resultcontrato)===false || resultcontrato.length === 0) 
      {
          setArraycontrato(arraynocontrato);
      }
      else 
      {
         setArraycontrato(resultcontrato);
      }
      setContrato(0);
      setContratoCantidad(resultcontrato.length===0?0:resultcontrato[0].cantidad);
      cbcontrato.splice(0,cbcontrato.length);
      for (let i=0; i<resultcontrato.length; i +=1){
        cbcontrato.push(resultcontrato[i].idestado===0?false:true);
      }
    }

    function fRadioEstado(e)
    {
       setREstado(e.target.value);
       switch (e.target.value) {
        case "0":
            setEstadoDesc("Todos");
            setAsumido(0);
            tEstado="9";
            break;
        case "1":
          setEstadoDesc("Pendientes");
          setAsumido(1);
          tEstado="0";
          break;
        case "2":
          tEstado="1";
          setAsumido(2);
          setEstadoDesc("Ejecutados");
            break;
        case "3":
          tEstado="2";
          setAsumido(3);
          setEstadoDesc("Cancelados");
            break;
        default:
            break;      
    }
    getContratosEstado(tEstado, arrayproductos[producto].idproducto);
    }
    
    function fFiltrar(){
      setFiltrar(!filtrar);
    }
    function fSubir(){
      setShowSubir(!showSubir);
    }

    function onModalClose1(){
      setShowSubir(false);
    }

  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => { const [paramName, paramValue] = item.split("="); parsedParams[paramName] = paramValue });
  }, [location])

   useEffect(() => {
        init()
    }, [])

    return (
        <>      
            <Modal visible={showSubir} onClose={onModalClose1} className="cmodal wmodal"  classContainer="modal-contratosadmin">
                <div className="cerrar-button">
                    <button className="cerrar" onClick={onModalClose1}>X</button>
                </div>
                <label>Llamar</label>
                {arraycontrato.map((item, i) => {
                   return <>
                            <div key={i} className='cbcontrato'>
                               <Checkbox
                                  key={i}
                                  id={`contrato-${i}`}
                                  sx={{color: "white", "&.Mui-checked": { color: "white" },}}
                                  checked={cbcontrato[i]}
                                  onClick={handleInput}
                               />
                               {item.negocio}({item.cantidad})
                            </div>
                          </>
                })}
            </Modal>

            <div>
             <Navbar nivel={1} />
              <Hero clase={"hero-section"}>
              {inicia === true ? (
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
              ) : (
               ""
              )}
               { inicia === false ? 
                    <>
                    <Encabezado   clase={"encabezado"}/>
                    <div className="contratosadmin">
                           <div className="container-contratosadmin">
                              {inicia === false?
                               <>
                                  <label className="label">Administrar {arraycontrato.length === 0 ? "" : ` (${arraycontrato.length}) Contratos`}</label>
                                  <label className="label-contratos-2">Negocio</label>
                                  <div className='grupo-contratos-label'>
                                  <select className="select-contratosadmin-2" id="negocio" onChange={handleInput} value={negocio}>
                                      {arraynegocios.map((item, i) => {
                                        return <option key={i} value={i} >{item.nick}</option>
                                      })}
                                  </select>
                                </div>
                                <label className="label-contratos-2">Categoria{arraycategorias.length===0?"":` (${arraycategorias.length})`}</label>
                                <div className='grupo-contratos-label'>
                                  <select className="select-contratosadmin-2" id="contrato" onChange={handleInput} value={categoria}>
                                      {arraycategorias.map((item, i) => {
                                        return <option key={i} value={i} >{item.nick}</option>
                                      })}
                                  </select>
                                </div>
                                <label className="label-contratos-2">Producto ({capacidad} Plazas-{disponible} Disponibles)</label>
                                <div className='grupo-contratos-label'>
                                      <select className="select-contratosadmin-2" id="producto" onChange={handleInput} value={producto}>
                                      {arrayproductos.map((item, i) => {
                                        return <option key={i} value={i} >{item.nick}</option>
                                      })}
                                  </select>
                                </div>
                                {filtrar===true?
                                <input className="input-fp"
                                         id="findProducto"
                                         value={findProducto}
                                         onChange={handleInput}
                                         type="text"
                                         placeholder="Filtrar producto"
                                         required
                                  />:""
                                 }
                                  <label className="label-1-contratosadmin">Contratos ({contratoCantidad} capacidades) ({estadoDesc})</label>
                                  <div className="input-area-contratosadmin">
                                     <select className="select-contratosadmin-2" id="contrato" onChange={handleInput} value={contrato}>
                                        {arraycontrato.map((item, i) => {
                                         return <option key={i} value={i} >{item.negocio}</option>
                                        })}
                                     </select>
                                  </div>
                               {filtrar===true && arraycontrato.length>0 && arraycontrato[0].corto!=="No hay contratos"?
                               <input className="input-fp"
                                         id="findContrato"
                                         value={findContrato}
                                         onChange={handleInput}
                                         type="text"
                                         placeholder="Filtrar contrato"
                                         required
                                  />:""
                               }
                               </>:""
                              }
                              {/* Esta información solo sale si hay algún contrato*/}
                              {arraycontrato.length>0 && arraycontrato[0].corto!=="No hay contratos"?
                               <>
                               <div className="input-contratosadmin">
                                 { inicia === false ?
                                   <>
                                      <label className="label-contratos-2">Fecha</label>
                                      <div className='grupo-contratos-label'>
                                      <label className="label-contratos-3-4">{arraycontrato[contrato].fecha.substring(0,10)}</label>
                                   </div>
                                   {filtrar===true?
                                     <input className="input-fp"
                                         id="findFecha"
                                         value={findFecha}
                                         onChange={handleInput}
                                         type="text"
                                         placeholder="Filtrar fecha"
                                         required
                                     />:""
                                   }
                                   <label className="label-contratos-2">Estado</label>
                                   <div>
                                       <select className="select-contratosadmin-estado" id="selectestado" onChange={handleInput} disabled={tipouser===0} value={estado}>
                                       {arrayestadoscontratos.map((item, i) => {
                                          return <option key={i} value={item.estado} >{item.desc}</option>
                                       })}
                                       </select>
                                   </div>
                                   </>:""
                                 }
                                 </div> 
                                 </>:""
                              }
                              { inicia === false ?
                                   <>
                                   {filtrar===true?
                                   <div className="input-filtra-estado">
                                     <FormControl>
                                        <FormLabel className='label-radio' id="radio-buttons-group-label">Filtrar estado</FormLabel>
                                            <RadioGroup
                                                aria-labelledby="radio-buttons-group-label"
                                                defaultValue={String(asumido)}
                                                onChange={fRadioEstado}
                                                name="radio-buttons-group"
                                             >
                                                <FormControlLabel value={0} control={<Radio />} label="Todos" />
                                                <FormControlLabel value={1} control={<Radio />} label="Pendientes" />
                                                <FormControlLabel value={2} control={<Radio />} label="Ejecutados" />
                                                <FormControlLabel value={3} control={<Radio />} label="Cancelados" />
                                            </RadioGroup>
                                    </FormControl>
                                   </div>:""
                                   }
                                   </>:""
                                }

                            {/*} Fin de bloque si hay contratos*/}

                            <div className="contratosadmin-grupo-button">
                                {/*Estos botones no salen si no hay contratos*/}
                                <Tippy content="Filtrar.">
                                        <button type="button" className="contratosadmin-button1 primary" onClick={fFiltrar}>
                                            Filtrar
                                        </button>
                                 </Tippy>
                                {arraycontrato.length>0 && arraycontrato[0].corto!=="No hay contratos" && tipouser!==0?
                                <>
                                 <Tippy content="Subir">
                                        <button type="button" className="contratosadmin-button1 primary" onClick={fSubir}>
                                            Subir
                                        </button>
                                 </Tippy>

                                {tipouser!==0 && inicia===false?
                                <>
                                <Tippy content="Registrar los datos del contrato." >
                                       <button type="button" className="contratosadmin-button1 primary" onClick={confirmar}>
                                           <Check />
                                       </button>
                                </Tippy>
                                </>:""
                                }
                                {tipouser===1 && arraycontrato[0].corto!=="No hay contratos" && inicia===false?
                                <>
                                <Tippy content="Ubicar cliente en el Mapa.">
                                   <Link sx={{
                                         background: "dodgerblue",
                                         border: "none",
                                         cursor: "pointer:",
                                         color: "aliceblue",
                                         borderRadius: "15px",
                                         height: "30px",
                                         width: "73px",
                                         marginBottom: "10px",
                                         marginRight: "3px",
                                         display: "flex",
                                         justifyContent: "center",
                                           }} target="_blank" rel="noreferrer" href={`https://www.google.es/maps/dir//${lat},${lng}/@${lat},${lng},19.54z`}>
                                        <MapIcon />
                                   </Link>
                                </Tippy>
                                </>:""
                                }
                               
                                {tipouser===0  && arraycontrato[0].corto!=="No hay contratos" && inicia===false && arraycontrato[contrato].idestado===1?
                                   <>
                                   <Tippy content="Cancelar el contrato">
                                          <button type="button" className="contratosadmin-button1 primary" onClick={fcancelar}>
                                              <Close />
                                          </button>
                                   </Tippy>
                                   </>:""
                                 }                               
                                 {tipouser===0 && arraycontrato[0].corto!=="No hay contratos" && inicia===false?
                                 <>
                                 <Tippy content="Evaluar el comportamiento del negocio.">
                                        <button type="button" className="contratosadmin-button1 primary" onClick={fevaluar}>
                                                Evaluar
                                        </button>
                                 </Tippy>
                                </>:""
                                }
                                {tipouser!==0 && arraycontrato[0].corto!=="No hay contratos" && inicia===false?
                                <>
                                <Tippy content="Evaluar el comportamiento del cliente.">
                                       <button type="button" className="contratosadmin-button1 primary" onClick={fevaluar}>
                                               Evaluar
                                       </button>
                                </Tippy>
                                </>:""
                                }
                                </>:""
                                 } 
                            </div>

                        </div>

                      {/* Evaluar Contrato */}
                      {inicia===false && evaluar===true && cancelar===false?
                         <>
                         <div className="evaluar">
                         <div className="container-evaluar"> 
                              <label className="label-actual">Evaluar Contrato:</label>
                              <div className="input-area-evaluar">
                                   <label className="label-cliente-evaluar">Cliente:</label>
                                   <label className="label-nombre-evaluar">{arraycliente[cliente].nombre}</label>
                              </div>
                              <div className="input-area-evaluar">
                                   <label className="label-contrato-evaluar">Contrato:</label>
                                   <label className="label-contrato-nombre-evaluar">{arraycontrato[contrato].corto}</label>
                              </div>
                              <div className="input-area-postponer">
                                  <label className="label-actual">Fecha contrato:</label>
                                  <input className="input-actual"
                                         id="actual"
                                         value={arraycontrato[contrato].fechatrabajo.substring(0,10)}
                                         onChange={handleInput}
                                         type="date"
                                         required
                                         disabled
                                  />
                              </div>                      
                              <div className="input-area-evaluar">
                                   <FormControl>
                                         <FormLabel className='label-radio' id="radio-buttons-group-label">¿Como evalua al {tipouser===0?"Cliente":"Negocio"}:?</FormLabel>
                                                    <RadioGroup
                                                         aria-labelledby="radio-buttons-group-label"
                                                         defaultValue={String(2)}
                                                         onChange={fradio}
                                                         name="radio-buttons-group"
                                                    >
                                                        <FormControlLabel value={0} control={<Radio />} label="Mal" />
                                                        <FormControlLabel value={1} control={<Radio />} label="Regular" />
                                                        <FormControlLabel value={2} control={<Radio />} label="Bien" />
                                                        <FormControlLabel value={3} control={<Radio />} label="Excelente" />
                                                    </RadioGroup>
                                    </FormControl>
                              </div>                    
                              <div className="input-area-evaluar">
                                   <label className="comentario">Comentarios:</label>
                                   <textarea className="input-comentario"
                                             id="comentario"
                                             value={comentario}
                                             onChange={handleInput}
                                             type="text"
                                             maxLength={255}
                                             required
                                    />
                              </div>         
                              <div className="evaluar-grupo-button">
                                   <Tippy content="Confirmar Evaluacion">
                                          <button type="button" className="evaluar-button primary" disabled={false} onClick={confirmarEvaluar}>
                                             <Check />
                                          </button>
                                   </Tippy>         
                                   <Tippy content="Clic para volver">
                                          <button type="button" className="evaluar-button1 primary" onClick={()=>setEvaluar(false)}>
                                            <ArrowBack />
                                          </button>
                                  </Tippy>
                            </div>

                            </div>
                           </div>
                          </>:""
                        }
                        {/* Cancelar Contrato */}
                        {inicia===false && cancelar===true && evaluar===false?
                          <>
                          <div className="cancelar">
                             <div className="container-cancelar"> 
                                  <label className="label-actual">Cancelar Contrato:</label>
                                  <div className="input-area-cancelar">
                                       <label className="label-cliente">Cliente:</label>
                                       <label className="label-contrato-cancelar">{arraycliente[cliente].nombre}</label>
                                  </div>
                                  <div className="input-area-cancelar">
                                       <label className="label-contrato">Contrato:</label>
                                       <label className="label-contrato-nombre-cancelar">{arraycontrato[contrato].corto}</label>
                                  </div>                         
                                  <div className="input-area-cancelar">
                                       <label className="label-actual">Fecha Trabajo:</label>
                                       <input className="input-actual"
                                              id="actual"
                                              value={arraycontrato[contrato].fechatrabajo.substring(0,10)} 
                                              onChange={handleInput}
                                              type="date"
                                              required
                                              disabled
                                       />
                                  </div>                                    
                                  <div className="cancelar-grupo-button">
                                       <Tippy content="Cancelar Contrato">
                                              <button type="button" className="cancelar-button primary" onClick={confirmarCancelar}>
                                                  <Check />
                                              </button>
                                       </Tippy>         
                                       <Tippy content="Clic para volver">
                                             <button type="button" className="cancelar-button1 primary" onClick={fcancelar}>
                                                <ArrowBack />
                                             </button>
                                        </Tippy>
                                  </div>
                             </div>
                          </div>
                         </>:""
                       }                      
                    </div>
                    </>:""}
                </Hero>
            </div>
        </>
    );
};

export default ContratoAdmin
