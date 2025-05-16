import { Platform } from 'react-native';

// Define los tipos para la respuesta de la API de Gemini
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text?: string;
      }[];
    };
  }[];
  promptFeedback?: {
    safetyRatings: {
      category: string;
      probability: string;
    }[];
  };
}

// Interfaz para el diagnóstico
interface DiagnosisRequest {
  imageBase64?: string;
  problemDescription: string;
}

// Interfaz para la respuesta del diagnóstico
export interface DiagnosisResult {
  issue: string;
  severity: 'low' | 'medium' | 'high';
  recommendedActions: string[];
  requiredParts: {
    id: string;
    name: string;
    estimatedCost: string;
    availabilityStatus: 'in-stock' | 'limited' | 'out-of-stock';
  }[];
}

// Función para analizar un problema del hogar usando Gemini
export async function analyzeProblem(data: DiagnosisRequest): Promise<DiagnosisResult> {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    const model = process.env.EXPO_PUBLIC_GEMINI_MODEL || 'gemini-1.5-pro';
    
    if (!apiKey) {
      throw new Error('API key no configurada en las variables de entorno');
    }

    // Construir el prompt para Gemini
    const imageContent = data.imageBase64 
      ? [{
          inlineData: {
            mimeType: "image/jpeg",
            data: data.imageBase64
          }
        }] 
      : [];
    
    const prompt = `Eres un experto en diagnóstico de problemas del hogar. 
    Analiza la siguiente situación y proporciona:
    
    1. El problema específico identificado
    2. La severidad del problema (low, medium, high)
    3. Acciones recomendadas para solucionar el problema
    4. Piezas que podrían ser necesarias, con su coste estimado y disponibilidad
    
    Descripción del problema: ${data.problemDescription}
    
    Responde en formato JSON con la siguiente estructura exacta:
    {
      "issue": "descripción del problema",
      "severity": "low/medium/high",
      "recommendedActions": ["acción 1", "acción 2", ...],
      "requiredParts": [
        {
          "id": "p1",
          "name": "nombre de la pieza",
          "estimatedCost": "rango de precio (ej: $10-15)",
          "availabilityStatus": "in-stock/limited/out-of-stock"
        }
      ]
    }`;

    // URL de la API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    // Preparar la solicitud
    const requestBody = {
      contents: [
        {
          parts: [
            ...imageContent,
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1.0,
        maxOutputTokens: 2048,
      }
    };
    
    // Realizar la solicitud a la API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const responseData: GeminiResponse = await response.json();
    
    // Extraer el texto de la respuesta
    if (!responseData.candidates || responseData.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }
    
    const responseText = responseData.candidates[0].content.parts[0].text;
    
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }
    
    // Intentar extraer el JSON de la respuesta
    let extractedJson: string = responseText;
    
    // A veces la IA envuelve el JSON en bloques de código, así que intentamos extraerlo
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                      responseText.match(/```\n([\s\S]*?)\n```/) ||
                      responseText.match(/{[\s\S]*}/);
                      
    if (jsonMatch) {
      extractedJson = jsonMatch[0].replace(/```json\n|```\n|```/g, '');
    }
    
    // Analizar la respuesta
    const diagnosisResult: DiagnosisResult = JSON.parse(extractedJson);
    
    // Asegurarse de que la respuesta tiene la estructura esperada
    if (!diagnosisResult.issue || !diagnosisResult.severity || 
        !Array.isArray(diagnosisResult.recommendedActions) ||
        !Array.isArray(diagnosisResult.requiredParts)) {
      throw new Error('Formato de respuesta inválido de la API de Gemini');
    }
    
    return diagnosisResult;
    
  } catch (error) {
    console.error('Error al analizar problema con Gemini:', error);
    // En caso de error, devolver un diagnóstico genérico
    return {
      issue: 'No se pudo analizar el problema. Por favor, inténtalo de nuevo.',
      severity: 'medium',
      recommendedActions: [
        'Vuelve a intentar con una imagen más clara',
        'Proporciona una descripción más detallada del problema',
        'Contacta con soporte si el problema persiste'
      ],
      requiredParts: []
    };
  }
}

// Función para convertir una imagen a base64
export async function imageToBase64(uri: string): Promise<string | null> {
  // En la web, no podemos usar FileSystem de Expo, así que podemos usar fetch
  if (Platform.OS === 'web') {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            // Eliminar el prefijo "data:image/jpeg;base64," para obtener solo el base64
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          } else {
            reject(new Error('Failed to convert image to base64'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  } else {
    // Para dispositivos móviles, utilizamos FileSystem de Expo
    try {
      const { FileSystem } = require('expo-file-system');
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }
}

// Función para discutir el diagnóstico con Gemini
export async function discussDiagnosis(
  initialDiagnosis: DiagnosisResult, 
  userQuestion: string
): Promise<string> {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    const model = process.env.EXPO_PUBLIC_GEMINI_MODEL || 'gemini-1.5-pro';
    
    if (!apiKey) {
      throw new Error('API key no configurada en las variables de entorno');
    }

    // Construir el prompt para la discusión
    const prompt = `Eres un asistente experto en reparaciones del hogar. 
    Se ha diagnosticado el siguiente problema:
    - Problema: ${initialDiagnosis.issue}
    - Severidad: ${initialDiagnosis.severity}
    - Acciones recomendadas: ${initialDiagnosis.recommendedActions.join(', ')}
    - Piezas requeridas: ${initialDiagnosis.requiredParts.map(p => p.name).join(', ')}
    
    El usuario tiene la siguiente pregunta o comentario sobre este diagnóstico:
    "${userQuestion}"
    
    Responde de manera útil, clara y profesional. Proporciona información técnica precisa pero comprensible para alguien sin conocimientos especializados.`;

    // URL de la API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    // Preparar la solicitud
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 32,
        topP: 1.0,
        maxOutputTokens: 1024,
      }
    };
    
    // Realizar la solicitud a la API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const responseData: GeminiResponse = await response.json();
    
    // Extraer el texto de la respuesta
    if (!responseData.candidates || responseData.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }
    
    const responseText = responseData.candidates[0].content.parts[0].text;
    
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }
    
    return responseText;
    
  } catch (error) {
    console.error('Error discussing diagnosis with Gemini:', error);
    return 'Lo siento, no pude procesar tu pregunta en este momento. Por favor, inténtalo de nuevo más tarde.';
  }
}