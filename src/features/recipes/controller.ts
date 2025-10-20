import { Request, Response } from "express";
import { OpenAIService } from "../../services/ai.service";
import { Recipe } from "../../models/Recipe";
import { inject, injectable } from "tsyringe";
import { RecipeService } from "./service";
import { RecipeCDTO } from "../../models/dtos/RecipeCDTO";

@injectable()
export class RecipeController {
  constructor(
    @inject(RecipeService) private readonly recipeService: RecipeService
  ) {}

  generateRecipe = async (req: Request, res: Response) => {
    let { ingredients } = req.body;
    ingredients = ingredients || "";
    const recipe = await this.recipeService.generateRecipe(ingredients);
    return res.json(recipe);
  };

  createRecipe = async (req: Request, res: Response) => {
    let recipe = req.body as RecipeCDTO;
    const createdRecipe = await this.recipeService.createRecipe(recipe);
    return res.status(201).json(createdRecipe);
  };

  getRecipes = async (req: Request, res: Response) => {
    const userIdString = req.query.userId;

    if (
      !userIdString ||
      Array.isArray(userIdString) ||
      isNaN(Number(userIdString))
    ) {
      return res
        .status(400)
        .json({ error: "Parámetro 'userId' inválido o faltante" });
    }

    const userId = Number(userIdString);

    try {
      const recipes = await this.recipeService.getRecipesByUserId(userId);
      return res.json(recipes);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener recetas" });
    }
  };
}
