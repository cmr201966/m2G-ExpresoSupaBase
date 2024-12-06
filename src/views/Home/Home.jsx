{
  /*QRCode value="TRANSFERMOVIL_ETECSA, TRANSFERENCIA,9224069991525391,56174215" />
  <QRCode value="https://expreso-cb7f2.web.app/" />*/
}
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// @mui/material
import { IconButton, Box, CircularProgress } from "@mui/material";
// @mui/icons
import { ArrowBack } from "@mui/icons-material";

// components
import Navbar from "../../components/Navbar/Navbar";
//import QRCode from "react-qr-code";
import BigSlider from "../../components/BigSlider/BigSlider";
import MultipleSlider from "../../components/MultipleSlider/MultipleSlider";
import CardMultipleSlider from "../../components/CardMultipleSlider/CardMultipleSlider";

// layouts
import Hero from "../../layouts/Hero/Hero";

// utils
import {
  isValid,
  creaBucket,
  borraSessionStorage,
  getJpgFileSB,
} from "../../Utiles/Utiles";
import {
  getanunciosCM, getcategoriasnewCM, 
} from "../../Utiles/apiBaseDatos";

// contexts
import { useNotification } from "../../context/NotificationProvider";

// styles
import "./styles.css";

const Home = () => {
  const navigate = useNavigate();
  const { setOpen, setMessage } = useNotification();
  const location = useLocation();
  const parsedParams = {};
  const [result, setResult] = useState([]);
  const [inicia, setInicia] = useState(true);
  const [nivel, setNivel] = useState(0);
  const [desctmp, setDesctmp] = useState("");
  const [rutatmp, setRutatmp] = useState("");
  const [show, setShow] = useState(false);
  const [imgsFileName, setImgsFileName] = useState([]);
  const [imgsFolder, setImgsFolder] = useState([]);
  const [imgsId, setImgsId] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [users, setUsers] = useState([]);
  const [nombres, setNombres] = useState([]);
  const [links, setLinks] = useState([]);
  const screenWidth = window.innerWidth;

  async function init() {
    setInicia(true);
    setShow(true);
    if (isValid(parsedParams.categoria) && parsedParams.categoria!==""){
      navigate(`/productos?categoria=${parsedParams.categoria}`);
    }
    sessionStorage.setItem("deDonde", "Home")
    if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "SUPABASE") creaBucket("galerias");
    borraSessionStorage(["categoria",]);
    const newResult = [];
    if (
      parsedParams.nivel === undefined ||
      parsedParams.idowner === undefined ||
      parsedParams.nivel === "0"
    ) {
      setNivel(0);
      let resultApp = await getanunciosCM();
//      let resultApp = await apiBaseDatos("anuncios");
      let imgsFileName1 = [];
      let imgsFolder1 = [];
      let imgsId1 = [];
      let category1 = [];
      let users1 = [];
      let nombres1 = [];
      let links1 = [];
      let ruta =
        sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL"
          ? "./galerias/app_images/aplicaciones"
          : "aplicaciones";
      resultApp.forEach((item) => {
        let pcMovil=screenWidth<=400?"-movil":"";
        imgsFileName1.push(item.id + pcMovil + ".jpg");
        imgsFolder1.push(ruta + "/" + item.id);
        imgsId1.push(item.idsb);
        category1.push(item.idcategoria);
        users1.push(item.iduser);
        nombres1.push(item.desc);
        links1.push(item.link);
      });
      setImgsFileName(imgsFileName1);
      setImgsFolder(imgsFolder1);
      setImgsId(imgsId1)
      setCategorys(category1);
      setUsers(users1);
      setNombres(nombres1);
      setLinks(links1);
      let result = await getcategoriasnewCM(true);
//      let result = await apiBaseDatos("getcategoriasnew");
      let longitug = isValid(result) === true ? result.length : 0;
      let arrayContenidoFoto = [];
      let resultado = [];
      for (let i = 0; i < longitug; i += 1) {
        resultado = await getJpgFileSB(
          result[i].idcategoria + ".jpg",
          "./galerias/app_images/categorias_de_negocios/" +
            result[i].idcategoria,
          "categorias_de_negocios/" + result[i].idcategoria, result[i].idsb
        );
        if (
          isValid(resultado) === true &&
          resultado !== "" &&
          isValid(resultado.length) === true
        )
          arrayContenidoFoto.push(resultado);
        else {
          setMessage("Error al recuperar la imagen del usuario");
          setOpen(true);
        }
      }
      if (longitug !== 0) {
         if (sessionStorage.getItem("sgbd").toLocaleUpperCase() !== "MYSQL")
            result.forEach((item, i) => {
              newResult.push({
                 categoria: item.idcategoria,
                 name: item.nick,
                 link: item.link,
                 photo: arrayContenidoFoto[i],
                 tooltip: item.categoria,});
            })
            else
            result.forEach((item, i) => {
              newResult.push({
                 categoria: item.idcategoria,
                 name: item.nick,
                 link: item.link,
                 photo: arrayContenidoFoto[i],
                 tooltip: item.categoria,});
            })
        setResult(newResult);
      }
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
          descripcion={prop.tooltip}
          rutatmp={rutatmp}
          desctmp={desctmp}
          nivel={nivel}
        />
      )
    );
    return resultOfCards;
  }, [result]);

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
    <div>
      <Navbar nivel={0} />
      <Hero>
      <div className="grip-flecha">
        <div></div>
        <div className="encabezado">
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
                <ArrowBack className="color-flecha" />
              </IconButton>
              <h3 className="color-encabezado">Atrás</h3>
            </>
          )}
        </div>
        <div></div>
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
            <BigSlider
              imgsFolder={imgsFolder}
              imgsFileName={imgsFileName}
              imgsId={imgsId}
              categorias={categorys}
              users={users}
              nombres={nombres}
              links={links}
            />
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
  );
};

export default Home;
