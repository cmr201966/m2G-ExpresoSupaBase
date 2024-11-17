import { useState } from "react";
import { useNavigate } from "react-router-dom";

// @mui/material
import { IconButton } from "@mui/material";
// @mui/icons
import { Search } from "@mui/icons-material";

function SearchWrapper() {
  const navigate = useNavigate();

  const [buscar, setBuscar] = useState("");

  function handleInput(e) {
    switch (e.target.id) {
      case "buscar":
        setBuscar(e.target.value);
        break;
      default:
        break;
    }
  }

  function buscaProductos(e) {
    e.preventDefault();
    navigate(`/productos?buscar=${buscar}&user=${sessionStorage.getItem("user")}&nombre=Filtro: '${buscar}'`);
  }

  return (
    <>
      <div className="input-lupa">
        <form onSubmit={buscaProductos}>
          <input
            className="buscar-input"
            id="buscar"
            placeholder="Buscar productos"
            value={buscar}
            onChange={handleInput}
            type="text"
          />
          <IconButton className="lupa" id="lupa" color="primary" type="submit">
            <Search />
          </IconButton>
        </form>
      </div>
    </>
  );
}

export default SearchWrapper;
