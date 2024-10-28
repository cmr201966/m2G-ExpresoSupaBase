import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tu-proyecto.supabase.co';
const supabaseKey = 'tu-clave-de-api';
const supabase = createClient(supabaseUrl, supabaseKey);

const DescargarImagen = () => {
  const [imagenUrl, setImagenUrl] = useState('');

  useEffect(() => {
    const obtenerImagen = async () => {
      const { data, error } = await supabase
        .storage
        .from('mi_bucket')
        .download('imagenes/mi_imagen.jpg');

      if (error) {
        console.error('Error al descargar la imagen:', error);
      } else {
        const url = URL.createObjectURL(data);
        setImagenUrl(url);
      }
    };

    obtenerImagen();
  }, []);

  return (
    <div>
      {imagenUrl && <img src={imagenUrl} alt="Imagen descargada" />}
    </div>
  );
};

export default DescargarImagen;


const base64ToBlob = (base64, contentType = '') => {
    const byteCharacters = atob(base64);
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







import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';

const supabaseUrl = 'https://tu-proyecto.supabase.co';
const supabaseKey = 'tu-clave-de-api';
const supabase = createClient(supabaseUrl, supabaseKey);

const uploadBase64Image = async (base64String) => {
  const blob = base64ToBlob(base64String, 'image/jpeg');
  const { data, error } = await supabase.storage
    .from('mi_bucket')
    .upload('imagenes/mi_imagen.jpg', blob);

  if (error) {
    console.error('Error al subir el fichero:', error);
  } else {
    console.log('Fichero subido exitosamente:', data);
  }
};

// Ejemplo de uso en un componente React
const MiComponente = () => {
  const [base64String, setBase64String] = useState('');

  const handleUpload = () => {
    uploadBase64Image(base64String);
  };

  return (
    <div>
      <input 
        type="text" 
        value={base64String} 
        onChange={(e) => setBase64String(e.target.value)} 
        placeholder="Ingresa el string base64"
      />
      <button onClick={handleUpload}>Subir Imagen</button>
    </div>
  );
};

export default MiComponente;


const crearBucket = async () => {
    const { data, error } = await supabase.storage.createBucket('mi_bucket');
  
    if (error) {
      console.error('Error al crear el bucket:', error);
    } else {
      console.log('Bucket creado exitosamente:', data);
    }
  };
  
  // Llama a la función para crear el bucket
  crearBucket();



  import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tu-proyecto.supabase.co';
const supabaseKey = 'tu-clave-de-api';
const supabase = createClient(supabaseUrl, supabaseKey);

const verificarBucket = async (bucketName) => {
  const { data, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error('Error al listar los buckets:', error);
    return false;
  }

  const bucketExists = data.some(bucket => bucket.name === bucketName);
  return bucketExists;
};

// Ejemplo de uso
const bucketName = 'mi_bucket';
verificarBucket(bucketName).then(exists => {
  if (exists) {
    console.log('El bucket existe.');
  } else {
    console.log('El bucket no existe.');
  }
});




import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tu-proyecto.supabase.co';
const supabaseKey = 'tu-clave-de-api';
const supabase = createClient(supabaseUrl, supabaseKey);

const obtenerUsuariosPorCondicion = async (nombreValor) => {
  const { data, error } = await supabase.rpc('obtener_usuarios_por_condicion', { nombre_valor: nombreValor });

  if (error) {
    console.error('Error al ejecutar la función:', error);
  } else {
    console.log('Datos obtenidos:', data);
  }
};

// Ejemplo de uso
obtenerUsuariosPorCondicion('Juan');
