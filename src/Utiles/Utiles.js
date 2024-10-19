function isValid(state){
    if (state==null || state==='null' || state===undefined || state==='undefined')  return false
    else return true;
  }

  function buscarEnArreglo (arreglo, valor, atributo) {
    let index = -1;
    arreglo.forEach((item, i) => {
      if (Number(item[atributo]) === Number(valor)) {
        index = i;
      }
    });
    return index;
  };

  function buscarEnArregloString(arreglo, valor, atributo) {
    let index = -1;
    arreglo.forEach((item, i) => {
      if (item[atributo].toUpperCase() === valor.toUpperCase()) {
        index = i;
      }
    });
    return index;
  };


  export {isValid, buscarEnArreglo, buscarEnArregloString}
