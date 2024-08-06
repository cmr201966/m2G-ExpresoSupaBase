0// components
import { useLocation } from "react-router-dom";
import Tippy from "@tippyjs/react";
// layouts
import Modal from "../../components/Modal/Modal";
//
// styles
import "./styles.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Check from "@mui/icons-material/Check";
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import { Button, Box, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ComGalerias = (props) => {
  const {
    rutatmp,
    perfil,
    permiso,
    fixed,
    handleShowGaleries,
    botonCerrar,
    deQuien,
  } = props;
  const location = useLocation();
  const parsedParams = {};
  const [arrayalbum, setArrayalbum] = useState([]);
  const [arrayfotos, setArrayfotos] = useState([]);
  const [nombre_album, setNombre_album] = useState("");
  const [inicia, setInicia] = useState(true);
  const [contenidofoto, setContenidofoto] = useState([]);
  const [contenidoalbum, setContenidoalbum] = useState([]);
  const [contenido, setContenido] = useState([]);
  const [show, setShow] = useState(false);
  const [album_add, setAlbum_add] = useState(false);
  const [file_Name, setFile_Name] = useState(0);
  const [contenidophoto, setContenidophoto] = useState();
  const [selectalbum, setSelectalbum] = useState(0);
  const [selectfoto, setSelectfoto] = useState(0);
  const [albumtxt, setAlbumtxt] = useState("");
  let [talbum, setTalbum] = useState("");
  const [foto, setFoto] = useState();
  let [carpeta, setCarpeta] = useState("");
  let [vacia, setVacia] = useState(false);
  const tipouser = Number(sessionStorage.getItem("tipouser"));
  const [showimg, setShowimg] = useState(false);

  async function init() {
    if (rutatmp === "/") {
      return;
    }
    sessionStorage.setItem("filtro", "");
    sessionStorage.setItem("naturaleza", parsedParams.naturaleza);
    sessionStorage.setItem("idowner", parsedParams.idowner);
    sessionStorage.setItem("nivel", parsedParams.nivel);
    init1(rutatmp, 0);
  }

  async function init1(rutatmp, i) {
    let marrayalbum = [];
    const galeriasfolders = await axios.post(
      "http://localhost:3001/getgalerias",
      { ruta: rutatmp },
      {}
    );
    let tarrayalbum = [];
    let tarrayfotos = [];
    let j = 1;
    for (const item of galeriasfolders.data) {
      if (item.toLowerCase().indexOf(".jpg") <= 0) {
        if (arrayalbum.length === 0 && item.toLowerCase() !== "pedidos") {
          tarrayalbum.push(item);
          if (talbum === item || selectalbum !== i) {
            setSelectalbum(j);
          }
          j = j += 1;
          // obtener el contenido del primer jpg de cada album
          carpeta = rutatmp === "" ? "" : rutatmp + "/" + item;
          const galeriasfolders = await axios.post(
            "http://localhost:3001/getgalerias",
            { ruta: carpeta },
            {}
          );
          if (galeriasfolders.data.length > 0) {
            const primerjpg = await axios.post(
              "http://localhost:3001/getjpg-file",
              {
                file:
                  "./galerias/app_images/" +
                  carpeta +
                  "/" +
                  galeriasfolders.data[0],
              },
              {}
            );
            if (primerjpg.data.length !== 0 && primerjpg.error === undefined) {
              contenidoalbum.push(primerjpg.data);
            }
          } else {
            const primerjpg = await axios.post(
              "http://localhost:3001/getjpg-file",
              { file: "./galerias/app_images/" + carpeta + "/nada.nada" },
              {}
            );
            if (primerjpg.data.length !== 0 && primerjpg.error === undefined) {
              contenidoalbum.push(primerjpg.data);
            }
          }
        }
      } else {
        tarrayfotos.push(item);
      }
    }
    // llenar el arreglo con las imagenes del album select
    //    for (let i = 0; i < arrayalbum.length; i += 1) {}
    carpeta = rutatmp === "" ? "" : rutatmp + "/";
    contenidofoto.splice(0, contenidofoto.length);
    let tarray = [];
    for (const item of tarrayfotos) {
      const resultado = await axios.post(
        "http://localhost:3001/getjpg-file",
        { file: "./galerias/app_images/" + carpeta + item },
        {}
      );
      if (resultado.data.length !== 0 && resultado.error === undefined) {
        tarray.push(resultado.data);
      }
    }
    setAlbumtxt(marrayalbum[i]);
    setArrayfotos(tarrayfotos);
    setFile_Name(tarrayfotos.length + 1);
    setContenidofoto(tarray);
    setInicia(false);
  }

  function handleInput(e) {
    switch (e.target.id) {
      case "nombre_album":
        setNombre_album(e.target.value);
        break;
      default:
        break;
    }
  }

  function addalbum() {
    setAlbum_add(true);
  }

  const [created, setCreated] = useState(false);

  async function confirmar_album() {
    const creacarpeta = await axios.post(
      "http://localhost:3001/getcreacarpeta",
      { ruta: "./galerias/app_images/" + rutatmp + "/" + nombre_album },
      {}
    );
    if (creacarpeta.error) {
      setContenido("No se pudo crear el album");
      setShow(true);
    } else {
      const dtjpg = await axios.post(
        "http://localhost:3001/getjpg-file",
        { ruta: "./galerias/app_images/nada.nada" },
        {}
      );
      let tarrayalbum = arrayalbum;
      tarrayalbum.push(nombre_album);
      setAlbumtxt(nombre_album);
      setSelectalbum(tarrayalbum.length - 1);
      setArrayalbum(tarrayalbum);
      contenidoalbum.push(dtjpg.data);
      let tarray = [];
      setContenidofoto(tarray);
      setCreated(true);
    }
    setAlbum_add(false);
  }

  useEffect(() => {
    if (created) {
      const ultimoAlbum = document.getElementById(
        `imagen-${arrayalbum.length - 1}`
      );
      if (ultimoAlbum !== null) {
        {
          /*}        document.getElementById(`imagen-${arrayalbum.length - 1}`).scrollTo('#target');*/
        }
        ultimoAlbum.focus();
        {
          /*}        document.getElementById("galeria-album")*/
        }
        setCreated(false);
      }
    }
  }, [created, arrayalbum]);

  function cancelar_album() {
    setAlbum_add(false);
  }

  function cambialbum(i) {
    carpeta = arrayalbum[i].toLowerCase() === "perfil" ? "" : arrayalbum[i];
    talbum = arrayalbum[i];
    init1(rutatmp + "/" + carpeta, i);
  }

  async function del_file_in_folder(folder, file) {
    await axios.post(
      "http://localhost:3001/del_file_in_folder",
      { ruta: folder, file },
      {}
    );
  }

  async function crea_file_in_folder(folder, file, contenidofoto) {
    await axios.post(
      "http://localhost:3001/set_file_in_folder",
      { ruta: folder, file, contenidofoto },
      {}
    );
  }

  async function onPhotoChange(e) {
    const file = e.target.files[0];
    //const fileName = e.target.value;
    if (!file) return;
    const reader = new FileReader();
    // eslint-disable-next-line no-shadow
    let content;
    reader.onload = (e) => {
      content = e.target.result;
      setContenidophoto(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  function selectAlbum(i) {
    setSelectalbum(i);
    setAlbumtxt(arrayalbum[i]);
    cambialbum(i);
  }

  function selectFoto(i) {
    setSelectfoto(i);
    setShowimg(true);
    sessionStorage.setItem("hd_i", i);
  }

  function onModalClose2() {
    setShowimg(false);
  }

  function borrarFoto(i) {

      del_file_in_folder(
        "./galerias/app_images/" + rutatmp, arrayfotos[i]
      );
      init1(rutatmp, 0);
  
  }

  useEffect(() => {
    if (contenidofoto.length) setInicia(false);
  }, [contenidofoto]);

  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item, i) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location]);

  useEffect(() => {
    if (inicia === false && contenidophoto.length !== 0) {
      let nombre_file = "foto-" + file_Name;
      crea_file_in_folder(
        "./galerias/app_images/" + rutatmp,
        nombre_file,
        contenidophoto
      );
      carpeta = "";
      vacia = contenidofoto.length === 0;
      contenidofoto.push(contenidophoto);
      let tarray = contenidoalbum;
      setContenidoalbum(tarray);
      talbum = arrayalbum[selectalbum];
      if (vacia) {
        tarray.push(contenidophoto);
        arrayalbum.splice(0, arrayalbum.length);
        init1(rutatmp, 0);
      } else {
        init1(rutatmp + "/" + carpeta, selectalbum);
      }
    }
  }, [contenidophoto]);

  useEffect(() => {
    if (document.getElementById("nombre_album") !== null) {
      document.getElementById("nombre_album").focus();
    }
  }, [album_add]);

  useEffect(() => {
    init();
  }, []);

  const theme = useTheme();

  return (
    <>
      <Modal
        visible={showimg}
        onClose={onModalClose2}
        className="cmodal"
        classContainer="modal-cardrow"
      >
        <div className="cerrar-button">
          <button className="cerrar" onClick={onModalClose2}>
            X
          </button>
        </div>
        <div className="img_zoom">
          <img className="img-hd"
            src={contenidofoto[Number(sessionStorage.getItem("hd_i"))]}
            alt="dueño"
          />
        </div>
      </Modal>

      <Box
        sx={{
          background: theme.palette.primary.main,
          width: "100vw",
          position: !fixed ? "relative" : "fixed",
          left: 0,
          bottom: 0,
        }}
      >
        {inicia === false ? (
          <Box
            sx={{ paddingRight: "27px", position: "relative", height: "100%" }}
          >
            {botonCerrar ? (
              <Button
                variant="contained"
                onClick={handleShowGaleries}
                color="error"
                sx={{
                  position: "absolute",
                  top: "5px",
                  right: "20px",
                  borderRadius: "100%",
                  minWidth: 0,
                  minHeight: 0,
                  width: "35px",
                  height: "35px",
                }}
              >
                <Close />
              </Button>
            ) : (
              ""
            )}

            <label className="titulo-album">Fotos {deQuien}</label>
            <div className="galeria-fotos-view">
              {tipouser !== 0 && permiso === true ? (
                <div className="image-galeria-add-foto">
                  <label className="label-add">
                    <input
                      id="foto"
                      value={foto}
                      onChange={onPhotoChange}
                      type="file"
                      required
                    />
                    <Add className="addcss" />
                  </label>
                </div>
              ) : (
                ""
              )}

              <div className="galeria-foto">
                {contenidofoto.map((item, i) => (
                  <>
                    <div className="imagen-borrar">
                      <img
                        key={i}
                        onClick={() => selectFoto(i)}
                        className={
                          selectfoto === i
                            ? "image-galeria-border album-foto"
                            : "image-galeria-noborder album-foto"
                        }
                        src={contenidofoto[i]}
                      />
                      {tipouser !== 0 && permiso === true ? (
                        <Tippy content={`Eliminar la foto`}>
                          <button
                            className="card-image-offon"
                            onClick={() => borrarFoto(i)}
                          >
                            <DeleteIcon />
                          </button>
                        </Tippy>
                      ) : (
                        ""
                      )}
                    </div>
                  </>
                ))}
              </div>
            </div>
          </Box>
        ) : (
          ""
        )}
      </Box>
    </>
  );
};

export default ComGalerias;
