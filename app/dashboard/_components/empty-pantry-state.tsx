'use client'

import React, { useState, useCallback } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconUpload, IconCheck, IconX, IconExclamationCircle } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { scanReceiptAction, savePantryItemsToDatabase } from '@/lib/actions/receipt.actions'
import FieldArray from './field-array'
import { ExtractionResult } from '@/lib/services/receipt.services'
import { ExtractedItem, ExtractionResponse, ExtractionResponseSchema } from '@/lib/schemas/receipt.schemas'

interface FormValues {
  receipt: FileList | null
}

const EmptyPantryState = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[] | null>(null)

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
      alert(result.error || 'Failed to scan receipt')
    }
  }

  const onItemsSubmit = async (data: ExtractionResponse) => {
    console.log('Submitting items:', data.items)
    const result = await savePantryItemsToDatabase({ items: data.items })
    console.log('Save result:', result)
    if (result.success) {
      setExtractedItems(null)
    } else {
      alert(result.error || 'Failed to save items')
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
    <div className="container mx-auto py-8">
      {!extractedItems ? (
        <form onSubmit={handleReceiptSubmit(onReceiptSubmit)} className="max-w-md mx-auto">
          <div className='flex items-start justify-start gap-2'>
            <div className='flex items-center justify-center '>
              <IconExclamationCircle className='w-8 h-8 text-primary' />
            </div>
            <div>
              <h1 className="text-2xl font-semibold ">Nothing in the Pantry yet!</h1>
              <p className="text-muted-foreground mb-4">Upload a receipt to get started</p>
            </div>
          </div>
          <Controller
            name="receipt"
            control={receiptControl}
            render={({ field: { onChange, ref, name } }) => (
              <div
                className={cn(
                  'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200',
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50',
                  currentFile && 'border-primary bg-primary/5'
                )}
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

                <div className="flex flex-col items-center space-y-3">
                  {currentFile ? (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <IconCheck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{currentFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onChange(null)}
                      >
                        <IconX className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <IconUpload className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {isDragging
                            ? 'Drop your receipt here'
                            : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Images up to 10MB
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          />

          <Button
            type="submit"
            disabled={!hasFile || isSubmitting}
            className="w-full mt-4"
          >
            {isSubmitting ? 'Scanning...' : 'Scan Receipt'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleItemsSubmit(onItemsSubmit)} className="max-w-md mx-auto">
          <FieldArray 
            control={itemsControl}
            fields={fields}
            append={append}
            remove={remove}
          />
          <Button 
            type="submit" 
            disabled={isItemsSubmitting}
            className="w-full mt-4"
          >
            {isItemsSubmitting ? 'Saving...' : 'Confirm & Add Items'}
          </Button>
        </form>
      )}
    </div>
  )
}

export default EmptyPantryState 