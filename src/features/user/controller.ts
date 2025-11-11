import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { UserService } from "./service";

@injectable()
export class UserController {
  constructor(@inject(UserService) private readonly userService: UserService) {}
  deleteUser = async (req: Request, res: Response) => {
    console.log("[UserController] DELETE /api/users/:id called");

    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      console.warn("[UserController] Invalid or missing user id param");
      return res.status(400).json({ message: "Parámetro 'id' inválido" });
    }

    try {
      const deleted = await this.userService.deleteUser(id);

      if (!deleted) {
        console.warn(`[UserController] User not found for id=${id}`);
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      console.log(
        `[UserController] User and related recipes deleted. id=${id}`
      );
      return res.json({
        message: "Usuario y sus recetas fueron eliminados correctamente",
      });
    } catch (err) {
      console.error("[UserController] Failed to delete user", err);
      return res.status(500).json({ message: "Error al eliminar usuario" });
    }
  };
}
