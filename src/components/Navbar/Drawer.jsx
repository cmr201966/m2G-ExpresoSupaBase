/* eslint-disable react/prop-types */
import { useState } from "react";

// @mui/material
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

// utils
import { isValid } from "../../Utiles/Utiles";

export default function NavigationDrawer({
  open,
  onClose,
  nivel,
  openLocation,
}) {
  const [hamburguesa1] = useState([
    "/",
    isValid(sessionStorage.getItem("user")) === false
      ? "/login"
      : "/cerrarsesion",
    "/registrarse?inserta=true",
    "/categorias",
    "/catproductos",
    "/aplicaciones",
  ]);
  const [hamburguesa1Depende] = useState([0, 0, 1, 0, 0, 0, 0]);
  const [hamburguesa1Nivel] = useState([1, 0, 0, 0, 0, 0, 0]);
  const [hamburguesa2] = useState(["/acercade"]);

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
      <List>
        {[
          "Inicio",
          isValid(sessionStorage.getItem("user")) === false
            ? "Inicio sesión"
            : "Cerrar sesion",
          "Registrarse",
          "Categorias",
          "Vender",
          "Anuncios",
        ].map((text, i) => (
          <ListItem key={i} disablePadding>
            {(hamburguesa1Depende[i] === 1 &&
              isValid(sessionStorage.getItem("user")) === true) ||
            (hamburguesa1Nivel[i] == 1 && nivel === 0) ? (
              ""
            ) : (
              <ListItemButton LinkComponent="a" href={hamburguesa1[i]}>
                <ListItemText primary={text} />
              </ListItemButton>
            )}
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton LinkComponent="button" onClick={openLocation}>
            <ListItemText primary="Ubicación" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {["Acerca de"].map((text, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton LinkComponent="a" href={hamburguesa2[i]}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer open={open} onClose={onClose}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
