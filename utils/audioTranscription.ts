import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';

// Acceder a las variables de entorno
const apiKey = Constants.expoConfig?.extra?.GEMINI_API_KEY || 
               process.env.EXPO_PUBLIC_GEMINI_API_KEY || 
               'AIzaSyCh8qIxrGRQTqHSc_C93tyxd41Lx70nKfM';
const modelName = Constants.expoConfig?.extra?.GEMINI_MODEL || 
                 process.env.EXPO_PUBLIC_GEMINI_MODEL || 
                 'gemini-2.5-pro-preview-05-06';

/**
 * Convierte un archivo de audio a base64
 */
export async function audioToBase64(uri: string): Promise<string | null> {
  try {
    // Para la web
    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            // Eliminar el prefijo para obtener solo el base64
            const base64Data = reader.result.split(',')[1];
            resolve(base64Data);
          } else {
            reject(new Error('No se pudo convertir el audio a base64'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } 
    // Para dispositivos móviles
    else {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    }
  } catch (error) {
    console.error('Error al convertir audio a base64:', error);
    return null;
  }
}

/**
 * Transcribe un archivo de audio a texto usando Gemini
 */
export async function transcribeAudio(audioUri: string): Promise<string | null> {
  try {
    // En una implementación real, convertiríamos el audio a base64
    // y lo enviaríamos a la API de Gemini para su transcripción
    
    // Para simular la funcionalidad, usamos una implementación simple
    // que envía un prompt a Gemini solicitando que genere una transcripción
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    
    // Prompt para Gemini solicitando que simule una transcripción de audio
    // de un problema de plomería en el hogar
    const requestBody = {
      contents: [{
        parts: [{
          text: `Simula una transcripción de audio de una persona describiendo un problema 
          de plomería en su hogar. La transcripción debe ser natural, detallada y específica, 
          como si alguien realmente estuviera explicando un problema como una fuga bajo el
          fregadero, un grifo que gotea, o una tubería ruidosa. Incluye detalles sobre cuánto
          tiempo lleva ocurriendo el problema, qué han notado (como manchas de agua, sonidos, etc.)
          y qué les preocupa. No indiques que es una simulación, simplemente proporciona
          la transcripción como si fuera real.`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    };
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`Error en la solicitud a Gemini: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extraer el texto generado
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      
      return data.candidates[0].content.parts[0].text;
    }
    
    return null;
  } catch (error) {
    console.error('Error en la transcripción de audio:', error);
    return null;
  }
}

/**
 * En una implementación real, esta función enviaría el audio a un
 * servicio de transcripción específico como Google Speech-to-Text
 */
export async function transcribeWithGoogleSpeechToText(audioUri: string): Promise<string | null> {
  // Esta es una implementación simulada
  console.log("Simulando transcripción con Google Speech-to-Text:", audioUri);
  return "El grifo de la cocina lleva goteando varios días y he notado una mancha de humedad debajo del fregadero. Cuando abro el gabinete, puedo ver que hay agua acumulada en la base. La conexión del desagüe parece estar suelta o dañada.";
}