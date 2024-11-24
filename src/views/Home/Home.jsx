import { useEffect, useRef } from "react";

// styles
import "./styles.css";

const Home = () => {
  const linkRef = useRef(null);
  useEffect(() => {
    // Simula un clic en el <a>
    if (linkRef.current) {
      linkRef.current.click();
    }
  }, []);

  return (
    <a
       ref={linkRef}
       href={"https://expreso-stgo.web.app/"}
       target="_blank"
       rel="noopener noreferrer"
    >
      Este sitio cambio click para ir al sitio nuevo
    </a>
  );
};

export default Home;
