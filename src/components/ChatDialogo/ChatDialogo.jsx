import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { MenuOpen, Menu } from "@mui/icons-material";
import { Close, Send } from "@mui/icons-material";

// styles
import "./styles.css";
// socket
import io from "socket.io-client";

import {
  useTheme,
  Box,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";

const socket = io("http://localhost:3001");

const ChatDialogo = (props) => {
  const { user, nombre, indexChat, openSide, openSideHandler, fixed } = props;
  const [show, setShow] = useState(false);
  const [inicia, setInicia] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  const [texto, setTexto] = useState("");
  const [buscar, setBuscar] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [contenidofoto, setContenidofoto] = useState("");

  async function init() {
    // Recuperar los chats entre estos 2 users
    //    socket.disconnect();
    //    socket.connect();
    const get_chat = await axios.post(
      "http://localhost:3001/get-chat",
      {
        userOut: sessionStorage.getItem("user"),
        userIn: user,
      },
      {}
    );
    let tmsgs = [];
    tmsgs = get_chat.data;
    setMsgs(tmsgs);
    const fotobuffer = await axios.post(
      "http://localhost:3001/getjpg-file",
      {
        file: "./galerias/app_images/usuarios/" + user + "/" + user + ".jpg",
      },
      {}
    );

    if (fotobuffer.data.length !== 0 && fotobuffer.error === undefined) {
      setContenidofoto(fotobuffer.data);
    } else {
      setContenidofoto("");
    }

    setInicia(false);
  }

  async function refrescar_chat() {
    const resultado = await axios.post(
      "http://localhost:3001/get-chat",
      {
        userOut: sessionStorage.getItem("user"),
        userIn: user,
      },
      {}
    );
    let tmsgs = [];
    if (resultado.data) {
      for (let i = 0; i < resultado.data.length; i += 1) {
        tmsgs.push({
          userOut: resultado.data[i].userOut,
          userIn: resultado.data[i].userIn,
          desc: resultado.data[i].desc,
        });
      }
      setMsgs(tmsgs);
    } else {
      setMsgs(tmsgs);
    }
  }

  async function enviar(e) {
    console.log(
      "Enviar: Out( " +
        sessionStorage.getItem("user") +
        "), In(" +
        user +
        "), Texto: " +
        texto
    );
    setSendingMessage(true);
    e.preventDefault();
    try {
      console.log(msgs);
      let tmsgs = msgs;
      tmsgs.push({
        userOut: sessionStorage.getItem("user"),
        userIn: user,
        desc: texto,
      });
      setMsgs(tmsgs);
      const resultado = await axios.post(
        "http://localhost:3001/set-chat",
        {
          userOut: sessionStorage.getItem("user"),
          userIn: user,
          texto,
          tipo: true,
        },
        {}
      );

      setTexto("");
      socket.emit("send-message", { target: user });
    } catch (err) {
      console.log(err);
    }
    setSendingMessage(false);
  }

  function handleInput(e) {
    switch (e.target.id) {
      case "texto":
        setTexto(e.target.value);
        break;
      default:
        break;
    }
  }

  const onModalClose = () => {
    setShow(false);
  };

  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    if (socketId !== null) {
      socket.emit("user-id", { id: sessionStorage.getItem("user") });
    }
  }, [socketId]);

  useEffect(() => {
    //
    console.log("Observando...");
    socket.on("connected", (param) => {
      const { socketId } = param;
      setSocketId(socketId);
      console.log("socketID: " + socketId);
    });
    //
    socket.on("new-message", () => {
      console.log("Mensaje nuevo");
      console.log(user);
      setInicia(true);
      init();
    });
    //
    socket.on("disconnect", () => {
      console.log(`disconnected ${sessionStorage.getItem("user")}`);
    });
  }, []);

  useEffect(() => {
    init();
  }, [indexChat]);

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Paper
        sx={{
          flex: 1,
          padding: "10px",
          width: !fixed ? { md: "50%", xs: "100%" } : "100%",
          background: theme.palette.background.paper,
          borderRadius: {
            md: openSideHandler ? "0 15px 15px 0" : "15px",
            xs: "15px",
          },
          position: !fixed ? "relative" : "fixed",
          height: !fixed ? "100%" : "400px",
          paddingRight: !fixed ? 0 : "27px",
          left: 0,
          bottom: 0,
        }}
        elevation={2}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: theme.palette.background.default,
            border: "1px solid gray",
            padding: "10px",
            marginRight: !fixed ? 0 : "10px",
          }}
          className="barra-titulo"
        >
          <Box
            sx={{
              gap: "10px",
              display: "flex",
              alignItems: "center",
              flex: 1,
            }}
          >
            {openSideHandler ? (
              <IconButton
                sx={{ display: { xs: "inherit", md: "none" } }}
                onClick={openSideHandler}
              >
                {openSide ? <MenuOpen /> : <Menu />}
              </IconButton>
            ) : null}

            {inicia === false ? (
              <img
                className="img-titulo-chat"
                src={contenidofoto}
                alt={nombre}
              />
            ) : (
              ""
            )}
            {inicia === false ? (
              <label className="nombre-chat">{nombre}</label>
            ) : (
              ""
            )}
          </Box>
        </Box>
        {inicia === false ? (
          <Box
            sx={{ paddingTop: "10px", marginRight: !fixed ? 0 : "10px" }}
            className="chat-msgs"
          >
            {msgs.length !== 0 &&
            msgs !== undefined &&
            msgs !== null &&
            !msgs.error ? (
              <>
                {msgs.map((item, i) => (
                  <Box
                    sx={{
                      padding: "1px",
                      display: "flex",
                      width: "100%",
                      justifyContent:
                        item.userOut === sessionStorage.getItem("user")
                          ? "flex-end"
                          : "flex-start",
                    }}
                  >
                    <Typography
                      sx={{
                        padding: "5px",
                        borderRadius: "5px",
                        color: "aliceblue",
                        background:
                          item.userOut === sessionStorage.getItem("user")
                            ? "blue"
                            : "gray",
                      }}
                      variant="span"
                      className="msgs"
                    >
                      {item.desc}
                    </Typography>
                  </Box>
                ))}
              </>
            ) : (
              ""
            )}
          </Box>
        ) : (
          ""
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
          }}
          component="form"
        >
          <TextField
            id="texto"
            value={texto}
            size="small"
            sx={{ div: { borderRadius: "25px" }, width: "100%" }}
            placeholder="<mensaje a enviar>"
            onChange={handleInput}
            type="text"
            required
          />
          {!sendingMessage ? (
            <Button
              variant="contained"
              sx={{
                borderRadius: "100%",
                minWidth: 0,
                minHeight: 0,
                width: "36px",
                height: "36px",
                marginRight: !fixed ? 0 : "10px",
              }}
              className="button-enviar"
              type="submit"
              onClick={enviar}
            >
              <Send sx={{ fontSize: "20px" }} />
            </Button>
          ) : (
            <CircularProgress sx={{ marginRight: !fixed ? 0 : "10px" }} />
          )}
        </Box>
      </Paper>
    </>
  );
};

export default ChatDialogo;
