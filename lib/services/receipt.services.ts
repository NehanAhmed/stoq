import { genAI } from "../gemini"
import { EXTRACTION_PROMPT } from "../prompt"
import { ExtractedItem, ExtractionResponseSchema } from "../schemas/receipt.schemas"

const MODEL = "gemini-2.5-flash-lite"
const TIMEOUT_MS = 15_000

const SUPPORTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const

type SupportedMimeType = (typeof SUPPORTED_MIME_TYPES)[number]



type ExtractionResult =
  | { success: true; items: ExtractedItem[] }
  | { success: false; error: string }


function isSupportedMimeType(mimeType: string): mimeType is SupportedMimeType {
  return SUPPORTED_MIME_TYPES.includes(mimeType as SupportedMimeType)
}

function stripMarkdownFences(text: string): string {
  // Gemini occasionally wraps JSON in ```json ... ``` even when told not to
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim()
}


export async function extractReceiptItems(
  imageBase64: string,
  mimeType: string
): Promise<ExtractionResult> {
  // 1. Validate mime type before hitting the API
  if (!isSupportedMimeType(mimeType)) {
    return {
      success: false,
      error: `Unsupported file type: ${mimeType}. Please upload a JPEG, PNG, WEBP, HEIC, or HEIF image.`,
    }
  }

  const model = genAI.getGenerativeModel({ model: MODEL })

  let rawText: string

  try {
    // 2. Race the API call against a hard timeout
    const result = await Promise.race([
      model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: EXTRACTION_PROMPT },
              { inlineData: { mimeType, data: imageBase64 } },
              { text: "Extract all grocery items from this receipt." },
            ],
          },
        ],
      }),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("Gemini request timed out after 15s")),
          TIMEOUT_MS
        )
      ),
    ])

    rawText = result.response.text().trim()
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[gemini] API call failed:", message)
    return { success: false, error: `AI extraction failed: ${message}` }
  }

  // 3. Strip any accidental markdown fences
  const cleaned = stripMarkdownFences(rawText)

  // 4. Parse JSON
  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    console.error("[gemini] JSON parse failed. Raw response:", rawText)
    return {
      success: false,
      error: "AI returned an unreadable response. Please try again.",
    }
  }

  // 5. Validate shape with Zod — never trust AI output directly
  const validated = ExtractionResponseSchema.safeParse(parsed)
  if (!validated.success) {
    console.error("[gemini] Schema validation failed:", validated.error.format())
    return {
      success: false,
      error: "AI returned unexpected data. Please try again.",
    }
  }

  return { success: true, items: validated.data.items }
}

