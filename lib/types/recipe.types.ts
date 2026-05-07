import type { RecipeIngredient } from "../schema"

export interface AIInput {
  input: string
  ingredients: RecipeIngredient[]
}

export interface RecipeParam {
  id: string
  houseId: string
  name: string
  tagline: string
  ingredients: RecipeIngredient[]
  instructions: string
  createdAt: Date
  updatedAt: Date
}x  