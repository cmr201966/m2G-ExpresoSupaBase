import { useCallback, useEffect, useMemo, useState } from "react";
import Tippy from "@tippyjs/react";

// @mui/material
import { Dialog, DialogTitle, IconButton, Typography } from "@mui/material";
// @mui/icons
import { Check, Close, PlaceOutlined } from "@mui/icons-material";

// services
import { apiBaseDatos } from "../../Utiles/Utiles";

function Location() {
  const [showDialog, setShowDialog] = useState(false);

  const onModalClose = useCallback(() => setShowDialog(false), [setShowDialog]);

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
    await apiBaseDatos("setConfig", province, municipal);
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
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Tippy content={"Donde recibirá su producto ó servicio"}>
        <IconButton
          sx={{ padding: 0 }}
          color="inherit"
          onClick={() => setShowDialog(true)}
        >
          <PlaceOutlined sx={{ color: "aliceblue", fontSize: "28px" }} />
          <span className="ubicacion">Ubicación</span>
        </IconButton>
      </Tippy>
      <Dialog open={showDialog} onClose={onModalClose}>
        <DialogTitle>Ubicación</DialogTitle>
        <button
          aria-label="close"
          onClick={onModalClose}
          className="dialog-close"
        >
          <Close />
        </button>
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
            <select
              id="municipio"
              onChange={onMunicipalSelect}
              value={municipal}
            >
              {provinceMunicipals?.map((item, i) => (
                <option key={i} value={item.municipio}>
                  {item.desc}
                </option>
              ))}
            </select>
          </div>
          <div className="dialog-button-row">
            <button type="button" className="dialog-submit" onClick={confirmar}>
              <Check />
              Aplicar
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default Location;
