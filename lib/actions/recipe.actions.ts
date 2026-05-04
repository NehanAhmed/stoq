'use server'

import { headers } from "next/headers"
import { auth } from "../auth"
import { getAllPantryItemsByHouseId, getAllRecipesByHouseId, saveRecipeToDatabase } from "../services/recipe.services"
import { getHouseIdByUserId } from "./receipt.actions"
import { AIInput } from "../types/recipe.types"
import { client } from "../openrouter"
import { SYSTEM_PROMPT } from "../prompt"
import { aiRecipeResponseSchema } from "../schemas/recipe.schemas"

export const createRecipeAction = async (input: string) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        const userId = session?.user.id
        if (!userId) {
            return { success: false, error: "User not authenticated" }
        }
        const houseId = await getHouseIdByUserId(userId)
        if (!houseId) {
            return { success: false, error: "House not found" }
        }
        const pantryItems = await getAllPantryItemsByHouseId(houseId)

        if (pantryItems.length === 0) {
            return { success: false, error: "No pantry items found" }
        }

        const rawContent = await AIRecipeService({ input, ingredients: pantryItems });
        if (!rawContent) {
            return { success: false, error: "AI returned empty response" };
        }
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("No JSON object found in AI response:", rawContent);
            return { success: false, error: "AI returned invalid JSON" };
        }
        const cleaned = jsonMatch[0].trim();

        let parsed: unknown;
        try {
            parsed = JSON.parse(cleaned);
        } catch {
            return { success: false, error: "AI returned invalid JSON" };
        }

        const validated = aiRecipeResponseSchema.safeParse(parsed);
        

        if (!validated.success) {
            console.error("AI response validation failed:", validated.error.flatten());
            return { success: false, error: "AI response did not match expected schema" };
        }

        const saved = await saveRecipeToDatabase({ ...validated.data, houseId });
        return { success: true, data: saved };


    } catch (error) {
        console.error(error)
        return { success: false, error: "Failed to create recipe" }
    }
}


const AIRecipeService = async (input: AIInput) => {
    try {
        const completion = await client.chat.send({
            chatRequest: {
                models: ['openai/gpt-oss-120b:free'],
                messages: [
                    {
                        role: 'system',
                        content: SYSTEM_PROMPT.replace('{ingredients}', JSON.stringify(input.ingredients))
                    },
                    {
                        role: 'user',
                        content: input.input
                    },
                ],
            }
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("OpenRouter API error:", error);
        throw error;
    }
}

export const fetchAllRecipeByHouseId = async (houseId: string) => {
    try {
        const recipes = await getAllRecipesByHouseId(houseId);
        return recipes;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw error;
    }
}