'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ManualGroceryItem, ManualGroceryForm } from "@/lib/schemas/grocery.schemas"
import { Control, Controller, UseFieldArrayReturn, UseFormRegister } from "react-hook-form"

interface FieldArrayProps {
  control: Control<ManualGroceryForm>
  register: UseFormRegister<ManualGroceryForm>
  fields: UseFieldArrayReturn<ManualGroceryForm, "items", "id">["fields"]
  append: UseFieldArrayReturn<ManualGroceryForm, "items", "id">["append"]
  remove: UseFieldArrayReturn<ManualGroceryForm, "items", "id">["remove"]
}

const UNIT_OPTIONS = [
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
  { value: "ml", label: "ml" },
  { value: "l", label: "l" },
  { value: "oz", label: "oz" },
  { value: "lb", label: "lb" },
  { value: "pcs", label: "pcs" },
  { value: "pack", label: "pack" },
  { value: "box", label: "box" },
  { value: "bottle", label: "bottle" },
  { value: "can", label: "can" },
  { value: "jar", label: "jar" },
  { value: "bag", label: "bag" },
] as const

function getDefaultItem(): ManualGroceryItem {
  return {
    name: "",
    quantity: "1",
    unit: null,
  }
}

function FieldArray({ control, register, fields, append, remove }: FieldArrayProps) {
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
          <Input {...register(`items.${index}.name`)} placeholder="Item name" />
          <Input {...register(`items.${index}.quantity`)} placeholder="Qty" />
          <Controller
            name={`items.${index}.unit`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select

                value={value ?? ""}
                onValueChange={(val) => onChange(val === "" ? null : val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Button type="button" variant="ghost" onClick={() => remove(index)}>✕</Button>
        </div>
      ))}

      <Button type="button" onClick={() => append(getDefaultItem())}>
        + Add item
      </Button>
    </div>
  )
}

export default FieldArray