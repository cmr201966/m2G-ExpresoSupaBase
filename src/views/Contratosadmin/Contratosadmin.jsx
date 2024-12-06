import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useLocation } from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';
import Map from "../../components/Map/Map";
// @mui/material
import { IconButton } from "@mui/material"
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
import { useNavigate } from "react-router-dom"
// styles
import "./styles.css";
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import FilterAltOff from "@mui/icons-material/FilterAltOff";

import { useEffect, useState } from "react";
import axios from "axios";
import { SetMealRounded } from "@mui/icons-material";
//import styledEngineSc from "@mui/styled-engine-sc";
import { useFilter } from "../../context/FilterProvider";

const ContratoAdmin = () => {
    const { filterState, setFilterState } = useFilter()
    const location = useLocation();
    const parsedParams = {}
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [showMap, setshowMap] = useState(false);
    const [contenido, setContenido] = useState("");
    const [arraycliente, setArraycliente] = useState([]);
    const [cliente, setCliente] = useState(0);
    const arraynocliente = [{ iduser: 99999999, nombre: "No hay clientes"}];
    const arraymycliente = [{ iduser: sessionStorage.getItem("user"), nombre: sessionStorage.getItem("usernombre")}];
    const [arraymenu, setArraymenu] = useState([]);
    const arraynomenu = [{menu: 999999, producto: 999999, nick: "No hay menú"}];
    const [arrayestadoscontratos, setArrayestadoscontratos] = useState([]);
    const [estadocontrato, setEstadocontrato] = useState(0);
    const [arraycontrato, setArraycontrato] = useState([]);
    const [arraytcontrato, setArraytcontrato] = useState([]);
    const arraynocontrato = [{ contrato: 99999999,idestado:99999999,idnegocio:99999999,idproducto: 99999999, fechatrabajo: "00/00/0000", corto: "No hay contratos", largo: "No hay contratos", estado: "Desconocido", menu:false }];
    const [contrato, setContrato] = useState(0);
    const [arrayestadosproductos, setArrayestadosproductos] = useState([]);
    const [estadoproducto, setEstadoproducto] = useState([]);
    const arraynoestados = [{estado: 999999, desc: "Desconocido"}];
    const [cambios, setCambios] = useState(false);
    const [inicia, setInicia] = useState(true);
    const tipouser = Number(sessionStorage.getItem("tipouser"));
    let   condicion="";
    const [filtro_contrato, setFiltro_contrato] = useState(sessionStorage.getItem("filtro_contrato"));
    const [estado_contrato, setEstado_contrato] = useState(sessionStorage.getItem("estado_contrato"));
    const [negocio, setNegocio] = useState(sessionStorage.getItem("negocio"));
    const [cproducto, setCproducto] = useState(sessionStorage.getItem("cproducto"));
    const [producto, setProducto] = useState(sessionStorage.getItem("producto"));
    const [estado, setEstado] = useState("");
    const [fechai, setFechai] = useState(sessionStorage.getItem("fechai"));
    const [fechaf, setFechaf] = useState(sessionStorage.getItem("fechaf"));
    const [fechapostponer, setFechapostponer] = useState("");
    const [filtrar, setFiltrar] = useState(false);
    const [postponer, setPostponer] = useState(false);
    const [cancelar, setCancelar] = useState(false);
    const [evaluar, setEvaluar] = useState(false);
    // Para el filtro
    const [arraytnegocios, setArraytnegocios] = useState([]);
    const arraynotnegocios = [{categorianegocio:999999, desc:"No hay tipos de negocio"}];
    const [tnegocio, setTnegocio] = useState (0);
    const [arraynegocios, setArraynegocios] = useState([]);
    const [tnegocios, setTnegocios] = useState([]);
    const arraynonegocios = [{idnegocio:999999, desc:"No Hay negocios"}];
    const [tcategoriasproductos, setTcategoriasproductos] = useState ([]);
    const [arraycategoriasproductos, setArraycategoriasproductos] = useState ([]);
    const arraynocategoriasproductos = [{keycategoria:999999, categoria:"No hay Categorias de Productos"}];
    const [arrayproductos, setArrayproductos] = useState ([]);
    const [tproductos, setTproductos] = useState ([]);
    const arraynoproductos = [{producto:999999, desc:"No hay productos"}];
    const [arrayestado, setArrayestado] = useState([]);
    const arraynoestado = [{estado:999999, desc:"No hay estados de contratos"}];
    // Filtrar
    const [cbtnegocio, setCbtnegocio] = useState(false);
    const [cbnegocio, setCbnegocio] = useState(false);
    const [cbcproducto, setCbcproducto] = useState(false);
    const [cbproducto, setCbproducto] = useState(false);
    const [cbestado, setCbestado] = useState(false);
    const [cbfechai, setCbfechai] = useState(false);
    const [cbfechaf, setCbfechaf] = useState(false);
    // Evaluar Contrato
    const [rbutton, setRbutton] = useState(0);
    const [comentario, setComentario] = useState("");
    const [confirma, setConfirma] = useState(true);
    const [asumido, setAsumido] = useState("");
    // Ubicar el cliente en el Mapa
    const [domicilioSN, setDomicilioSN] = useState(false);
    const [domicilio, setDomicilio] = useState(false);
    const [descnegocio, setDescnegocio] = useState("");
    const [numcontrato, setNumcontrato] = useState(0);
    const [publicar, setPublicar] = useState(false);
    
  
    // Estados para la posición GPS del mapa
    const [zoom, setZoom] = useState(15.00);

    const [lng, setLng] = useState(-75.829090519);
    const [lat, setLat] = useState(20.0217583);

    const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };

  const lngLatSelected = (point, lngLat) => {
    setLng(lngLat.lng);
    setLat(lngLat.lat);
  };
        
  async function init() 
  {
    condicion="";
    sessionStorage.setItem("filtro","Contratos")
      setContenido("Preparando condiciones, espere por favor...");
      setShow(true);
      if (sessionStorage.getItem("filtro_contrato") === null)
      { 
         sessionStorage.removeItem("estado_contrato");
         sessionStorage.removeItem("tnegocio");
         sessionStorage.removeItem("negocio");
         sessionStorage.removeItem("cproducto");
         sessionStorage.removeItem("producto");
         sessionStorage.removeItem("fechai");
         sessionStorage.removeItem("fechaf");
      }
      else
      {
        condicion=forma_condicion();
      }
      let resultcliente;
      //
      // tipouser=0 usuario DT ó usuario gratis, puede ver sus contratos
      // tipouser=1 y tipouser=2, es dueño de negocio, puede ver todos los contratos
      // realizados sobre los productos que el oferta.
      // tipouser=9 SuperUser puede ver todos los contratos 
      //
      
      if (sessionStorage.getItem("user") !== null && (tipouser!== 0))
      {
          // Usuario dueño de negocio Básico ó Premiun puede ver todos
          //  los contratos que se han hecho a sus productos
          let resultcliente1 = await axios.post(
            "http://localhost:3001/getclientes",
            {user: sessionStorage.getItem("user"), tipouser},
            {}
          );
          if (resultcliente1.data.error || resultcliente1.data.length === 0) {
             setArraycliente(arraynocliente);
             resultcliente = arraynocliente;
          }
          else
          {
             setArraycliente(resultcliente1.data);
             resultcliente = resultcliente1.data;
          }
      }

      if (sessionStorage.getItem("user") !== null && tipouser===0)
      {
        // Usuario Gratis puede ver solo sus contratos 
        setArraycliente(arraymycliente);
        resultcliente = arraymycliente;
      }
      // Ya tengo los clientes, ahora buscar los contratos
      setCliente(0);
      // Buscar los contratos del primer cliente.
      let tmenu=false;
      let tnegocio=99999999;
      let tproducto=99999999;
      let arraytcontrato;
      const resultcontrato = await axios.post(
          "http://localhost:3001/getcontratos",
          {user: sessionStorage.getItem("user"), tipouser, usercontrato:resultcliente[0].iduser, condicion },
          {}
      );
      if (resultcontrato.data.error || resultcontrato.data.length === 0) 
      {
          setLng(-75.829090519);
          setLat(20.0217583);
          setDomicilioSN(false);
          setDomicilio(false);
          setDescnegocio("");
          setNumcontrato(0);
          setArraycontrato(arraynocontrato);
          setArraytcontrato(arraynocontrato);
          tproducto=arraynocontrato[0].idproducto;
          setEstadocontrato(arraynocontrato.idestado);
          tnegocio=arraynocontrato[0].idnegocio;
          tmenu=false;
      }
      else 
      {
         setLng(resultcontrato.data[0].longitud);
         setLat(resultcontrato.data[0].latitud);
         setNumcontrato(resultcontrato.data[0].contrato);
         setDescnegocio(resultcontrato.data[0].negocio);
         setDomicilioSN(resultcontrato.data[0].domicilioSN);
         setDomicilio(resultcontrato.data[0].domicilio);
         setPublicar(resultcontrato.data[0].publicar);
         setArraycontrato(resultcontrato.data);
         setArraytcontrato(resultcontrato.data);
         tproducto=resultcontrato.data[0].idproducto;
         setEstadocontrato(resultcontrato.data[0].idestado);
         tmenu=resultcontrato.data[0].menu;
         tnegocio=resultcontrato.data[0].idnegocio;
      }
      setContrato(0);
      let resultmenu;
      if (tmenu)
      {
          let resultmenu1 = await axios.post(
              "http://localhost:3001/getmenu",
              {user: resultcliente[0].iduser, producto: tproducto, dueno:sessionStorage.getItem("user")},
              {}
          );
          if (resultmenu1.data.error || resultmenu1.data.length === 0) {
              setArraymenu(arraynomenu);
              resultmenu=arraynomenu;
          }
          else 
          {
              setArraymenu(resultmenu1.data);
              resultmenu=resultmenu1.data;
            }     
      }
      // Recuperar los estados de los contratos
      const resultestadoscontratos = await axios.post(
          "http://localhost:3001/getestadoscontratos",
          {},
          {}
      );

      if (resultestadoscontratos.data.error || resultestadoscontratos.data.length === 0) 
      {
          setArrayestadoscontratos(arraynoestados);
      }
      else 
      {
          setArrayestadoscontratos(resultestadoscontratos.data);
      }
      // Recuperar los estados de los productos para este negocio
      const resultestadosproductos = await axios.post(
          "http://localhost:3001/getestadosproductos",
          {tnegocio},
          {}
      );
      if (resultestadosproductos.data.error || resultestadosproductos.data.length === 0) 
      {
          setArrayestadosproductos(arraynoestados);
      }
      else 
      {
          setArrayestadosproductos(resultestadosproductos.data);
          const arraytmp = [];
          if (resultmenu)
          {
             for (let i =0; i < resultmenu.length; i+= 1)
             {
                arraytmp.push(resultmenu[i].idestado);
             }
          }
          setEstadoproducto(arraytmp);
      }   
      /// Preparando condiciones para filtrar
      let tttnegocios=[];
      const resulttnegocios = await axios.post(
        "http://localhost:3001/getcategoriasnegocios",
        {},
        {}
      );
      if (resulttnegocios.data.error || resulttnegocios.data.length === 0)
      {
        setArraytnegocios(arraynotnegocios);
        tttnegocios=arraynonegocios;    }
      else
      {
        setArraytnegocios(resulttnegocios.data);
        tttnegocios=resulttnegocios.data;
      }
      // Negocios pertenecientes al primer tipo  de negocio en arraytnegocios
      let ttnegocios=[];
      const resultnegocios = await axios.post(
        "http://localhost:3001/getnegocios-1",
        {},
        {}
      );
      if (resultnegocios.data.error || resultnegocios.data.length === 0)
      {
        setArraynegocios(arraynonegocios);
        setTnegocios(arraynonegocios);
        ttnegocios=arraynonegocios;
      }
      else
      {
        setArraynegocios(resultnegocios.data);
        // filtrar los negocios del tipo de negocio filtrado 
        // sino mostrar todos los negocios
        if (sessionStorage.getItem("tnegocio")!==null)
        {
          let j=0;
          for (let i=0;i<tttnegocios.length;i+=1)
          {
           if (tttnegocios[i].categorianegocio===Number(sessionStorage.getItem("tnegocio")))
           {
             j=i;
           }
          }
          ttnegocios=resultnegocios.data.filter((item,i)=>{if (item.categorianegocio === Number(sessionStorage.getItem("tnegocio"))){return item}});
        }
        else
        {
          ttnegocios=resultnegocios.data;
        }
  
        if (ttnegocios.length!==0)
        {
          setTnegocios(ttnegocios);
        }
        else
        {
          setTnegocios(arraynonegocios);
          ttnegocios=arraynonegocios;
        }
      }
      // Categorias de Productos
      let ttcategoriasproductos=[];
      const resultcategoriasproductos = await axios.post(
          "http://localhost:3001/getcategorias",
          {condicion:""},
          {}
        );
        if (resultcategoriasproductos.data.error || resultcategoriasproductos.data.length === 0)
        {
          setArraycategoriasproductos(arraynocategoriasproductos);
          setTcategoriasproductos(arraynocategoriasproductos);
          ttcategoriasproductos=arraynocategoriasproductos;
        }
        else
        {
          setArraycategoriasproductos(resultcategoriasproductos.data);
          // filtrar las categorias de productos para el negocio activo.
          if (sessionStorage.getItem("negocio")!==null)
          {
            let j=0;
            for (let i=0;i<ttnegocios.length;i+=1)
            {
             if (ttnegocios[i].idnegocio===Number(sessionStorage.getItem("negocio")))
             {
               j=i;
             }
            } 
            ttcategoriasproductos=resultcategoriasproductos.data.filter((item,i)=>{if (item.idnegocio === Number(sessionStorage.getItem("negocio"))){return item}});
          }
          else
          {
            ttcategoriasproductos=resultcategoriasproductos.data;
          }  
          if (ttcategoriasproductos.length!==0)
          {
            setTcategoriasproductos(ttcategoriasproductos);
          }
          else
          {
            setTcategoriasproductos(arraynocategoriasproductos);
            ttcategoriasproductos=arraynocategoriasproductos;
          }
        }
        let ttproductos=[];
        // Productos de la primera categoria de productos  
        const resultproductos = await axios.post(
             "http://localhost:3001/getproductos-categoria",
             {categoriaproducto: ""},
             {}
        );
        if (resultproductos.data.error || resultproductos.data.length === 0)
        {
            setArrayproductos(arraynoproductos);
            setTproductos(arraynoproductos);
            ttproductos=arraynoproductos;
         }
         else
         {
            setArrayproductos(resultproductos.data);
            // filtrar los productos de la primera categoria de negocios
            if (sessionStorage.getItem("cproducto")!==null)
            {
              let j=0;
              for (let i=0;i<ttcategoriasproductos.length;i+=1)
              {
               if (ttcategoriasproductos[i].idnegocio===Number(sessionStorage.getItem("cproducto")))
               {
                 j=i;
               }
              } 
              ttproductos=resultproductos.data.filter((item,i)=>{if (item.idcategoria ===Number(sessionStorage.getItem("cproducto"))){return item}});
            }
            else
            {
              ttproductos=resultproductos.data;
            }
            if (ttproductos.length!==0)
            {
              setTproductos(ttproductos);
            }
            else
            {
              setTproductos(arraynoproductos);
              ttproductos=arraynoproductos;
            }
         }
         let ttestado=[];
         const resultestado = await axios.post(
        "http://localhost:3001/getestadoscontratos",
        {},
        {}
      );
  
      const data = resultestado.data;
      if (data.error || data.length === 0)
      {
        setArrayestado(arraynoestado)
        ttestado=arraynoestado;
      }
      else
      {
        setArrayestado(resultestado.data);
        ttestado=resultestado.data;
      }
  
      ///
      setShow(false);
      setInicia(false);
   } //init 

  function forma_condicion()
    {
      if (sessionStorage.getItem("filtro_contrato")==="true")
       {
          if (sessionStorage.getItem("estado_contrato")!==null)
          {
            if (condicion.length!==0)
            {
               condicion = condicion + " and (tablaestadoscontratos.estado=" + sessionStorage.getItem("estado_contrato") + ")";
            }
            else
            {
                condicion = " (tablaestadoscontratos.estado=" + sessionStorage.getItem("estado_contrato") + ")";
            }
          }

          if (sessionStorage.getItem("tnegocio")!==null)
          {
            if (condicion.length!==0)
            {
               condicion = condicion + " and (tablacatcategoriasnegocios.categorianegocio=" + sessionStorage.getItem("tnegocio") + ")";
            }
            else
            {
                condicion = "(tablacatcategoriasnegocios.categorianegocio=" + sessionStorage.getItem("tnegocio") + ")";
            }
          }

          if (sessionStorage.getItem("negocio")!==null)
          {
             if (condicion.length!==0)
             {
                condicion = condicion + " and (tablacatnegocios.idnegocio=" + sessionStorage.getItem("negocio") + ")";
             }
             else
             {
                condicion = "(tablacatnegocios.idnegocio=" + sessionStorage.getItem("negocio") + ")";
             }
          }

          if (sessionStorage.getItem("cproducto")!==null)
          {
            if (condicion.length!==0)
            {
               condicion = condicion + " and (tablacatcategoriasproductos.idcategoria=" + sessionStorage.getItem("cproducto") + ")";
            }
            else
            {
                condicion = "(tablacatcategoriasproductos.idcategoria=" + sessionStorage.getItem("cproducto") +")";
            }
          }
 
          if (sessionStorage.getItem("producto")!==null)
            {
              if (condicion.length!==0)
              {
                 condicion = condicion + " and (tablacatproductos.idproducto=" + sessionStorage.getItem("producto") + ")";
              }
              else
              {
                  condicion = "(tablacatproductos.idproducto" + sessionStorage.getItem("producto") + ")";
              }
            }
            if (sessionStorage.getItem("fechai")!==null)
            {
                if (condicion.length!==0)
              {
                let fecha=sessionStorage.getItem("fechai").split("-");
                condicion = condicion + " and (tablareservaciones.fechatrabajo>=cdate('" + fecha[2] + "/" + fecha[1] + "/" + fecha[0] + "'))";
              }
              else
              {
                let fecha=sessionStorage.getItem("fechai").split("-");
                condicion = " (tablareservaciones.fechatrabajo>=cdate('" + fecha[2] + "/" + fecha[1] + "/" + fecha[0] + "'))";
              }
            }
            if (sessionStorage.getItem("fechaf")!==null)
            {
              if (condicion.length!==0)
              {
                let fecha=sessionStorage.getItem("fechaf").split("-");
                condicion = condicion + " and (tablareservaciones.fechatrabajo<=cdate('" + fecha[2] + "/" + fecha[1] + "/" + fecha[0] + "'))";
              }
              else
              {
                let fecha=sessionStorage.getItem("fechaf").split("-");
                condicion = " (tablareservaciones.fechatrabajo<=cdate('" + fecha[2] + "/" + fecha[1] + "/" + fecha[0] + "'))";
              }
            }
 
       }
       return(condicion);
    }


    async function cambiacontratos(indexuser)
    {
        setInicia(true);
        let ttcontrato=[];
        const resultcontrato = await axios.post(
            "http://localhost:3001/getcontratos",
            {user: sessionStorage.getItem("user"), tipouser, usercontrato:arraycliente[indexuser].iduser},
            {}
        );
        console.log(resultcontrato.data);
        if (resultcontrato.data.error || resultcontrato.data.length === 0) 
        {
            setArraycontrato(arraynocontrato);
            setEstadocontrato(arraynocontrato[0].idestado);
            ttcontrato=arraynocontrato;
        }
        else 
        {
            setArraycontrato(resultcontrato.data);
            setEstadocontrato(resultcontrato.data[0].idestado);
            ttcontrato=resultcontrato.data;
        }
        setContrato(0);
        let resultmenu;
        if (ttcontrato.menu)
        {
            let resultmenu1 = await axios.post(
                "http://localhost:3001/getmenu",
                {user: arraycliente[indexuser].iduser, producto: ttcontrato[0].idproducto, negocio: ttcontrato.data[0].idnegocio, dueno:sessionStorage.getItem("user")},
                {}
            );
            resultmenu=resultmenu1.data;
            if (resultmenu.error || resultmenu.length === 0) {
                setArraymenu(arraynomenu);
            }
            else 
            {
                setArraymenu(resultmenu);
            }       
        }
        setInicia(false);  
    }

    function borrarfiltro()
    {
       sessionStorage.removeItem("filtro_contrato");
       setCbestado(false);
       setCbtnegocio(false);
       setCbnegocio(false);
       setCbcproducto(false);
       setCbproducto(false);
       setCbfechai(false);
       setCbfechaf(false);
       sessionStorage.removeItem("estado_contrato");
       sessionStorage.removeItem("tnegocio");
       sessionStorage.removeItem("negocio");
       sessionStorage.removeItem("cproducto");
       sessionStorage.removeItem("producto");
       sessionStorage.removeItem("fechai");
       sessionStorage.removeItem("fechaf");
   }
   
   async function handleInput(e) {
    switch (e.target.id) {
            case "cliente":
                setCliente(e.target.value);
                cambiacontratos(e.target.value);
                break;
            case "contrato":              
                setContrato(e.target.value);
                setNumcontrato(arraycontrato[e.target.value].contrato);
                setEstadocontrato(arraycontrato[e.target.value].idestado);
                setLng(arraycontrato[e.target.value].longitud);
                setLat(arraycontrato[e.target.value].latitud);
                setDescnegocio(arraycontrato[e.target.value].negocio);
                setDomicilioSN(arraycontrato[e.target.value].domicilioSN);
                setDomicilio(arraycontrato[e.target.value].domicilio);
                setInicia(true);
                setContenido("Preparando información del contrato, espere por favor...");
                setShow(true);
//              Preparar el menu para este contrato 
                let resultmenu;
                if (arraycontrato[e.target.value].menu)
                {
                    let resultmenu1 = await axios.post(
                        "http://localhost:3001/getmenu",
                        {user: arraycliente[cliente].iduser, producto: arraycontrato[e.target.value].idproducto, negocio: arraycontrato[e.target.value].idnegocio},
                        {}
                    );
                    resultmenu=resultmenu1;
                    if (resultmenu.data.error || resultmenu.data.length === 0) {
                        setArraymenu(arraynomenu);
                    }
                    else {
                        setArraymenu(resultmenu.data);
                    }               
                }
                setShow(false);
                setInicia(false);
                break;
                case "selectestado":
                 setEstadocontrato(e.target.value);
                 setCambios(true);
                 break;
                 case "cbestado":
                  setCbestado(e.target.checked);
                  break;
                case "estado":
                  setEstado(e.target.value);
                  break;
                case "cbtnegocio":
                  setCbtnegocio(e.target.checked);
                  cambia_tipo_tnegocio_cb(e.target.checked);
                  break;
                case "tnegocio":
                  setTnegocio(e.target.value);
                  cambia_tipo_tnegocio(arraytnegocios[Number(e.target.value)].categorianegocio);  
                  break;
                case "negocio":
                  setNegocio(e.target.value);
                  cambia_negocio(tnegocios[Number(e.target.value)].idnegocio);
                  break;
                case "cbnegocio":
                  setCbnegocio(e.target.checked);
                  cambia_negocio_cb(e.target.checked);
                  break;
                case "categoria":
                  setCproducto(e.target.value);
                  cambia_categoria_producto(tcategoriasproductos[Number(e.target.value)].keycategoria);
                  break;
                case "cbcproducto":
                  setCbcproducto(e.target.checked);
                  cambia_categoria_producto_cb(e.target.checked);
                  break;
                case "cbproducto":
                  setCbproducto(e.target.checked);
                  cambia_producto_cb(e.target.checked);
                  break;
              case "producto":
                  setProducto(e.target.value);
                  break;
              case "cbfechai":
                  setCbfechai(e.target.checked);
                  break;
              case "fechai":
                  setFechai(e.target.value);
                  break;
              case "cbfechaf":
                  setCbfechaf(e.target.checked);
                  break;      
              case "fechaf":
                  setFechaf(e.target.value);
                  break;      
              case "postponer":
                  if (e.target.value<=arraycontrato[contrato].fechatrabajo.substring(0,10))
                  {
                     setContenido("El contrato no se puede postponer para una fecha anterior a la actual");
                     setShow(true)
                  }
                  else
                  {
                     setFechapostponer(e.target.value);
                  }
                  break;
            case "comentario":
                  setComentario(e.target.value)
                  break;
                           
            default:
                setInicia(true);
                const arraytmp = [];
                for (let i =0; i < estadoproducto.length; i+= 1)  {
                    arraytmp.push(estadoproducto[i]);
                }
                arraytmp[Number(e.target.id[e.target.id.length-1])]=Number(e.target.value);
                setEstadoproducto(arraytmp);
                setCambios(true);
                setInicia(false);
                break;      
        }
    }

    function cambia_tipo_tnegocio(tnegocio)
    {
      let ttarraynegocios=[];
      let ttarraycategoriasproductos=[];
      let ttarrayproductos=[];
      ttarraynegocios=arraynegocios.filter((item,i)=>{if (item.categorianegocio === tnegocio){return item}});
      if (ttarraynegocios.length!==0)
      {
         setTnegocios(ttarraynegocios);
         ttarraycategoriasproductos=arraycategoriasproductos.filter((item,i)=>{if (item.idnegocio === ttarraynegocios[0].idnegocio){return item}});
         if (ttarraycategoriasproductos.length!==0)
         {
            setTcategoriasproductos(ttarraycategoriasproductos);
            ttarrayproductos = arrayproductos.filter((item,i)=>{if (item.idcategoria === ttarraycategoriasproductos[0].keycategoria){return item}});
            if (ttarrayproductos.length!==0)
            {
              setTproductos(ttarrayproductos);
            }
            else
            {
              setTproductos(arraynoproductos);
            }
         }
         else
         {
            setTcategoriasproductos(arraynocategoriasproductos);
            setTproductos(arraynoproductos);
         }
      }
      else
      {
        setTnegocios(arraynonegocios);
        setTcategoriasproductos(arraynocategoriasproductos);
        setTproductos(arraynoproductos);
      
      }
    }
    
    async function cambia_tipo_tnegocio_cb(cbtnegocio){
      let ttarraynegocios=[];
      let ttarraycategoriasproductos=[];
      if (cbtnegocio){// tnegocio true
         setTnegocio(0);
         if (cbnegocio)
         {// cbtnegocio y cbnegocio en true, mostrar negocios del primer tnegocio
            ttarraynegocios=arraynegocios.filter((item,i)=>{if (item.categorianegocio === arraytnegocios[0].categorianegocio){return item}});
            if (ttarraynegocios.length!==0)
            {
              setTnegocios(ttarraynegocios);
            }
            else
            {
              setTnegocios(arraynonegocios);
            }
            setNegocio(0);
         }
         if (cbcproducto)
         {// categoria de producto en true
          if (cbnegocio)
            {//categoriaproducto en true y cbnegocio en true
              // las categorias dependen del negocio
              ttarraycategoriasproductos=arraycategoriasproductos.filter((item,i)=>{if (item.idnegocio === ttarraynegocios[0].idnegocio){return item}});
              if (ttarraycategoriasproductos.length!==0)
              {
                setTcategoriasproductos(ttarraycategoriasproductos);
              }
              else
              {
                setTcategoriasproductos(arraynocategoriasproductos);
              }
          
            }// cbnegocio true
            else
            {// categoriaproducto en true y cbnegocio en false y cbtnegocio en true
             // las categoriasproductos dependen del tnegocio
             const resultcproductos = await axios.post(
              "http://localhost:3001/getcproductos-tnegocio",
              {tnegocio: arraytnegocios[0].categorianegocio},
              {}
              );
              if (resultcproductos.data.error || resultcproductos.data.length === 0)
              {
                 setTcategoriasproductos(arraynocategoriasproductos);
              }
              else
              {
                 setTcategoriasproductos(resultcproductos.data);
                 ttarraycategoriasproductos=resultcproductos.data;
              }
              setCproducto(0);
            } // cbtnegocio true y cbnegocio false
         }//categoriaproducto true

         if (cbproducto)
         {//  producto en true
           if (cbcproducto){//cbtnegocio true, producto en true y cproducto en true
            // los productos dependen de la categoriaproducto
              let ttproductos=arrayproductos.filter((item,i)=>{if (item.idcategoria === ttarraycategoriasproductos[cproducto].keycategoria){return item}});
              if (ttproductos.length===0){
                 setTproductos(arraynoproductos);
              }
              else{
                 setTproductos(ttproductos);
              }
              setProducto(0);
            }// productos por cproductos
            else
            { // cbtnegocio true, producto en true
              //categoriaproducto false verificar cbnegocio
              if (cbnegocio)
              {// si cbnegocio mostrar los productos del negocio
                 const resultproductos = await axios.post(
                 "http://localhost:3001/getproductos-negocio",
                 {negocio: tnegocios[negocio].idnegocio},
                 {}
                 );
                 if (resultproductos.data.error || resultproductos.data.length === 0)
                 {
                    setTproductos(arraynoproductos);
                 }
                 else
                 {
                     setTproductos(resultproductos.data);
                 }
                 setProducto(0);
              }// productos por negocio
              else
              {// si cbnegocio false, mostrar los productos del cbtnegocio
                const resultproductos = await axios.post(
                  "http://localhost:3001/getproductos-tnegocio",
                  {categorianegocio: arraytnegocios[0].categorianegocio},
                  {}
                  );
                  if (resultproductos.data.error || resultproductos.data.length === 0)
                  {
                     setTproductos(arraynoproductos);
                  }
                  else
                  {
                      setTproductos(resultproductos.data);
                  }
                  setProducto(0);               
              } //productos por tnegocio
            }
         }
      }
      else
      { // tipo de negocio se apaga
        // comprobar cbnegocio,cbcproducto, cbproduco
       if (cbnegocio)
       {  // tiponegocio false y cbnegocio en true
          // mostrar todos los negocios
          setTnegocios(arraynegocios);
          ttarraynegocios=arraynegocios;
          setNegocio(0);
       }//cbnegocio true
       if (cbcproducto)
       {  // tnegocio false cproducto true
          if (cbnegocio)
          {  // cbnegocio true las categoriasproducto depende del negocio
             // getcategoriasproductos-negocio
             setTcategoriasproductos(arraycategoriasproductos.filter((item,i)=>{if (item.idnegocio === ttarraynegocios[0].idnegocio){return item}}));
             ttarraycategoriasproductos=arraycategoriasproductos.filter((item,i)=>{if (item.idnegocio === ttarraynegocios[0].idnegocio){return item}});
             setCproducto(0);
          }
          else
          {  // cbtnegocio false, cbnegocio false, cproducto true mostrar todas la categoriasproducto
             setTcategoriasproductos(arraycategoriasproductos);
             ttarraycategoriasproductos=arraycategoriasproductos;
          }
       }
       if (cbproducto)//tnegocio false producto true
       {
          if (cbcproducto) 
          { // tnegocio false, cproducto true, producto true mostrar los productos de la categoriaproducto
            let tmp=arrayproductos.filter((item,i)=>{if (item.idcategoria === ttarraycategoriasproductos[0].keycategoria){return item}});
            if (tmp.length!==0)
            {
              setTproductos(tmp);
            }
            else
            {
              setTproductos(arraynoproductos);
            }
            setCproducto(0);
          }
          else
          { // tnegocio false,cproducto false preguntar por el negocio
             if (cbnegocio)
             {  // tnegocio false,cproducto false negocio true mostrar productos del negocio
              const resultproductos = await axios.post(
                "http://localhost:3001/getproductos-negocio",
                {negocio: tnegocios[negocio].idnegocio},
                {}
                );
                if (resultproductos.data.error || resultproductos.data.length === 0)
                {
                   setTproductos(arraynoproductos);
                }
                else
                {
                   setTproductos(resultproductos.data);
                }
                setProducto(0);
             }
             else
             { // mostrar todos los productos todo para arriba es false
               setTproductos(arrayproductos);
               setProducto(0);
             }
          }

       }
      }
      setTnegocio(0);
    } // cambia_tipo_negocio_cb

    function cambia_negocio(negocio)
    {
      let ttarraycategoriasproductos=[];
      let ttarrayproductos=[];
      ttarraycategoriasproductos=arraycategoriasproductos.filter((item,i)=>{if (item.idnegocio === negocio){return item}});
      if (ttarraycategoriasproductos.length!==0)
      {
        setTcategoriasproductos(ttarraycategoriasproductos);
        ttarrayproductos =arrayproductos.filter((item,i)=>{if (item.idcategoria === ttarraycategoriasproductos[0].keycategoria){return item}});  
        if (ttarrayproductos.length!==0)
        {
          setTproductos(ttarrayproductos);  
        }
        else
        {
          setTproductos(arraynoproductos);  
        }
      }
      else
      {
        setTcategoriasproductos(arraynocategoriasproductos);
        setTproductos(arraynoproductos);  
      }
     }
    
     function cambia_categoria_producto(categoriaproducto){
      let ttproductos=arrayproductos.filter((item,i)=>{if (item.idcategoria === categoriaproducto){return item}});
      if (ttproductos.length===0){
           setTproductos(arraynoproductos);
      }
      else{
           setTproductos(ttproductos);
      }
      setProducto(0);
     }
    
     async function cambia_negocio_cb(cbnegocio)
     {
       let ttarraynegocios=[];
       let ttarraycategoriasproductos=[];
       if (cbnegocio)
       {  // cbnegocio cambia a true
          if (cbtnegocio)
          {  // cbnegocio en true y cbtnegocio en true los negocios dependen
            // del tipo de negocio
            ttarraynegocios=arraynegocios.filter((item,i)=>{if (item.categorianegocio === arraytnegocios[tnegocio].categorianegocio){return item}});
            if (ttarraynegocios.length!==0)
            {
               setTnegocios(ttarraynegocios)
            }
            else
            {
             setTnegocios(arraynonegocios)
             ttarraynegocios=arraynonegocios;
            }
          }
          else
          {   // tnegocio false mostrar todos los negocios
             setTnegocios(arraynegocios);
             ttarraynegocios=arraynegocios;
          }
          setNegocio(0);
          if (cbcproducto)
          {// negocio true y cbcproducto true
           // la categoriaproducto depende del negocio
           ttarraycategoriasproductos=arraycategoriasproductos.filter((item,i)=>{if (item.idnegocio === ttarraynegocios[0].idnegocio){return item}});
           if (ttarraycategoriasproductos.length!==0)
           {
              setTcategoriasproductos(ttarraycategoriasproductos)
           }
           else
           {
             setTcategoriasproductos(arraynocategoriasproductos);
             ttarraycategoriasproductos=arraynocategoriasproductos;
           }
          }
          if (cbproducto)
          {// negocio a true verificar cbcproducto
             if (cbcproducto)
             {// negocio true, producto true y cproducto true mostrar productos segun cproducto
               let tmp=arrayproductos.filter((item,i)=>{if (item.idcategoria === ttarraycategoriasproductos[0].keycategoria){return item}});
               if (tmp.length!==0)
               {
                 setTproductos(tmp);
               }
               else
               {
                 setTproductos(arraynoproductos);
               }
               setCproducto(0);  
             }
             else
             {//negocio true, producto true y cproducto false mostrar productos segun negocio
               const resultproductos = await axios.post(
                 "http://localhost:3001/getproductos-negocio",
                 {negocio: tnegocios[0].idnegocio},
                 {}
                 );
                 if (resultproductos.data.error || resultproductos.data.length === 0)
                 {
                    setTproductos(arraynoproductos);
                 }
                 else
                 {
                    setTproductos(resultproductos.data);
                 }
                 setProducto(0);
             }
 
          }
 
       }// cbnegocio cambia a true
      else
      {// cbnegocio cambia a false
        if (cbcproducto)
        { // cbnegocio false y cbcproducto true verificar cbtnegocio si es true las categorias dependen de tnegocio
          // si cbtnegocio es false mostrar todas las categorias ne productos
           if (cbtnegocio)
           {// las categorias dependen del tnegocio
             const resultcproductos = await axios.post(
               "http://localhost:3001/getcproductos-tnegocio",
               {tnegocio: arraytnegocios[tnegocio].categorianegocio},
               {}
               );
               if (resultcproductos.data.error || resultcproductos.data.length === 0)
               {
                  setTcategoriasproductos(arraynocategoriasproductos);
                  ttarraycategoriasproductos=arraynocategoriasproductos;
               }
               else
               {
                  setTcategoriasproductos(resultcproductos.data);
                  ttarraycategoriasproductos=resultcproductos.data;
               }
               setCproducto(0);
           }
           else
           { // mostrar todas las cproductos
             setTcategoriasproductos(arraycategoriasproductos);
             ttarraycategoriasproductos=arraycategoriasproductos;
             setCproducto(0);
           }
        }
        if (cbproducto)
        {  // negocio false, producto true verificar cproducto y tnegocio
           if (cbcproducto)
           {// negocio false, producto true, cproducto true mostrar productos segun cproducto
             let tmp=arrayproductos.filter((item,i)=>{if (item.idcategoria === ttarraycategoriasproductos[0].keycategoria){return item}});
             if (tmp.length!==0)
             {
               setTproductos(tmp);
             }
             else
             {
               setTproductos(arraynoproductos);
             }
             setCproducto(0);
           }
           else
           {
              if (cbtnegocio)
              {// negocio true, producto true, cproducto false tnegocio true mostrar productos segun tnegocio
               const resultproductos = await axios.post(
                 "http://localhost:3001/getproductos-tnegocio",
                 {categorianegocio: arraytnegocios[tnegocio].categorianegocio},
                 {}
                 );
                 if (resultproductos.data.error || resultproductos.data.length === 0)
                 {
                    setTproductos(arraynoproductos);
                 }
                 else
                 {
                     setTproductos(resultproductos.data);
                 }
                 setProducto(0);               
              }
           }
        }
      }
     }
 
     async function cambia_categoria_producto_cb(cbcproducto){
      let ttarraycategoriasproductos=[];
      if (cbcproducto)
      {// categoriaproducto true
      // verificar cbnegocio y cbtnegocio
         if (cbnegocio)
         { // negocios true
           // filtrar las categoriasproducto para el negocio activo
           ttarraycategoriasproductos=arraycategoriasproductos.filter((item,i)=>{if (item.idnegocio === tnegocios[negocio].idnegocio){return item}});
           if (ttarraycategoriasproductos.length!==0)
           {
           setTcategoriasproductos(ttarraycategoriasproductos);
           }
           else
           {
            setTcategoriasproductos(arraynocategoriasproductos);
           }
           setCproducto(0);
         }
         else
         {// negocio false, verificar cbtnegocio
             if (cbtnegocio)
             {// tnegocio true
              // filtrar las categoriasproducto para el tnegocio activo
              const resultcproductos = await axios.post(
                "http://localhost:3001/getcproductos-tnegocio",
                {tnegocio: arraytnegocios[tnegocio].categorianegocio},
                {}
                );
                if (resultcproductos.data.error || resultcproductos.data.length === 0)
                {
                  ttarraycategoriasproductos=arraynocategoriasproductos;
                  setTcategoriasproductos(arraynocategoriasproductos);
                }
                else
                {
                  ttarraycategoriasproductos=resultcproductos.data;
                  setTcategoriasproductos(resultcproductos.data);
                }
                setCproducto(0);    
             }
             else
             { // cbnegocio es false y cbtnegocio es false, mostrar todas la cproductos
               setTcategoriasproductos(arraycategoriasproductos);
               ttarraycategoriasproductos=arraycategoriasproductos;
              }
          }
          if (cbproducto)
          { // cproducto true y  producto es true
            // mostrar los productos para la primera categoria de productos
            let tmp=arrayproductos.filter((item,i)=>{if (item.idcategoria === ttarraycategoriasproductos[0].keycategoria){return item}});
            if (tmp.length!==0)
            {
               if (arrayproductos.filter((item,i)=>{if (item.idcategoria === ttarraycategoriasproductos[0].keycategoria){return item}}).length!==0)
               {
                  setTproductos(arrayproductos.filter((item,i)=>{if (item.idcategoria === ttarraycategoriasproductos[0].keycategoria){return item}}));
               }
               else
               {
                 setTproductos(arraynoproductos);
               }
            }
            else
            {
              setTproductos(arraynoproductos);
            }
            setCproducto(0);
          }
        }        
      else{ // cproducto false
        if (cbproducto)
        {// cproducto false, cbproducto true
           if (cbnegocio)
           {// cbnegocio true mostrar productos para el negocio activo
            const resultproductos = await axios.post(
              "http://localhost:3001/getproductos-negocio",
              {negocio: tnegocios[negocio].idnegocio},
              {}
              );
              if (resultproductos.data.error || resultproductos.data.length === 0)
              {
                 setTproductos(arraynoproductos);
              }
              else
              {
                  setTproductos(resultproductos.data);
              }
              setProducto(0);
           }
           else
           {// no cbnegocio, verificar cbtnegocio
           if (cbtnegocio)
           {// si cbtnegocio true mostrar productos para el tnegocio activo
            const resultproductos = await axios.post(
              "http://localhost:3001/getproductos-tnegocio",
              {categorianegocio: arraytnegocios[tnegocio].categorianegocio},
              {}
              );
              if (resultproductos.data.error || resultproductos.data.length === 0)
              {
                 setTproductos(arraynoproductos);
              }
              else
              {
                  setTproductos(resultproductos.data);
              }
              setProducto(0);               
           }
           else
           {// cbnegocio y cbtnegocio false mostrar todos los productos
             setTproductos(arrayproductos);
             setProducto(0);
           }
           }
        }
    }
  }

  async function cambia_producto_cb(cbproducto)
  {
    var tttcproductos=[];
    var tttproductos=[];
   if (cbproducto){
      // producto true;
      // verificar cbcproducto, cbnegocio, cbtnegocio 
      if (cbcproducto)
      {  
        // cproducto true mostrar los productos para esta cproducto
        if (arrayproductos.filter((item,i)=>{if (item.idcategoria === tcategoriasproductos[cproducto].keycategoria){return item}}).length!==0)
        {
         setTproductos(arrayproductos.filter((item,i)=>{if (item.idcategoria === tcategoriasproductos[cproducto].keycategoria){return item}}));
        }
        else
        {
          setTproductos(arraynoproductos);
        }
      }
      else{ // cbcproducto en false, verificar cbnegocio y cbtnegocio
        if (cbnegocio){// el checkbox de negocio en true, filtrar los producto para el negocio activo
             // getproductos(negocio);
           // Productos de la primera categoria de productos  
           const resultproductos = await axios.post(
                "http://localhost:3001/getproductos-negocio",
                {negocio: tnegocios[negocio].idnegocio},
                {}
           );
           if (resultproductos.data.error || resultproductos.data.length === 0)
           {
              setTproductos(arraynoproductos);
           }
           else
           {
             setTproductos(resultproductos.data);
           }
          setProducto(0);

        }
        else{// check de negocio en false verificar cbtnegocio
             if (cbtnegocio){ // checkbox de tnegocios en true, filtrar los productos para el tnegocio activo
                  // getproductos(tnegocio);
                  if (arrayproductos.filter((item,i)=>{if (item.idcategoria === tcategoriasproductos[cproducto].keycategoria){return item}}).length!==0)
                  {
                     setTproductos(arrayproductos.filter((item,i)=>{if (item.idcategoria === tcategoriasproductos[cproducto].keycategoria){return item}}))
                  }
                  else
                  {
                    setTproductos(arraynoproductos);
                  }

             }
             else{// el checkbox de productos esta en true y cbcproducto,cbnegocio,cbtnegocio estan en false
                  if (arrayproductos.length!==0)
                  {
                     setTproductos(arrayproductos);
                  }
                  else
                  {
                    setTproductos(arraynoproductos);
                  }
             }
        }
      }
   }
  } // cambia_producto_cb

    function confirmarFiltro() 
    {
      let filtro=false;
      if (cbestado===true)
      {
         sessionStorage.setItem("estado_contrato",arrayestado[Number(estado)].estado);
         filtro=true;
      }
      if (cbtnegocio===true)
      {
         sessionStorage.setItem("tnegocio",arraytnegocios[Number(tnegocio)].categorianegocio);
         filtro=true;
      }
      if (cbnegocio===true)
      {
         sessionStorage.setItem("negocio",tnegocios[Number(negocio)].idnegocio);
         filtro=true;
      }
      if (cbcproducto===true)
      {
         sessionStorage.setItem("cproducto",tcategoriasproductos[Number(cproducto)].keycategoria);
         filtro=true;
      }
      if (cbproducto===true)
      {
         sessionStorage.setItem("producto",tproductos[Number(producto)].idproducto);
         filtro=true;
      }
      if (cbfechai===true)
      {
         sessionStorage.setItem("fechai",fechai);
         filtro=true;
      }
      if (cbfechaf===true)
      {
        sessionStorage.setItem("fechaf",fechaf);
        filtro=true;
      }
      if (filtro)
      {
        sessionStorage.setItem("filtro_contrato",true);
      }
      else
      {
        sessionStorage.removeItem("filtro_contrato");
      }
      setFilterState({ type: "set", newvalue: false })
      init();
    } 

    async function confirmar() 
    {
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
        }

    async function confirmarPostponer() 
    {
    const result = await axios.post(
      "http://localhost:3001/setpostponercontrato",
      { contrato:arraycontrato[contrato].contrato, fechapostponer },
      {}
    );
    if (result.data.error)
    {
       setContenido(result.data.error);
       setShow(true); 
    }
    else
    {
      let tarray=arraycontrato;
      tarray[contrato].fechatrabajo=fechapostponer;
      setArraycontrato(tarray);
      setPostponer(false);
      setContenido("Se registró la operación de postponer.");
      setShow(true);
    }
    } //confirmarpostponer

    const onModalClose = () => {
        setShow(false)
    }

    async function confirmarCancelar() 
    {
    const result = await axios.post(
      "http://localhost:3001/setcancelarcontrato",
      { contrato:arraycontrato[contrato].contrato },
      {}
    );
    if (result.data.error)
    {
      setContenido(result.data.error);
      setShow(true); 
    }
    else
    {
      let tarray=arraycontrato;
      tarray[contrato].idestado=2;
      setArraycontrato(tarray);
      setEstadocontrato(2);
      setCancelar(false);
      setContenido("Se canceló el contrato " + contrato);
      setShow(true);
    }
    } //cancelarcontrato

    function ffiltrar()
    {
      if (filtrar===true)
      {
         setFiltrar(false);
      }
      else
      {
        if (postponer===false && evaluar===false && evaluar===false && cancelar===false)
        {
          setFiltrar(true);
        }
      }
    }

    function fcancelar()
    {
      if (cancelar===true)
      {
         setCancelar(false);
      }
      else
      {
        if (filtrar===false && postponer===false && evaluar===false && evaluar===false)
        {
          setCancelar(true);
        }
      }
    }

    function fpostponer()
    {
      if (postponer===true)
      {
         setPostponer(false);
      }
      else
      {
        if (filtrar===false && cancelar===false && evaluar===false && evaluar===false)
        {
          setPostponer(true);
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
        if (filtrar===false && cancelar===false && evaluar===false && postponer===false)
        {
          setEvaluar(true);
        }
      }
    }

    async function confirmarEvaluar() 
    {
     const result = await axios.post(
      "http://localhost:3001/setevalua",
      { quien: tipouser===0?0:1, contrato, evalua: rbutton, comentario},
      {}
    );
    if (result.data.error){
      setContenido(result.data.error);
      setShow(true);
    }
    else
    {
      setEvaluar(false);
      setConfirma(false);
      setContenido("Se registró la evaluación.");
      setShow(true);
    }
    } //confirmar evaluar contrato

    function fradio(e)
    {
       setRbutton(e.target.value);
    }

    function fpublicar()
    {
      // publicar
    }

    useEffect(() => {
      setFiltrar(filterState.show);
    }, [filterState])
  
  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item, i) => { const [paramName, paramValue] = item.split("="); parsedParams[paramName] = paramValue });
  }, [location])

   useEffect(() => {
        init()
    }, [])

    //const 
    
    return (
        <>
            <Modal visible={show} onClose={onModalClose} className="cmodal wmodal"  classContainer="modal-contratosadmin">
                <div className="cerrar-button">
                    <button className="cerrar" onClick={onModalClose}>X</button>
                </div>
                <div className="main-modal">
                     <label>{contenido}</label>
                </div>
            </Modal>

            <div>
            {inicia===false?
            <Navbar
                links={[
                    { label: "Inicio", to: "/",tooltips: "Ir a la página principal" },
                    { label: sessionStorage.getItem("user") === null ? "Iniciar sesión" : "Cerrar sesión", to: sessionStorage.getItem("user") === null ? "/login" : "/cerrarsesion", tooltips: sessionStorage.getItem("user") === null ? "Abrir sesión" : "Cerrar la sesión de " + sessionStorage.getItem("usernombre") },
                    { label: "Registrarse", to: "/registrarse?inserta=true", tooltips: "Crear una cuenta de usuario" },
                    { label: "Acerca de", to: "/Acercade", tooltips: "Acerca de Destodo.cu" },
                      ]}  mcliente={arraycliente[cliente].iduser} mcontrato={arraycontrato[contrato].contrato}

            />:""}
                <Hero>
                    <div className="cabeza">
                    {parsedParams.nivel===0?"":
                     <IconButton color="primary" onClick={() => {
                         navigate(`/?naturaleza=${sessionStorage.getItem("naturaleza")}&owner=${sessionStorage.getItem("idowner")}&nivel=${sessionStorage.getItem("nivel")}`);
                     }}>
                      <ArrowBack />
                      </IconButton>
                    }
                        <h3 className="h1-cabeza">DesTodo.cu</h3>
                        <h4 className="h3-1-cabeza-contrato-admin"> - Contratos ({numcontrato})</h4>
                    </div>
                    <div className="contratosadmin">
                           <div className="container-contratosadmin">
                           {inicia === false?
                                <div className="input-area-contratosadmin">
                                     <label className="label-1-contratosadmin">Cliente:</label>
                                     <select className="select-contratosadmin-1" id="cliente" onChange={handleInput} disabled={tipouser===0} value={cliente}>
                                        {arraycliente.map((item, i) => {
                                           return <option key={i} value={i} >{item.nombre}</option>
                                        })}
                                     </select>
                                </div>:""
                            }    
                            {inicia === false?
                            <div className="input-area-contratosadmin">
                                <label className="label-1-contratosadmin">Contratos:</label>
                                <select className="select-contratosadmin-2" id="contrato" onChange={handleInput} value={contrato}>
                                    {arraycontrato.map((item, i) => {
                                        return <option key={i} value={i} >{item.corto}</option>
                                    })}
                                </select>
                            </div>:""
                            }
                            {/* Esta información solo sale si hay algún contrato*/}
                            {arraycontrato.length>0 && arraycontrato[0].corto!=="No hay contratos"?
                            <>
                            <div className="input-contratosadmin">
                                 { inicia === false ?
                                   <>
                                   <div className='grupo-contratos-label'>
                                      <label className="label-contratos-2">Negocio:</label>
                                      <label className="label-contratos-3-1">{arraycontrato[contrato].negocio}</label>
                                   </div>
                                   <div className='grupo-contratos-label'>
                                      <label className="label-contratos-2">Categoria:</label>
                                      <label className="label-contratos-3-2">{arraycontrato[contrato].categoria}</label>
                                   </div>
                                   <div className='grupo-contratos-label'>
                                      <label className="label-contratos-2">Producto:</label>
                                      <label className="label-contratos-3-3">{arraycontrato[contrato].largo}</label>
                                   </div>
                                   <div className='grupo-contratos-label'>
                                      <label className="label-contratos-2">Fecha:</label>
                                      <label className="label-contratos-3-4">{arraycontrato[contrato].fechatrabajo.substring(0,10)}</label>
                                   </div>
                                   </>:""
                                 }
                                 { inicia === false ?
                                   <>
                                   <div>
                                   <label className="label-contratos-2">Estado:</label>
                                   <select className="select-contratosadmin-estado" id="selectestado" onChange={handleInput} disabled={tipouser===0} value={estadocontrato}>
                                   {arrayestadoscontratos.map((item, i) => {
                                       return <option key={i} value={item.estado} >{item.desc}</option>
                                   })}
                                   </select>
                                   </div>
                                   </>:""
                                }
                                 { inicia === false ?
                                   arraycontrato[contrato].menu ?
                                    <label className="label-menu-contratosadmin-1">INCLUYE:</label>:"":""
                                 }
                                 { inicia === false ?
                                   arraycontrato[contrato].menu ?
                                   <>
                                    <div className='label-menu-grupo-1'>
                                        <label className="label-menu-contratosadmin-2">Producto</label>
                                        <label className="label-menu-contratosadmin-3">Estado</label>
                                    </div>
                                    </>:"":""
                                 }
                                 { inicia === false ?
                                  arraycontrato[contrato].menu ?
                                  arraymenu.map((item1,i)=>
                                    <>
                                    <div key={i} className="menu-contratosadmin">
                                         <label className="label-menu-contratosadmin">{item1.nick}</label>
                                           <select className={"estados"} id={`selectproducto${i}`} onChange={handleInput} disabled={tipouser===0} value={estadoproducto[i]}>
                                           {arrayestadosproductos.map((item, j) => {
                                             return <option key={j} value={item.estado} >{item.desc}</option>
                                           })}
                                        </select>
                                    </div>
                                    </>
                                        ):""
                                 
                                :""}
                            </div> 
                            </>:""}
                            {/*} Fin de bloque si hay contratos*/}

                            <div className="contratosadmin-grupo-button">
                                {/*Estos botones no salen si no hay contratos*/}
                                {arraycontrato.length>0 && arraycontrato[0].corto!=="No hay contratos"?
                                <>
                                {tipouser!==0 && cambios===true && inicia===false?
                                <>
                                <Tippy content="Registrar los datos del contrato." >
                                       <button type="button" className="contratosadmin-button1 primary" onClick={confirmar}>
                                           <Check />
                                       </button>
                                </Tippy>
                                </>:""
                                }
                                {tipouser===1 && arraycontrato[0].corto!=="No hay contratos" && inicia===false && domicilioSN===true && domicilio===true?
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
                                {tipouser!==0 && arraycontrato[0].corto!=="No hay contratos" && inicia===false && publicar?
                                 <>
                                 <Tippy content="Publicar resultados">
                                        <button type="button" className="contratosadmin-button1 primary" onClick={fpublicar}>
                                                Publicar
                                        </button>
                                 </Tippy>
                                </>:""
                                }
                                {tipouser===0 && arraycontrato[0].corto!=="No hay contratos" && inicia===false && arraycontrato[contrato].idestado===1?
                                <>
                                <Tippy content="Evaluar el comportamiento del negocio.">
                                       <button type="button" className="contratosadmin-button1 primary" onClick={fpostponer}>
                                               Postponer
                                      </button>
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
                                {inicia===false?
                                <>
                                <Tippy content="Filtrar Contratos">
                                       <button type="button" className="contratosadmin-button1 primary" onClick={ffiltrar}>
                                               <FilterAltIcon />
                                       </button>
                                 </Tippy>
                                 </>:""
                                }
                            </div>

                        </div>
                       {/* Filtrar Contratos */}
                       {inicia===false && filtrar===true && cancelar===false && postponer===false && evaluar===false && showMap===false?
                       <>
                       <div className="filtrar-contratos">
                            <div className="container-filtrar-contratos">
                                <label className="label-m">Filtrar los contratos:</label>
                                <div className="input-area-filtro">
                                     <Checkbox className="cbox-estado-negocio" id="cbestado" color="checkbox" defaultChecked  checked={cbestado} onClick={handleInput}/> 
                                     <label className="label-estado">Estado Contrato:</label>
                                     {cbestado?
                                     <select className="selectec" id="estado" onChange={handleInput} value={estado}>
                                     {arrayestado.map((item, i) => 
                                     {
                                        return <option key={i} value={i} >{item.desc}</option>
                                     })}
                                     </select>:""
                                     }
                                </div>
                                <div className="input-area-filtro">
                                    <Checkbox className="cbox-Tnegocio" id="cbtnegocio" color="checkbox" defaultChecked  checked={cbtnegocio} onClick={handleInput}/> 
                                    <label className="label-datos-producto">Tipo Negocio:</label>           
                                    {cbtnegocio?
                                    <select className="selectTP" id="tnegocio" onChange={handleInput} value={tnegocio} >
                                            {arraytnegocios.map((item, i) => {
                                            return <option key={i} value={i} >{item.desc}</option>
                                    })}
                                    </select>:""
                                    }
                                </div>
                                <div className="input-area-filtro">
                                    <Checkbox className="cbox-negocio" id="cbnegocio" color="checkbox" defaultChecked  checked={cbnegocio} onClick={handleInput}/>
                                    <label className="label-datos-producto">Negocio: </label>
                                    {cbnegocio?          
                                    <select className="selectne" id="negocio" onChange={handleInput} value={negocio}>
                                            {tnegocios.map((item, i) => {
                                            return <option key={i} value={i} >{item.desc}</option>
                                     })}
                                    </select>:""
                                    }
                                </div>
                                <div className="input-area-filtro">
                                    <Checkbox className="cbox-Cproducto" id="cbcproducto" color="checkbox" defaultChecked  checked={cbcproducto} onClick={handleInput}/>
                                    <label className="label-datos-producto">Categorias:</label>
                                    {cbcproducto?          
                                    <select className="selectca" id="categoria" onChange={handleInput} value={cproducto}>
                                            {tcategoriasproductos.map((item, i) => {
                                            return <option key={i} value={i} >{item.categoria}</option>
                                     })}
                                    </select>:""
                                    }
                                </div>
                                <div className="input-area-filtro">
                                    <Checkbox className="cbox-producto" id="cbproducto" color="checkbox" defaultChecked  checked={cbproducto} onClick={handleInput}/>
                                    <label className="label-datos-producto">Producto: </label>
                                    {cbproducto?          
                                    <select className="selectpro" id="producto" onChange={handleInput} value={producto} >
                                           {tproductos.map((item, i) => {
                                           return <option key={i} value={i} >{item.desc}</option>
                                    })}
                                     </select>:""
                                    }
                                </div>
                                <div className="input-area-filtro">
                                    <Checkbox className="cbox-producto" id="cbfechai" color="checkbox" defaultChecked  checked={cbfechai} onClick={handleInput}/>
                                    <label className="label-1">Fecha Inicial:</label>
                                    {cbfechai?
                                    <input className="input-fechai"
                                           id="fechai"
                                           value={fechai}
                                           onChange={handleInput}
                                           type="date"
                                           required
                                    />:""
                                    }
                                </div>
                                <div className="input-area-filtro">
                                     <Checkbox className="cbox-producto" id="cbfechaf" color="checkbox" defaultChecked  checked={cbfechaf} onClick={handleInput}/>
                                     <label className="label-1">Fecha Final:</label>
                                     {cbfechaf?          
                                     <input className="input-fechaf"
                                            id="fechaf"
                                            value={fechaf}                   
                                            onChange={handleInput}
                                            type="date"
                                            required
                                     />:""
                                     }
                                </div>
                                <div className="estado-contratos-grupo-button">
                                     <Tippy content="Establecer el filtro">
                                            <button type="button" className="Filtrarc" onClick={confirmarFiltro}>
                                                <Check />
                                            </button>
                                      </Tippy>
                                      <Tippy content="Eliminar todos los filtros">
                                             <button type="button" className="estado-contratos-button estado-contratos-button1 primary" onClick={borrarfiltro}>
                                                <FilterAltOff />
                                             </button>
                                      </Tippy>
                                      <Tippy content="Regresar al contrato">
                                             <button type="button" className="estado-contratos-button estado-contratos-button1 primary" onClick={ffiltrar}>
                                               <ArrowBack />
                                             </button>
                                      </Tippy>
                                </div>
                            </div>
                      </div>
                      </>:""
                      }
                      {/* Evaluar Contrato */}
                      {inicia===false && evaluar===true && cancelar===false && postponer===false && filtrar===false && showMap===false?
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
                                                         defaultValue={String(asumido)}
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
                        {inicia===false && cancelar===true && postponer===false && evaluar===false && filtrar===false && showMap===false?
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
                        {/* PostPoner Contrato */}
                        {inicia===false && postponer===true && cancelar===false && evaluar===false && showMap===false?
                        <>
                        <div className="postponer">
                           <div className="container-postponer"> 
                               <label className="label-cliente">PostPoner contrato:</label>
                               <div className="input-area-postponer">
                                    <label className="label-cliente">Cliente:</label>
                                    <label className="label-cliente-postponer">{arraycliente[cliente].nombre}</label>
                               </div>
                               <div className="input-area-postponer">
                                    <label className="label-contrato">Contrato:</label>
                                    <label className="label-contrato-postponer">{arraycontrato[contrato].corto}</label>
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
                               <div className="input-area-postponer">
                                    <label className="label-postponer">Fecha postponer:</label>
                                    <input className="input-postponer"
                                           id="postponer"
                                           value={fechapostponer}
                                           placeholder="20/09/2022"
                                           onChange={handleInput}
                                           type="date"
                                           required
                                    />
                               </div>
                               <div className="postponer-grupo-button">              
                                   <Tippy content="Postponer contrato para otra fecha">
                                          <button type="button" className="postponer-button primary" onClick={confirmarPostponer}>
                                             <Check />
                                          </button>
                                   </Tippy>         
                                   <Tippy content="Clic para volver">
                                          <button type="button" className="postponer-button1 primary" onClick={fpostponer}>
                                             <ArrowBack />
                                          </button>
                                   </Tippy>
                               </div>
                            </div>
                       </div>
                       </>:""
                       }
                    </div>
                </Hero>
            </div>
        </>
    );
};

export default ContratoAdmin
