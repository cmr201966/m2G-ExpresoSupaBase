import Navbar from "../../components/Navbar/Navbar"
import Hero from "../../layouts/Hero/Hero";
import { useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";
import Encabezado from "../../components/Encabezado/Encabezado";
import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { isValid, buscarEnArreglo,} from "../../Utiles/Utiles";
import { getCategoriasNegociosCM } from "../../Utiles/apiBaseDatos";
import "./styles.css";


const Categorias = () => {
    const navigate = useNavigate();
    const [inicio, setInicio] = useState(true);
    const [categoria, setCategoria] = useState(0);
    const [arrayCategorias, setArrayCategorias] = useState([]);
    const arraynoCategorias = [{ categorianegocio: 99999999, desc: "Desconocida" }];

    async function init() {
      let resultcategorias = await getCategoriasNegociosCM();
      //    let resultcategorias = await apiBaseDatos("getCategoriasNegocios")
          if (isValid(resultcategorias)===false || isValid(resultcategorias.length) === false)
          {
            setArrayCategorias(arraynoCategorias);
            setCategoria(arraynoCategorias[0].categorianegocio);
          }
          else 
          {
            setArrayCategorias(resultcategorias);
            setCategoria(  buscarEnArreglo(resultcategorias, resultcategorias[0].categorianegocio, "categorianegocio"));     
          }
      setInicio(false);
    }

    async function handleInput(e) {
     switch (e.target.id) {
       case "categorianegocio":
           setCategoria(e.target.value);
           break;
      default:
         break;
     }
   }

   async function confirmar() {
    navigate(`/productos?categoria=${arrayCategorias[categoria].categorianegocio}&nombre=${arrayCategorias[categoria].nick}&user=${sessionStorage.getItem("user")}`);
  }

   
    useEffect(() => {
      init();
    }, []);
  
  
    return (
    
      <div className="Info-Productos">
      <Navbar
         nivel={1}
      />
      <Hero>
      {inicio===true ? (
            <Box
              sx={{
                width: "100%",
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress color="checkbox" />
            </Box>
          ) : null
      }
      {inicio===false?
        <div className="div-papa-categorias-1">
          <Encabezado/>
          <main className="main-info-producto">
             <p className="strong margen-catnegocio"> Ir a categoria</p>
             <select className="select-categorias-1" id="categorianegocio" onChange={handleInput} value={categoria}>
                   {arrayCategorias.map((item, i) => {
                      return <option key={i} value={i} >{item.nick}</option>
                   })}
              </select>

              <div className="grupo-button-categorias">
                  {inicio===false ?
                      <button type="button" className="categoria-1 producto-button primary" onClick={confirmar}>
                            < Search />
                      </button>:""
                  }
                </div>
          </main>          
        </div>:""
        }
      </Hero>
    </div>
      
    );
  };
  
  export default Categorias;
