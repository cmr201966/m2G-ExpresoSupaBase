import Navbar from "../../components/Navbar/Navbar"
import Hero from "../../layouts/Hero/Hero";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom"


const Ubicacion = () => {

    const navigate = useNavigate();
  
    return (
      <div>   
      <Navbar nivel={1}/>
      <Hero>
        <div className="cabeza">
              <IconButton color="primary" onClick={() => {
                navigate(`/?nivel=0`);
              }}>
                <ArrowBack className="flecha"/>
              </IconButton>

            <h3 className="acercade-title">Atrás</h3>
        </div>
        <div>
          <p>Ubicacion</p>
        </div>
      </Hero>
            
      </div>
    );
  };
  
  export default Ubicacion;
