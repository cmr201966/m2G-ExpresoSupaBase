//import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
//import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import { isValid } from "../../Utiles/Utiles";
import { useNavigate } from "react-router-dom";

export default function NavigationDrawer({ open, onClose, nivel }) {
  const [hamburguesa1] = useState(["/",isValid(sessionStorage.getItem("user"))===false? "/login" : "/cerrarsesion","/registrarse","/catproductos", "/aplicaciones", "/ubicacion"]);
  const [hamburguesa2] = useState(["/acercade"]);
  const navigate = useNavigate();

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
      <List>
        {["Inicio", isValid(sessionStorage.getItem("user"))===false? "Inicio sesión" : "Cerrar sesion", "Registrarse", "Vender", "Anuncios", "Ubicación"].map((text, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton LinkComponent="a" href={hamburguesa1[i]} >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
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
