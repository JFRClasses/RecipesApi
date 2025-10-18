import { Router } from "express";

const router = Router();

router.post('/recipes/ai-generate');
router.post('/recipes');
router.get('/recipes/:id');
router.post('/recipes');

export default router;