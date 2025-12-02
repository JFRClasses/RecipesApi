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
    console.log("[RecipeController] POST /api/recipes/ai-generate called");
    ingredients = ingredients || "";
    const recipe = await this.recipeService.generateRecipe(ingredients);
    console.log("[RecipeController] Recipe generated via AI");
    return res.json(recipe);
  };

  createRecipe = async (req: Request, res: Response) => {
    console.log("[RecipeController] POST /api/recipes called");
    let recipe = req.body as RecipeCDTO;
    const createdRecipe = await this.recipeService.createRecipe(recipe);
    console.log(
      `[RecipeController] Recipe created with id=${createdRecipe.id}`
    );
    return res.status(201).json(createdRecipe);
  };

  getRecipes = async (req: Request, res: Response) => {
    console.log("[RecipeController] GET /api/recipes called");
    const userIdString = req.query.userId;

    if (
      !userIdString ||
      Array.isArray(userIdString) ||
      isNaN(Number(userIdString))
    ) {
      console.warn("[RecipeController] Invalid or missing userId query param");
      return res
        .status(400)
        .json({ error: "Parámetro 'userId' inválido o faltante" });
    }

    const userId = Number(userIdString);

    try {
      const recipes = await this.recipeService.getRecipesByUserId(userId);
      console.log(
        `[RecipeController] Returning ${recipes.length} recipes for userId=${userId}`
      );
      return res.json(recipes);
    } catch (err) {
      console.error("[RecipeController] Failed to get recipes", err);
      return res.status(500).json({ error: "Error al obtener recetas" });
    }
  };
  deleteRecipe = async (req: Request, res: Response) => {
    console.log("[RecipeController] DELETE /api/recipes/:id called");

    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      console.warn("[RecipeController] Invalid or missing recipe id param");
      return res.status(400).json({ message: "Parámetro 'id' inválido" });
    }

    try {
      const deleted = await this.recipeService.deleteRecipe(id);

      if (!deleted) {
        console.warn(`[RecipeController] Recipe not found for id=${id}`);
        return res.status(404).json({ message: "Receta no encontrada" });
      }

      console.log(`[RecipeController] Recipe deleted successfully. id=${id}`);
      return res.json({ message: "Receta eliminada correctamente" });
    } catch (err) {
      console.error("[RecipeController] Failed to delete recipe", err);
      return res.status(500).json({ message: "Error al eliminar receta" });
    }
  };

  toggleFavorite = async (req: Request, res: Response) => {
    console.log("[RecipeController] PATCH /api/recipes/:id/toggle-favorite");

    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Parámetro 'id' inválido" });
    }

    try {
      const result = await this.recipeService.toggleFavorite(id);

      if (!result) {
        return res.status(404).json({ error: "Receta no encontrada" });
      }

      return res.json(result);
    } catch (err) {
      console.error("[RecipeController] toggleFavorite error", err);
      return res.status(500).json({ error: "Error al actualizar favorito" });
    }
  };
  getLatestRecipes = async (req: Request, res: Response) => {
    console.log("[RecipeController] GET /api/recipes/latest called");

    const userIdString = req.query.userId;

    if (
      !userIdString ||
      Array.isArray(userIdString) ||
      isNaN(Number(userIdString))
    ) {
      return res.status(400).json({
        error: "Parámetro 'userId' inválido o faltante",
      });
    }

    const userId = Number(userIdString);

    try {
      const recipes = await this.recipeService.getLatestRecipes(userId);
      return res.json(recipes);
    } catch (err) {
      console.error("[RecipeController] Error getting latest recipes", err);
      return res.status(500).json({
        error: "Error al obtener las últimas recetas",
      });
    }
  };
}
