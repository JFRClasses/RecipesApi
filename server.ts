import { logger, patchConsoleToWinston } from "./src/config/logger";
patchConsoleToWinston();

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
import userRoutes from './src/features/user/routes';
const app = express();
container.registerSingleton(CryptService, CryptService);
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/recipes',recipeRoutes);
app.use('/api/user',userRoutes);
app.get("/users", async (_req, res) => {
  const users = await AppDataSource.getRepository(User).find();
  return res.json(users);
});

app.get("/", (req: Request, res: Response) => {
  return res.json({ test: "test" });
});

logger.info('[Server] Initializing data source...');
AppDataSource.initialize()
  .then(() => {
    logger.info('[Server] Data source initialized successfully');
    const port = process.env.PORT || 3000;
    app.listen(port, () =>
      logger.info(`[Server] HTTP server listening on port ${port}`)
    );
  })
  .catch((error) => logger.error('[Server] Failed to initialize data source', error));
