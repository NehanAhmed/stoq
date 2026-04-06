'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExtractedItem, ExtractionResponse } from "@/lib/schemas/receipt.schemas"
import { Control, UseFieldArrayReturn } from "react-hook-form"

interface FieldArrayProps {
  control: Control<ExtractionResponse>
  fields: UseFieldArrayReturn<ExtractionResponse, "items", "id">["fields"]
  append: UseFieldArrayReturn<ExtractionResponse, "items", "id">["append"]
  remove: UseFieldArrayReturn<ExtractionResponse, "items", "id">["remove"]
}

const FieldArray = ({ control, fields, append, remove }: FieldArrayProps) => {
  return (
    <div>
      <div className="grid grid-cols-[1fr_120px_100px_40px] gap-2 mb-2">
        <span>Item Name</span>
        <span>Quantity</span>
        <span>Unit</span>
        <span />
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-[1fr_120px_100px_40px] gap-2 mb-2">
          <Input {...control.register(`items.${index}.name`)} placeholder="Item name" />
          <Input {...control.register(`items.${index}.quantity`)} placeholder="Qty" />
          <Input {...control.register(`items.${index}.unit`)} placeholder="Unit" />
          <Button type="button" variant="ghost" onClick={() => remove(index)}>✕</Button>
        </div>
      ))}

      <Button type="button" onClick={() => append({ name: "", quantity: '1', unit: null } as ExtractedItem)}>
        + Add item
      </Button>
    </div>
  )
}

export default FieldArray