'use client'

import { useCallback, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from 'motion/react'
import { IconShoppingCart, IconReceipt, IconLoader2 } from '@tabler/icons-react'
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ReceiptScan from "../_components/reciept-scan"
import FieldArray from "../_components/field-array"
import { ManualGroceryForm, ManualGroceryFormSchema } from "@/lib/schemas/grocery.schemas"
import { savePantryItemsAction } from "@/lib/actions/grocery.actions"
import { toast } from "sonner"

const fadeUpVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
}

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ManualGroceryForm>({
    resolver: zodResolver(ManualGroceryFormSchema),
    defaultValues: { items: [] },
    mode: "onChange"
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  })

  const onSubmit = useCallback(async (data: ManualGroceryForm) => {
    setIsSubmitting(true)
    try {
      const result = await savePantryItemsAction(data.items)

      if (result.success) {
        toast.success(`Added ${data.items.length} item(s) to your pantry`)
        form.reset({ items: [] })
      } else {
        toast.error(result.error || "Failed to save items")
      }
    } catch (error) {
      console.error("[onSubmit]", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }, [form])

  return (
    <motion.div
      initial={fadeUpVariants.initial}
      animate={fadeUpVariants.animate}
      transition={fadeUpVariants.transition}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={fadeUpVariants.initial}
        animate={fadeUpVariants.animate}
        transition={{ ...fadeUpVariants.transition, delay: 0.1 }}
        className="text-center space-y-2"
      >
        <h1 className="text-2xl font-semibold tracking-tight">
          Add Items to Pantry
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose how you'd like to add items to your pantry
        </p>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        initial={fadeUpVariants.initial}
        animate={fadeUpVariants.animate}
        transition={{ ...fadeUpVariants.transition, delay: 0.2 }}
        className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Receipt Scan Section */}
        <motion.div
          initial={fadeUpVariants.initial}
          animate={fadeUpVariants.animate}
          transition={{ ...fadeUpVariants.transition, delay: 0.3 }}
          whileHover={{ y: -2 }}
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconReceipt className="h-5 w-5 text-primary" />
                </motion.div>
                <div>
                  <CardTitle className="text-lg font-semibold">Scan Receipt</CardTitle>
                </div>
              </div>
              <CardDescription className="text-sm">
                Upload a receipt image to automatically extract and add items to your pantry
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ReceiptScan />
            </CardContent>
          </Card>
        </motion.div>

        {/* Manual Entry Section */}
        <motion.div
          initial={fadeUpVariants.initial}
          animate={fadeUpVariants.animate}
          transition={{ ...fadeUpVariants.transition, delay: 0.4 }}
          whileHover={{ y: -2 }}
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconShoppingCart className="h-5 w-5 text-primary" />
                </motion.div>
                <div>
                  <CardTitle className="text-lg font-semibold">Manual Entry</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FieldArray
                  control={form.control}
                  register={form.register}
                  fields={fields}
                  append={append}
                  remove={remove}
                />

                <AnimatePresence>
                  {form.formState.errors.items?.root && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-destructive"
                    >
                      {form.formState.errors.items.root.message}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.div
                  whileHover={{ scale: !isSubmitting && fields.length > 0 && form.formState.isValid ? 1.02 : 1 }}
                  whileTap={{ scale: !isSubmitting && fields.length > 0 && form.formState.isValid ? 0.98 : 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !form.formState.isValid || fields.length === 0}
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <IconLoader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Save {fields.length} Item{fields.length !== 1 ? 's' : ''}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Page