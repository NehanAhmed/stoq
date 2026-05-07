'use client'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createRecipeAction } from "@/lib/actions/recipe.actions"
import { IconLoader2, IconCheck, IconExclamationCircle, IconSparkles } from "@tabler/icons-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const fadeUpVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
}

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
  const recipeInputValue = form.watch("recipeInput").trim()

  return (
    <motion.div
      initial={fadeUpVariants.initial}
      animate={fadeUpVariants.animate}
      transition={fadeUpVariants.transition}
      className="space-y-6"
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6 space-y-6">
          <motion.form
            initial={fadeUpVariants.initial}
            animate={fadeUpVariants.animate}
            transition={{ ...fadeUpVariants.transition, delay: 0.1 }}
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Input Field */}
            <motion.div
              initial={fadeUpVariants.initial}
              animate={fadeUpVariants.animate}
              transition={{ ...fadeUpVariants.transition, delay: 0.2 }}
              className="space-y-3"
            >
              <Label htmlFor="recipe-input" className="flex items-center gap-2 text-sm font-medium">
                <motion.div
                  className="flex h-4 w-4 items-center justify-center"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconSparkles className="h-4 w-4 text-primary" />
                </motion.div>
                Describe Your Recipe
              </Label>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
              >
                <Input
                  id="recipe-input"
                  placeholder="e.g: I want to eat something spicy for Evening Snack."
                  className={cn(
                    "py-6 transition-all duration-200",
                    error && "border-destructive focus-visible:ring-destructive",
                    success && "border-green-500 focus-visible:ring-green-500"
                  )}
                  {...form.register("recipeInput")}
                  disabled={isLoading}
                />
              </motion.div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={fadeUpVariants.initial}
              animate={fadeUpVariants.animate}
              transition={{ ...fadeUpVariants.transition, delay: 0.3 }}
              className="w"
            >
              <motion.div
                whileHover={{ scale: !isLoading && recipeInputValue ? 1.02 : 1 }}
                whileTap={{ scale: !isLoading && recipeInputValue ? 0.98 : 1 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  className="w-full py-6 px-8 min-w-35 gap-2"
                  disabled={isLoading || !recipeInputValue}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <IconLoader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </motion.span>
                    ) : success ? (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <IconCheck className="h-4 w-4" />
                        Done!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Generate Recipe
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>

          {/* Status Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md"
              >
                <IconExclamationCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-sm text-green-600 bg-green-500/10 px-4 py-3 rounded-md"
              >
                <IconCheck className="h-4 w-4 shrink-0" />
                <span>Your recipe has been generated and saved!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default RecipeInput