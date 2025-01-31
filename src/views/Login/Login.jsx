import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// utils
import { isValid } from "../../Utiles/Utiles";
import { loginCM } from "../../Utiles/apiBaseDatos";

// components
import Navbar from "../../components/Navbar/Navbar";

// layouts
import Hero from "../../layouts/Hero/Hero";

// context
import { useNotification } from "../../context/NotificationProvider";

// @mui/icons
import { Check } from "@mui/icons-material";
// @mui/material
import { CircularProgress } from "@mui/material";

// styles
import "./styles.css";

const Login = () => {
  const navegar = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const { setOpen, setMessage } = useNotification();
  const parsedParams = {};
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  async function init() {
    if (isValid(parsedParams.login) === true) {
      sessionStorage.setItem("login", parsedParams.login);
    } else sessionStorage.setItem("login", null);
    if (isValid(parsedParams.regreso) === true) {
      sessionStorage.setItem("ruta", parsedParams.regreso);
    } else sessionStorage.setItem("regreso", null);
  }

  function handleInput(e) {
    switch (e.target.id) {
      case "user":
        setUser(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  }

  async function confirma(e) {
    setLoading(true);
    e.preventDefault();
    let result = await loginCM(user, password);
    //    let result = await apiBaseDatos("login", user, password);
    setLoading(false);
    if (
      isValid(result.error) === true ||
      isValid(result.length) === false ||
      result.length === 0
    ) {
      setMessage("Usuario o contraseña incorrecto");
      setOpen(true);
    } else {
      sessionStorage.setItem("user", result[0].iduser);
      sessionStorage.setItem("usernombre", result[0].nombre);
      sessionStorage.setItem("tipouser", result[0].tipouser);
      sessionStorage.setItem("usercelular", result[0].celular);
      sessionStorage.setItem("userprovincia", result[0].provincia);
      sessionStorage.setItem("usermunicipio", result[0].municipio);
      const ruta = sessionStorage.getItem("regreso") + "?regreso=1";
      if (sessionStorage.getItem("login") === "1") {
        navegar(ruta);
      } else navegar("/?nivel=0");
    }
  }

  useEffect(() => {
    const localParams = location.search.substring(1).split("&");
    localParams.forEach((item) => {
      const [paramName, paramValue] = item.split("=");
      parsedParams[paramName] = paramValue;
    });
  }, [location]);

  useEffect(() => {
    init();
    const inputElement = document.getElementById("user");
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  return (
    <div>
      <Navbar nivel={9999} />
      <Hero clase={"hero-section"}>
        <div className="login">
          <form onSubmit={confirma} className="container-login">
            <h4 className="title-1">Iniciar sesión</h4>
            <div className="input-area-login">
              {/*<p>Usuario</p>*/}
              <input
                id="user"
                placeholder="Usuario"
                value={user}
                onChange={handleInput}
                type="text"
                required
              />
            </div>
            <div className="input-area-login">
              {/*<p>Contraseña</p>*/}
              <input
                id="password"
                placeholder="Contraseña"
                value={password}
                onChange={handleInput}
                type="password"
                required
              />
            </div>
            <div className="grupo-button-login">
              <button type="submit" className="button-login primary">
                {loading ? (
                  <CircularProgress color="inherit" size={18} />
                ) : (
                  <Check className="addcss-login" />
                )}
                <span>Iniciar</span>
              </button>
            </div>
          </form>
        </div>
      </Hero>
    </div>
  );
};

export default Login;
