import { OpenAI } from 'openai';
import axios from 'axios';
import { envs } from '../config/env';
import { singleton } from 'tsyringe';
import { generateRecipePrompt } from '../config/prompts';

@singleton()
export class OpenAIService {
    openai : OpenAI;
    constructor() {
        this.openai = new OpenAI({
            apiKey: envs.openAIApiKey
        });
        console.log('[OpenAIService] Initialized OpenAI client');
    }

    /**
     * 
     * @param {string} contentResponse 
     */
    getJSONFromResponse(contentResponse : string | null) {
        try {
            const preview = contentResponse ? contentResponse.slice(0, 120) : 'null';
            console.log(`[OpenAIService] Parsing JSON from response. Preview: ${preview}...`);
            if(!contentResponse) throw new Error('No content');
            const json = JSON.parse(contentResponse);
            console.log(`[OpenAIService] JSON parsed successfully. Keys: ${Object.keys(json).join(', ')}`);
            return json;
        } catch (err) {
            console.error('[OpenAIService] Failed to parse JSON from model response');
            return { error: true };
        }
    }

    /**
     * 
     * @param {string} prompt 
     */
    async generateRecipeWithPrompt(prompt:string) {
        const promptPreview = (prompt || '').slice(0, 80);
        console.log(`[OpenAIService] Generating recipe with prompt. Preview: "${promptPreview}"`);
        const startedAt = Date.now();
        const response = await this.openai.chat.completions.create({
            model: "gpt-5-mini",
            messages: [
                {
                    role: "user",
                    name: "App",
                    content: generateRecipePrompt
                },
                {
                    role: "user",
                    name: "user",
                    content: prompt
                }
            ],
            max_completion_tokens: 5000, 
        });
        const durationMs = Date.now() - startedAt;
        const choices = response.choices?.length ?? 0;
        const usage = (response as any).usage || {};
        console.log(`[OpenAIService] Model responded in ${durationMs}ms. Choices: ${choices}. Usage: prompt=${usage.prompt_tokens || '?'} completion=${usage.completion_tokens || '?'} total=${usage.total_tokens || '?'}`);
        return response;
    }

    /**
     * 
     * @param {string} ingredients 
     */
    async getRecipeWithIngredients(ingredients:string) {
        console.log(`[OpenAIService] getRecipeWithIngredients called. Ingredients length: ${ingredients?.length || 0}`);
        const response = await this.generateRecipeWithPrompt(ingredients);
        const recipeObject = this.getJSONFromResponse(response.choices[0].message.content);
        
        if (Object.keys(recipeObject).includes('error')) {
            console.warn('[OpenAIService] Model returned an error payload');
            return recipeObject;
        }

        const images = await this.getPosibleImages(recipeObject.title);
        console.log(`[OpenAIService] Retrieved ${images.length} image candidates for "${recipeObject.title}"`);
        
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
        console.log('[OpenAIService] Recipe generated successfully');
        return generateRecipe;
    }

    /**
     * 
     * @param {string} keywords 
     */
    async getPosibleImages(keywords:string) {
        console.log(`[OpenAIService] Searching images for keywords: "${keywords}"`);
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
        console.log(`[OpenAIService] Found ${images.length} images from Unsplash`);
        return images;
    }
}
