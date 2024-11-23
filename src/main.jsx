import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FilterProvider } from "./context/FilterProvider";
import { ThemeProvider } from "@mui/material";
import dark from "./assets/theme/tema";
import { NotificationProvider } from "./context/NotificationProvider";
import Notification from "./components/Notification/Notification";

import Login from "./views/Login/Login";
import Productos from "./views/Productos/Productos";
import Negocios from "./views/Negocios/Negocios";
import Catproductos from "./views/Catproductos/Catproductos";
import Registrarse from "./views/Registrarse/Registrarse";
import Acercade from "./views/Acercade/Acercade";
import CerrarSesion from "./views/CerrarSesion/CerrarSesion";
import Home from "./views/Home/Home";
import Galerias from "./views/Galerias/Galerias";
import InfoProducto from "./views/InfoProducto/InfoProducto";
import InfoNegocio from "./views/infoNegocio/InfoNegocio";
import Anuncios from "./views/Anuncios/Anuncios";
import Whatsapp from "./views/Whatsapp/Whatsapp";
import Ubicacion from "./views/Ubicacion/Ubicacion";
import Categorias from "./views/Categorias/Categorias";
import CatCategorias from "./views/CatCategorias/CatCategorias.jsx";
import ActivarUsuarios from "./views/ActivarUsuarios/ActivarUsuarios.jsx";
import ActivarProductos from "./views/ActivarProductos/ActivarProductos.jsx";

import "tippy.js/dist/tippy.css";
import "./index.css";
sessionStorage.setItem("sgbd", "SUPABASE");
//sessionStorage.setItem("sgbd","MYSQL");

// font
import "@fontsource/poppins";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Suspense>
    <FilterProvider>
      <ThemeProvider theme={dark}>
        <NotificationProvider>
          <Notification />
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/productos" element={<Productos />} />
              <Route exact path="/negocios" element={<Negocios />} />
              <Route exact path="/catproductos" element={<Catproductos />} />
              <Route exact path="/registrarse" element={<Registrarse />} />
              <Route exact path="/acercade" element={<Acercade />} />
              <Route exact path="/cerrarsesion" element={<CerrarSesion />} />
              <Route exact path="/galerias" element={<Galerias />} />
              <Route exact path="/infoproducto" element={<InfoProducto />} />
              <Route exact path="/infonegocio" element={<InfoNegocio />} />
              <Route exact path="/anuncios" element={<Anuncios />} />
              <Route exact path="/whatsapp" element={<Whatsapp />} />
              <Route exact path="/ubicacion" element={<Ubicacion />} />
              <Route exact path="/categorias" element={<Categorias />} />
              <Route exact path="/catcategorias" element={<CatCategorias />} />
              <Route exact path="/activarusuarios" element={<ActivarUsuarios />} />
              <Route exact path="/activarproductos" element={<ActivarProductos />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </ThemeProvider>
    </FilterProvider>
  </Suspense>
);
