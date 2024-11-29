import { getJpgFile } from "../servicios/imagenes";
import { getFilesInFolder } from "../servicios/fs";
import { creafileinfolder, delfileinfolder } from "../servicios/fs";
import { getgalerias } from "../servicios/galerias";
import supabase from "./connection";

async function creaFileInFolder(
  folderMYSQL,
  folderSUPABASE,
  file,
  contenidofoto,
  file_Name,
  tabla,
  campo,
  valor
) {
  let err = "";
  if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL") {
    err = await creafileinfolder({ ruta: folderMYSQL, file, contenidofoto });
  } else {
    err = await uploadBase64Image(
      contenidofoto,
      "galerias",
      folderSUPABASE + "/" + file,
      false, tabla, campo, valor
    );
    await supabase
    .from(tabla)
    .update({ nophoto: file_Name })
    .eq(campo, valor);
  
  }
  return err;
}

async function deleteFileInFolder(folderMYSQL, folderSUPABASE, file) {
  let err = "";
  if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL") {
    await delfileinfolder({ ruta: folderMYSQL, file });
  } else {
    await supabase.storage
      .from("galerias")
      .remove([folderSUPABASE + "/" + file]);
  }
  return err;
}

async function getGaleriasSB(folder) {
  let galeriasfolders = [];
  if (sessionStorage.getItem("sgbd").toLocaleUpperCase() === "MYSQL") {
    galeriasfolders = await getgalerias({ ruta: folder });
    galeriasfolders = await galeriasfolders.json();
  } else {
    const { data } = await supabase.storage.from("galerias").list(folder, {
      limit: 1000,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });
    data.forEach((item) => {
      galeriasfolders.push(item.name);
    });
  }
  return galeriasfolders;
}

function borraSessionStorage(items) {
  items.forEach((item) => {
    sessionStorage.removeItem(item);
  });
}

function isValid(state) {
  if (
    state == null ||
    state === "null" ||
    state === undefined ||
    state === "undefined"
  )
    return false;
  else return true;
}

function buscarEnArreglo(arreglo, valor, atributo) {
  let index = -1;
  arreglo.forEach((item, i) => {
    if (Number(item[atributo]) === Number(valor)) {
      index = i;
    }
  });
  return index;
}

function buscarEnArregloString(arreglo, valor, atributo) {
  let index = -1;
  arreglo.forEach((item, i) => {
    if (item[atributo].toUpperCase() === valor.toUpperCase()) {
      index = i;
    }
  });
  return index;
}

const checkFileExists = async (bucketName, directory, fileName) => {
  const { data } = await supabase.storage.from(bucketName).list(directory);
  const fileExists = data.some((file) => file.name === fileName);
  return fileExists;
};


async function filesList(bucketName, directory){
  const {data} = await supabase.storage
    .from(bucketName)
    .list(directory);
    return data;
 
}  

async function getUrlPublic(bucketName, directory, fileName){
/*
  let fe=true;
  if (fileName.indexOf("-movil")!==-1){
     const { data, error } = await supabase
       .storage
       .from(bucketName)
       .list(directory, { limit: 100, offset: 0 });

      if (isValid(error)===false) {
        const fileExists = data.some(file => file.name === fileName);
        fe=fileExists;
      }
  }

  let fileName1 = fe===false?fileName.replace("-movil",""):fileName;
*/

  const {data} = supabase.storage
  .from(bucketName)
  .getPublicUrl(directory + "/" + fileName); 
  return data;  
}

const getUrlCM = async (bucketName, directory, fileName, id) => {
  let urlWithCacheBuster="";
  let url=await getUrlPublic(bucketName, directory, fileName);
  urlWithCacheBuster = `${url.publicUrl}?cb=${id}`;
  return urlWithCacheBuster;
};

const getImagenCM = async (bucketName, directory, fileName) => {
  let url = "";
  const { data, error } = await supabase.storage
    .from(bucketName)
    .download(directory + "/" + fileName);
  if (isValid(data) === true) {
    url = URL.createObjectURL(data);
    return url;
  } else return url;
};

const cleanBase64String = (base64String) => {
  const index = base64String.indexOf(",");
  return index !== -1 ? base64String.substring(index + 1) : base64String;
};

const base64ToBlob = (base64, contentType = "", isBase64ToBlob) => {
  let byteCharacters;
  if (isBase64ToBlob === true) {
    byteCharacters = base64;
  } else {
    byteCharacters = atob(cleanBase64String(base64));
  }
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

const uploadBase64Image = async (
  base64String,
  bucket,
  carpeta,
  isBase64ToBlob, tabla, campo, id
) => {
  if (isBase64ToBlob === true) return {};
  await supabase.storage.from(bucket).remove([carpeta]);
  const blob = base64ToBlob(base64String, "image/jpeg", isBase64ToBlob);
  const { data, error } = await supabase.storage.from(bucket).upload(carpeta, blob);
  // poner el id del fichero en la tabla
  await supabase
  .from(tabla)
  .update({ idsb: data.id })
  .eq(campo, id);

  return error;
};

async function buscaFoto(foto) {
  let resultado = await getJpgFile({ file: foto });
  return resultado;
}

async function creaBucket(bucket) {
  const { data } = await supabase.storage.listBuckets();
  const bucketExists = data.some((bucket) => bucket.name === bucket);
  if (bucketExists === false) {
    await supabase.storage.createBucket(bucket);
  }
}

async function getFilesInFolderSB(folderMYSQL, folderSUPABASE, bucket) {
  let resultFiles = [];
  if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
    resultFiles = await getFilesInFolder({ folderMYSQL });
    resultFiles = await resultFiles.json();
  } else {
    const { data } = await supabase.storage.from(bucket).list(folderSUPABASE, {
      limit: 1000,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });
    data.forEach((item) => {
      resultFiles.push(item.name);
    });
  }
  return resultFiles;
}

async function getJpgFileSB(fileName, directoryMYSQL, directorySUPABASE, id) {
  let result = [];
  if (sessionStorage.getItem("sgbd").toUpperCase() === "MYSQL") {
    result = await getJpgFile({ file: directoryMYSQL + "/" + fileName });
    result = await result.text();
  } else {
    result = await getUrlCM("galerias", directorySUPABASE, fileName, id);
    //result = await getImagenCM("galerias", directorySUPABASE, fileName);
  }
  return result;
}

export { 
  filesList, 
  checkFileExists 
};

export {
  isValid,
  buscarEnArreglo,
  buscarEnArregloString,
  uploadBase64Image,
  buscaFoto,
  creaBucket,
  creaFileInFolder,
};

export { 
  getFilesInFolderSB, 
  getJpgFileSB, 
  getImagenCM,
  getGaleriasSB,
};

export {
  borraSessionStorage,
  deleteFileInFolder,
};
