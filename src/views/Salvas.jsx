//import Modal from "../../components/Modal/Modal";
//import Map from "../../components/Map/MapBox";
//import Check from "@mui/icons-material/Check";
//import FilterAltOff from "@mui/icons-material/FilterAltOff";
//import { getparesgpsnaturaleza } from "../../servicios/naturalezas";
//import { LegendToggle, LensTwoTone } from "@mui/icons-material";

//import { getprovincias, getmunicipios  } from "../../servicios/catalogos";


/*
  const [arrayprovincias, setArrayprovincias] = useState([]);
  const [provincia, setProvincia] = useState("");
  const [arraymunicipios, setArraymunicipios] = useState([]);
  const [tmunicipios, setTmunicipios] = useState([]);
  const arraynomunicipios = [
    { idmunicipio: 999999, municipio: 999999, desc: "No hay municipios" },
  ];
  const [municipio, setMunicipio] = useState("");
  */


  /*
  let item;
  const arraytusuarios = [
    { tipouser: 0, desc: "DesTodo" },
    { tipouser: 1, desc: "Dueño" },
  ];
  const arrayopciones = [
    { opcion: "Cualquier parte del campo" },
    { opcion: "Hacer coincidir todo el campo" },
    { opcion: "Comienzo del campo" },
  ];
  */

  /*
  const [arrayproductos, setArrayproductos] = useState([]);
  const arraynoproductos = [{ producto: 999999, desc: "No hay productos" }];
  const [tproductos, setTproductos] = useState([]);
  const [producto, setProducto] = useState(0);
  const [desc, setDesc] = useState("");
*/

/*
  //
  // Ubicacion
  //
  let mprovincia = sessionStorage.getItem("provincia");
  let mmunicipio = sessionStorage.getItem("municipio");
  //
  // Naturaleza
  //
  let mnaturaleza = sessionStorage.getItem("naturaleza");

  //
  // Negocio-Productos
  //
  let mtnegocio = sessionStorage.getItem("tnegocio");
  let mnegocio = sessionStorage.getItem("negocio");
  let mproducto = sessionStorage.getItem("producto");
  //
  // Atributos
  //
  let mdesc = sessionStorage.getItem("desc");
  let mprecio = sessionStorage.getItem("precio");
  let mdomicilio = sessionStorage.getItem("domicilio");
  let mabierto = sessionStorage.getItem("abierto");
  // Fin estados del filtro

*/


//  const [domicilio, setDomicilio] = useState(0);
//  const [abierto, setAbierto] = useState(0);


//const centerPoint = [20.0217583, -75.829090519]; 
//let distanciaArriba = .5; // en km
//let distanciaAbajo = .5; // en km
//let distanciaIzquierda = .5; // en km
//let distanciaDerecha = .5; // en km

{/*
    let result1 = await getproductos({naturaleza: sessionStorage.getItem("pnaturaleza"), desc: sessionStorage.getItem("pdesc"),condicion: sessionStorage.getItem("pcondicion"),
                                      tipo: sessionStorage.getItem("ptipo"), condicion_filter, naturalezas: sessionStorage.getItem("pnaturalezas")});*/}


    //
    // poner nombre en cooki
    //
    /*
    setNombre(sessionStorage.getItem("pdesc"));
    sessionStorage.setItem("filtro", "Productos");
    if (
      sessionStorage.getItem("filtro_productos") === null ||
      sessionStorage.getItem("filtro_productos") === "" ||
      sessionStorage.getItem("filtro_productos") === undefined
    ) {
      //condicion_filter = "";
      sessionStorage.removeItem("provincia");
      sessionStorage.removeItem("municipio");
      sessionStorage.removeItem("poblado");
      sessionStorage.removeItem("reparto");
      sessionStorage.removeItem("cercade");
      sessionStorage.removeItem("tnegocio");
      sessionStorage.removeItem("negocio");
      sessionStorage.removeItem("producto");
      sessionStorage.removeItem("desc");
      sessionStorage.removeItem("precio");
      sessionStorage.removeItem("domicilio");
      sessionStorage.removeItem("abierto");
    } else {
      //condicion_filter = forma_condicion();
    }
      */


/*
  function onModalClose() {
    setFilterState({ type: "set", newvalue: false });
  }
*/


    /*
    console.log(sessionStorage.getItem("categoria"))
    let resultproductos = await getproductoscategoria({categoria: sessionStorage.getItem("categoria")});
    resultproductos = await resultproductos.json();
    console.log("605", resultproductos);
    if (resultproductos.error || resultproductos.length === 0) {
      setArrayproductos(arraynoproductos);
      setTproductos(arraynoproductos);
    } else {
      setArrayproductos(resultproductos);
      // filtrar los productos del primer negocio
      let ttarrayproductos = [];
      console.log(sessionStorage.getItem("categoria"));
      ttarrayproductos = resultproductos.filter((item) => {
        if (item.categorianegocio === Number(sessionStorage.getItem("categoria"))) {
          return item;
        }
      });
      if (ttarrayproductos.length !== 0) {
        setTproductos(ttarrayproductos);
      } else {
        setTproductos(arraynoproductos);
        ttarrayproductos = arraynoproductos;
      }
      {console.log("625", ttarrayproductos)}
    }
    setProducto(0);
    */



    /*
    let resultprovincias = await getprovincias({});
    resultprovincias = await resultprovincias.json();
    if (!resultprovincias.error && resultprovincias.length !== 0) {
      setArrayprovincias(resultprovincias);
    }
    setProvincia(0);

    let ttmunicipios = [];
    let resultmunicipios = await getmunicipios({});
    resultmunicipios = await resultmunicipios.json(); 
    
    if (resultmunicipios.error || resultmunicipios.length === 0) {
      setArraymunicipios(arraynomunicipios);
      setTmunicipios(arraynomunicipios);
      ttmunicipios = arraynomunicipios;
    } else {
      setArraymunicipios(resultmunicipios);
      ttmunicipios = resultmunicipios.filter((item, i) => {
        if (item.provincia === resultprovincias[0].provincia) {
          return item;
        }
      });
      if (ttmunicipios.length !== 0) {
        setTmunicipios(ttmunicipios);
      } else {
        setTmunicipios(arraynomunicipios);
      }
    }
    setMunicipio(0);
    //setShow(filterState.show);
    setInicia(false);
    */


  /*
  const centerMapOnAddress = async (address) => {
    try {
      const { longitude, latitude } = await geocodeAddress(address);
      setLat(latitude);
      setLng(longitude);
      setZoom(12.5);
      setToFly({ latitude: latitude, longitude: longitude, zoom: 14.5 });
    } catch (error) {
      console.error(error);
    }
  };
*/

/*
let bbox = createBoundingBox(centerPoint, distanciaArriba, distanciaAbajo, distanciaIzquierda, distanciaDerecha);
  const geocodeAddress = async (address) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${config.mapBoxAPI}`
    );
    const data = await response.json();

    if (data.features.length > 0) {
      const [longitude, latitude] = data.features[0].geometry.coordinates;
      return { longitude, latitude };
    } else {
      throw new Error("No se encontraron resultados.");
    }
  };
*/


{/*
switch (e.target.id) {
  case "cbubicacion":
    setCbubicacion(e.target.checked);
    break;
  case "cbprovincia":
    setCbprovincia(e.target.checked);
    cambia_provincia_cb(e.target.checked);
    break;
    
  case "provincia":
    setProvincia(e.target.value);
    cambia_provincia(e.target.value);
    break;
    
  case "cbmunicipio":
    setCbmunicipio(e.target.checked);
    cambia_municipio_cb(e.target.checked);
    break;
    
  case "municipio":
    setMunicipio(e.target.value);
    {
      }       
    }
    break;
    
  case "cbnaturaleza":
    setCbnaturaleza(e.target.checked);
    break;
    
  case "naturaleza":
    setNaturaleza(e.target.value);
    break;
    
  case "cbnegocioproducto":
    setCbnegocioproducto(e.target.checked);
    break;
  
  
  case "tnegocio":
    console.log("8888888888")
    setTnegocio(e.target.value);
    cambia_tipo_tnegocio(
      arraytnegocios[Number(e.target.value)].categorianegocio
    );
    break;
    
  case "cbtnegocio":
    setCbtnegocio(e.target.checked);
    cambia_tipo_tnegocio_cb(e.target.checked);
    break;
  
  case "negocio":
    setNegocio(e.target.value);
    cambia_negocio(tnegocios[Number(e.target.value)].idnegocio);
    break;
  case "cbnegocio":
    setCbnegocio(e.target.checked);
    cambia_negocio_cb(e.target.checked);
    break;
  
  
  case "producto":
    setProducto(e.target.value);
    break;
    
  case "cbproducto":
    setCbproducto(e.target.checked);
    cambia_producto_cb(e.target.checked);
    break;
  case "cbatributos":
    setCbatributos(e.target.checked);
    break;
  case "cbprecio":
    setCbprecio(e.target.checked);
    break;
    
  case "precio":
    setPrecio(e.target.value);
    centerMapOnAddress(e.target.value);
    break;
  case "desc":
    setDesc(e.target.value);
    break;
    
  case "cbdomicilio":
    setCbdomicilio(e.target.checked);
    break;
  case "domicilio":
    setDomicilio(e.target.value);
    break;
  case "verOtraVez":
    setVerOtraVez(e.target.checked);
    break;
  case "cbabiertosn":
    setCbabiertosn(e.target.checked);
    break;
  case "abierto":
    setAbierto(e.target.value);
    break;
  case "cbdesc":
    setCbdesc(e.target.checked);
    break;
  default:
    break;
}
}

function cambia_tipo_tnegocio(tnegocio) {
let ttarraynegocios = [];
setTnegocios(
  arraynegocios.filter((item, i) => {
    if (item.categorianegocio === tnegocio) {
      return item;
    }
  })
);
ttarraynegocios = arraynegocios.filter((item, i) => {
  if (item.categorianegocio === tnegocio) {
    return item;
  }
});
setTproductos(
  arrayproductos.filter((item, i) => {
    if (item.idnegocio === ttarraynegocios[0].idnegocio) {
      return item;
    }
  })
);
}









function cambia_negocio(negocio) {
setTproductos(
  arrayproductos.filter((item, i) => {
    if (item.idnegocio === negocio) {
      return item;
    }
  })
);
}





async function cambia_tipo_tnegocio_cb(cbtnegocio) {
let ttarraynegocios = [];
if (cbtnegocio) {
  // tnegocio true
  setTnegocio(0);
  if (cbnegocio) {
    // cbtnegocio y cbnegocio en true, mostrar negocios del primer tnegocio
    ttarraynegocios = arraynegocios.filter((item, i) => {
      if (item.categorianegocio === arraytnegocios[0].categorianegocio) {
        return item;
      }
    });
    if (ttarraynegocios.length !== 0) {
      setTnegocios(
        arraynegocios.filter((item) => {
          if (
            item.categorianegocio === arraytnegocios[0].categorianegocio
          ) {
            return item;
          }
        })
      );
    } else {
      setTnegocios(arraynonegocios);
    }
    setNegocio(0);
  }

  if (cbproducto) {
    //  producto en true
   
  }
} else {
  // tipo de negocio se apaga
  // comprobar cbnegocio,cbcproducto, cbproduco
  if (cbnegocio) {
    // tiponegocio false y cbnegocio en true
    // mostrar todos los negocios
    setTnegocios(arraynegocios);
    ttarraynegocios = arraynegocios;
    setNegocio(0);
  } //cbnegocio true
  if (cbproducto) {
    //tnegocio false producto true

  }
}
setTnegocio(0);
} // cambia_tipo_negocio_cb




async function cambia_negocio_cb(cbnegocio) {
let ttarraynegocios = [];
if (cbnegocio) {
  // cbnegocio cambia a true
  if (cbtnegocio) {
    // cbnegocio en true y cbtnegocio en true los negocios dependen
    // del tipo de negocio
    ttarraynegocios = arraynegocios.filter((item) => {
      if (
        item.categorianegocio === arraytnegocios[tnegocio].categorianegocio
      ) {
        return item;
      }
    });
    if (ttarraynegocios.length !== 0) {
      setTnegocios(
        arraynegocios.filter((item) => {
          if (
            item.categorianegocio ===
            arraytnegocios[tnegocio].categorianegocio
          ) {
            return item;
          }
        })
      );
    } else {
      setTnegocios(arraynonegocios);
    }
  } else {
    // tnegocio false mostrar todos los negocios
    setTnegocios(arraynegocios);
    ttarraynegocios = arraynegocios;
  }
  setNegocio(0);
  if (cbproducto) {
    // cbproducto a true verificar cbcproducto
    
  }
} // cbnegocio cambia a true
else {
  // cbnegocio cambia a false

  if (cbproducto) {
    // negocio false, producto true verificar cproducto y tnegocio

  }
}
}





async function cambia_producto_cb(cbproducto) {
if (cbproducto) {
  // producto true;
  // verificar cbcproducto, cbnegocio, cbtnegocio
}
} // cambia_producto_cb




function cambia_provincia(provincia) {
let ttmunicipios = [];
ttmunicipios = arraymunicipios.filter((item, i) => {
  if (item.provincia === arrayprovincias[provincia].provincia) {
    return item;
  }
});
if (ttmunicipios.length !== 0) {
  setTmunicipios(ttmunicipios);
} else {
  setTmunicipios(arraynomunicipios);
  ttmunicipios = arraynomunicipios;
}
setMunicipio(0);
}

function cambia_provincia_cb(cbprovincia) {
if (cbprovincia === false) {
  setCbmunicipio(false);
}
}

function cambia_municipio_cb(cbmunicipio) {
if (cbmunicipio !== false) {
  setCbprovincia(true);
}
}

function ayuda1() {
setContenido("Varios precios: 550,600,650 rango de precios: 700-1000");
setShow(true);
}

function confirmar() {
let filtro = false;
// Ubicación
if (cbprovincia === true) {
  sessionStorage.setItem("provincia", arrayprovincias[provincia].provincia);
  mprovincia = arrayprovincias[provincia].provincia;
  filtro = true;
} else {
  sessionStorage.removeItem("provincia");
  mprovincia = "";
}
if (cbmunicipio === true) {
  sessionStorage.setItem("municipio", tmunicipios[municipio].municipio);
  mmunicipio = tmunicipios[municipio].municipio;
  filtro = true;
} else {
  sessionStorage.removeItem("municipio");
  mmunicipio = "";
}
if (cbnaturaleza === true) {
  sessionStorage.setItem(
    "naturaleza",
    arraynaturalezas[naturaleza].idnaturaleza
  );
  mnaturaleza = arraynaturalezas[naturaleza].idnaturaleza;
  filtro = true;
} else {
  sessionStorage.removeItem("naturaleza");
  mnaturaleza = "";
}

if (cbtnegocio === true) {
  sessionStorage.setItem(
    "tnegocio",
    arraytnegocios[tnegocio].categorianegocio
  );
  mtnegocio = arraytnegocios[tnegocio].categorianegocio;
  filtro = true;
} else {
  sessionStorage.removeItem("tnegocio");
  mtnegocio = "";
}
if (cbnegocio === true) {
  sessionStorage.setItem("negocio", tnegocios[negocio].idnegocio);
  mnegocio = tnegocios[negocio].idnegocio;
  filtro = true;
} else {
  sessionStorage.removeItem("negocio");
  mnegocio = "";
}
if (cbproducto === true) {
  sessionStorage.setItem("producto", tproductos[producto].idproducto);
  mproducto = tproductos[producto].idproducto;
  filtro = true;
} else {
  sessionStorage.removeItem("producto");
  mproducto = "";
}
if (cbdesc === true) {
  sessionStorage.setItem("desc", desc);
  mdesc = desc;
  filtro = true;
} else {
  sessionStorage.removeItem("desc");
  mdesc = "";
}
if (cbprecio === true) {
  sessionStorage.setItem("precio", precio);
  mprecio = precio;
  filtro = true;
} else {
  sessionStorage.removeItem("precio");
  mprecio = "";
}
if (cbdomicilio === true) {
  sessionStorage.setItem("domicilio", cbdomicilio);
  mdomicilio = domicilio;
  filtro = true;
} else {
  sessionStorage.removeItem("domicilio");
  mdomicilio = "";
}
if (cbabiertosn === true) {
  sessionStorage.setItem("abierto", abierto);
  mabierto = abierto;
  filtro = true;
} else {
  sessionStorage.removeItem("abierto");
  mabierto = "";
}
if (filtro) {
  sessionStorage.setItem("filtro_productos", true);
  condicion_filter = forma_condicion();
  sessionStorage.setItem("condicion_filter", condicion_filter);
} else {
  sessionStorage.removeItem("filtro_productos");
  sessionStorage.setItem("condicion_filter", "");
  condicion_filter = "";
}
setFilterState({ type: "set", newvalue: false });
init1();
}

function borrarfiltro() {
setCbubicacion(false);
setCbprovincia(false);
setCbmunicipio(false);
setCbnegocioproducto(false);
setCbtnegocio(false);
setCbnegocio(false);
setCbproducto(false);
setCbatributos(true);
setCbdesc(false);
setDesc("");
setCbprecio(false);
setCbdomicilio(false);
setCbabiertosn(false);
sessionStorage.removeItem("filtro_productos");
sessionStorage.setItem("condicion_filter", "");
condicion_filter = "";
setFilterState({ type: "set", newvalue: false });
init1();
}
      <Modal
        visible={show}
        onClose={onModalClose9}
        className="cmodal wmodal"
        classContainer="modal-productos"
      >
        {inicia === false ? (
          <>
            <div className="cerrar-button">
              <button className="cerrar" onClick={onModalClose}>
                X
              </button>
            </div>
            <div className="modal-filter-title">
              <label className="label-filter-title">Filtrar</label>
            </div>

            <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>


              <div className="check-ubicacion">
                <Checkbox
                  className="cbox-ubicacion"
                  id="cbubicacion"
                  color="checkbox"
                  defaultChecked
                  checked={cbubicacion}
                  onClick={handleInput}
                />
                <label className="check-ubi">Ubicacion</label>
              </div>
              {cbubicacion ? (
                <>
                  <div className="check-ubicacion-provincia">
                    <Checkbox
                      className="cbox-ubicacion-provincia"
                      id="cbprovincia"
                      color="checkbox"
                      defaultChecked
                      checked={cbprovincia}
                      onClick={handleInput}
                    />
                    <label className="check-label-ubicacion-provincia">
                      Provincia
                    </label>
                    {cbprovincia ? (
                      <select
                        className="select-ubicacion-provincia"
                        id="provincia"
                        onChange={handleInput}
                        value={provincia}
                      >
                        {arrayprovincias.map((item, i) => {
                          return (
                            <option key={i} value={i}>
                              {item.desc}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="check-ubicacion-provincia">
                    <Checkbox
                      className="cbox-ubicacion-municipio"
                      id="cbmunicipio"
                      color="checkbox"
                      defaultChecked
                      checked={cbmunicipio}
                      onClick={handleInput}
                    />
                    <label className="check-label-ubicacion-municipio">
                      Municipio
                    </label>
                    {cbmunicipio ? (
                      <select
                        className="select-ubicacion-municipio"
                        id="municipio"
                        onChange={handleInput}
                        value={municipio}
                      >
                        {tmunicipios.map((item, i) => {
                          return (
                            <option key={i} value={i}>
                              {item.desc}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              ) : (
                ""
              )}

              <div>
                <Checkbox
                  className="cbox-negocio-producto"
                  id="cbnegocioproducto"
                  color="checkbox"
                  defaultChecked
                  checked={cbnegocioproducto}
                  onClick={handleInput}
                />
                <label className="check-neg-prod">Negocio-Productos</label>
              </div>
              {cbnegocioproducto ? (
                <>
                  <div className="cbox-negocioproducto">
                    <Checkbox
                      className="cbox-Tnegocio"
                      id="cbtnegocio"
                      color="checkbox"
                      defaultChecked
                      checked={cbtnegocio}
                      onClick={handleInput}
                    />
                    <label className="check-ubi">Tipo Negocio:</label>
                    {cbtnegocio ? (
                      <select
                        className="select-tnegocio"
                        id="tnegocio"
                        onChange={handleInput}
                        value={tnegocio}
                      >
                        {arraytnegocios.map((item, i) => {
                          return (
                            <option key={i} value={i}>
                              {item.desc}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="cbox-negocioproducto">
                    <Checkbox
                      className="cbox-negocio"
                      id="cbnegocio"
                      color="checkbox"
                      defaultChecked
                      checked={cbnegocio}
                      onClick={handleInput}
                    />
                    <label className="check-ubi">Negocios:</label>
                    {cbnegocio ? (
                      <select
                        className="select-negocio"
                        id="negocio"
                        onChange={handleInput}
                        value={negocio}
                      >
                        {tnegocios.map((item, i) => {
                          return (
                            <option key={i} value={i}>
                              {item.desc}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="cbox-negocioproducto">
                    <Checkbox
                      className="cbox-producto"
                      id="cbproducto"
                      color="checkbox"
                      defaultChecked
                      checked={cbproducto}
                      onClick={handleInput}
                    />
                    <label className="check-ubi">Productos:</label>
                    {cbproducto ? (
                      <select
                        className="select-productos"
                        id="producto"
                        onChange={handleInput}
                        value={producto}
                      >
                        {tproductos.map((item, i) => {
                          return (
                            <option key={i} value={i}>
                              {item.desc}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              ) : (
                ""
              )}


              <div>
                <Checkbox
                  className="cbox-atributos"
                  id="cbatributos"
                  color="checkbox"
                  checked={cbatributos}
                  onClick={handleInput}
                />
                <label className="check-neg-prod">Atributos-Productos</label>
              </div>
              {cbatributos ? (
                <>
                  <div className="atributos">
                    <Checkbox
                      className="cbox-desc"
                      id="cbdesc"
                      color="checkbox"
                      checked={cbdesc}
                      onClick={handleInput}
                    />
                    <label className="check-ubi">Descripción</label>
                    {cbdesc ? (
                      <>
                        <input
                          className="input-desc"
                          id="desc"
                          value={desc}
                          onChange={handleInput}
                          type="text"
                          placeholder="<disco duro>"
                          required
                        />
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="atributos">
                    <Checkbox
                      className="cbox-precio"
                      id="cbprecio"
                      color="checkbox"
                      checked={cbprecio}
                      onClick={handleInput}
                    />
                    <label className="check-ubi">Precio</label>
                    {cbprecio ? (
                      <>
                        <input
                          className="input-precio"
                          id="precio"
                          value={precio}
                          onChange={handleInput}
                          type="text"
                          placeholder="550,600,650,700-1000"
                          required
                        />
                        <Tippy content="Ayuda">
                          <button
                            type="button"
                            className="button-filtrar-?1 primary"
                            onClick={ayuda1}
                          >
                            ?
                          </button>
                        </Tippy>
                      </>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="atributos">
                    <Checkbox
                      className="check-domicilio"
                      id="cbdomicilio"
                      color="checkbox"
                      checked={cbdomicilio}
                      onClick={handleInput}
                    />
                    <Tippy content="Filtrar las ofertas con entraga a domicilio">
                      <label className="label-domicilio">¿Domicilio?</label>
                    </Tippy>
                    {cbdomicilio === true ? (
                      <select
                        className="select-filtrar-domicilio"
                        id="domicilio"
                        onChange={handleInput}
                        value={domicilio}
                      >
                        {opciones.map((item, i) => {
                          return (
                            <option key={i} value={i}>
                              {item.desc}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="atributos">
                    <Checkbox
                      className="check-abiertosn"
                      id="cbabiertosn"
                      color="checkbox"
                      checked={cbabiertosn}
                      onClick={handleInput}
                    />
                    <Tippy content="Filtrar los establecimientos abiertos">
                      <label className="label-abiertosn">¿Abierto/Libre?</label>
                    </Tippy>
                    {cbabiertosn === true ? (
                      <select
                        className="select-filtrar-abierto"
                        id="abierto"
                        onChange={handleInput}
                        value={abierto}
                      >
                        {opciones.map((item, i) => {
                          return (
                            <option key={i} value={i}>
                              {item.desc}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              ) : (
                ""
              )}
            </Box>

            <div className="grupo-button-filtrar">
              <Tippy content="Aplicar el filtro">
                <button
                  type="button"
                  className="button-filtrar-1 primary"
                  onClick={confirmar}
                >
                  <Check />
                </button>
              </Tippy>
              <Tippy content="Eliminar todos los filtros">
                <button
                  type="button"
                  className="button-filtrar-2 primary"
                  onClick={borrarfiltro}
                >
                  <FilterAltOff />
                </button>
              </Tippy>
              <Tippy content="Clic para volver">
                <button
                  type="button"
                  className="button-filtrar-3 primary"
                  onClick={onModalClose}
                >
                  <ArrowBack />
                </button>
              </Tippy>
            </div>
          </>
        ) : (
          ""
        )}
      </Modal>
      */}

/*
  function parser(expresion, tabla, campo, tipo) {
    // analizar la expresion para formar la condicion
    let cual = 1;
    let rango = false;
    let simbolo1 = "";
    let simbolo2 = "";
    let condicion = "";
    for (let i = 0; i < expresion.length; i += 1) {
      if (i > 100) return "";
      if (expresion[i] === ",") {
        if (rango === true) {
          if (simbolo1 !== "" && simbolo2 !== "") {
            // armar el rango  r1-r2
            // precio>=r1 && precio<=r2
            if (condicion !== "") {
              condicion = condicion + " or ";
            } else {
              condicion = "";
            }
            condicion =
              condicion +
              "(" +
              tabla +
              "." +
              campo +
              ">=" +
              tipo +
              simbolo1 +
              tipo +
              " and " +
              tabla +
              "." +
              campo +
              "<=" +
              tipo +
              simbolo2 +
              tipo +
              ")";
            simbolo1 = "";
            simbolo2 = "";
            cual = 1;
            rango = false;
          } else {
            return "Sintaxis error posición " + i;
          }
        } else {
          // no es un rango
          if (simbolo1 !== "") {
            if (condicion !== "") {
              condicion = condicion + " or ";
            } else {
              condicion = "";
            }
            condicion =
              condicion +
              "(" +
              tabla +
              "." +
              campo +
              "=" +
              tipo +
              simbolo1 +
              tipo +
              ")";
            simbolo1 = "";
            simbolo2 = "";
            cual = 1;
          } else {
            return "Sintaxis error posición " + i;
          }
        }
      }
      if (expresion[i] === "-") {
        if (simbolo1 !== "" && simbolo2 === "") {
          cual = 2;
          rango = true;
        } else {
          return "Error de sintáxis en la posición " + i;
        }
      }
      if (expresion[i] !== "," && expresion[i] !== "-") {
        if (expresion[i].indexOf("0123456789") !== 0) {
          if (cual === 1) {
            simbolo1 = simbolo1 + expresion[i];
          } else {
            simbolo2 = simbolo2 + expresion[i];
          }
        } else {
          return "Error de sintáxis en la posición " + i;
        }
      }
    }
    // final de la cadena ver que hay pendiente
    if (rango === true) {
      if (simbolo1.length !== 0 && simbolo2.length !== 0) {
        if (condicion.length !== 0) {
          condicion =
            condicion +
            " or ((" +
            tabla +
            "." +
            campo +
            ">=" +
            simbolo1 +
            ") and (" +
            tabla +
            "." +
            campo +
            "<=" +
            simbolo2 +
            "))";
        } else {
          condicion =
            "((" +
            tabla +
            "." +
            campo +
            ">=" +
            tipo +
            simbolo1 +
            tipo +
            ") and (" +
            tabla +
            "." +
            campo +
            "<=" +
            tipo +
            simbolo2 +
            tipo +
            "))";
        }
      } else return "Error de sintáxis en la última posición ";
    } else {
      if (simbolo1.length !== 0) {
        if (condicion.length !== 0) {
          condicion =
            condicion +
            " or (" +
            tabla +
            "." +
            campo +
            "=" +
            tipo +
            simbolo1 +
            tipo +
            ")";
        } else {
          condicion =
            "(" + tabla + "." + campo + "=" + tipo + simbolo1 + tipo + ")";
        }
      } else {
        return "Error de sintáxis en la última posición ";
      }
    }
    if (condicion.length !== 0) condicion = " and " + condicion;
    return condicion;
  }

  function forma_condicion() {
    condicion_filter = "";
    if (
      sessionStorage.getItem("filtro_productos") !== null &&
      sessionStorage.getItem("filtro_productos") !== undefined
    ) {
      //
      // Provincia
      //
      if (mprovincia !== null && mprovincia !== "") {
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter +
            " and (tablacatnegocios.provinvia=" +
            mprovincia +
            ")";
        } else {
          condicion_filter =
            " and (tablacatnegocios.provincia=" + mprovincia + ")";
        }
      }
      //
      // Naturaleza
      //
      if (mmunicipio !== null && mmunicipio !== "") {
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter +
            " and (tablacatnegocios.municipio=" +
            mmunicipio +
            ")";
        } else {
          condicion_filter =
            " and (tablacatnegocios.municipio=" + mmunicipio + ")";
        }
      }

      //
      // Naturaleza
      //
      if (mnaturaleza !== null && mnaturaleza !== "") {
//        if (condicion_filter.length !== 0) {
//          condicion_filter =
//            condicion_filter + " and (tablaaplicaciones.idnaturaleza=" + mnaturaleza + ")";
//        } else {
//          condicion_filter = " and (tablaaplicaciones.idnaturaleza=" + mnaturaleza + ")";
//        }
      }

      //
      // Hasta aqui Ubicación
      // Inicia Negocios
      //
      if (mtnegocio !== null && mtnegocio !== "") {
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter +
            " and (tablacatnegocios.categorianegocio=" +
            mtnegocio +
            ")";
        } else {
          condicion_filter =
            " and (tablacatnegocios.categorianegocio=" + mtnegocio + ")";
        }
      }
      if (mnegocio !== null && mnegocio !== "") {
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter +
            " and (tablacatnegocios.idnegocio=" +
            mnegocio +
            ")";
        } else {
          condicion_filter =
            " and (tablacatnegocios.idnegocio=" + mnegocio + ")";
        }
      }

      if (mproducto !== null && mproducto !== "") {
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter +
            " and (tablacatproductos.idproducto=" +
            mproducto +
            ")";
        } else {
          condicion_filter =
            " and (tablacatproductos.idproducto=" + mproducto + ")";
        }
      }
      //
      // Atributos
      //
      if (mdesc !== null && mdesc !== "") {
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter +
            " and instr(tablacatproductos.`desc`,'" +
            mdesc +
            "')>0";
        } else {
          condicion_filter =
            " and instr(tablacatproductos.`desc`,'" + mdesc + "')>0";
        }
      }
      if (mprecio !== null && mprecio !== "") {
        let tprecio = parser(mprecio, "tablacatproductos", "precio", "");
        if (condicion_filter.length !== 0) {
          condicion_filter = condicion_filter + tprecio;
        } else {
          condicion_filter = tprecio;
        }
      }

      //
      if (mdomicilio !== null && mdomicilio !== "") {
        let tcondicion = Number(mdomicilio) === 0 ? true : false;
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter +
            " and (tablacatproductos.domicilio=" +
            tcondicion +
            ")";
        } else {
          condicion_filter =
            " and (tablacatproductos.domicilio=" + tcondicion + ")";
        }
      }

      if (mabierto !== null && mabierto !== "") {
        let tabierto = Number(mabierto) === 0 ? 0 : 1;
        if (condicion_filter.length !== 0) {
          condicion_filter =
            condicion_filter +
            " and (tablacatproductos.ocupado=" +
            tabierto +
            ")";
        } else {
          condicion_filter = " and (tablacatproductos.ocupado=" + tabierto + ")";
        }
      }
    }
    return condicion_filter;
  }

  */

  {/*
    // Negocios del primer tipo  de negocio
    let ttarraynegocios = [];
    let resultnegocios = await getnegocios1({negocio: ""});
    resultnegocios = await resultnegocios.json();
    if (resultnegocios.error || resultnegocios.length === 0) {
      setArraynegocios(arraynonegocios);
      setTnegocios(arraynonegocios);
      ttarraynegocios = arraynonegocios;
    } else {
      setArraynegocios(resultnegocios);
      // filtrar los negocios del tipo de negocio activo.
      ttarraynegocios = resultnegocios.filter((item) => {
        if (item.categorianegocio === ttarraytnegocios[0].categorianegocio) {
          return item;
        }
      });
      if (ttarraynegocios.length !== 0) {
        setTnegocios(ttarraynegocios);
      } else {
        setTnegocios(arraynonegocios);
        ttarraynegocios = arraynonegocios;
      }
    }
    setNegocio(0);
    */}

      /*
  const [cbdesc, setCbdesc] = useState(false);
  const [cbprecio, setCbprecio] = useState(false);
  const [precio, setPrecio] = useState("");
  const [cbubicacion, setCbubicacion] = useState(false);
  const [cbproducto, setCbproducto] = useState(false);
  const [cbnegocio, setCbnegocio] = useState(false);
  const [cbtnegocio, setCbtnegocio] = useState(false);
  const [cbmunicipio, setCbmunicipio] = useState(false);
  const [cbprovincia, setCbprovincia] = useState(false);
  */


    /*
  const [cbnegocioproducto, setCbnegocioproducto] = useState(false);
  const [cbatributos, setCbatributos] = useState(true);
  const [cbdomicilio, setCbdomicilio] = useState(false);
  const [cbabiertosn, setCbabiertosn] = useState(false);
  */


        /*
      case "cbubicacion":
        setCbubicacion(e.target.checked);
        break;
      case "cbprovincia":
        setCbprovincia(e.target.checked);
        cambia_provincia_cb(e.target.checked);
        break;
        
      case "provincia":
        setProvincia(e.target.value);
        cambia_provincia(e.target.value);
        break;
        
      case "cbmunicipio":
        setCbmunicipio(e.target.checked);
        cambia_municipio_cb(e.target.checked);
        break;
        
      case "municipio":
        setMunicipio(e.target.value);
        {
          }       
        }
        break;
        
      case "cbnaturaleza":
        setCbnaturaleza(e.target.checked);
        break;
        
      case "naturaleza":
        setNaturaleza(e.target.value);
        break;
        
      case "cbnegocioproducto":
        setCbnegocioproducto(e.target.checked);
        break;
      
      
      case "tnegocio":
        console.log("8888888888")
        setTnegocio(e.target.value);
        cambia_tipo_tnegocio(
          arraytnegocios[Number(e.target.value)].categorianegocio
        );
        break;
        
      case "cbtnegocio":
        setCbtnegocio(e.target.checked);
        cambia_tipo_tnegocio_cb(e.target.checked);
        break;
      
      case "negocio":
        setNegocio(e.target.value);
        cambia_negocio(tnegocios[Number(e.target.value)].idnegocio);
        break;
      case "cbnegocio":
        setCbnegocio(e.target.checked);
        cambia_negocio_cb(e.target.checked);
        break;
      
      
      case "producto":
        setProducto(e.target.value);
        break;
        
      case "cbproducto":
        setCbproducto(e.target.checked);
        cambia_producto_cb(e.target.checked);
        break;
      case "cbatributos":
        setCbatributos(e.target.checked);
        break;
      case "cbprecio":
        setCbprecio(e.target.checked);
        break;
        
      case "precio":
        setPrecio(e.target.value);
        centerMapOnAddress(e.target.value);
        break;
      case "desc":
        setDesc(e.target.value);
        break;
        
      case "cbdomicilio":
        setCbdomicilio(e.target.checked);
        break;
      case "domicilio":
        setDomicilio(e.target.value);
        break;
      case "verOtraVez":
        setVerOtraVez(e.target.checked);
        break;
      case "cbabiertosn":
        setCbabiertosn(e.target.checked);
        break;
      case "abierto":
        setAbierto(e.target.value);
        break;
      case "cbdesc":
        setCbdesc(e.target.checked);
        break;
        */

          /*
  function cambia_tipo_tnegocio(tnegocio) {
    let ttarraynegocios = [];
    setTnegocios(
      arraynegocios.filter((item, i) => {
        if (item.categorianegocio === tnegocio) {
          return item;
        }
      })
    );
    ttarraynegocios = arraynegocios.filter((item, i) => {
      if (item.categorianegocio === tnegocio) {
        return item;
      }
    });
    setTproductos(
      arrayproductos.filter((item, i) => {
        if (item.idnegocio === ttarraynegocios[0].idnegocio) {
          return item;
        }
      })
    );
  }









  function cambia_negocio(negocio) {
    setTproductos(
      arrayproductos.filter((item, i) => {
        if (item.idnegocio === negocio) {
          return item;
        }
      })
    );
  }
  




  async function cambia_tipo_tnegocio_cb(cbtnegocio) {
    let ttarraynegocios = [];
    if (cbtnegocio) {
      // tnegocio true
      setTnegocio(0);
      if (cbnegocio) {
        // cbtnegocio y cbnegocio en true, mostrar negocios del primer tnegocio
        ttarraynegocios = arraynegocios.filter((item, i) => {
          if (item.categorianegocio === arraytnegocios[0].categorianegocio) {
            return item;
          }
        });
        if (ttarraynegocios.length !== 0) {
          setTnegocios(
            arraynegocios.filter((item) => {
              if (
                item.categorianegocio === arraytnegocios[0].categorianegocio
              ) {
                return item;
              }
            })
          );
        } else {
          setTnegocios(arraynonegocios);
        }
        setNegocio(0);
      }

      if (cbproducto) {
        //  producto en true
       
      }
    } else {
      // tipo de negocio se apaga
      // comprobar cbnegocio,cbcproducto, cbproduco
      if (cbnegocio) {
        // tiponegocio false y cbnegocio en true
        // mostrar todos los negocios
        setTnegocios(arraynegocios);
        ttarraynegocios = arraynegocios;
        setNegocio(0);
      } //cbnegocio true
      if (cbproducto) {
        //tnegocio false producto true

      }
    }
    setTnegocio(0);
  } // cambia_tipo_negocio_cb




  async function cambia_negocio_cb(cbnegocio) {
    let ttarraynegocios = [];
    if (cbnegocio) {
      // cbnegocio cambia a true
      if (cbtnegocio) {
        // cbnegocio en true y cbtnegocio en true los negocios dependen
        // del tipo de negocio
        ttarraynegocios = arraynegocios.filter((item) => {
          if (
            item.categorianegocio === arraytnegocios[tnegocio].categorianegocio
          ) {
            return item;
          }
        });
        if (ttarraynegocios.length !== 0) {
          setTnegocios(
            arraynegocios.filter((item) => {
              if (
                item.categorianegocio ===
                arraytnegocios[tnegocio].categorianegocio
              ) {
                return item;
              }
            })
          );
        } else {
          setTnegocios(arraynonegocios);
        }
      } else {
        // tnegocio false mostrar todos los negocios
        setTnegocios(arraynegocios);
        ttarraynegocios = arraynegocios;
      }
      setNegocio(0);
      if (cbproducto) {
        // cbproducto a true verificar cbcproducto
        
      }
    } // cbnegocio cambia a true
    else {
      // cbnegocio cambia a false

      if (cbproducto) {
        // negocio false, producto true verificar cproducto y tnegocio

      }
    }
  }





  async function cambia_producto_cb(cbproducto) {
    if (cbproducto) {
      // producto true;
      // verificar cbcproducto, cbnegocio, cbtnegocio
    }
  } // cambia_producto_cb




  function cambia_provincia(provincia) {
    let ttmunicipios = [];
    ttmunicipios = arraymunicipios.filter((item, i) => {
      if (item.provincia === arrayprovincias[provincia].provincia) {
        return item;
      }
    });
    if (ttmunicipios.length !== 0) {
      setTmunicipios(ttmunicipios);
    } else {
      setTmunicipios(arraynomunicipios);
      ttmunicipios = arraynomunicipios;
    }
    setMunicipio(0);
  }

  function cambia_provincia_cb(cbprovincia) {
    if (cbprovincia === false) {
      setCbmunicipio(false);
    }
  }

  function cambia_municipio_cb(cbmunicipio) {
    if (cbmunicipio !== false) {
      setCbprovincia(true);
    }
  }

  function ayuda1() {
    setContenido("Varios precios: 550,600,650 rango de precios: 700-1000");
    setShow(true);
  }

  function confirmar() {
    let filtro = false;
    // Ubicación
    if (cbprovincia === true) {
      sessionStorage.setItem("provincia", arrayprovincias[provincia].provincia);
      mprovincia = arrayprovincias[provincia].provincia;
      filtro = true;
    } else {
      sessionStorage.removeItem("provincia");
      mprovincia = "";
    }
    if (cbmunicipio === true) {
      sessionStorage.setItem("municipio", tmunicipios[municipio].municipio);
      mmunicipio = tmunicipios[municipio].municipio;
      filtro = true;
    } else {
      sessionStorage.removeItem("municipio");
      mmunicipio = "";
    }
    if (cbnaturaleza === true) {
      sessionStorage.setItem(
        "naturaleza",
        arraynaturalezas[naturaleza].idnaturaleza
      );
      mnaturaleza = arraynaturalezas[naturaleza].idnaturaleza;
      filtro = true;
    } else {
      sessionStorage.removeItem("naturaleza");
      mnaturaleza = "";
    }

    if (cbtnegocio === true) {
      sessionStorage.setItem(
        "tnegocio",
        arraytnegocios[tnegocio].categorianegocio
      );
      mtnegocio = arraytnegocios[tnegocio].categorianegocio;
      filtro = true;
    } else {
      sessionStorage.removeItem("tnegocio");
      mtnegocio = "";
    }
    if (cbnegocio === true) {
      sessionStorage.setItem("negocio", tnegocios[negocio].idnegocio);
      mnegocio = tnegocios[negocio].idnegocio;
      filtro = true;
    } else {
      sessionStorage.removeItem("negocio");
      mnegocio = "";
    }
    if (cbproducto === true) {
      sessionStorage.setItem("producto", tproductos[producto].idproducto);
      mproducto = tproductos[producto].idproducto;
      filtro = true;
    } else {
      sessionStorage.removeItem("producto");
      mproducto = "";
    }
    if (cbdesc === true) {
      sessionStorage.setItem("desc", desc);
      mdesc = desc;
      filtro = true;
    } else {
      sessionStorage.removeItem("desc");
      mdesc = "";
    }
    if (cbprecio === true) {
      sessionStorage.setItem("precio", precio);
      mprecio = precio;
      filtro = true;
    } else {
      sessionStorage.removeItem("precio");
      mprecio = "";
    }
    if (cbdomicilio === true) {
      sessionStorage.setItem("domicilio", cbdomicilio);
      mdomicilio = domicilio;
      filtro = true;
    } else {
      sessionStorage.removeItem("domicilio");
      mdomicilio = "";
    }
    if (cbabiertosn === true) {
      sessionStorage.setItem("abierto", abierto);
      mabierto = abierto;
      filtro = true;
    } else {
      sessionStorage.removeItem("abierto");
      mabierto = "";
    }
    if (filtro) {
      sessionStorage.setItem("filtro_productos", true);
      condicion_filter = forma_condicion();
      sessionStorage.setItem("condicion_filter", condicion_filter);
    } else {
      sessionStorage.removeItem("filtro_productos");
      sessionStorage.setItem("condicion_filter", "");
      condicion_filter = "";
    }
    setFilterState({ type: "set", newvalue: false });
    init1();
  }

  function borrarfiltro() {
    setCbubicacion(false);
    setCbprovincia(false);
    setCbmunicipio(false);
    setCbnegocioproducto(false);
    setCbtnegocio(false);
    setCbnegocio(false);
    setCbproducto(false);
    setCbatributos(true);
    setCbdesc(false);
    setDesc("");
    setCbprecio(false);
    setCbdomicilio(false);
    setCbabiertosn(false);
    sessionStorage.removeItem("filtro_productos");
    sessionStorage.setItem("condicion_filter", "");
    condicion_filter = "";
    setFilterState({ type: "set", newvalue: false });
    init1();
  }
  */

  
  async function getNegocios(value){
    let resultnegocios = await getnegociosusercategoria({ user: "", categorianegocio: arraytnegocios[value].categorianegocio});
    resultnegocios = await resultnegocios.json();

    if (resultnegocios.error || resultnegocios.length === 0) {
      // No encontro ningun negocio para este usuario
      setArraynegocios(arraynonegocios);
      setArrayproductos(arraynoproductos);
    } else {
      setArraynegocios(resultnegocios);

      // Productos del negocio
      let resultproductos = await getproductoscategoria({ negocio: resultnegocios[0].negocio });
      resultproductos = await resultproductos.json();

      if (resultproductos.error || resultproductos.length === 0) {
        setArrayproductos(arraynoproductos);
        recuperardatosproducto(arraynoproductos, 0);
      } else {
        setArrayproductos(resultproductos);
        recuperardatosproducto(resultproductos, 0);
        const [primero] = resultproductos;
        setProducto({ label: primero.desc, value: 0 });
        let resultado = await getJpgFile({ file: "./galerias/app_images/productos" + "/" + resultproductos[0].idproducto + "/" + resultproductos[0].idproducto + ".jpg"});
        resultado = await resultado.text();
        
        if (resultado.length !== 0) {
          setContenidofoto(resultado);
          setNombrefoto(resultproductos[0].idproducto);
        } else {
          setNombrefoto("");
        }
      }
      setNegocio(0);
    }

  }
