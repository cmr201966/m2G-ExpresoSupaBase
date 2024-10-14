import Navbar from "../../components/Navbar/Navbar"
import Hero from "../../layouts/Hero/Hero";
import { useNavigate } from "react-router-dom"
import { login } from "../../servicios/login";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./styles.css";



const Login = () => {
  const navegar = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [resultado, setResultado] = useState("");
  const parsedParams = {};
  const location = useLocation();
  async function init() {
    if (parsedParams.login!== undefined && parsedParams.login!== 'undefined' && parsedParams.login!== null && parsedParams.login!== 'null'){
      sessionStorage.setItem("login", parsedParams.login);
   }
   else sessionStorage.setItem("login", null);
   if (parsedParams.regreso!== undefined && parsedParams.regreso!== 'undefined' && parsedParams.regreso!== null && parsedParams.regreso!== 'null'){
    sessionStorage.setItem("ruta", parsedParams.regreso);
 }
 else sessionStorage.setItem("regreso", null);

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
      console.log(result.provincia, result.municipio)
      sessionStorage.setItem("user", result.iduser);
      sessionStorage.setItem("usernombre", result.nombre);
      sessionStorage.setItem("tipouser", result.tipouser);
      sessionStorage.setItem("usercelular", result.celular);
      sessionStorage.setItem("userfijo", result.fijo);
      sessionStorage.setItem("useremail", result.email);
      sessionStorage.setItem("userprovincia", result.provincia);
      sessionStorage.setItem("usermunicipio", result.municipio);
      const ruta = sessionStorage.getItem("regreso") + "?regreso=1";
      if ((sessionStorage.getItem("login")==="1") || (sessionStorage.getItem("login")===1)){
         navegar(ruta)
      } else
         navegar("/?nivel=0"); 
      
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
  }, []);



  return (

    <div>
      <Navbar nivel={1} />
      <Hero>
        <div className="login">
          <div className="container-login">
            <h4 className="title-1">Iniciar sesión</h4>
            <div className="input-area-login">
              <label>Usuario:</label>
              <input
                id="user"
                value={user}
                onChange={handleInput}
                type="text"
                required
              />
            </div>
            <div className="input-area-login">
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
