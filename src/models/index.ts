import "reflect-metadata";
import { DataSource } from "typeorm";
import { envs } from "../config/env";
import { User } from "./User";
import { Recipe } from "./Recipe";



export const AppDataSource = new DataSource({
    type: "postgres",
    host: envs.dbHost,
    port: envs.dbPort,
    username: envs.dbUser,
    password: envs.dbPassword,
    database: envs.dbName,
    synchronize: false,
    logging: true,
    entities: [User,Recipe],
    subscribers: [],
    migrations: ["dist/src/config/migrations/*"],
})