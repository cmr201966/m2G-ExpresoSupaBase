import { useNavigate } from "react-router-dom";

// components
import Navbar from "../../components/Navbar/Navbar";

// layouts
import Hero from "../../layouts/Hero/Hero";

// styles
import "./styles.css";

// @mui/icons
import {
  ArrowBack,
} from "@mui/icons-material";
//import {  CreaTablaBaseDatos} from "../../Utiles/apiBaseDatos";

// @mui/material
import { IconButton } from "@mui/material";

const Vista404 = () => {
  const parsedParams = {};
  const navigate = useNavigate();
  
    return (
    <div>
      <Navbar nivel={1} />
      <Hero>
        <div className="encabezado">
          {parsedParams.nivel === 0 ? (
            ""
          ) : (
            <IconButton
              color="primary"
              onClick={() => {
                navigate(`/?nivel=${sessionStorage.getItem("nivel")}`);
              }}
            >
              <ArrowBack className="color-flecha" />
            </IconButton>
          )}
        </div>
        <div className="vista404">
            <h3>La página que buscas no existe.</h3>
        </div>
      </Hero>
    </div>
  );
};

export default Vista404;
