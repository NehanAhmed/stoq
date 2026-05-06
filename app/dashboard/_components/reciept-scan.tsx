'use client'

import React, { useState, useCallback } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'motion/react'
import { IconUpload, IconCheck, IconX, IconExclamationCircle, IconLoader2 } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { scanReceiptAction, savePantryItemsToDatabase } from '@/lib/actions/receipt.actions'
import FieldArray from './field-array'
import { ExtractionResult } from '@/lib/services/receipt.services'
import { ExtractedItem, ExtractionResponse, ExtractionResponseSchema } from '@/lib/schemas/receipt.schemas'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface FormValues {
  receipt: FileList | null
}

const fadeUpVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
}

const ReceiptScan = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[] | null>(null)
  const router = useRouter()

  const {
    control: receiptControl,
    handleSubmit: handleReceiptSubmit,
    watch,
    reset: resetReceipt,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { receipt: null },
  })

  const receipt = watch('receipt')
  const hasFile = receipt && receipt.length > 0
  const currentFile = hasFile ? receipt[0] : null

  const {
    control: itemsControl,
    handleSubmit: handleItemsSubmit,
    reset: resetItems,
    formState: { isSubmitting: isItemsSubmitting },
  } = useForm<ExtractionResponse>({
    resolver: zodResolver(ExtractionResponseSchema),
    defaultValues: { items: [] },
  })

  const { fields, append, remove } = useFieldArray({
    control: itemsControl,
    name: 'items',
  })

  const onReceiptSubmit = async (data: FormValues) => {
    if (!data.receipt || data.receipt.length === 0) return

    const formData = new FormData()
    formData.append('file', data.receipt[0])

    const result:ExtractionResult = await scanReceiptAction(formData)

    if (result.success) {
      setExtractedItems(result.items)
      resetItems({ items: result.items })
      resetReceipt()
    } else {
      toast.error(result.error || 'Failed to scan receipt')
    }
  }

  const onItemsSubmit = async (data: ExtractionResponse) => {
    const result = await savePantryItemsToDatabase({ items: data.items })
    if (result.success) {
      setExtractedItems(null)
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to save items')
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  return (
    <motion.div
      initial={fadeUpVariants.initial}
      animate={fadeUpVariants.animate}
      transition={fadeUpVariants.transition}
      className="space-y-6"
    >
      {!extractedItems ? (
        <form onSubmit={handleReceiptSubmit(onReceiptSubmit)} className="space-y-6">
          <motion.div
            initial={fadeUpVariants.initial}
            animate={fadeUpVariants.animate}
            transition={{ ...fadeUpVariants.transition, delay: 0.1 }}
          >
            <Controller
              name="receipt"
              control={receiptControl}
              render={({ field: { onChange, ref, name } }) => (
                <motion.div
                  className={cn(
                    'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200',
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50',
                    currentFile && 'border-primary bg-primary/5'
                  )}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                    const files = e.dataTransfer.files
                    if (files.length > 0) {
                      onChange(files)
                    }
                  }}
                >
                  <Input
                    id="receipt-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    ref={ref}
                    name={name}
                  />

                  <div className="flex flex-col items-center space-y-4">
                    {currentFile ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <motion.div
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
                          whileHover={{ scale: 1.1 }}
                        >
                          <IconCheck className="h-6 w-6 text-primary" />
                        </motion.div>
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{currentFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onChange(null)}
                          >
                            <IconX className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        <motion.div
                          className="flex h-12 w-full items-center justify-center rounded-full bg-muted"
                          whileHover={{ scale: 1.1, backgroundColor: "var(--muted-foreground/10)" }}
                        >
                          <IconUpload className="h-6 w-6 text-muted-foreground mx-auto" />
                        </motion.div>
                        <div className="space-y-2">
                          <p className="font-medium text-sm">
                            {isDragging
                              ? 'Drop your receipt here'
                              : 'Click to upload or drag and drop'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Images up to 10MB
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            />
          </motion.div>

          <motion.div
            initial={fadeUpVariants.initial}
            animate={fadeUpVariants.animate}
            transition={{ ...fadeUpVariants.transition, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: hasFile && !isSubmitting ? 1.02 : 1 }}
              whileTap={{ scale: hasFile && !isSubmitting ? 0.98 : 1 }}
            >
              <Button
                type="submit"
                disabled={!hasFile || isSubmitting}
                className="w-full"
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
                      Scanning...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Scan Receipt
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </motion.div>
        </form>
      ) : (
        <motion.form
          onSubmit={handleItemsSubmit(onItemsSubmit)}
          className="space-y-6"
          initial={fadeUpVariants.initial}
          animate={fadeUpVariants.animate}
          transition={{ ...fadeUpVariants.transition, delay: 0.1 }}
        >
          <motion.div
            initial={fadeUpVariants.initial}
            animate={fadeUpVariants.animate}
            transition={{ ...fadeUpVariants.transition, delay: 0.2 }}
          >
            <FieldArray 
              control={itemsControl}
              register={itemsControl.register}
              fields={fields}
              append={append}
              remove={remove}
            />
          </motion.div>
          <motion.div
            initial={fadeUpVariants.initial}
            animate={fadeUpVariants.animate}
            transition={{ ...fadeUpVariants.transition, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: !isItemsSubmitting ? 1.02 : 1 }}
              whileTap={{ scale: !isItemsSubmitting ? 0.98 : 1 }}
            >
              <Button 
                type="submit" 
                disabled={isItemsSubmitting}
                className="w-full"
              >
                <AnimatePresence mode="wait">
                  {isItemsSubmitting ? (
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
                      Confirm & Add Items
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>
      )}
    </motion.div>
  )
}

export default ReceiptScan 