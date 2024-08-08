// components
import Navbar from "../../components/Navbar/Navbar"

// layouts
import Hero from "../../layouts/Hero/Hero";

// 
import { useNavigate } from "react-router-dom"

// styles
import "./styles.css";

import { useState } from "react";
import axios from "axios";



const Login = () => {
  const navegar = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [resultado, setResultado] = useState("");

async function verificauser(user)
{
  // Si el producto del usuario es movil pedir GPS
  // Input y Icono para mostrar Mapa que sea opcional
  // sino mapa debe teclear ubicacion Ej: Plaza de marte
}

  function handleInput(e) {
    switch (e.target.id) {
      case "user":
        setUser(e.target.value);
        verificauser(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  }

  async function confirmalogin(e) {
    e.preventDefault();
    const result = await axios.post(
      "http://localhost:3001/login",
      { user, password },
      {}
    );
    const data = await result.data;
    if (data.error) 
    {
      setResultado(data.error);
    } 
    else 
    {
      sessionStorage.setItem("user", data.iduser);
      sessionStorage.setItem("usernombre", data.nombre);
      sessionStorage.setItem("tipouser", data.tipouser);
      sessionStorage.setItem("usercelular", data.celular);
      sessionStorage.setItem("userfijo", data.fijo);
      sessionStorage.setItem("useremail", data.email);
      sessionStorage.setItem("userprovincia", data.provincia);
      sessionStorage.setItem("usermunicipio", data.municipio);

      navegar("/"); // ir a home
      
    } //data.error

  } //confirmalogin

  return (
    
    <div>
      <Navbar
        links={[
          { label: "Inicio", to: "/",tooltips: "Ir a la página principal" },
          { label: sessionStorage.getItem("user") === null ? "Iniciar sesión" : "Cerrar sesión", to: sessionStorage.getItem("user") === null ? "/login" : "/cerrarsesion", tooltips: sessionStorage.getItem("user") === null ? "Abrir sesión" : "/Cerrar la sesión de " + sessionStorage.getItem("usernombre") },
          { label: "Registrarse", to: "/registrarse?inserta=true", tooltips: "Crear una cuenta de usuario" },
          { label: "Acerca de", to: "/Acercade", tooltips: "Acerca de Destodo" },
        ]}
      />
      <Hero>
        <h3 className="main-title">M2G-Destodo</h3>
        <div className="login">
          <div className="container-login">
            <h4 className="title-1">Iniciar sesión</h4>
            <div className="input-area">
              <label>Usuario:</label>
              <input
                id="user"
                value={user}
                onChange={handleInput}
                type="text"
                required
              />
            </div>
            <div className="input-area">
              <label>Contraseña:</label>
              <input
                id="password"
                value={password}
                onChange={handleInput}
                type="password"
                required
              />
            </div>
            {
              resultado !== "" && <label className="err">{resultado}</label>
            }

            <div className="grupo-button-login">
              <button type="button" className="confirmarlogin button-login primary" onClick={confirmalogin}>
                Confirmar
              </button>
            </div>

          </div>
        </div>

      </Hero>
    </div>


  );
};

export default Login;
