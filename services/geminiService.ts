import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, DifficultyLevel } from '../types';

export const fetchQuizQuestions = async (count: number = 5, difficulty: DifficultyLevel, region: string | null): Promise<QuizQuestion[]> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("API Key is missing");
        }

        const ai = new GoogleGenAI({ apiKey });

        let difficultyPrompt = "";
        switch(difficulty) {
            case 'easy': difficultyPrompt = "Pose des questions sur les plats nationaux très connus et populaires."; break;
            case 'medium': difficultyPrompt = "Pose des questions sur des ingrédients spécifiques ou des plats un peu moins connus."; break;
            case 'hard': difficultyPrompt = "Pose des questions pointues sur l'histoire culinaire, les variations régionales ou des mets rares."; break;
        }

        let regionPrompt = region ? `Concentre-toi uniquement sur la cuisine de cette région : ${region}.` : "Choisis des pays variés du monde entier.";

        const systemInstruction = `
        Tu es un expert culinaire mondial joyeux et passionné. 
        Génère un quiz sur les plats endogènes.
        Le ton doit être ludique et "ambiancé".
        ${difficultyPrompt}
        ${regionPrompt}
        `;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Génère ${count} questions de quiz uniques.
            Pour chaque question, donne le pays, une description qui sert de devinette (sans nommer le plat), la bonne réponse (le nom du plat), 3 choix de réponses (dont la bonne), et une anecdote amusante (funFact).`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            country: { type: Type.STRING, description: "Le pays d'origine du plat" },
                            description: { type: Type.STRING, description: "Une description appétissante ou un indice sur le plat sans le nommer" },
                            correctAnswer: { type: Type.STRING, description: "Le nom correct du plat" },
                            options: { 
                                type: Type.ARRAY, 
                                items: { type: Type.STRING },
                                description: "Liste de 3 plats possibles incluant la bonne réponse"
                            },
                            funFact: { type: Type.STRING, description: "Une petite anecdote culturelle sur ce plat" }
                        },
                        required: ["country", "description", "correctAnswer", "options", "funFact"],
                        propertyOrdering: ["country", "description", "correctAnswer", "options", "funFact"]
                    }
                }
            }
        });

        const data = JSON.parse(response.text || "[]");
        return data as QuizQuestion[];

    } catch (error) {
        console.error("Failed to fetch questions:", error);
        // Fallback data
        return [
            {
                country: "Italie",
                description: "Une pâte ronde garnie de tomate et mozzarella.",
                correctAnswer: "Pizza",
                options: ["Pizza", "Pasta", "Risotto"],
                funFact: "La Margherita a été créée en l'honneur de la reine Marguerite."
            },
            {
                country: "Japon",
                description: "Riz vinaigré accompagné de poisson cru.",
                correctAnswer: "Sushi",
                options: ["Sushi", "Ramen", "Tempura"],
                funFact: "À l'origine, c'était une méthode de conservation du poisson."
            },
            {
                country: "Mexique",
                description: "Galette de maïs garnie de viande et légumes.",
                correctAnswer: "Tacos",
                options: ["Tacos", "Burrito", "Enchiladas"],
                funFact: "Il existe des milliers de variétés de tacos au Mexique."
            }
        ];
    }
};