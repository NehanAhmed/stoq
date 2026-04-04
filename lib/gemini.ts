
import { GoogleGenerativeAI } from "@google/generative-ai"
import { config } from "dotenv"
config({ path: ".env.local" });


export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)


