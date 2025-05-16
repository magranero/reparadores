import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from 'expo-constants';

// Acceder a las variables de entorno
const apiKey = Constants.expoConfig?.extra?.GEMINI_API_KEY || 
               process.env.EXPO_PUBLIC_GEMINI_API_KEY || 
               '';
const modelName = Constants.expoConfig?.extra?.GEMINI_MODEL || 
                 process.env.EXPO_PUBLIC_GEMINI_MODEL || 
                 'gemini-2.5-pro-preview-05-06';

// Inicializar la API de Gemini
const genAI = new GoogleGenerativeAI(apiKey);

// Obtener el modelo
const model = genAI.getGenerativeModel({ model: modelName });

// Función para analizar una imagen y descripción
export async function analyzeImageAndDescription(
  imageBase64: string, 
  description: string
): Promise<{
  issue: string;
  severity: 'low' | 'medium' | 'high';
  recommendedActions: string[];
  requiredParts: {
    id: string;
    name: string;
    estimatedCost: string;
    availabilityStatus: 'in-stock' | 'limited' | 'out-of-stock';
  }[];
}> {
  try {
    // Preparar la imagen para el modelo
    const imageParts = [
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      },
    ];

    // Crear el prompt para el modelo
    const prompt = `
    Eres un experto en diagnóstico de problemas del hogar. Analiza la siguiente imagen y descripción de un problema en el hogar:

    Descripción del usuario: ${description}

    Proporciona un diagnóstico detallado con el siguiente formato JSON:
    {
      "issue": "Breve descripción del problema identificado",
      "severity": "high/medium/low",
      "recommendedActions": ["Acción 1", "Acción 2", "Acción 3"],
      "requiredParts": [
        {
          "id": "p1",
          "name": "Nombre de la pieza",
          "estimatedCost": "Rango de precio estimado",
          "availabilityStatus": "in-stock/limited/out-of-stock"
        }
      ]
    }

    Asegúrate de que la respuesta sea SOLO el objeto JSON, sin texto adicional.
    `;

    // Generar contenido con el modelo
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [...imageParts, { text: prompt }] }],
    });

    const response = result.response;
    const text = response.text();
    
    // Extraer el JSON de la respuesta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No se pudo extraer JSON de la respuesta");
    }
    
    const jsonStr = jsonMatch[0];
    const analysisResult = JSON.parse(jsonStr);
    
    return analysisResult;
  } catch (error) {
    console.error("Error al analizar la imagen:", error);
    throw error;
  }
}

// Función para continuar la conversación sobre el diagnóstico
export async function discussDiagnosis(
  previousMessages: { role: 'user' | 'model', content: string }[],
  newUserMessage: string
): Promise<string> {
  try {
    // Crear un chat con el historial de mensajes
    const chat = model.startChat({
      history: previousMessages,
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    // Enviar el nuevo mensaje del usuario
    const result = await chat.sendMessage(newUserMessage);
    const response = result.response;
    
    return response.text();
  } catch (error) {
    console.error("Error en la discusión del diagnóstico:", error);
    throw error;
  }
}