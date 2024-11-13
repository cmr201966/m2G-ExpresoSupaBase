import { IconButton } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

// styles
import "./styles.css";


const Encabezado = () => {
    const navigate = useNavigate();

    return (
      <>
      <div className="grip-flecha">
         <div></div>
         <div className="encabezado">
                <IconButton
                  color="primary"
                  onClick={() => {
                  navigate(`/?nivel=${0}`)}}
                >
                <ArrowBack className="color-flecha" />
                </IconButton>
                {/*<h4 className="color-encabezado">Atrás</h4>*/}
          </div>
          <div></div>
      </div>        
        </>
  );
};

export default Encabezado;
