export interface AIInput {
  input: string
  ingredients: {
    name: string
    quantity: string
    unit: string
  }[]
}

export interface RecipeParam{
  id:string
  houseId:string
  name:string
  tagline:string
  ingredients:{
    name: string
    quantity: string
    unit: string
  }[]
  instructions:string
  createdAt:Date
  updatedAt:Date
}