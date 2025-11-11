import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Recipe } from "./Recipe";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    name!: string
    @Column()
    email!: string;
    @Column()
    password!: string;
    @OneToMany(() => Recipe, (recipe) => recipe.user)
    recipes!: Recipe[];
}