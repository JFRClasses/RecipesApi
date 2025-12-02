import { Router } from "express";
import { container } from "tsyringe";
import { RecipeController } from "./controller";

const router = Router();
const ctrl =  container.resolve(RecipeController);
router.get('/',ctrl.getRecipes)
router.get('/latest', ctrl.getLatestRecipes);
router.post('/ai-generate', ctrl.generateRecipe);
router.post('/',ctrl.createRecipe);
router.patch('/:id/toggle-favorite', ctrl.toggleFavorite);
router.delete('/:id', ctrl.deleteRecipe);

export default router;