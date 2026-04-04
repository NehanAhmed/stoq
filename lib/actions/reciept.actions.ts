'use server'
import { headers } from "next/headers"
import { auth } from "../auth"
import { extractReceiptItems } from "../services/reciept.services"

export async function scanReceiptAction(formData: FormData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        const userId = session?.user.id
        if (!userId) {
            return { success: false, error: "User not authenticated" }
        }
        
        const file = formData.get("file") as File
        if (!file) return { success: false, error: "No file provided" }

        if(file.size > 10 * 1024 * 1024) {
            return { success: false, error: "File size too large" }
        }
        
        if(!file.type.startsWith("image/")) {
            return { success: false, error: "File must be an image" }
        }
        

        const mimeType = file.type
        const arrayBuffer = await file.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString("base64")

        return extractReceiptItems(base64, mimeType)  
      
    } catch (error) {
        console.error("Error scanning receipt:", error)
        return { success: false, error: "Failed to scan receipt" }
    }
  }