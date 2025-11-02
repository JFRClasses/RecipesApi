import { inject, injectable } from "tsyringe";
import { AppDataSource } from "../../models";
import { Recipe } from "../../models/Recipe";
import { OpenAIService } from "../../services/ai.service";
import { RecipeDTO } from '../../models/dtos/RecipeDTO';
import { RecipeCDTO } from "../../models/dtos/RecipeCDTO";

@injectable()
export class RecipeService {
  constructor(
    @inject(OpenAIService) private readonly aiService: OpenAIService
  ) {}

  generateRecipe = async (ingredients: string) => {
    ingredients = ingredients || "";
    console.log(`[RecipeService] generateRecipe called. Ingredients length: ${ingredients.length}`);
    const recipe = await this.aiService.getRecipeWithIngredients(ingredients);
    console.log('[RecipeService] generateRecipe completed');
    return recipe;
  };

  async createRecipe(recipe: RecipeCDTO) {
    console.log(`[RecipeService] createRecipe called. Title: "${recipe.title}" UserId: ${recipe.userId}`);
    const newRecipe = AppDataSource.manager.create(Recipe, recipe);

    const saved = await AppDataSource.manager.save(Recipe, newRecipe);
    console.log(`[RecipeService] Recipe created with id=${saved.id}`);
    return saved;
  }

  async getRecipesByUserId(userId : number) : Promise<RecipeDTO[]>{
    console.log(`[RecipeService] getRecipesByUserId called for userId=${userId}`);
    const recipeRepository = AppDataSource.manager.getRepository(Recipe);
    const recipes = await recipeRepository.find({where: { userId:userId }});
    console.log(`[RecipeService] Fetched ${recipes.length} recipes for userId=${userId}`);
    const mappedRecipes: RecipeDTO[] = recipes.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      minutes: r.minutes,
      ingredients: r.ingredients,
      instructions: r.instructions,
      imageUrl: r.imageUrl,
      stars: r.stars,
      userId: r.userId
    }));
    console.log(`[RecipeService] Mapped ${mappedRecipes.length} recipes to DTO`);
    return mappedRecipes;
  }
}
