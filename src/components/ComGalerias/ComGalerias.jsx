0// components
import { useLocation } from "react-router-dom";
import Tippy from "@tippyjs/react";
// layouts
import Modal from "../../components/Modal/Modal";
//
// styles
import "./styles.css";
import { useEffect, useState } from "react";
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import { Button, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getgalerias } from "../../servicios/galerias";
import { getJpgFile } from "../../servicios/imagenes";
import { creafileinfolder, delfileinfolder } from "../../servicios/fs";

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
  const [arrayalbum] = useState([]);
  const [arrayfotos, setArrayfotos] = useState([]);
  const [inicia, setInicia] = useState(true);
  const [contenidofoto, setContenidofoto] = useState([]);
  const [contenidoalbum, setContenidoalbum] = useState([]);
  const [album_add] = useState(false);
  const [file_Name, setFile_Name] = useState(0);
  const [contenidophoto, setContenidophoto] = useState();
  const [selectalbum, setSelectalbum] = useState(0);
  const [selectfoto, setSelectfoto] = useState(0);
  let [talbum] = useState("");
  const [foto] = useState();
  let [carpeta] = useState("");
  let [vacia] = useState(false);
  const tipouser = Number(sessionStorage.getItem("tipouser"));
  const [showimg, setShowimg] = useState(false);
  const [isBase64ToBlob, setIsBase64ToBlob]=useState(true);

  async function init() {
    if (rutatmp === "/") {
      return;
    }
    sessionStorage.setItem("nivel", parsedParams.nivel);
    init1(rutatmp, 0);
  }

  async function init1(rutatmp, i) {



    let galeriasfolders = await getgalerias({ruta: rutatmp});
    galeriasfolders = await galeriasfolders.json();



    let tarrayalbum = [];
    let tarrayfotos = [];
    let j = 1;
    for (const item of galeriasfolders) {
      if (item.toLowerCase().indexOf(".jpg") <= 0) {
        if (arrayalbum.length === 0 && item.toLowerCase() !== "pedidos") {
          tarrayalbum.push(item);
          if (talbum === item || selectalbum !== i) {
            setSelectalbum(j);
          }
          j = j += 1;
          // obtener el contenido del primer jpg de cada album
          carpeta = rutatmp === "" ? "" : rutatmp + "/" + item;



          let galeriasfolders = await getgalerias({ruta: carpeta});
          galeriasfolders = await galeriasfolders.json();




          if (galeriasfolders.length > 0) {



          let primerjpg = await getJpgFile({ file: "./galerias/app_images/" + carpeta + "/" + galeriasfolders[0]});
          primerjpg = await primerjpg.text();



          if (primerjpg===true) {
              contenidoalbum.push(primerjpg);
            }
          } else {



              let primerjpg = await getJpgFile({ file: "./galerias/app_images/" + carpeta + "/nada.nada" });
              primerjpg = await primerjpg.text();



            if (primerjpg===true) {
              contenidoalbum.push(primerjpg);
            }
          }
        }
      } else {
        tarrayfotos.push(item);
      }
    }
    carpeta = rutatmp === "" ? "" : rutatmp + "/";
    contenidofoto.splice(0, contenidofoto.length);
    let tarray = [];
    for (const item of tarrayfotos) {



      let resultado = await getJpgFile({ file: "./galerias/app_images/" + carpeta + item  });
      resultado = await resultado.text();


      
      if (resultado.length !== 0 && resultado.error === undefined) {
        tarray.push(resultado);
      }
    }
    setArrayfotos(tarrayfotos);
    setFile_Name(tarrayfotos.length + 1);
    setContenidofoto(tarray);
    setInicia(false);
  }

  async function del_file_in_folder(folder, file) {
    await delfileinfolder({ ruta: folder, file  });

  }

  async function crea_file_in_folder(folder, file, contenidofoto) {
await creafileinfolder({ ruta: folder, file, contenidofoto  });

  }

  async function onPhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setContenidophoto(e.target.result);
      setIsBase64ToBlob(false);
    };
    reader.readAsDataURL(file);
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

      del_file_in_folder("./galerias/app_images/" + rutatmp, arrayfotos[i]);

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

//  const theme = useTheme();

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

      <div className="galeria-frame">
        {inicia === false ? (
          <>
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

              {contenidofoto.map((item, i) => (
              <div key={i} className="galeria-foto">
                  <div key={i} className="imagen-borrar">
                      <img
                        key={i}
                        onClick={() => selectFoto(i)}
                        className={
                          selectfoto === i
                            ? "image-galeria-noborder album-foto"
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
               </div>
              ))}

            </div>
            </>
        ) : (
          ""
        )}
        </div>
    </>
  );
};

export default ComGalerias;
