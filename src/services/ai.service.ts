import { OpenAI } from 'openai';
import axios from 'axios';
import { envs } from '../config/env';
import { singleton } from 'tsyringe';

@singleton()
export class OpenAIService {
    openai : OpenAI;
    constructor() {
        this.openai = new OpenAI({
            apiKey: envs.openAIApiKey
        });
    }

    /**
     * 
     * @param {string} contentResponse 
     */
    getJSONFromResponse(contentResponse : string | null) {
        try {
            console.log(contentResponse);
            if(!contentResponse) throw new Error("No content");
            const json = JSON.parse(contentResponse);
            console.log(json);
            return json;
        } catch {
            return { error: true };
        }
    }

    /**
     * 
     * @param {string} prompt 
     */
    async generateRecipeWithPrompt(prompt:string) {
        const response = await this.openai.chat.completions.create({
            model: "gpt-5-mini",
            messages: [
                {
                    role: "user",
                    name: "App",
                    content: 
                    `
                    Instrucciones: Eres un chef profesional que genera recetas basado en ingredientes.
                    - Siempre vas a contestar con una lista de instrucciones, en JSON.
                    Sin relleno, sin saludos. Todo directo.
                    - Te pueden escribir mucho texto, pero debes de poder extraer los ingredientes del texto que te pasen.
                    - Si no te pasan una lista de ingredientes, vas a contestar con: {"error": true}.
                    - Tus contestaciones van a ser las siguientes:
                    {
                        "title": "$nombre_receta",
                        "ingredients": ["$ingrediente1", "$ingrediente2", ...],
                        "instructions": ["$instruccion1", "$instruccion2", ...],
                        "category": "$categoria", //Americana, Mexicana, Italiana, etc.
                        "minutes": $minutos //Tiempo de preparación
                    }
                    - Si no entiendes lo que te pasen, o no son ingredientes, vas a contestar con: {"error": true}.
                    - No es necesario utilizar todos los ingredientes.
                    - Siempre incluye los condimentos básicos, como la sal, azúcar, además del agua.
                    `
                },
                {
                    role: "user",
                    name: "user",
                    content: prompt
                }
            ],
            max_completion_tokens: 5000, 
        });
        console.log(response);
        return response;
    }

    /**
     * 
     * @param {string} ingredients 
     */
    async getRecipeWithIngredients(ingredients:string) {
        const response = await this.generateRecipeWithPrompt(ingredients);
        const recipeObject = this.getJSONFromResponse(response.choices[0].message.content);
        
        if (Object.keys(recipeObject).includes('error')) {
            return recipeObject;
        }

        const images = await this.getPosibleImages(recipeObject.title);
        
        const generateRecipe = {
            title: recipeObject.title,
            category: recipeObject.category,
            minutes: recipeObject.minutes,
            instructions: recipeObject.instructions,
            ingredients: recipeObject.ingredients,
            prompt: ingredients,
            stars: Math.floor(Math.random() * 5) + 1,
            imageUrl: images[Math.floor(images.length * Math.random())]
        }
        return generateRecipe;
    }

    /**
     * 
     * @param {string} keywords 
     */
    async getPosibleImages(keywords:string) {
        const query = axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: keywords.split(' ')[0]
            },
            headers: {
                Authorization: `Client-ID ${envs.upslapshApiKey}`
            }
        });
        const response = await query;
        const images = response.data.results.map((object:any) => object.urls.regular);
        return images;
    }
}
