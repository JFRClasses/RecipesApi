export interface RecipeDTO {
  id: number;
  title: string;
  category?: string;
  minutes: number;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
  stars: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
