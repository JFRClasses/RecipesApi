import { Router } from "express";
import { container } from "tsyringe";
import { RecipeController } from "./controller";

const router = Router();
const ctrl =  container.resolve(RecipeController);
router.get('/',ctrl.getRecipes)
router.post('/ai-generate', ctrl.generateRecipe);
router.post('/',ctrl.createRecipe);
router.delete('/:id', ctrl.deleteRecipe);

export default router;