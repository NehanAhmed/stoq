import z from "zod";

export const createHouseSchema = z.object({
    name: z.string().min(1, "House name is required"),
    noOfMembers: z.number().min(1, "At least 1 member required").max(100, "Maximum 100 members"),
    location: z.string().optional(),
})

export type CreateHouseFormValues = z.infer<typeof createHouseSchema>
