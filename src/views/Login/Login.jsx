      {/*
        links={[
          { label: "Inicio", to: "/",tooltips: "Ir a la página principal" },
          { label: sessionStorage.getItem("user") === null ? "Iniciar sesión" : "Cerrar sesión", to: sessionStorage.getItem("user") === null ? "/login" : "/cerrarsesion", tooltips: sessionStorage.getItem("user") === null ? "Abrir sesión" : "/Cerrar la sesión de " + sessionStorage.getItem("usernombre") },
          { label: "Registrarse", to: "/registrarse?inserta=true", tooltips: "Crear una cuenta de usuario" },
          { label: "Acerca de", to: "/Acercade", tooltips: "Acerca de Destodo" },
        ]}
          */}



// components
import Navbar from "../../components/Navbar/Navbar"

// layouts
import Hero from "../../layouts/Hero/Hero";

// 
import { useNavigate } from "react-router-dom"

// styles
import "./styles.css";

import { useState } from "react";
import { login } from "../../servicios/login";



const Login = () => {
  const navegar = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [resultado, setResultado] = useState("");

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

  async function confirmalogin(e) {
    e.preventDefault();

    let result = await login({user, password});
    result = await result.json();

    if (result.error) 
    {
      setResultado(result.error);
    } 
    else 
    {
      sessionStorage.setItem("user", result.iduser);
      sessionStorage.setItem("usernombre", result.nombre);
      sessionStorage.setItem("tipouser", result.tipouser);
      sessionStorage.setItem("usercelular", result.celular);
      sessionStorage.setItem("userfijo", result.fijo);
      sessionStorage.setItem("useremail", result.email);
      sessionStorage.setItem("userprovincia", result.provincia);
      sessionStorage.setItem("usermunicipio", result.municipio);
      navegar("/?nivel=0"); 
      
    } 

  } 

  return (

    <div>
      <Navbar nivel={1} />
      <Hero>
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
