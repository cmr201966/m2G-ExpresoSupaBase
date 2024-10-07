{
  /*QRCode value="TRANSFERMOVIL_ETECSA, TRANSFERENCIA,9224069991525391,56174215" />*/
}
import Navbar from "../../components/Navbar/Navbar";
//import Grid from "../../components/Grid/Grid";
import { useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Box, CircularProgress } from "@mui/material";
//import QRCode from "react-qr-code";
import BigSlider from "../../components/BigSlider/BigSlider";
import MultipleSlider from "../../components/MultipleSlider/MultipleSlider";
import CardMultipleSlider from "../../components/CardMultipleSlider/CardMultipleSlider";
//import Tippy from "@tippyjs/react";
import { useNavigate } from "react-router-dom";

// layouts
import Hero from "../../layouts/Hero/Hero";

//
//import { Link } from "react-router-dom";

// styles
import "./styles.css";
import { useEffect, useMemo, useState } from "react";
//import { getapps, getsubapps } from "../../servicios/home";
import { getCategoriasNew } from "../../servicios/home";
import { getAplicaciones } from "../../servicios/aplicaciones";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedParams = {};
  const [result, setResult] = useState([]);
  const [inicia, setInicia] = useState(true);
  const [opcion, setOpcion] = useState("");
  const [nivel, setNivel] = useState(0);
  const [desctmp, setDesctmp] = useState("");
  const [rutatmp, setRutatmp] = useState("");
  const [show, setShow] = useState(false);
  const [imgs, setImgs] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [users, setUsers] = useState([]);
  const [nombres, setNombres] = useState([]);
  
  async function init() {
    setInicia(true);
    let result1;
    setShow(true);
    setOpcion("");
    sessionStorage.removeItem("categoria");
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
      result1.forEach((item) => {
        newResult.push({
          categoria: item.idcategoria,
          name: item.categoria,
          link: item.link,
          photo:
            "http://localhost:3001/app_images/categorias_de_negocios/" +
            item.idcategoria +
            "/" +
            item.idcategoria +
            ".jpeg",
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
  } // init


  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item, i) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location]);

  useEffect(() => {
    init();
  }, []);

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

  return (
    <>
      <div>
        <Navbar nivel={0} />

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
                  <ArrowBack />
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


