export interface RecipeCDTO {
  title: string;
  category?: string;
  minutes: number;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
  stars: number;
  userId: number;
}
