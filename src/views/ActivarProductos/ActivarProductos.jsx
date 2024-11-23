import Navbar from "../../components/Navbar/Navbar"
import Hero from "../../layouts/Hero/Hero";
import Encabezado from "../../components/Encabezado/Encabezado";
import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { 
    getProductosActivaCM, setProductosActivaCM } 
   from "../../Utiles/apiBaseDatos";
import "./styles.css";


const ActivarProductos = () => {
    const [inicio, setInicio] = useState(true);
    const [arrayProductos, setArrayProductos] = useState([]);

    async function init() {
      setArrayProductos(await getProductosActivaCM(false));
      setInicio(false);
    }

   const activarUsuario = async (idproducto) => {
    try {
        await setProductosActivaCM(idproducto);
        init();
    } catch (error) {
        console.error('Error al activar el producto:', error);
    }
};

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
             <p className="strong margen-catnegocio">Productos Pendientes de Activación</p>
             <div className="activar-usuarios">
               <table>
                <thead>
                    <tr >
                        <th>Producto</th>
                        <th >Nombre</th>
                    </tr>
                </thead>
                <tbody>
                    {arrayProductos.map(item => (
                        <tr key={item.iduser}>
                            <td>{item.iduser}</td>
                            <td>{item.nick}</td>
                            <td>
                                <button onClick={() => activarUsuario(item.iduser)}>Activar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
               </table>
            </div>
          </main>          
        </div>:""
        }
      </Hero>
    </div>
      
    );
  };
  
  export default ActivarProductos;
