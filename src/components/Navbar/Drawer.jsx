/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";

// @mui/material
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
// @mui/icons
import { Person, Settings, PersonAddAlt1 } from "@mui/icons-material";
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

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
    "/catcategorias",
    "/categorias",
    "/catproductos",
    "/anuncios",
  ]);
  const [hamburguesa1Depende] = useState([0, 0, 1, 0, 0, 0, 0]);
  const [hamburguesa1Nivel] = useState([1, 0, 0, 0, 0, 0, 0]);
  const [hamburguesa2] = useState(["/acercade"]);
  const [hamburguesa3] = useState(["/activarusuarios", "/activarproductos"]);
  const [hamburguesa4] = useState(["/contratosadmin"]);
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
          "Ir a categoria",
          "Publicar",
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
        //<ListItem disablePadding>
        //  <ListItemButton LinkComponent="button" onClick={openLocation}>
        //    <ListItemText primary="Ubicación" />
        //  </ListItemButton>
       // </ListItem>
      </List>
      {isValid(sessionStorage.getItem("tipouser"))===true ?
      <>
      <Divider />
      <List>
        {["Administrar contratos"].map((text, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton LinkComponent="a" href={hamburguesa4[i]}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      </>:""
      }
      {Number(sessionStorage.getItem("tipouser")) === 3 ?
      <>
      <Divider />
      <List>
        {["Activar usuario", "Activar productos"].map((text, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton LinkComponent="a" href={hamburguesa3[i]}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      </>:""
      }
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
      <Divider />
      <div className="row-buttons">
        {Number(sessionStorage.getItem("tipouser")) === 3 ? (
          <Tippy content={"Categorias de negocios"}>
            <Link to="/catcategorias?login=1&regreso=/catcategorias">
              <IconButton id="categorias">
                <Settings />
              </IconButton>
            </Link>
          </Tippy>
        ) : (
          ""
        )}
        {isValid(sessionStorage.getItem("user")) ? (
          <Tippy
            content={`Actualizar datos de ${sessionStorage.getItem("user")}`}
          >
            <Link to="/registrarse?inserta=false&where=false">
              <IconButton id="user">
                <Person id="user" />
              </IconButton>
            </Link>
          </Tippy>
        ) : (
          ""
        )}

        {Number(sessionStorage.getItem("tipouser")) === 3 ? (
          <Tippy content={"Agregar un usuario"}>
            <Link to="/registrarse?inserta=true&where=true">
              <IconButton id="user">
                <PersonAddAlt1 />
              </IconButton>
            </Link>
          </Tippy>
        ) : (
          ""
        )}

        {Number(sessionStorage.getItem("tipouser")) === 3 ? (
          <Tippy content={"Editar un usuario"}>
            <Link to="/registrarse?inserta=false&where=true">
              <IconButton id="user">
                 <ManageAccountsOutlinedIcon />
              </IconButton>
            </Link>
          </Tippy>
        ) : (
          ""
        )}
      </div>
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
