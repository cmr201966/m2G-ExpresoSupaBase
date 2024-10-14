{
  /*QRCode value="TRANSFERMOVIL_ETECSA, TRANSFERENCIA,9224069991525391,56174215" />*/
}
import Navbar from "../../components/Navbar/Navbar";
import { useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import { Box, CircularProgress } from "@mui/material";
//import QRCode from "react-qr-code";
import BigSlider from "../../components/BigSlider/BigSlider";
import MultipleSlider from "../../components/MultipleSlider/MultipleSlider";
import CardMultipleSlider from "../../components/CardMultipleSlider/CardMultipleSlider";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import Hero from "../../layouts/Hero/Hero";
import { useEffect, useMemo, useState } from "react";
import { getCategoriasNew } from "../../servicios/home";
import { getAplicaciones } from "../../servicios/aplicaciones";
import { getprovincias, getmunicipios } from "../../servicios/catalogos";
import { setconfig, getconfig  } from "../../servicios/config";
import { getJpgFile  } from "../../servicios/imagenes";

import "./styles.css";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {};
  const [result, setResult] = useState([]);
  const [inicia, setInicia] = useState(true);
  const [nivel, setNivel] = useState(0);
  const [desctmp, setDesctmp] = useState("");
  const [rutatmp, setRutatmp] = useState("");
  const [show, setShow] = useState(false);
  const [imgs, setImgs] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [users, setUsers] = useState([]);
  const [nombres, setNombres] = useState([]);
  const [show1, setShow1] = useState();
  const [arrayprovincias, setArrayprovincias] = useState([]);
  const [arraymunicipios, setArraymunicipios] = useState([]);
  const [provincia, setProvincia] = useState(0);
  const [municipio, setMunicipio] = useState(0);
  const [tmunicipios, setTmunicipios] = useState([]);
  const arraydesconocido = [{ provincia: 99, municipio: 99, desc: "Desconocido" }];


  async function init() {
    setInicia(true);
    let result1;
    setShow(true);
    sessionStorage.removeItem("categoria");
    sessionStorage.removeItem("ubicacion-provincia");
    sessionStorage.removeItem("ubicacion-municipio");

    let resultconfig = await getconfig({});
    resultconfig = await resultconfig.json();
    if (resultconfig.length!==0){
       if (resultconfig[0].provincia!=0){
          setProvincia(resultconfig[0].provincia);
          setMunicipio(resultconfig[0].municipio);
          sessionStorage.setItem("ubicacion-provincia", resultconfig[0].provincia);
          sessionStorage.setItem("ubicacion-municipio", resultconfig[0].municipio);
             }     
    }
    else setShow1(true);

    //let ttprovincias=[];
    let resultprovincia = await getprovincias({});
    resultprovincia = await resultprovincia.json();

    if (resultprovincia.error || resultprovincia.length === 0)
    {
      setArrayprovincias(arraydesconocido);
      //ttprovincias=arraydesconocido;
    }
    else
    {
      setArrayprovincias(resultprovincia);
      //ttprovincias=resultprovincia;
    }
    if (resultconfig.length===0){
      setProvincia(14);
    }
    let ttmunicipios=[];

    let resultmunicipio = await getmunicipios({});
    resultmunicipio = await resultmunicipio.json();

    if (resultmunicipio.error || resultmunicipio.length === 0)
    {
       setArraymunicipios(arraydesconocido);
       setTmunicipios(arraydesconocido);
       ttmunicipios=arraydesconocido;
    }
    else
    {
      setArraymunicipios(resultmunicipio);
      if (resultconfig.length===0){
        setMunicipio(6);
        ttmunicipios = resultmunicipio.filter((item)=>{if (item.provincia === 14){return item}});
      }
      else{
        ttmunicipios = resultmunicipio.filter((item)=>{if (item.provincia ===resultconfig[0].provincia){return item}});
      }
    }
    if (ttmunicipios.length!==0)
    {
      setTmunicipios(ttmunicipios);
    }
    else
    {
      setTmunicipios(arraydesconocido);
      ttmunicipios=arraydesconocido;
    }

    const newResult = [];
    if (
      parsedParams.nivel === undefined ||
      parsedParams.idowner === undefined ||
      parsedParams.nivel === "0"
    ) {
      setNivel(0);
      let resultApp = await getAplicaciones({});
      resultApp = await resultApp.json();
      let imgs1=[];
      let category1=[];
      let users1=[];
      let nombres1=[];
      resultApp.forEach((item) => {
        imgs1.push("./galerias/app_images/aplicaciones/" + item.id + "/" + item.id + ".jpg");
        category1.push(item.idcategoria);
        users1.push(item.iduser)
        nombres1.push(item.desc)
      });
      setImgs(imgs1);
      setCategorys(category1);
      setUsers(users1);
      setNombres(nombres1);
      let result = await getCategoriasNew({user: sessionStorage.getItem("user"),});
      result1 = await result.json();
      let arrayContenidoFoto=[];
      for(let i=0;i<result1.length; i+=1){
        let resultado = await getJpgFile({ file: "./galerias/app_images/categorias_de_negocios/" + result1[i].idcategoria + "/" + result1[i].idcategoria + ".jpg"});
        resultado = await resultado.text();
        arrayContenidoFoto.push(resultado);
      }

/*            "http://localhost:3001/app_images/categorias_de_negocios/" +
            item.idcategoria +
            "/" +
            item.idcategoria +
            ".jpeg",
*/

      result1.forEach((item, i) => {
        newResult.push({
          categoria: item.idcategoria,
          name: item.categoria,
          link: item.link,
          photo: arrayContenidoFoto[i],
          tooltip: item.desc,
        });
      });
      setResult(newResult);
    } 

    sessionStorage.getItem("user") === null
      ? setRutatmp("usuarios/invitado")
      : setRutatmp(`usuarios/${sessionStorage.getItem("user")}`);
    sessionStorage.getItem("user") === null
      ? setDesctmp("invitado")
      : setDesctmp(`${sessionStorage.getItem("usernombre")}`);
    setInicia(false);
    setShow(false);
  } 

  const onModalClose = () => 
  {
    if(sessionStorage.getItem("ubicacion-provincia")!==null){
    setShow1(false)
    }
    //document.getElementById("password").focus();
  }

  async function handleselect(e) {
    let ttmunicipio=[];
    switch (e.target.id) {
      case "provincia":
        setProvincia(Number(e.target.value));
        ttmunicipio=arraymunicipios.filter((item,i)=>{if (item.provincia === Number(e.target.value)){return item}});
        setTmunicipios(ttmunicipio);
        if (ttmunicipio.length === 0){
          setTmunicipios(arraydesconocido);
          ttmunicipio=arraydesconocido;
        }
       setMunicipio(0);
       break
      case "municipio":
        setMunicipio(Number(e.target.value));
        break

      }
  }

  async function confirmar(){
    await setconfig({provincia, municipio});
    
    setShow1(false);
  }

  const arrayOfCards = useMemo(() => {
    const resultOfCards = [];
    result.forEach((prop, i) =>
      resultOfCards.push(
        <CardMultipleSlider
          key={i}
          link={prop.link}
          titulo={prop.name}
          categoria={prop.categoria}
          imagen={prop.photo}
          descripcion={name}
          rutatmp={rutatmp}
          desctmp={desctmp}
          nivel={nivel}
        />
      )
    );
    return resultOfCards;
  }, [result]);

  function poneModal(){
    setShow1(!show1);
  }
    
  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location]);

  useEffect(() => {
    init();
  }, []);

  return (
    <>
    <Modal visible={show1} onClose={onModalClose} className="cmodal-home" classContainer="modal-catprod">
      <div className="cerrar-button">
        <button className="cerrar" onClick={onModalClose}>X</button>
      </div>

      <div className="main-modal">
         <p className="strong font-size1">Ubicación
         </p>
         <div className="modal-provincia">
           <label>Provincia:</label>
           <select  className="select-home-prov-munic"  id="provincia" onChange={handleselect} value={provincia}>
              {arrayprovincias.map((item, i) => {
              return <option key={i} value={item.provincia} >{item.desc}</option>
            })}
           </select>
         </div>
         <div className="modal-municipio">
           <label>Municipio:</label>
           <select className="select-home-prov-munic" id="municipio" onChange={handleselect} value={municipio}>
               {tmunicipios.map((item, i) => {
               return <option key={i} value={item.municipio} >{item.desc}</option>
            })}
            </select>
         </div>
         <div className="grupo-button-modal-home">
                   
               <button type="button" className="producto-button primary " onClick={confirmar}>
                 <Check />
              </button>
              <button type="button" className="producto-button primary" onClick={onModalClose}>
                 <Close />
              </button>
            </div>                 


      </div>
    </Modal>

      <div>
        <Navbar nivel={0} showModal={poneModal} />
        <Hero>
          <div className="cabeza">
            {nivel === 0 ? (
              ""
            ) : (
              <>
                <IconButton
                  color="primary"
                  onClick={() => {
                    navigate(
                      `/?naturaleza=${sessionStorage.getItem(
                        "naturaleza"
                      )}&owner=${sessionStorage.getItem(
                        "idowner"
                      )}&nivel=${sessionStorage.getItem("nivel")}`
                    );
                  }}
                >
                  <ArrowBack className="flecha"/>
                </IconButton>
                <h3 className="acercade-title">Atrás</h3>
              </>
            )}
          </div>

          {show ? (
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
          ) : null}
          {inicia === false ? (
            <>
              <BigSlider imgs={imgs} categorias={categorys} users={users} nombres={nombres}/>
              <div className="main-grid negative-margin">
                <div className="grid-letf"></div>
                <div className="gradient-background"></div>
                <MultipleSlider imgs={arrayOfCards} />
                <div className="grid-rigth"></div>
              </div>
            </>
          ) : (
            ""
          )}
        </Hero>
      </div>
    </>
  );
};


export default Home;


