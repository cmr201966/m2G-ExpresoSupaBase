import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// @mui/material
import { IconButton, Box, CircularProgress } from "@mui/material";
// @mui/icons
import { ArrowBack } from "@mui/icons-material";

// components
import Navbar from "../../components/Navbar/Navbar";
import BigSlider from "../../components/BigSlider/BigSlider";
import MultipleSlider from "../../components/MultipleSlider/MultipleSlider";
import CardMultipleSlider from "../../components/CardMultipleSlider/CardMultipleSlider";
import Footer from "../../components/Footer/Footer"; // 🔹 Importamos el footer

// layouts
import Hero from "../../layouts/Hero/Hero";

// utils
import { isValid, creaBucket, borraSessionStorage, getJpgFileSB } from "../../Utiles/Utiles";
import { getanunciosCM, getcategoriasnewCM, setVisitas } from "../../Utiles/apiBaseDatos";

// context
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

    sessionStorage.setItem("directo", "1");
    sessionStorage.setItem("deDonde", "Home");

    if (sessionStorage.getItem("sgbd")?.toLocaleUpperCase() === "SUPABASE")
      creaBucket("galerias");

    borraSessionStorage(["categoria"]);

    // 🔹 Mostrar carrusel para todos
    setNivel(0);
    await setVisitas();

    // BigSlider
    let resultApp = await getanunciosCM("0");
    if (resultApp === null) resultApp = [];

    let imgsFileName1 = [];
    let imgsFolder1 = [];
    let imgsId1 = [];
    let category1 = [];
    let users1 = [];
    let nombres1 = [];
    let links1 = [];

    let ruta =
      sessionStorage.getItem("sgbd")?.toLocaleUpperCase() === "MYSQL"
        ? "./galerias/app_images/aplicaciones"
        : "aplicaciones/home";

    resultApp.forEach((item) => {
      let pcMovil = screenWidth <= 600 ? "-movil" : "";
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
    setImgsId(imgsId1);
    setCategorys(category1);
    setUsers(users1);
    setNombres(nombres1);
    setLinks(links1);

    // MultipleSlider
    let categoriesResult = await getcategoriasnewCM(true);
    let arrayContenidoFoto = [];

    if (isValid(categoriesResult)) {
      for (let i = 0; i < categoriesResult.length; i++) {
        let foto = await getJpgFileSB(
          categoriesResult[i].idcategoria + ".jpg",
          "./galerias/app_images/categorias_de_negocios/" + categoriesResult[i].idcategoria,
          "categorias_de_negocios/" + categoriesResult[i].idcategoria,
          categoriesResult[i].idsb
        );
        arrayContenidoFoto.push(foto || "");
      }

      const newResult = categoriesResult.map((item, i) => ({
        categoria: item.idcategoria,
        name: item.nick,
        link: item.link,
        photo: arrayContenidoFoto[i],
        tooltip: item.categoria,
      }));

      setResult(newResult);
    }

    // Detecta invitado o usuario
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
    return result.map((prop, i) => (
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
    ));
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
      <Hero clase={"hero-section"}>
        <div className="grip-flecha">
          <div></div>
          <div className="encabezado">
            {nivel !== 0 && (
              <>
                <IconButton
                  color="primary"
                  onClick={() => {
                    navigate(
                      `/?naturaleza=${sessionStorage.getItem("naturaleza")}&owner=${sessionStorage.getItem(
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

        {show && (
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
        )}

        {!inicia && (
          <>
            <BigSlider
              imgsFolder={imgsFolder}
              imgsFileName={imgsFileName}
              imgsId={imgsId}
              categorias={categorys}
              users={users}
              nombres={nombres}
              links={links}
              sizeClass="grande"
            />

            <div className="main-grid negative-margin">
              <div className="grid-letf"></div>
              <div className="gradient-background"></div>
              <MultipleSlider imgs={arrayOfCards} />
              <div className="grid-rigth"></div>
            </div>
          </>
        )}
      </Hero>
      <Footer /> {/* 🔹 Agregado aquí */}
    </div>
  );
};

export default Home;
