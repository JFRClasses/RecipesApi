import { inject, injectable } from "tsyringe";
import { AuthService } from "./service";
import { NextFunction, Response, Request } from "express";

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private readonly auth: AuthService) {}

  getUser = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      if (!id || isNaN(id)) {
        return res.status(400).json({ message: "Parámetro 'id' inválido" });
      }

      console.log(`[AuthController] GET /api/auth/user/${id} called`);
      const user = await this.auth.getUserById(id);

      console.log(`[AuthController] Returning user info for id=${id}`);
      return res.status(200).json({
        message: "User data loaded successfully",
        user,
      });
    } catch (e: any) {
      const status = e.status || 500;
      console.error("[AuthController] Failed to load user", e);
      return res.status(status).json({
        message: e.message || "Internal server error",
      });
    }
  };

  register = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      console.log("[AuthController] POST /api/auth/register called");
      const r = await this.auth.register(name, email, password);
      console.log(
        `[AuthController] User registered successfully. Email=${email}`
      );
      return res.status(201).json(r);
    } catch (e: any) {
      const status = e.status || 500;
      console.error("[AuthController] Register failed", e);
      return res
        .status(status)
        .json({
          message: e.message || "Internal server error",
          isLogged: false,
          userId: 0,
        });
    }
  };

  login = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { email, password } = req.body;
      console.log("[AuthController] POST /api/auth/login called");
      const r = await this.auth.login(email, password);
      console.log(`[AuthController] User logged in. Email=${email}`);
      return res.json(r);
    } catch (e: any) {
      const status = e.status || 500;
      console.error("[AuthController] Login failed", e);
      return res
        .status(status)
        .json({
          message: e.message || "Internal server error",
          isLogged: false,
          userId: 0,
        });
    }
  };
}
