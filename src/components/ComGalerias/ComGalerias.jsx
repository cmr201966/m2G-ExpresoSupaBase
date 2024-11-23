0// components
import { useLocation } from "react-router-dom";
import Tippy from "@tippyjs/react";
// layouts
import Modal from "../../components/Modal/Modal";
//
// styles
import "./styles.css";
import { useEffect, useState } from "react";
// @mui/material
import {CircularProgress,} from "@mui/material";
//import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getGaleriasSB, isValid, getJpgFileSB, creaFileInFolder, deleteFileInFolder } from "../../Utiles/Utiles";
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import { useNotification } from "../../context/NotificationProvider";

const ComGalerias = (props) => {
  const {
    ruta,
    perfil,
    permiso,
    fixed,
    handleShowGaleries,
    botonCerrar,
    deQuien,
    cambiaNombreFoto,
    cambiaFoto,
    idsb,
    nophoto,
    tabla,
    campo
  } = props;
  const {setOpen, setMessage} = useNotification();
  const location = useLocation();
  const parsedParams = {};
  const [arrayfotos, setArrayfotos] = useState([]);
  const [inicia, setInicia] = useState(true);
  const [contenidofoto, setContenidofoto] = useState([]);
  const [file_Name, setFile_Name] = useState(nophoto);
  const [fotoPerfil, setFotoPerfil] = useState(false);
  const [contenidophoto, setContenidophoto] = useState();
  const [selectfoto, setSelectfoto] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cantPhoto, setCantPhoto] = useState(0);
  const [foto] = useState();
  const tipouser = Number(sessionStorage.getItem("tipouser"));
  const [showimg, setShowimg] = useState(false);

  async function init() {
    if (ruta === "/") return;
    sessionStorage.setItem("nivel", parsedParams.nivel);
    init1(ruta);
  }

  async function init1(ruta) {
    let galeriasfolders = await getGaleriasSB(ruta);
    let tarrayfotos = [];
    let cantPhotoT=1;
    for (const item of galeriasfolders) {
      if (item.toLowerCase().indexOf(".jpg") >= 0 && cantPhotoT<=4) {
        tarrayfotos.push(item);
        cantPhotoT=cantPhotoT+1;
      }
    }
    let {indexperfil, fp}=lastIndex(tarrayfotos);
    let este = tarrayfotos.splice(indexperfil,1)[0];
    tarrayfotos = [este,...tarrayfotos]
    setArrayfotos(tarrayfotos);
    setCantPhoto(tarrayfotos.length);
    let carpetaMYSQL = ruta === "" ? "" : "/" + ruta;
    let carpetaSUPABASE = ruta === "" ? "" : ruta;
    contenidofoto.splice(0, contenidofoto.length);
    let tarray = [];
    for (const item of tarrayfotos) {
      let resultado = await getJpgFileSB(item, "./galerias/app_images" + carpetaMYSQL, carpetaSUPABASE, idsb);
      if (isValid(resultado)=== true && isValid(resultado.length) === true){ 
        tarray.push(resultado)
        }
    }
    if (fp===false){ 
      cambiaNombreFoto("")
    }
    else cambiaNombreFoto(perfil + ".jpg");
    setFile_Name(file_Name + 1);
    setContenidofoto(tarray);
    setInicia(false);
  }

  function lastIndex(array){
    let endArray=[];
    let tfotoPerfil=false;
    let indexperfil;
    array.forEach((item, i) => {
      if (item===perfil + ".jpg"){ 
        tfotoPerfil=true;
        indexperfil=i;
      }
       const index = item.split("foto-");
       if (index[1]!==undefined){
        const valor=index[1].split(".")
        endArray.push(Number(valor[0]));
       }
    });
    endArray.sort((a, b) => a - b);
    setFotoPerfil(tfotoPerfil);
    return {indexperfil: indexperfil, fp: tfotoPerfil};
//    return {indexPhoto: endArray.length!==0?endArray[endArray.length-1]:0, fp: tfotoPerfil};
  }

  async function del_file_in_folder(folderSQL, folderSUPABASE, file) {
    setLoading(true);
    await deleteFileInFolder( folderSQL, folderSUPABASE, file );
    setCantPhoto(cantPhoto-1);
    setLoading(false);
  }

  async function crea_file_in_folder(folderSQL, folderSUPABASE, file, contenidofoto) {
    await creaFileInFolder( folderSQL, folderSUPABASE, file, contenidofoto, file_Name, tabla, campo, perfil )
    setCantPhoto(cantPhoto+1);
    setMessage("Se agregó la imagen")
    setOpen(true);
    setLoading(false);
    init1(ruta);
  }

  function VerificaCantPhoto(e){
    if (cantPhoto>=4){
      setMessage("Alcanzó la cantidad máxima de fotos, elimine una")
      setOpen(true);
      e.preventDefault()
    }
  }
  async function onPhotoChange(e) {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setContenidophoto(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  function selectFoto(i) {
    setSelectfoto(i);
/*    setShowimg(true);*/
    cambiaFoto(contenidofoto[i]);
    sessionStorage.setItem("hd_i", i);
  }

  function onModalClose2() {
    setShowimg(false);
  }

  async function borrarFoto(i) {
      await del_file_in_folder("./galerias/app_images/" + ruta, ruta, arrayfotos[i]);
      setMessage("Se eliminó la imagen")
      setOpen(true); 
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
    if (isValid(contenidophoto)=== true){
       if (inicia === false && contenidophoto.length !== 0) {
          let nombre_file = fotoPerfil===false?perfil + ".jpg":"foto-" + file_Name + ".jpg";
          crea_file_in_folder("./galerias/app_images/" + ruta, ruta, nombre_file, contenidophoto);  
       }
  }
  }, [contenidophoto]);

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

            <label className="titulo-album">{deQuien}</label>
            <div className="galeria-fotos-view">
              {tipouser !== 0 && permiso === true ? (
                <div className="image-galeria-add-foto">
                  <label className="label-add">
                    <input
                      id="foto"
                      value={foto}
                      onClick={VerificaCantPhoto}
                      onChange={onPhotoChange}
                      type="file"
                      required
                    />
                    {loading ? <CircularProgress color="inherit" size={16} /> : <AddAPhotoOutlinedIcon className="addcss" />}
                  </label>
                </div>
              ) : (
                ""
              )}
              <div className="scroll-fotos">
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
