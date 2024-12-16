import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../layouts/Hero/Hero";
import Encabezado from "../../components/Encabezado/Encabezado";
import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { getUsuariosCM, setActivaUsuarioCM } from "../../Utiles/apiBaseDatos";
import "./styles.css";

const Activar = () => {
  const [inicio, setInicio] = useState(true);
  const [arrayUsuarios, setArrayUsuarios] = useState([]);

  async function init() {
    setArrayUsuarios(await getUsuariosCM(false));
    setInicio(false);
  }

  const activarUsuario = async (iduser) => {
    try {
      await setActivaUsuarioCM(iduser);
      init();
    } catch (error) {
      console.error("Error al activar el usuario:", error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="Info-Productos">
      <Navbar nivel={1} />
      <Hero>
        {inicio === true ? (
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
        ) : null}
        <Encabezado   clase={"encabezado"}/>
        {inicio === false ? (
          <div className="div-papa-categorias-1">
            <main className="main-info-producto">
              <p className="strong margen-catnegocio">
                Usuarios Pendientes de Activación
              </p>
              <div className="activar-usuarios">
                <table>
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Nombre</th>
                      <th>Celular</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arrayUsuarios.map((item) => (
                      <tr key={item.iduser}>
                        <td>{item.iduser}</td>
                        <td>{item.nombre}</td>
                        <td>{item.celular}</td>
                        <td>
                          <button onClick={() => activarUsuario(item.iduser)}>
                            Activar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        ) : (
          ""
        )}
      </Hero>
    </div>
  );
};

export default Activar;
