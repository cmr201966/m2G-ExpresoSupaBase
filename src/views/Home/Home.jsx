import Navbar from "../../components/Navbar/Navbar";
import Grid from "../../components/Grid/Grid";
import { useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Box, CircularProgress } from "@mui/material";
import { useFilter } from "../../context/FilterProvider";
import QRCode from "react-qr-code";
import BigSlider from "../../components/BigSlider/BigSlider";
import MultipleSlider from "../../components/MultipleSlider/MultipleSlider";
import CardMultipleSlider from "../../components/CardMultipleSlider/CardMultipleSlider";
import Tippy from "@tippyjs/react";

// layouts
import Hero from "../../layouts/Hero/Hero";

//
import { Link } from "react-router-dom";

// styles
import "./styles.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getapps, getsubapps } from "../../servicios/home";

const Home = () => {
  const { filterState, setFilterState } = useFilter();
  const location = useLocation();
  const parsedParams = {};
  const [result, setResult] = useState([]);
  const [naturaleza, setNaturaleza] = useState(0);
  const [inicia, setInicia] = useState(true);
  const [opcion, setOpcion] = useState("");
  const [nivel, setNivel] = useState(0);
  const [owner, setOwner] = useState(0);
  const [desctmp, setDesctmp] = useState("");
  const [rutatmp, setRutatmp] = useState("");
  const [ayuda, setAyuda] = useState();
  const [show, setShow] = useState(false);

  async function init() {
    let result1;
    setShow(true);
    sessionStorage.setItem("pnaturaleza", "");
    sessionStorage.setItem("pdesc", "");
    sessionStorage.setItem("pcondicion", "");
    sessionStorage.setItem("ptipo", "");
    sessionStorage.setItem("pnohay", "");
    sessionStorage.setItem("filtro", "Ubicación");
    sessionStorage.removeItem("filtro_productos");
    sessionStorage.setItem("condicion_filter", "");
    setFilterState({ type: "set", newvalue: false });
    setOpcion("");
    let tayuda =
      sessionStorage.getItem("usernombre") === null
        ? "Invitado"
        : sessionStorage.getItem("usernombre");
    const newResult = [];
    if (
      parsedParams.nivel === undefined ||
      parsedParams.idowner === undefined ||
      parsedParams.nivel === "0"
    ) {
      setNivel(0);

      let result = await getapps({
        login: sessionStorage.getItem("user") === null ? false : true,
        user:
          sessionStorage.getItem("user") === null
            ? ""
            : sessionStorage.getItem("user"),
      });
      result1 = await result.json();

      result1.forEach((item, i) => {
        let ttooltip = item.tooltip;
        if (item.tooltip === "Galerias") ttooltip = ttooltip + " de " + tayuda;
        newResult.push({
          naturaleza: item.idnaturaleza,
          name: item.idapp,
          link: item.link,
          photo:
            "http://localhost:3001/app_images/aplicaciones/" +
            item.id +
            "/" +
            item.id +
            ".jpg",
          tooltip: ttooltip,
          condicion: "",
          owner: item.id,
          campo1: item.campo1,
          nohay: item.nohay,
          naturalezas: item.naturalezas,
        });
      });
      setResult(newResult);
    } else {
      setNivel(parsedParams.nivel);
      cambiamenu(
        parsedParams.naturaleza,
        parsedParams.idowner,
        parsedParams.nivel
      );
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

  async function cambiamenu(naturaleza, owner, nivel) {
    let result1;
    const newResult = [];
    sessionStorage.setItem("pnaturaleza", "");
    sessionStorage.setItem("pdesc", "");
    sessionStorage.setItem("pcondicion", "");
    sessionStorage.setItem("ptipo", "");
    sessionStorage.setItem("pnohay", "");

    let result = await getsubapps({
      naturaleza,
      nivel,
      owner,
      user: sessionStorage.getItem("user"),
    });
    result1 = await result.json();

    if (!result1.error) {
      result1.forEach((item, i) => {
        let ttooltip = item.tooltip;
        if (item.tooltip === "Galerias") ttooltip = ttooltip + " de " + ayuda;
        newResult.push({
          naturaleza: item.idnaturaleza,
          name: item.idapp,
          link: item.link,
          photo:
            "http://localhost:3001/app_images/aplicaciones/" +
            item.idowner +
            "/" +
            item.id +
            ".jpg",
          tooltip: ttooltip,
          condicion: "",
          owner: item.id,
          campo1: item.campo1,
          idowner: item.idowner,
          nohay: item.nohay,
          naturalezas: item.naturalezas,
        });
      });
    } else {
      newResult.push({
        naturaleza: "",
        name: "No hay Aplicaciones",
        link: "/",
        photo: "http://localhost:3001/app_images/destodo/destodo.jpg",
        tooltip: "",
        condicion: "",
        owner: "",
        campo1: "",
        idowner: "",
        nohay: "",
        naturalezas: "",
      });
    }

    setResult(newResult);
  }

  function handleInput(e) {
    switch (e.target.id) {
      default:
        break;
    }
  }

  function atras() {
    setNivel(nivel - 1);
  }

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
          titulo={prop.name}
          imagen={"http://192.168.1.106:3001/app_images/moto5.jpeg"}
          descripcion={prop.tooltip}
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
              <IconButton
                color="primary"
                onClick={() => {
                  setNivel(nivel - 1);
                  if (nivel - 1 > 0) {
                    cambiamenu(naturaleza, owner, nivel - 1);
                  } else {
                    init();
                  }
                }}
              >
                <ArrowBack />
              </IconButton>
            )}
            {/*QRCode value="TRANSFERMOVIL_ETECSA, TRANSFERENCIA,9224069991525391,56174215" />*/}
            <h4 className="h3-1-cabeza-home">{opcion}</h4>
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
          <BigSlider
            imgs={[
              "http://192.168.1.106:3001/app_images/taxi1.jpeg",
              "http://192.168.1.106:3001/app_images/taxi1.jpeg",
              "http://192.168.1.106:3001/app_images/taxi1.jpeg",
            ]}
          />
          <div className="main-grid negative-margin">
            <div className="grid-letf"></div>
             <MultipleSlider  imgs={arrayOfCards}/> 
            <div className="grid-rigth"></div>
          </div>
        </Hero>
      </div>
    </>
  );
};

{
  /*
            <Grid>
              {result.map((item, i) => (
                <Link
                  className="link-image"
                  style={{
                    backgroundImage: `url('${item.photo}')`,
                    textDecoration: "none",
                  }}
                  key={i}
                  onClick={
                    item.link === "submenu"
                      ? (e) => {
                          e.preventDefault();
                          setOpcion(item.name);
                          setNivel(nivel + 1);
                          setNaturaleza(item.naturaleza);
                          setOwner(item.idowner);
                          //setSubmenu(true);
                          cambiamenu(item.naturaleza, item.owner, nivel + 1);
                        }
                      : () => {}
                  }
                  to={`/${item.link}?naturaleza=${item.naturaleza}&nombre=${item.name}&condicion=${item.condicion}&campo1=${item.campo1}&owner=${item.owner}&idowner=${item.idowner
                  }&rutatmp=${rutatmp}&desctmp=${desctmp}&nohay=${item.nohay}&naturalezas=${item.naturalezas}&nivel=${nivel}&deQuien=${sessionStorage.getItem("user") === null
                      ? "Invitado": sessionStorage.getItem("usernombre")}`}
                  >
                  <Tippy content={item.tooltip}>
                    <div>
                      <span className="link-image-span">{item.name}</span>
                    </div>
                  </Tippy>
                </Link>
              ))}
            </Grid>

  */
}

export default Home;
