/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from "react";

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
import { apiBaseDatos } from "../../Utiles/Utiles";

function Location(props) {
  const { open, onModalClose } = props;

  const [cantClose, setCantClose] = useState(false);
  const [loading, setLoading] = useState(true);

  const [province, setProvince] = useState();
  const [provinces, setProvinces] = useState([]);

  const onProvinceSelect = (e) => setProvince(e.target.value);

  const [municipal, setMunicipal] = useState();
  const [municipals, setMunicipals] = useState([]);

  const onMunicipalSelect = (e) => setMunicipal(e.target.value);

  const provinceMunicipals = useMemo(() => {
    return municipals?.filter((item) => item.provincia === Number(province));
  }, [municipals, province]);

  const confirmar = useCallback(async () => {
    setLoading(true);
    await apiBaseDatos("setConfig", province, municipal);
    setLoading(false);
    onModalClose();
  }, [municipal, onModalClose, province]);

  const init = async () => {
    const remoteProvinces = await apiBaseDatos("provincias");
    setProvinces(remoteProvinces);
    if (remoteProvinces?.length) {
      setProvince(remoteProvinces[0].provincia);
    }

    const remoteMunicipals = await apiBaseDatos("municipios");
    setMunicipals(remoteMunicipals);

    const config = await apiBaseDatos("getConfig");
    console.log(config);
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

  useEffect(() => {
    init();
  }, []);

  return (
    <Dialog open={open} onClose={onModalClose}>
      <DialogTitle>Ubicación</DialogTitle>
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
