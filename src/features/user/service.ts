import { injectable } from "tsyringe";
import { AppDataSource } from "../../models";
import { User } from "../../models/User";
import { Recipe } from "../../models/Recipe";

@injectable()
export class UserService {
  deleteUser = async (id: number): Promise<boolean> => {
    console.log(`[UserService] deleteUser called for id=${id}`);

    const userRepository = AppDataSource.manager.getRepository(User);
    const recipeRepository = AppDataSource.manager.getRepository(Recipe);

    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      console.warn(`[UserService] No user found with id=${id}`);
      return false;
    }

    const recipes = await recipeRepository.find({ where: { userId: id } });
    if (recipes.length > 0) {
      await recipeRepository.delete({ userId: id });
      console.log(
        `[UserService] Deleted ${recipes.length} recipes for userId=${id}`
      );
    } else {
      console.log(`[UserService] No recipes found for userId=${id}`);
    }

    const result = await userRepository.delete(id);

    if (result.affected && result.affected > 0) {
      console.log(`[UserService] User deleted id=${id}`);
      return true;
    }

    console.warn(`[UserService] Failed to delete user id=${id}`);
    return false;
  };
}
