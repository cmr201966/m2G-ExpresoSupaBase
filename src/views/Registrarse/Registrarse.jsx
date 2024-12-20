import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Tippy from "@tippyjs/react";

// components
import Map from "../../components/Map/MapBox";
import Navbar from "../../components/Navbar/Navbar";
import Encabezado from "../../components/Encabezado/Encabezado";
import ComGalerias from "../../components/ComGalerias/ComGalerias";

// Iconos
import { Box, CircularProgress } from "@mui/material";
import {
  Collections,
  Check,
  Close,
  AddPhotoAlternate,
  Visibility,
  PlaceOutlined,
} from "@mui/icons-material";

// contexts
import { useNotification } from "../../context/NotificationProvider";

// layouts
import Hero from "../../layouts/Hero/Hero";

// utils
import {
  isValid,
  getJpgFileSB,
  buscarEnArreglo,
  buscarEnArregloString,
} from "../../Utiles/Utiles";
import {
  getProvinciasCM,
  getMunicipiosCM,
  getdatosuserCM,
  setregistrarseCM,
  getUsuariosCM,
} from "../../Utiles/apiBaseDatos";

// styles
import "./styles.css";

const Registrarse = () => {
  const location = useLocation();
  const parsedParams = {};
  const [loading, setLoading] = useState(false);
  const [showGalerias, setShowGalerias] = useState(false);
  const { setOpen, setMessage } = useNotification();
  const [user, setUser] = useState("");
  const [idsb, setIdsb] = useState("");
  const [nophoto, setNophoto] = useState("");
  const [password, setPassword] = useState("");
  const [rpassword, setRpassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [foto] = useState();
  const [nombrefoto, setNombrefoto] = useState("");
  const [contenidofoto, setContenidofoto] = useState();
  const [desc, setDesc] = useState("");
  const [provincia, setProvincia] = useState(13);
  const [municipio, setMunicipio] = useState(5);
  const arraydesconocido = [
    { provincia: 99, municipio: 99, desc: "Desconocido" },
  ];
  const arrayplan = [
    { plan: 0, desc: "Gratis", tip: "(Comprar y reservar)" },
    { plan: 1, desc: "Estandar", tip: "Negocio estandar" },
    { plan: 2, desc: "Premiun", tip: "Negocio Plus" },
    { plan: 3, desc: "Administrador", tip: "Administrador" },
  ];
  const [plan, setPlan] = useState(0);
  const [arrayprovincias, setArrayprovincias] = useState([]);
  const [arraymunicipios, setArraymunicipios] = useState([]);
  const [tmunicipios, setTmunicipios] = useState([]);
  const [show1, setShow1] = useState(true);
  const [cbvista, setCbvista] = useState(false);
  const [editarUser, setEditarUser] = useState(false);
  const [resultado, setResultado] = useState("");
  const [resultadopw] = useState("");
  const [inicia, setInicia] = useState(true);
  const [modifica, setModifica] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [zoom] = useState(15.5);
  const [isBase64ToBlob, setIsBase64ToBlob] = useState(true);
  const [arrayUsuarios, setArrayUsuarios] = useState([]);
  const arrayNoUsuarios = [{ iduser: 99999999, desc: "Desconocido" }];
  const [usuario, setUsuario] = useState("");
  const [datos, setDatos] = useState("");
  const [otrosDatos, setOtrosDatos] = useState("");

  // Otros estados
  const navigate = useNavigate();

  async function init() {
    setShow1(true);
    setInicia(true);
    setNombrefoto("");
    setResultado(arrayplan[0].tip);
    setModifica(!(parsedParams.inserta === "true"));

    let ttprovincias = [];
    let resultprovincia = await getProvinciasCM();
    //    let resultprovincia = await apiBaseDatos("provincias")

    if (resultprovincia === undefined) {
      setArrayprovincias(arraydesconocido);
      ttprovincias = arraydesconocido;
    } else {
      setArrayprovincias(resultprovincia);
      ttprovincias = resultprovincia;
    }
    setProvincia(ttprovincias[0].provincia);
    let ttmunicipios = [];
    let resultmunicipio = await getMunicipiosCM();
    //    let resultmunicipio = await apiBaseDatos("municipios");
    if (resultmunicipio === true) {
      setArraymunicipios(arraydesconocido);
      setTmunicipios(arraydesconocido);
      ttmunicipios = arraydesconocido;
    } else {
      setArraymunicipios(resultmunicipio);
      if (
        isValid(sessionStorage.getItem("user")) === false &&
        isValid(sessionStorage.getItem("userprovincia")) === false
      ) {
        ttmunicipios = resultmunicipio.filter((item) => {
          if (item.provincia === ttprovincias[0].provincia) {
            return item;
          }
        });
      } else {
        ttmunicipios = resultmunicipio.filter((item) => {
          if (
            item.provincia ===
            ttprovincias[sessionStorage.getItem("userprovincia") - 1].provincia
          ) {
            return item;
          }
        });
      }
    }
    if (ttmunicipios.length !== 0) setTmunicipios(ttmunicipios);
    else {
      setTmunicipios(arraydesconocido);
      ttmunicipios = arraydesconocido;
    }
    setMunicipio(ttmunicipios[0].municipio);
    setEditarUser(false);
    if (
      isValid(sessionStorage.getItem("user")) === true &&
      parsedParams.where === "false" &&
      parsedParams.inserta === "false"
    ) {
      let result = await getdatosuserCM(sessionStorage.getItem("user"));
      //      let result = await apiBaseDatos("getdatosuser", sessionStorage.getItem("user"));
      setUser(result[0].iduser);
      setPassword(result[0].pw);
      setNombre(result[0].nombre);
      setPlan(result[0].tipouser);
      setCelular(result[0].celular);
      setNophoto(result[0].nophoto);
      setDatos(result[0].datos);
      setOtrosDatos(result[0].otrosdatos);
      setProvincia(result[0].provincia);
      setMunicipio(result[0].municipio);
      setLat(
        isValid(result[0].latitud) === true && result[0].latitud !== 0
          ? result[0].latitud
          : ttmunicipios[
              buscarEnArreglo(ttmunicipios, result[0].municipio, "municipio")
            ].latitud
      );
      setLng(
        isValid(result[0].longitud) === true && result[0].longitud !== 0
          ? result[0].longitud
          : ttmunicipios[
              buscarEnArreglo(ttmunicipios, result[0].municipio, "municipio")
            ].longitud
      );
      setIdsb(result[0].idsb);
      setIsBase64ToBlob(true);
      let resultado = await getJpgFileSB(
        result[0].iduser + ".jpg",
        "./galerias/app_images/usuarios/" + result[0].iduser,
        "usuarios/" + result[0].iduser,
        result[0].idsb
      );
      if (resultado !== undefined && resultado !== null) {
        setContenidofoto(resultado);
        setNombrefoto(result[0].iduser);
      } else {
        setIsBase64ToBlob(false);
        setNombrefoto("");
        setNombre("");
        setDatos("");
        setOtrosDatos("");
        setMessage("Error al recuperar la imagen del usuario");
        setOpen(true);
      }
    }

    if (parsedParams.inserta === "true" && parsedParams.where === "true") {
      provinciachange(14, 6, resultprovincia, resultmunicipio);
      setLat(
        ttmunicipios[buscarEnArreglo(ttmunicipios, 6, "municipio")].latitud
      );
      setLng(
        ttmunicipios[buscarEnArreglo(ttmunicipios, 6, "municipio")].longitud
      );
    }
    if (parsedParams.inserta === "false" && parsedParams.where === "true") {
      /* Traer usuarios y poner select con ellos*/
      /*Poner los datos del primer user y en handleselect poner el que cojan*/
      setEditarUser(true);
      let resultusuarios = await getUsuariosCM(true);
      //    let resultusuarios = await apiBaseDatos("getUsuarios");
      if (isValid(resultusuarios) === false || resultusuarios.length === 0)
        setArrayUsuarios(arrayNoUsuarios);
      else {
        setArrayUsuarios(resultusuarios);
        setUser(resultusuarios[0].iduser);
        setPassword(resultusuarios[0].pw);
        setNombre(resultusuarios[0].nombre);
        setPlan(resultusuarios[0].tipouser);
        setCelular(resultusuarios[0].celular);
        setNophoto(resultusuarios[0].nophoto);
        setDatos(resultusuarios[0].datos);
        setOtrosDatos(resultusuarios[0].otrosdatos);
        setProvincia(resultusuarios[0].provincia);
        setMunicipio(resultusuarios[0].municipio);
        setLat(
          isValid(resultusuarios[0].latitud) === true &&
            resultusuarios[0].latitud !== 0
            ? resultusuarios[0].latitud
            : ttmunicipios[
                buscarEnArreglo(
                  ttmunicipios,
                  resultusuarios[0].municipio,
                  "municipio"
                )
              ].latitud
        );
        setLng(
          isValid(resultusuarios[0].longitud) === true &&
            resultusuarios[0].longitud !== 0
            ? resultusuarios[0].longitud
            : ttmunicipios[
                buscarEnArreglo(
                  ttmunicipios,
                  resultusuarios[0].municipio,
                  "municipio"
                )
              ].longitud
        );
        setIdsb(resultusuarios[0].idsb);
        setIsBase64ToBlob(true);
        let resultado = await getJpgFileSB(
          resultusuarios[0].iduser + ".jpg",
          "./galerias/app_images/usuarios/" + resultusuarios[0].iduser,
          "usuarios/" + resultusuarios[0].iduser,
          resultusuarios[0].idsb
        );
        if (resultado !== undefined && resultado !== null) {
          setContenidofoto(resultado);
          setNombrefoto(resultusuarios[0].iduser);
        } else {
          setIsBase64ToBlob(false);
          setNombrefoto("");
          setMessage("Error al recuperar la imagen del usuario");
          setOpen(true);
        }
      }
      setUsuario(0);
    }
    setInicia(false);
    setShow1(false);
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
  }, [location]);

  useEffect(() => {
    const inputElement = document.getElementById("user");
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  function provinciachange(cambia, municipio, provinciadata, municipiodata) {
    let ttmunicipio = [];
    setProvincia(cambia);
    ttmunicipio = municipiodata.filter((item) => {
      if (item.provincia === cambia) {
        return item;
      }
    });
    setTmunicipios(ttmunicipio);
    if (ttmunicipio.length === 0) {
      setTmunicipios(arraydesconocido);
      ttmunicipio = arraydesconocido;
    }
    setMunicipio(municipio);
    setUser("");
    setPassword("");
    setRpassword("");
    setNombre("");
    setCelular("");
    setDatos("");
    setOtrosDatos("");
  }
  function tcancelar() {
    navigate("/?nivel=0");
  }

  async function getImage(index) {
    return await getJpgFileSB(
      arrayUsuarios[index].iduser + ".jpg",
      "./galerias/app_images/usuarios/" + arrayUsuarios[index].iduser,
      "usuarios/" + arrayUsuarios[index].iduser,
      arrayUsuarios[index].idsb
    );
  }

  async function handleselect(e) {
    let ttmunicipio = [];
    let index = -1;
    let resultado;
    switch (e.target.id) {
      case "usuario":
        setShowGalerias(false);
        index = buscarEnArregloString(arrayUsuarios, e.target.value, "iduser");
        setUsuario(e.target.valor);
        setUser(arrayUsuarios[index].iduser);
        setPassword(arrayUsuarios[index].pw);
        setNombre(arrayUsuarios[index].nombre);
        setPlan(arrayUsuarios[index].tipouser);
        setCelular(arrayUsuarios[index].celular);
        setNophoto(arrayUsuarios[index].nophoto);
        setDatos(arrayUsuarios[index].datos);
        setOtrosDatos(arrayUsuarios[index].otrosdatos);
        setProvincia(arrayUsuarios[index].provincia);
        setMunicipio(arrayUsuarios[index].municipio);
        setLat(
          isValid(arrayUsuarios[index].latitud) === true &&
            arrayUsuarios[index].latitud !== 0
            ? arrayUsuarios[index].latitud
            : tmunicipios[
                buscarEnArreglo(
                  tmunicipios,
                  arrayUsuarios[index].municipio,
                  "municipio"
                )
              ].latitud
        );
        setLng(
          isValid(arrayUsuarios[index].longitud) === true &&
            arrayUsuarios[index].longitud !== 0
            ? arrayUsuarios[index].longitud
            : tmunicipios[
                buscarEnArreglo(
                  tmunicipios,
                  arrayUsuarios[index].municipio,
                  "municipio"
                )
              ].longitud
        );
        setIdsb(arrayUsuarios[index].idsb);
        setIsBase64ToBlob(true);
        resultado = await getImage(index);
        if (resultado !== undefined && resultado !== null) {
          setContenidofoto(resultado);
          setNombrefoto(arrayUsuarios[index].iduser);
        } else {
          setIsBase64ToBlob(false);
          setNombrefoto("");
          setMessage("Error al recuperar la imagen del usuario");
          setOpen(true);
        }

        break;
      case "provincia":
        setProvincia(Number(e.target.value));
        ttmunicipio = arraymunicipios.filter((item) => {
          if (item.provincia === Number(e.target.value)) {
            return item;
          }
        });
        setTmunicipios(ttmunicipio);
        if (ttmunicipio.length === 0) {
          setTmunicipios(arraydesconocido);
          ttmunicipio = arraydesconocido;
        }
        setMunicipio(0);
        setLat(
          ttmunicipio[
            buscarEnArreglo(ttmunicipio, ttmunicipio[0].municipio, "municipio")
          ].latitud
        );
        setLng(
          ttmunicipio[
            buscarEnArreglo(ttmunicipio, ttmunicipio[0].municipio, "municipio")
          ].longitud
        );
        break;
      case "municipio":
        setMunicipio(Number(e.target.value));
        setLat(
          tmunicipios[buscarEnArreglo(tmunicipios, e.target.value, "municipio")]
            .latitud
        );
        setLng(
          tmunicipios[buscarEnArreglo(tmunicipios, e.target.value, "municipio")]
            .longitud
        );
        break;
      case "plan":
        setPlan(e.target.value);
        setResultado(arrayplan[Number(e.target.value)].tip);
        break;
    }
  }

  function handleInput(e) {
    setResultado(arrayplan[plan].tip);
    switch (e.target.id) {
      case "user":
        setUser(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      case "rpassword":
        setRpassword(e.target.value);
        break;
      case "nombre":
        setNombre(e.target.value);
        break;
      case "celular":
        setCelular(e.target.value);
        break;
      case "datos":
        setDatos(e.target.value);
        break;
      case "otrosdatos":
        setOtrosDatos(e.target.value);
        break;
      case "vista":
        setCbvista(e.target.checked);
        break;
      default:
        break;
    }
  }

  async function confirmar() {
    setLoading(true);
    if (password !== rpassword) {
      setMessage("Contraseña incorrecta");
      setOpen(true);
      document.getElementById("password").focus();
    } else {
      if (desc === undefined || desc === null) {
        setDesc("");
      }
      let latT = lat === null || lat === undefined ? 0 : lat;
      let lngT = lat === null || lng === undefined ? 0 : lng;
      let response = await setregistrarseCM(
        user.toLowerCase(),
        nombre,
        password,
        celular,
        provincia,
        municipio,
        contenidofoto,
        modifica,
        plan,
        latT,
        lngT,
        isBase64ToBlob,
        datos,
        otrosDatos
      );
      //      let response = await apiBaseDatos("setregistrarse", user.toLowerCase(), nombre, password, celular,
      //                                                          provincia, municipio, contenidofoto, modifica,
      //                                                          plan, latT, lngT, isBase64ToBlob);
      let isOk = true;
      if (isValid(response) === true)
        if (isValid(response.length) === true) isOk = false;
      if (isOk === false) {
        setMessage("Ocurrio un error mientras se registraba el usuario.");
        setOpen(true);
      } else {
        setMessage("El usuario se registró correctamente.");
        setOpen(true);
        tcancelar();
      }
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
      setIsBase64ToBlob(false);
    };
    reader.readAsDataURL(file);
  };

  const cambiaNombreFoto = (valor) => {
    setNombrefoto(valor);
  };

  const cambiaFoto = (contenidofoto) => {
    setContenidofoto(contenidofoto);
  };

  const lngLatSelected = (point, lngLat) => {
    setLng(lngLat.lng);
    setLat(lngLat.lat);
  };

  const onChangeMap = (which, value) => {
    if (which === "lng") return setLng(value);
    return setLat(value);
  };

  return (
    <>
      <div>
        <Navbar />
          <Hero clase={"hero-section"}>
          <Encabezado   clase={"encabezado"}/>
          <div className="div-papa">
            {inicia === true && show1 === true ? (
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
                <div className="registrarse">
                  <div className="container-registrarse">
                    <label className="label-grupo label-registrase-size strong">
                      Registrarse
                    </label>
                    <label className="label-grupo label-datos-size strong">
                      Datos Generales
                    </label>
                    {editarUser === true ? (
                      <div className="input-area-registrarse">
                        <label htmlFor="usuario">* Usuario:</label>
                        <select
                          id="usuario"
                          onChange={handleselect}
                          value={usuario}
                        >
                          {arrayUsuarios.map((item, i) => {
                            return (
                              <option key={i} value={item.iduser}>
                                {item.nombre}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : (
                      ""
                    )}
                    {editarUser === false ? (
                      <div className="input-area-registrarse">
                        <label htmlFor="user">* Usuario:</label>
                        <input
                          id="user"
                          value={user}
                          color="black"
                          disabled={modifica}
                          onChange={handleInput}
                          placeholder="ID usuario "
                          type="text"
                          required
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="input-area-registrarse">
                      <label htmlFor="password">* Password:</label>
                      <input
                        id="password"
                        value={password}
                        onChange={handleInput}
                        placeholder="Contraseña"
                        type="password"
                        required
                      />
                    </div>
                    <div className="input-area-registrarse">
                      <label htmlFor="rpassword">* Repetir Pw:</label>
                      <input
                        id="rpassword"
                        value={rpassword}
                        onChange={handleInput}
                        placeholder="repetir contraseña"
                        type="password"
                        required
                      />
                    </div>
                    {resultadopw !== "" && (
                      <label className="resultado-registrarse">
                        {resultadopw}
                      </label>
                    )}

                    <div className="input-area-registrarse">
                      <label htmlFor="celular">* Celular:</label>
                      <input
                        id="celular"
                        value={celular}
                        onChange={handleInput}
                        placeholder="número celular"
                        required
                      />
                    </div>
                    <div className="input-area-registrarse">
                      <label htmlFor="plan">* Plan:</label>
                      <select id="plan" onChange={handleselect} value={plan}>
                        {arrayplan
                          .filter((item, i) => {
                            if (i < 3) {
                              return item;
                            }
                          })
                          .map((item1, i) => {
                            return (
                              <option key={i} value={i}>
                                {item1.desc}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    {resultado !== "" && (
                      <label className="resultado-registrarse">
                        {resultado}
                      </label>
                    )}
                    <label className="label-grupo label-datos-size strong">
                      Datos del negocio
                    </label>
                    <div className="input-area-registrarse">
                      <label htmlFor="nombre">Nombre:</label>
                      <input
                        id="nombre"
                        value={nombre}
                        onChange={handleInput}
                        placeholder="Nombre del negocio"
                        type="text"
                        required
                      />
                    </div>

                    <div className="input-area-registrarse">
                      <label htmlFor="datos">Datos:</label>
                      <input
                        id="datos"
                        value={datos}
                        onChange={handleInput}
                        placeholder="Descripción del negocio"
                        type="text"
                        required
                      />
                    </div>
                    <div className="input-area-registrarse">
                      <label htmlFor="otrosdatos">Otros datos:</label>
                      <input
                        id="otrosdatos"
                        value={otrosDatos}
                        onChange={handleInput}
                        placeholder="Más datos del negocio"
                        type="text"
                        required
                      />
                    </div>

                    <div className="input-area-registrarse">
                      <label htmlFor="provincia">Provincia:</label>
                      <select
                        id="provincia"
                        onChange={handleselect}
                        value={provincia}
                      >
                        {arrayprovincias.map((item, i) => {
                          return (
                            <option key={i} value={item.provincia}>
                              {item.desc}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="input-area-registrarse">
                      <label htmlFor="municipio">Municipio:</label>
                      <select
                        id="municipio"
                        onChange={handleselect}
                        value={municipio}
                      >
                        {tmunicipios.map((item, i) => {
                          return (
                            <option key={i} value={item.municipio}>
                              {item.desc}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {nombrefoto !== "" && cbvista ? (
                      <div className="img-class">
                        <img className="img-registrarse" src={contenidofoto} />
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="grupo-button-registrarse">
                      {nombrefoto !== "" ? (
                        <Tippy content="Vista previa">
                          <button
                            type="button"
                            className="producto-button primary"
                            onClick={() => setCbvista(!cbvista)}
                          >
                            <Visibility />
                          </button>
                        </Tippy>
                      ) : (
                        ""
                      )}
                      {inicia === false &&
                      user !== "" &&
                      password !== "" &&
                      celular !== "" &&
                      modifica === false ? (
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
                            <AddPhotoAlternate />
                          </Tippy>
                        </label>
                      ) : (
                        ""
                      )}
                      {inicia === false &&
                      showMap !== true &&
                      modifica === true ? (
                        <Tippy content={`Galeria de fotos del producto`}>
                          <button
                            type="button"
                            className="producto-button primary"
                            onClick={() => setShowGalerias(!showGalerias)}
                          >
                            <Collections />
                          </button>
                        </Tippy>
                      ) : (
                        ""
                      )}

                      {inicia === false &&
                      user !== "" &&
                      password !== "" &&
                      celular !== "" ? (
                        <Tippy content="Ubicar el negocio en el mapa">
                          <button
                            type="button"
                            className="producto-button primary"
                            onClick={() => setShowMap(!showMap)}
                          >
                            <PlaceOutlined />
                          </button>
                        </Tippy>
                      ) : (
                        ""
                      )}
                      {inicia === false &&
                      user !== "" &&
                      password !== "" &&
                      rpassword !== "" &&
                      celular !== "" ? (
                        <button
                          type="button"
                          className="producto-button primary "
                          onClick={confirmar}
                        >
                          {loading ? (
                            <CircularProgress color="inherit" size={16} />
                          ) : (
                            <Check />
                          )}
                        </button>
                      ) : (
                        ""
                      )}
                      <button
                        type="button"
                        className="producto-button primary"
                        onClick={tcancelar}
                      >
                        <Close />
                      </button>
                    </div>
                    {inicia === false &&
                    showGalerias === true &&
                    showMap === false ? (
                      <ComGalerias
                        deQuien={"Imagenes"}
                        ruta={"usuarios/" + user}
                        perfil={user}
                        permiso={true}
                        botonCerrar={false}
                        cambiaNombreFoto={cambiaNombreFoto}
                        cambiaFoto={cambiaFoto}
                        idsb={idsb}
                        nophoto={nophoto}
                        tabla={"tablausuarios"}
                        campo={"iduser"}
                      />
                    ) : (
                      ""
                    )}
                    {showMap === true ? (
                      <div className="mapa-registrarse">
                        <Map
                          sx={{ height: "340px", width: "345px" }}
                          onMapClick={lngLatSelected}
                          remoteshowMap={showMap}
                          lat={lat}
                          lng={lng}
                          point={{ lat, lng }}
                          onChange={onChangeMap}
                          remoteZoom={zoom}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </Hero>
      </div>
    </>
  );
};

export default Registrarse;
