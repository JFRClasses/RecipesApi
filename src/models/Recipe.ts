// src/models/Recipe.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: 'int', default: 0 })
  minutes!: number;

  @Column({ type: 'jsonb' })
  ingredients!: string[];

  @Column({ type: 'jsonb' })
  instructions!: string[];

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  prompt?: string;

  @Column({ type: 'int', default: 0 })
  stars!: number;

  // FK: cada receta pertenece a un usuario
  @Column()
  userId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}