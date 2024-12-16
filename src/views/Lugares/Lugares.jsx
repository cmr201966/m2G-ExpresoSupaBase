import { useLocation } from "react-router-dom";

// components
import Navbar from "../../components/Navbar/Navbar"
import CardIdentificalo from "../../components/CardIdentificalo/CardIdentificalo";
import { useNavigate } from "react-router-dom";

// styles
import "./styles.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Hero from "../../layouts/Hero/Hero"
// @mui/material
import { IconButton } from "@mui/material"
import ArrowBack from "@mui/icons-material/ArrowBack";

const Identificalo = () => {
 
    const navigate = useNavigate();
    const location = useLocation();
    const parsedParams = {}
    const [result, setResult] = useState([]);
    const [categoria, setCategoria] = useState(0);
    const [trespuesta, setTrespuesta] = useState([]);
    const [puntos, setPuntos] = useState(0);
    const [score, setScore] = useState(0);
    const [nombre, setNombre] = useState("");
    const [contenidofotos, setContenidoFotos] = useState([]);
    const [respuestas, setRespuestas] = useState(1);
    //
    async function init() 
    {
        sessionStorage.setItem("filtro", "")
        sessionStorage.setItem("lnaturaleza", parsedParams.naturaleza);
        sessionStorage.setItem("lidowner", parsedParams.idowner);
        sessionStorage.setItem("lnivel", parsedParams.nivel);
        sessionStorage.setItem("idApp", parsedParams.campo1);
        setNombre(parsedParams.nombre.replaceAll("%20"," ").replaceAll("%C3%B3","ó"));
        const resultscore = await axios.post(
            "http://localhost:3001/getscore",
            { user: "cmr", idapp: sessionStorage.getItem("idApp")},
//                { user: sessionStorage.getItem("user") , idApp: item.idApp, cantidad: ptos },
            {}
            );
         if(!resultscore.data.error && resultscore.data.length>0)
         {
            setScore(resultscore.data[0].score);
         }
        const resultjuegoitems = await axios.post(
            "http://localhost:3001/getidentificaimagen",
            { idjuego: Number(parsedParams.campo1) },
            {}
        );
        console.log(resultjuegoitems.data);
        setTrespuesta(["","","","",""]);
        const a = trespuesta;
        const newResult = [];
        contenidofotos.splice(0,contenidofotos.length);
        if (resultjuegoitems.data.error)
        {
            const resultado = await axios.post(
                "http://localhost:3001/getjpg-file",                
                { file: "./galerias/app_images/destodo/logo.jpg" },
                {}
              );
            contenidofotos.push(resultado.data);
            newResult.push({ respuesta1: resultjuegoitems.data.error, respuesta2: "", respuesta3: "", respuesta4: "", respuesta5: "", photo: contenidofotos[0] })
            setResult(newResult);
        }
        else
        {
            let ficherojpg=[];
            for(let w=0;w<resultjuegoitems.data.length;w+=1)
            {
              const resultado = await axios.post(
                "http://localhost:3001/getjpg-file",
                { file: "./galerias/app_images/entretenimiento/" +  resultjuegoitems.data[w].idcategoria1 +"/" + resultjuegoitems.data[w].idcategoria2 + "/" + resultjuegoitems.data[w].idcategoria3  + "/" + resultjuegoitems.data[w].idjuego + "/" + resultjuegoitems.data[w].id + ".jpg" },
                {}
              );
              contenidofotos.push(resultado.data);
              ficherojpg[w]="./galerias/app_images/entretenimiento/" +  resultjuegoitems.data[w].idcategoria1 +"/" + resultjuegoitems.data[w].idcategoria2 + "/" + resultjuegoitems.data[w].idcategoria3  + "/" + resultjuegoitems.data[w].idjuego + "/" + resultjuegoitems.data[w].id + ".jpg";
            }
            resultjuegoitems.data.forEach((item, i) => {
                let juegositems=[...resultjuegoitems.data];
                for (let k=0;k<=4;k+=1)
                {
                   a[k]=item.Lugar;
                }
                let ok = Math.floor(Math.random() * (5 - 0) + 0);
                juegositems.splice(i,1);
                let j=0;
                for (let k=0;k<=3;k+=1)
                {
                    j=Math.floor(Math.random() * (juegositems.length - 0) + 0);
                    if (k<ok) 
                       a[k]=juegositems[j].Lugar
                    else
                       a[k+1]=juegositems[j].Lugar;
                    juegositems.splice(j,1);
                }
//                newResult.push({ respuesta1: trespuesta[0], respuesta2: trespuesta[1], respuesta3: trespuesta[2] , respuesta4: trespuesta[3], respuesta5: trespuesta[4], photo: contenidofotos[i], answer: item.Lugar  });
                newResult.push({ respuesta1: trespuesta[0], respuesta2: trespuesta[1], respuesta3: trespuesta[2] , respuesta4: trespuesta[3], respuesta5: trespuesta[4], photo: ficherojpg[i], answer: item.Lugar, idApp:sessionStorage.getItem("idApp"), info: item.info  });
            })
            console.log(trespuesta);
            setResult(newResult);
        } 
    }
 
    useEffect(() => {
        const localParams = location.search.substring(1).split("&");
        localParams.forEach((item, i) => { const [paramName, paramValue] = item.split("="); parsedParams[paramName] = paramValue });
      }, [location])

      useEffect(() => {
        init()
    }, [])

    return (

        <div>
            <Navbar
                links={[
                    { label: "Inicio", to: "/",tooltips: "Ir a la página principal" },
                    { label: sessionStorage.getItem("user") === null ? "Iniciar sesión" : "Cerrar sesión", to: sessionStorage.getItem("user") === null ? "/login" : "/cerrarsesion", tooltips: sessionStorage.getItem("user") === null ? "Abrir sesión" : "/Cerrar la sesión de " + sessionStorage.getItem("usernombre") },
                    { label: "Registrarse", to: "/registrarse?inserta=true", tooltips: "Crear una cuenta de usuario" },
                    { label: "Acerca de", to: "/Acercade", tooltips: "Acerca de Destodo.cu" },
                          ]} 
            />
            <Hero>
                <div className="cabeza1">
                  <IconButton color="primary" onClick={() => {
                     navigate(`/?naturaleza=${sessionStorage.getItem("lnaturaleza")}&idowner=${sessionStorage.getItem("lidowner")}&nivel=${sessionStorage.getItem("lnivel")}`);
                     }}>
                  <ArrowBack />
                  </IconButton>
                <h2 className="h1-cabeza">Destodo.cu</h2>
                <h5 className="h3-1-cabeza-lugares" > - {nombre}</h5>
                <h5 className="h3-2-cabeza-lugares"> - Puntos: ({score}/{puntos})</h5>
                </div>
                {<div className="card-container scroll">
                    {result.map((item, i) => (
                        <CardIdentificalo index={i} key={i} item={item} mal={() => {puntos > 0 ? setPuntos(puntos - 1): setPuntos(0);setRespuestas(respuestas+1)}} bien={() => {setPuntos(puntos + 2);setRespuestas(respuestas+1)}} categoria = {categoria} respuestas={respuestas} puntos={puntos} />
//                        <CardIdentificalo index={i} key={i} item={item} mal={() => {puntos > 0 ? puntos=puntos - 1:puntos=0;setRespuestas(respuestas+1)}} bien={() => {puntos=puntos + 2;setRespuestas(respuestas+1)}} categoria = {categoria} respuestas={respuestas} puntos={puntos} />
                    ))}
                </div>}
            </Hero>
        </div>
    );
};

export default Identificalo;
