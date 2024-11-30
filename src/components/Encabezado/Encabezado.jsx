import { IconButton } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

// styles
import "./styles.css";

const Encabezado = (props) => {
  const { children } = props;

  let donde = sessionStorage.getItem("deDonde");
  const navigate = useNavigate();

  function regresa() {
    navigate(
      donde === "Home"
        ? `/?nivel=${0}`
        : `/productos?nivel=${0}&categoria=${sessionStorage.getItem(
            "categoria"
          )}`
    );
  }

  return (
    <div className="encabezado">
      <IconButton color="primary" onClick={regresa}>
        <ArrowBack className="color-flecha" />
      </IconButton>
      {children}
    </div>
  );
};

export default Encabezado;
