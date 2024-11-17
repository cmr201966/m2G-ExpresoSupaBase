/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// @mui/material
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  Typography,
} from "@mui/material";
// @mui/icons
import { Check, Close } from "@mui/icons-material";

// services
import { getProvinciasCM, getMunicipiosCM, getConfigCM, setConfigCM  } from "../../Utiles/apiBaseDatos";

function Location(props) {
  const { open, onModalClose, whereIs } = props;

  const [cantClose, setCantClose] = useState(false);
  const [loading, setLoading] = useState(true);

  const [province, setProvince] = useState();
  const [provinces, setProvinces] = useState([]);

  const onProvinceSelect = (e) => setProvince(e.target.value);

  const [municipal, setMunicipal] = useState();
  const [municipals, setMunicipals] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [donde] = useState(whereIs);
  
  const navigate = useNavigate();

  const onMunicipalSelect = (e) => setMunicipal(e.target.value);
console.log(whereIs);
  const provinceMunicipals = useMemo(() => {
    return municipals?.filter((item) => item.provincia === Number(province));
  }, [municipals, province]);

  const confirmar = useCallback(async () => {
    console.log(whereIs);
    if (whereIs!=="movil"){
    setLoading(true);
    await setConfigCM(province, municipal);
//    await apiBaseDatos("setConfig", province, municipal);
    }
    else{
      navigate(`/productos?buscar=${buscar}&user=${sessionStorage.getItem("user")}&nombre=Filtro: '${buscar}'`);
    }
    setLoading(false);
    onModalClose();
  }, [municipal, onModalClose, province]);

  const init = async () => {
    const remoteProvinces = await getProvinciasCM();
    console.log(remoteProvinces);
    //const remoteProvinces = await apiBaseDatos("provincias");
//    setProvinces(remoteProvinces);
    if (remoteProvinces?.length) {
      setProvince(remoteProvinces[0].provincia);
    }

    const remoteMunicipals = await getMunicipiosCM();
    console.log(remoteMunicipals);
    //const remoteMunicipals = await apiBaseDatos("municipios");
    setMunicipals(remoteMunicipals);

    const config = await getConfigCM();
    console.log(config);
//    const config = await apiBaseDatos("getConfig");
    if (!config?.length) {
      setCantClose(true);
      setProvince(14);
      setMunicipal(6);
    } else {
      setCantClose(false);
      setProvince(config[0].provincia);
      setMunicipal(config[0].municipio);
      sessionStorage.setItem("ubicacion-provincia", config[0].provincia);
      sessionStorage.setItem("ubicacion-municipio", config[0].municipio);
    }
    setLoading(false);
  };

  async function handleInput(e) {
    switch (e.target.id) {
       case "desc":
          setBuscar(e.target.value);
          break;
       default:
        break;
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Dialog open={open} onClose={onModalClose}>
      {whereIs!=="movil"?<DialogTitle>Ubicación</DialogTitle>:<DialogTitle>Buscar</DialogTitle>}
        {!cantClose && (
        <button
          aria-label="close"
          onClick={onModalClose}
          className="dialog-close"
        >
          <Close />
        </button>
        )}

        <div className="dialog">
          {whereIs!=="movil"?
          <>
          <div className="form-col alter">
            <Typography variant="body1">Provincia:</Typography>
            <select id="provincia" onChange={onProvinceSelect} value={province}>
              {provinces.map((item, i) => (
                <option key={i} value={item.provincia}>
                  {item.desc}
              </option>
              ))}
            </select>
          </div>
          <div className="form-col alter">
            <Typography>Municipio:</Typography>
              <select id="municipio" onChange={onMunicipalSelect} value={municipal}>
                 {provinceMunicipals?.map((item, i) => (
                   <option key={i} value={item.municipio}>
                     {item.desc}
                   </option>
                 ))}
              </select>
          </div>
          </>:
          <div className="form-col alter">
            <input className="input-buscar-movil"
                   id="desc"
                   value={buscar}
                   placeholder="Buscar productos..."
                   onChange={handleInput}
                   type="text"
                   required
            />
          </div>
          }

          <div className="dialog-button-row">
             <button type="button" className="dialog-submit" onClick={confirmar}>
               {loading ? <CircularProgress color="inherit" size={16} /> : <Check />}
                Aplicar
             </button>
          </div>
      </div>
    </Dialog>
  );
}

export default Location;
