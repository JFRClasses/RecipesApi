import { inject, injectable } from "tsyringe";
import { AppDataSource } from "../../models";
import { Recipe } from "../../models/Recipe";
import { OpenAIService } from "../../services/ai.service";
import { RecipeDTO } from "../../models/dtos/RecipeDTO";
import { RecipeCDTO } from "../../models/dtos/RecipeCDTO";

@injectable()
export class RecipeService {
  constructor(
    @inject(OpenAIService) private readonly aiService: OpenAIService
  ) {}

  generateRecipe = async (ingredients: string) => {
    ingredients = ingredients || "";
    console.log(
      `[RecipeService] generateRecipe called. Ingredients length: ${ingredients.length}`
    );
    const recipe = await this.aiService.getRecipeWithIngredients(ingredients);
    console.log("[RecipeService] generateRecipe completed");
    return recipe;
  };

  async createRecipe(recipe: RecipeCDTO) {
    console.log(
      `[RecipeService] createRecipe called. Title: "${recipe.title}" UserId: ${recipe.userId}`
    );
    const newRecipe = AppDataSource.manager.create(Recipe, recipe);

    const saved = await AppDataSource.manager.save(Recipe, newRecipe);
    console.log(`[RecipeService] Recipe created with id=${saved.id}`);
    return saved;
  }

  async getRecipesByUserId(userId: number): Promise<RecipeDTO[]> {
    console.log(
      `[RecipeService] getRecipesByUserId called for userId=${userId}`
    );
    const recipeRepository = AppDataSource.manager.getRepository(Recipe);
    const recipes = await recipeRepository.find({ where: { userId: userId } });
    console.log(
      `[RecipeService] Fetched ${recipes.length} recipes for userId=${userId}`
    );
    const mappedRecipes: RecipeDTO[] = recipes.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      minutes: r.minutes,
      ingredients: r.ingredients,
      instructions: r.instructions,
      imageUrl: r.imageUrl,
      stars: r.stars,
      userId: r.userId,
      isFavorite: r.isFavorite,
    }));
    console.log(
      `[RecipeService] Mapped ${mappedRecipes.length} recipes to DTO`
    );
    return mappedRecipes;
  }
  async deleteRecipe(id: number): Promise<boolean> {
    console.log(`[RecipeService] deleteRecipe called for id=${id}`);

    const recipeRepository = AppDataSource.manager.getRepository(Recipe);
    const result = await recipeRepository.delete(id);

    if (result.affected && result.affected > 0) {
      console.log(`[RecipeService] Recipe deleted id=${id}`);
      return true;
    }

    console.warn(`[RecipeService] No recipe found with id=${id}`);
    return false;
  }
  async toggleFavorite(id: number): Promise<RecipeDTO | null> {
    console.log(`[RecipeService] toggleFavorite called for id=${id}`);

    const recipeRepository = AppDataSource.manager.getRepository(Recipe);
    const recipe = await recipeRepository.findOne({ where: { id } });

    if (!recipe) {
      console.warn(`[RecipeService] Recipe not found for toggle. id=${id}`);
      return null;
    }

    recipe.isFavorite = !recipe.isFavorite;

    const updated = await recipeRepository.save(recipe);

    console.log(
      `[RecipeService] Favorite toggled. id=${id}, isFavorite=${updated.isFavorite}`
    );

    return {
      id: updated.id,
      title: updated.title,
      category: updated.category,
      minutes: updated.minutes,
      ingredients: updated.ingredients,
      instructions: updated.instructions,
      imageUrl: updated.imageUrl,
      stars: updated.stars,
      userId: updated.userId,
      isFavorite: updated.isFavorite,
    };
  }
  async getLatestRecipes(userId: number): Promise<RecipeDTO[]> {
    console.log(`[RecipeService] getLatestRecipes called for userId=${userId}`);

    const recipeRepository = AppDataSource.manager.getRepository(Recipe);

    const recipes = await recipeRepository.find({
      where: { userId },
      order: { id: "DESC" },
      take: 5,
    });

    console.log(
      `[RecipeService] Found ${recipes.length} latest recipes for userId=${userId}`
    );

    return recipes.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      minutes: r.minutes,
      ingredients: r.ingredients,
      instructions: r.instructions,
      imageUrl: r.imageUrl,
      stars: r.stars,
      userId: r.userId,
      isFavorite: r.isFavorite,
    }));
  }
}
