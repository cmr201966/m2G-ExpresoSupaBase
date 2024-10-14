// components
// 
import { useNavigate } from "react-router-dom"

// styles
import "./styles.css";
import { useEffect } from "react";


const Cerrarsesion = () => {
    const navigate = useNavigate();
    async function init() 
    {
        console.log("Cerrar session")
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("usernombre");
        sessionStorage.removeItem("tipouser");
        sessionStorage.removeItem("celular");
        sessionStorage.removeItem("fijo");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("dpostal");
        sessionStorage.removeItem("desc");
        sessionStorage.removeItem("userprovincia")
        navigate("/");
    }

    useEffect(() => {
        init()
    }, [])
    return (
        <>
        </>
    );


};

export default Cerrarsesion;
