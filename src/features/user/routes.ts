import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "./controller";

const router = Router();
const ctrl = container.resolve(UserController);
router.get('/:id',ctrl.getUser)
router.delete('/:id',ctrl.deleteUser);

export default router;