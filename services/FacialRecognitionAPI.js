const BASE_URL = 'https://ixk9cqrvwl5t.share.zrok.io';

// Headers obligatorios para la API
const DEFAULT_HEADERS = {
  'skip_zrok_interstitial': 'true',
};


export const registerUser = async (cuil, imageUri) => {
  try {
    // Crear FormData para enviar la imagen
    const formData = new FormData();
    formData.append('cuil', cuil);
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    console.log('Enviando registro facial para CUIL:', cuil);

    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: formData,
    });

    const responseText = await response.text();
    console.log('Respuesta del servidor (registro):', responseText);

    if (!response.ok) {
      let errorMessage = 'Error en el registro facial';
      
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Si no es JSON válido, usar el texto de respuesta
        errorMessage = responseText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    // Intentar parsear como JSON, si falla devolver el texto
    try {
      return JSON.parse(responseText);
    } catch (e) {
      return { success: true, message: responseText };
    }

  } catch (error) {
    console.error('Error en registerUser:', error);
    
    if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
    
    throw error;
  }
};

export const recognizeUser = async (imageUri) => {
  try {
    // Crear FormData para enviar la imagen
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    console.log('Enviando reconocimiento facial...');

    const response = await fetch(`${BASE_URL}/recognize`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: formData,
    });

    const responseText = await response.text();
    console.log('Respuesta del servidor (reconocimiento):', responseText);

    if (!response.ok) {
      let errorMessage = 'Error en el reconocimiento facial';
      
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Si no es JSON válido, usar el texto de respuesta
        errorMessage = responseText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    // Intentar parsear como JSON, si falla devolver el texto
    try {
      const data = JSON.parse(responseText);
      return data;
    } catch (e) {
      // Si no es JSON válido, asumir que es exitoso si el status es 200
      return { success: true, message: responseText };
    }

  } catch (error) {
    console.error('Error en recognizeUser:', error);
    
    if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
    
    throw error;
  }
};


export const validateCuil = (cuil) => {
  // CUIL debe tener 11 dígitos
  const cuilRegex = /^\d{11}$/;
  return cuilRegex.test(cuil.replace(/[-\s]/g, ''));
};


export const formatCuil = (cuil) => {
  const cleanCuil = cuil.replace(/[-\s]/g, '');
  if (cleanCuil.length === 11) {
    return `${cleanCuil.slice(0, 2)}-${cleanCuil.slice(2, 10)}-${cleanCuil.slice(10)}`;
  }
  return cuil;
};
