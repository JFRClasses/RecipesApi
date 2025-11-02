import "reflect-metadata";
import express, { Request, Response } from "express";
import { envs } from "./src/config/env";
import { AppDataSource } from "./src/models";
import { User } from "./src/models/User";
import cors from 'cors';
import { DataSource } from "typeorm";
import { container } from "tsyringe";
import { CryptService } from "./src/services/crypt.service";
import authRoutes from './src/features/auth/routes';
import recipeRoutes from './src/features/recipes/routes';
const app = express();
container.registerSingleton(CryptService, CryptService);
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/recipes',recipeRoutes)
app.get("/users", async (_req, res) => {
  const users = await AppDataSource.getRepository(User).find();
  return res.json(users);
});

app.get("/", (req: Request, res: Response) => {
  return res.json({ test: "test" });
});

console.log('[Server] Initializing data source...');
AppDataSource.initialize()
  .then(() => {
    console.log('[Server] Data source initialized successfully');
    const port = process.env.PORT || 3000;
    app.listen(port, () =>
      console.log(`[Server] HTTP server listening on port ${port}`)
    );
  })
  .catch((error) => console.error('[Server] Failed to initialize data source', error));
