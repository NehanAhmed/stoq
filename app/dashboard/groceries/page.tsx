'use client'

import { useCallback, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ReceiptScan from "../_components/reciept-scan"
import FieldArray from "../_components/field-array"
import { ManualGroceryForm, ManualGroceryFormSchema } from "@/lib/schemas/grocery.schemas"
import { savePantryItemsAction } from "@/lib/actions/grocery.actions"
import { toast } from "sonner"

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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Add Items to Pantry
      </h1>

      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Receipt Scan Section */}
        <Card>
          <CardHeader>
            <CardTitle><h1 className="text-2xl font-semibold">Scan Receipt</h1></CardTitle>
            <CardDescription><p>
              Upload a receipt image to automatically extract and add items to your pantry
            </p></CardDescription>
          </CardHeader>
          <CardContent>
            <ReceiptScan />
          </CardContent>
        </Card>

        {/* Manual Entry Section */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FieldArray
                control={form.control}
                register={form.register}
                fields={fields}
                append={append}
                remove={remove}
              />

              {form.formState.errors.items?.root && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.items.root.message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !form.formState.isValid || fields.length === 0}
              >
                {isSubmitting ? "Saving..." : `Save ${fields.length} Item(s)`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Page