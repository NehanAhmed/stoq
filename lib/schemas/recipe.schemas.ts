import z from "zod"

export const createRecipeSchema = z.object({
    name: z.string().min(1, "Recipe name is required"),
    tagline: z.string().min(1, "Tagline is required"),
    ingredients: z.string().min(1, "Ingredients are required"),
    instructions: z.string().min(1, "Instructions are required"),
})
export const aiRecipeResponseSchema = z.object({
    name: z.string().min(1),
    tagline: z.string().min(1),
    ingredients: z.array(
        z.object({
            name: z.string().min(1),
            quantity: z.string().min(1),
            unit: z.string().default(""),
        })
    ).min(1),
    instructions: z.array(z.string().min(1)).min(1), 
});

export type CreateRecipeFormValues = z.infer<typeof createRecipeSchema>
export type AiRecipeResponse = z.infer<typeof aiRecipeResponseSchema>;
export type SaveRecipePayload = AiRecipeResponse & { houseId: string };
