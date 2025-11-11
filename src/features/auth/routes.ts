import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "./controller";

const ctrl = container.resolve(AuthController);

const router = Router();
router.post('/register', ctrl.register);
router.post('/login', ctrl.login);

export default router;