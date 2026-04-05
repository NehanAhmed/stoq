import "server-only"

import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GOOGLE_API_KEY
if (!apiKey) {
    throw new Error("GOOGLE_API_KEY environment variable is required")
}

export const genAI = new GoogleGenerativeAI(apiKey)


