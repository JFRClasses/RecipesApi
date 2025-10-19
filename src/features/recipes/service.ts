import { inject, injectable } from "tsyringe";
import { AppDataSource } from "../../models";
import { Recipe } from "../../models/Recipe";
import { OpenAIService } from "../../services/ai.service";
import { RecipeDTO } from '../../models/dtos/RecipeDTO';

@injectable()
export class RecipeService {
  constructor(
    @inject(OpenAIService) private readonly aiService: OpenAIService
  ) {}

  generateRecipe = async (ingredients: string) => {
    ingredients = ingredients || "";
    const recipe = await this.aiService.getRecipeWithIngredients(ingredients);
    return recipe;
  };

  async createRecipe(recipe: Recipe) {
    const newRecipe = AppDataSource.manager.create(Recipe, recipe);

    const saved = await AppDataSource.manager.save(Recipe, newRecipe);

    return saved;
  }

  async getRecipesByUserId(userId : number) : Promise<RecipeDTO[]>{
    const recipeRepository = AppDataSource.manager.getRepository(Recipe);
    const recipes = await recipeRepository.find({where: { userId:userId }});
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
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
    return mappedRecipes;
  }
}
