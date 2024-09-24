//import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
//import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

export default function NavigationDrawer({ open, onClose }) {
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
      <List>
        {["Ubicación", "Iniciar sesión", "Registrarse", "Vender"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["Acerca de"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
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


        {/*  <Box ref={ref} sx={{ position: "relative" }}>
          {showMenu ? (
            <Box
              sx={{
                position: "fixed",
                zIndex: 99,
                right: 0,
                top: "90px",
                background: theme.palette.primary.main,
                height: "auto",
                width: "auto",
                padding: "10px",
              }}
            >
              {sessionStorage.getItem("user") === null ? (
                <div className="menu-no-login">
                  <Tippy content="Inicio sesión">
                    <button
                      className="button-no-login-1"
                      onClick={() => {
                        navigate("/login");
                      }}
                    >
                      Inicio sesión
                    </button>
                  </Tippy>
                  <Tippy content="Crear una cuenta de usuario">
                    <button
                      className="button-no-login-1"
                      onClick={() => {
                        navigate("/registrarse?inserta=true");
                      }}
                    >
                      Registrarse
                    </button>
                  </Tippy>
                  {nivel !== 0 ? (
                    <Tippy content="Ir a la página principal">
                      <button
                        className="button-no-login-1"
                        onClick={() => {
                          navigate("/");
                        }}
                      >
                        Inicio
                      </button>
                    </Tippy>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
              {sessionStorage.getItem("tipouser") &&
              Number(sessionStorage.getItem("tipouser")) === 0 ? (
                <div className="menu-gratis">
                  <Tippy content="Ir a la página principal">
                    <button
                      className="button-no-login-1"
                      onClick={() => {
                        navigate("/");
                      }}
                    >
                      Inicio
                    </button>
                  </Tippy>
                  <Tippy content="Cerrar la sesión">
                    <button
                      className="button-no-login-1"
                      onClick={() => {
                        navigate("/cerrarsesion");
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </Tippy>
                </div>
              ) : (
                ""
              )}

              {sessionStorage.getItem("tipouser") &&
              Number(sessionStorage.getItem("tipouser")) !== 0 ? (
                <div className="menu-duenos">
                  <Tippy content="Ir a la página principal">
                    <button
                      className="button-no-login-1"
                      onClick={() => {
                        navigate("/");
                      }}
                    >
                      Inicio
                    </button>
                  </Tippy>
                  <Tippy content="Administrar mis negocios">
                    <button
                      className="button-no-login-1"
                      onClick={() => {
                        navigate(
                          `/negocios?naturaleza=41&nombre=Negocios&condicion=&campo1=&owner=56&idowner=86&rutatmp=usuarios/${sessionStorage.getItem(
                            "user"
                          )}&desctmp=${sessionStorage.getItem(
                            "usernombre"
                          )}&nohay=&naturalezas=&nivel=2`
                        );
                      }}
                    >
                      Negocios
                    </button>
                  </Tippy>
                  <Tippy content="Administrar mis productos">
                    <button
                      className="button-no-login-1"
                      onClick={() => {
                        navigate(
                          `/catproductos?naturaleza=41&nombre=Negocios&condicion=&campo1=&owner=56&idowner=86&rutatmp=usuarios/${sessionStorage.getItem(
                            "user"
                          )}&desctmp=${sessionStorage.getItem(
                            "usernombre"
                          )}&nohay=&naturalezas=&nivel=2`
                        );
                      }}
                    >
                      Productos
                    </button>
                  </Tippy>
                  <Tippy content="Cerrar la sesión">
                    <button
                      className="button-no-login-1"
                      onClick={() => {
                        navigate("/cerrarsesion");
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </Tippy>
                </div>
              ) : (
                ""
              )}
            </Box>
          ) : null}
        </Box> */}




}
