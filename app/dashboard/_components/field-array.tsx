'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExtractedItem, ExtractionResponse, ExtractionResponseSchema } from "@/lib/schemas/receipt.schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"

const FieldArray = ({extractedItems}:{ extractedItems: ExtractedItem[]}) => {
    const form = useForm<ExtractionResponse>({
        resolver: zodResolver(ExtractionResponseSchema),
        defaultValues:{
            items: extractedItems
        }
    })

    const {fields,append,remove} = useFieldArray({
        control: form.control,
        name: "items"
    })

    const onSubmit = (data: ExtractionResponse) => {
        console.log(data)
    }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_120px_100px_40px] gap-2 mb-2">
        <span>Item Name</span>
        <span>Quantity</span>
        <span>Unit</span>
        <span />
      </div>

      {/* Rows */}
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-[1fr_120px_100px_40px] gap-2 mb-2">
          
          <Input
            {...form.register(`items.${index}.name`)}
            placeholder="Item name"
          />
          
          <Input
            {...form.register(`items.${index}.quantity`)}
            placeholder="Qty"
          />
          
          <Input
            {...form.register(`items.${index}.unit`)}
            placeholder="Unit"
          />

          <Button
            type="button"
            variant="ghost"
            onClick={() => remove(index)}
          >
            ✕
          </Button>

        </div>
      ))}

      {/* Add row manually */}
      <Button
        type="button"
        onClick={() => append({ name: "", quantity: '1', unit: null })}
      >
        + Add item
      </Button>

      {/* Submit */}
      <Button type="submit">Confirm & Save to Pantry</Button>

    </form>
  )
}

export default FieldArray