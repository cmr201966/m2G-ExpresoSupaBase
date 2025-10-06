import React from "react";
import "./Footer.css";
import { MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      {/* 🔹 Franja superior violeta */}
      <div className="footer-top-bar"></div>

      <div className="footer-container">

        {/* 🔹 Columna 1: Descripción */}
        <div className="footer-about">
          <h3>HABUN</h3>
          <p>
            Jabones artesanales hechos con amor y respeto por la naturaleza.
            Cada pieza es única, creada para cuidar tu piel y el planeta.
          </p>
        </div>

        {/* 🔹 Columna 2: Enlaces */}
        <div className="footer-links">
          <h4>Enlaces útiles</h4>
          <ul>
            <li><a href="#productos">Productos</a></li>
            <li><a href="#nosotros">Sobre nosotros</a></li>
            <li><a href="#contacto">Contacto</a></li>
            <li><a href="#faq">Preguntas frecuentes</a></li>
          </ul>
        </div>

        {/* 🔹 Columna 3: Contacto */}
        <div className="footer-contact">
          <h4>Contacto</h4>
          <p><MapPin size={16} className="inline text-[rgb(202,94,228)] mr-1" /> México DF</p>
          <p><Phone size={16} className="inline text-[rgb(202,94,228)] mr-1" />  +52 1 56 5710 7360</p>
          <p>✉️ contacto@habun.com</p>
          <div className="footer-social">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p> © 2025 HABUN - Amor a tu piel </p>
        <p> Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
