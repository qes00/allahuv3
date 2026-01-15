import { GoogleGenAI } from "@google/genai";

// Inicializar cliente. En producción real, esto debería estar proxied por el backend
// para no exponer la API KEY, pero para este ejercicio Frontend-heavy se usa process.env.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateSmartDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-latest'; 
    const prompt = `
      Actúa como un copywriter experto en e-commerce para una tienda peruana.
      Escribe una descripción corta (máximo 40 palabras), atractiva y vendedora para un producto.
      Nombre: ${productName}
      Categoría: ${category}
      
      Usa un tono amigable y profesional. Incluye emojis sutiles.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "No se pudo generar la descripción.";
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    throw new Error("Falló la generación de IA");
  }
};