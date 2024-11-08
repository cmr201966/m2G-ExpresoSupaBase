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
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getGalerias, isValid, getJpgFileSB, creaFileInFolder, deleteFileInFolder } from "../../Utiles/Utiles";

const ComGalerias = (props) => {
  const {
    ruta,
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
  const [foto] = useState();
  let talbum = "";
  let [carpeta] = useState("");
  let [vacia] = useState(false);
  const tipouser = Number(sessionStorage.getItem("tipouser"));
  const [showimg, setShowimg] = useState(false);
  const [isBase64ToBlob, setIsBase64ToBlob]=useState(true);

  async function init() {
    console.log(ruta);
    if (ruta === "/") {
      return;
    }
    sessionStorage.setItem("nivel", parsedParams.nivel);
    init1(ruta);
  }

  async function init1(ruta) {
    console.log(ruta);
    let galeriasfolders = await getGalerias(ruta);
    console.log(galeriasfolders);
    let tarrayfotos = [];
    for (const item of galeriasfolders) {
      if (item.toLowerCase().indexOf(".jpg") >= 0) {
        tarrayfotos.push(item);
      }
    }

    carpeta = ruta === "" ? "" : ruta + "/";
    contenidofoto.splice(0, contenidofoto.length);
    let tarray = [];
    for (const item of tarrayfotos) {
      let resultado = await getJpgFileSB("./galerias/app_images/" + carpeta + item, carpeta + item  );
      if (isValid(resultado)=== true && isValid(resultado.length) === true){ 
        tarray.push(resultado)
        setIsBase64ToBlob(true);
        }
    }
    setArrayfotos(tarrayfotos);
    setFile_Name(tarrayfotos.length);
    setContenidofoto(tarray);
    setInicia(false);
  }

  async function del_file_in_folder(folderSQL, folderSUPABASE, file) {
    console.log(folderSQL,",", folderSUPABASE,",", file)
    await deleteFileInFolder( folderSQL, folderSUPABASE, file );
  }

  async function crea_file_in_folder(folderSQL, folderSUPABASE, file, contenidofoto) {
    console.log(folderSQL, ",", folderSUPABASE,",", file);
    await creaFileInFolder( folderSQL, folderSUPABASE, file, contenidofoto )
    console.log("7777777");
  }

  async function onPhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setIsBase64ToBlob(false);
      setContenidophoto(e.target.result);
      console.log("6666666");
    };
    reader.readAsDataURL(file);
  }

  function selectFoto(i) {
    console.log(i);
    setSelectfoto(i);
    setShowimg(true);
    sessionStorage.setItem("hd_i", i);
  }

  function onModalClose2() {
    setShowimg(false);
  }

  function borrarFoto(i) {
      del_file_in_folder("./galerias/app_images/" + ruta, ruta, arrayfotos[i]);
      init1(ruta); 
  }

  useEffect(() => {
    if (contenidofoto.length) setInicia(false);
  }, [contenidofoto]);

  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location]);

  useEffect(() => {
    if (inicia === false && contenidophoto.length !== 0) {
      let nombre_file = "foto-" + file_Name + ".jpg";
      crea_file_in_folder("./galerias/app_images/" + ruta, ruta, nombre_file, contenidophoto);
      console.log("88888888");
      carpeta = "";
      vacia = contenidofoto.length === 0;
      contenidofoto.push(contenidophoto);
      let tarray = contenidoalbum;
      setContenidoalbum(tarray);
      talbum = arrayalbum[selectalbum];
      if (vacia) {
        console.log("Vacia..");
        tarray.push(contenidophoto);
        arrayalbum.splice(0, arrayalbum.length);
        console.log(ruta);
        init1(ruta);
      } else {
        console.log("No vacia");
        let truta=isValid(carpeta) && carpeta!==""?ruta + "/" + carpeta: ruta;
        console.log(truta);
        init1(truta);
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
