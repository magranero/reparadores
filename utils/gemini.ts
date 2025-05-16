import { 
  GoogleGenerativeAI, 
  HarmCategory, 
  HarmBlockThreshold 
} from '@google/generative-ai';
import * as FileSystem from 'expo-file-system';

// Initialize the Generative AI API with your API key
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'PLACEHOLDER_API_KEY';
const genAI = new GoogleGenerativeAI(API_KEY);

// Configure safety settings
const generationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

/**
 * Converts an image file to a base64 string
 * @param uri The URI of the image file
 * @returns Promise resolving to a base64 string
 */
export const imageToBase64 = async (uri: string): Promise<string | null> => {
  try {
    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Return with proper formatting
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

/**
 * Analyze a home problem using an image and description
 * @param {Object} data - The problem data
 * @param {string} data.imageBase64 - Base64 encoded image
 * @param {string} data.problemDescription - Text description of the problem
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeProblem = async ({
  imageBase64,
  problemDescription,
}: {
  imageBase64: string;
  problemDescription: string;
}): Promise<any> => {
  try {
    // Get multimodal model for vision tasks
    const model = genAI.getGenerativeModel({
      model: "gemini-pro-vision",
      safetySettings,
      generationConfig,
    });
    
    // Prepare image data
    const mimeType = "image/jpeg"; // Adjust if needed
    
    // Create the prompt with the image and description
    const prompt = `
      You are a professional home repair diagnostic assistant. Analyze this image and the user's description to identify the problem and provide repair recommendations.
      
      User problem description: "${problemDescription}"
      
      Provide a detailed diagnosis in JSON format, with the following properties:
      - issue (string): Brief title/name of the identified problem
      - severity (string): "low", "medium", or "high" depending on urgency of repair
      - detail (string): Detailed explanation of the problem
      - recommendedActions (array of strings): Step-by-step repair instructions
      - requiredParts (array of objects): Parts needed for repair, each with "name", "estimatedCost", and "availabilityStatus" properties
      - diyDifficulty (string): "easy", "medium", or "hard"
      - estimatedTime (string): Estimated time to complete repair, e.g. "30-60 minutes"
      - professionalRecommended (boolean): Whether a professional is recommended
      
      Focus on providing accurate, practical information based only on what you can clearly see in the image and the description.
    `;
    
    // Generate content with image and text
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
    ]);
    
    const response = result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/({[\s\S]*})/);
    if (jsonMatch && jsonMatch[0]) {
      try {
        const diagnosis = JSON.parse(jsonMatch[0]);
        return diagnosis;
      } catch (e) {
        console.error('Error parsing JSON response:', e);
        
        // Fallback response if JSON parsing fails
        return {
          issue: 'Problema de fontanería',
          severity: 'medium',
          detail: 'Se ha detectado un problema en su sistema de fontanería que requiere atención.',
          recommendedActions: ['Inspeccionar las conexiones', 'Verificar posibles fugas', 'Reemplazar componentes dañados'],
          requiredParts: [
            { name: 'Kit de reparación', estimatedCost: '20-30€', availabilityStatus: 'common' }
          ],
          diyDifficulty: 'medium',
          estimatedTime: '1-2 horas',
          professionalRecommended: true
        };
      }
    }
    
    // If no JSON could be extracted
    throw new Error('No valid JSON in response');
    
  } catch (error) {
    console.error('Error analyzing problem with Gemini:', error);
    throw error;
  }
};

/**
 * Discuss diagnosis with the AI for follow-up questions
 * @param analysis The original analysis result
 * @param question The user's follow-up question
 * @returns Promise resolving to AI's response
 */
export const discussDiagnosis = async (
  analysis: any,
  question: string
): Promise<string> => {
  try {
    // Get text-only model
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      safetySettings,
      generationConfig: {
        ...generationConfig,
        maxOutputTokens: 512, // Shorter for conversation
      },
    });
    
    // Create chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `Este es el análisis del problema de mi casa:\n${JSON.stringify(analysis, null, 2)}`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "He analizado el problema en su hogar. ¿En qué puedo ayudarle con respecto a este diagnóstico?",
            },
          ],
        },
      ],
    });
    
    // Send user's question
    const result = await chat.sendMessage(question);
    return result.response.text();
    
  } catch (error) {
    console.error('Error discussing diagnosis with Gemini:', error);
    return "Lo siento, no he podido procesar tu consulta en este momento. Por favor, intenta de nuevo más tarde.";
  }
};

export default {
  imageToBase64,
  analyzeProblem,
  discussDiagnosis
};