'use client'

import { motion, AnimatePresence } from 'motion/react'
import { IconPlus, IconX } from '@tabler/icons-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ManualGroceryItem, ManualGroceryForm } from "@/lib/schemas/grocery.schemas"
import { Control, Controller, UseFieldArrayReturn, UseFormRegister } from "react-hook-form"
import { fadeUpVariants, staggerContainer } from "@/lib/animations"

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
    <motion.div
      initial={fadeUpVariants.initial}
      animate={fadeUpVariants.animate}
      transition={fadeUpVariants.transition}
      className="space-y-4"
    >
      {/* Header */}
      <motion.div
        initial={fadeUpVariants.initial}
        animate={fadeUpVariants.animate}
        transition={{ ...fadeUpVariants.transition, delay: 0.1 }}
        className="grid grid-cols-[1fr_120px_100px_40px] gap-3 pb-2 border-b border-border/50"
      >
        <Label className="text-sm font-medium text-foreground">Item Name</Label>
        <Label className="text-sm font-medium text-foreground">Quantity</Label>
        <Label className="text-sm font-medium text-foreground">Unit</Label>
        <div />
      </motion.div>

      {/* Items */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              variants={fadeUpVariants}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-[1fr_120px_100px_40px] gap-3"
            >
              <div>
                <Input 
                  {...register(`items.${index}.name`)} 
                  placeholder="Item name" 
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>
              <div>
                <Input 
                  {...register(`items.${index}.quantity`)} 
                  placeholder="Qty" 
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>
              <Controller
                name={`items.${index}.unit`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <Select
                      value={value ?? ""}
                      onValueChange={(val) => onChange(val === "" ? null : val)}
                    >
                      <SelectTrigger className="w-full transition-all duration-200">
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
                  </div>
                )}
              />
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
              >
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => remove(index)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <IconX className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Add Item Button */}
      <motion.div
        initial={fadeUpVariants.initial}
        animate={fadeUpVariants.animate}
        transition={{ ...fadeUpVariants.transition, delay: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
        >
          <Button 
            type="button" 
            variant="outline"
            onClick={() => append(getDefaultItem())}
            className="w-full gap-2 transition-all duration-200"
          >
            <IconPlus className="h-4 w-4" />
            Add item
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default FieldArray