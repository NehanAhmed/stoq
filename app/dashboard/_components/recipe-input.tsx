'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createRecipeAction } from "@/lib/actions/recipe.actions"
import { IconLoader2, IconCheck, IconExclamationCircle, IconSparkles } from "@tabler/icons-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const RecipeInput = () => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      recipeInput: ""
    }
  })

  const onSubmit = async (data: { recipeInput: string }) => {
    setError(null)
    setSuccess(false)

    const result = await createRecipeAction(data.recipeInput)

    if (!result.success) {
      setError(result.error || "Something went wrong")
      toast.error(result.error || "Failed to generate recipe")
      return
    }

    setSuccess(true)
    toast.success("Recipe generated successfully!")
    form.reset()
    router.refresh()

    setTimeout(() => setSuccess(false), 3000)
  }

  const isLoading = form.formState.isSubmitting

  return (
    <div className="w-full space-y-4">
      <form
        className="w-full flex items-end justify-center gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="w-full space-y-3">
          <Label htmlFor="recipe-input" className="flex items-center gap-2">
            <IconSparkles className="w-4 h-4 text-primary" />
            Describe the Recipe
          </Label>
          <Input
            id="recipe-input"
            placeholder="e.g: I want to eat something spicy for Evening Snack."
            className={cn(
              "py-6 transition-all",
              error && "border-destructive focus-visible:ring-destructive",
              success && "border-green-500 focus-visible:ring-green-500"
            )}
            {...form.register("recipeInput")}
            disabled={isLoading}
          />
        </div>
        <div>
          <Button
            className="py-6 min-w-35"
            disabled={isLoading || !form.watch("recipeInput").trim()}
          >
            {isLoading ? (
              <>
                <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : success ? (
              <>
                <IconCheck className="w-4 h-4 mr-2" />
                Done!
              </>
            ) : (
              "Generate Recipe"
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md animate-in slide-in-from-top-1">
          <IconExclamationCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-500/10 px-4 py-3 rounded-md animate-in slide-in-from-top-1">
          <IconCheck className="w-4 h-4 shrink-0" />
          <span>Your recipe has been generated and saved!</span>
        </div>
      )}
    </div>
  )
}

export default RecipeInput