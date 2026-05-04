import { eq } from "drizzle-orm"
import { db } from "../db"
import { pantryItem, recipes } from "../schema"
import { AiRecipeResponse, SaveRecipePayload } from "../schemas/recipe.schemas"

export const getAllPantryItemsByHouseId = async (houseId: string) => {
    try {
        const pantryItems = await db 
        .select({name: pantryItem.name, quantity: pantryItem.quantity, unit: pantryItem.unit})   
        .from(pantryItem)
        .where(eq(pantryItem.houseId, houseId))
        return pantryItems
    } catch (error) {
        throw error
    }
}

export const saveRecipeToDatabase = async (recipe: SaveRecipePayload) => {
    try {
        const [saved] = await db
            .insert(recipes)
            .values({
                houseId: recipe.houseId,
                name: recipe.name,
                tagline: recipe.tagline,
                ingredients: recipe.ingredients,       
                instructions: recipe.instructions.join("\n")
            })
            .returning();

        return saved;
    } catch (error) {
        console.error("Error saving recipe to database:", error);
        throw error;
    }
};

export const getAllRecipesByHouseId = async (houseId: string) => {
    try {
        const recipesData = await db
            .select()
            .from(recipes)
            .where(eq(recipes.houseId, houseId));
        return recipesData;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw error;
    }
};