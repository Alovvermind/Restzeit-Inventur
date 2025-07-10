import { GoogleGenAI, Type } from "@google/genai";
import type { Analysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    zusammenfassung: {
      type: Type.STRING,
      description: "Eine kurze, einfühlsame Zusammenfassung der Analyse der Benutzereingabe in 2-3 Sätzen. Sprich den Nutzer direkt mit 'Du' an.",
    },
    muster: {
      type: Type.ARRAY,
      description: "Eine Liste der erkannten Charakterdefizite oder Verhaltensmuster (maximal 3).",
      items: {
        type: Type.OBJECT,
        properties: {
          titel: {
            type: Type.STRING,
            description: "Der Name des Musters (z.B. 'Groll', 'Angst', 'Egoismus', 'Unehrlichkeit').",
          },
          beschreibung: {
            type: Type.STRING,
            description: "Eine sanfte, konstruktive Beschreibung in 1-2 Sätzen, wie sich dieses Muster im Text des Benutzers gezeigt hat.",
          },
          beispiele: {
            type: Type.ARRAY,
            description: "Ein oder zwei kurze, wörtliche Zitate oder sehr enge Paraphrasen aus dem Text des Nutzers, die dieses Muster konkret belegen.",
            items: {
                type: Type.STRING,
            }
          }
        },
        required: ["titel", "beschreibung", "beispiele"],
      },
    },
    reflexionsfragen: {
      type: Type.ARRAY,
      description: "Zwei bis drei offene Fragen, die dem Benutzer helfen, tiefer über sein Verhalten nachzudenken und seinen eigenen Anteil zu erkennen.",
      items: {
        type: Type.STRING,
      },
    },
    tagesvorsatz: {
      type: Type.STRING,
      description: "Ein positiver, umsetzbarer Vorsatz für den nächsten Tag, der den erkannten Mustern entgegenwirkt. Formuliere ihn als 'Ich'-Aussage.",
    },
  },
  required: ["zusammenfassung", "muster", "reflexionsfragen", "tagesvorsatz"],
};

export async function analyzeInventory(inventoryText: string): Promise<Analysis> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analysiere den folgenden Text einer Tagesinventur im Sinne eines 12-Schritte-Programms. Identifiziere die Hauptmuster von Groll, Unehrlichkeit, Egoismus und Angst. Sei unterstützend und nicht wertend. Der Text lautet: "${inventoryText}"`,
      config: {
        systemInstruction: "Du bist ein weiser und mitfühlender Ratgeber, der auf den Prinzipien der 12-Schritte-Programme (wie die Anonymen Alkoholiker) basiert. Deine Aufgabe ist es, Nutzern bei ihrer täglichen Inventur zu helfen. Deine Antwort muss unterstützend, nicht wertend und konstruktiv sein. Du gibst keine medizinischen oder psychologischen Ratschläge, sondern spirituelle Anregungen im Sinne der Genesung. Gib deine Antwort IMMER als JSON zurück, das dem bereitgestellten Schema entspricht.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    return parsedData as Analysis;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Fehler bei der Analyse: ${error.message}. Bitte versuche es später erneut.`);
    }
    throw new Error("Ein unbekannter Fehler ist bei der Analyse aufgetreten.");
  }
}
