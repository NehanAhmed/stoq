"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createHouseAction } from "@/lib/actions/house.actions"
import { createHouseSchema, type CreateHouseFormValues } from "@/lib/schemas/house.schema"

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateHouseModalProps {
  children: React.ReactNode
}

// ─── Component ────────────────────────────────────────────────────────────────

const CreateHouseModal = ({ children }: CreateHouseModalProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const form = useForm<CreateHouseFormValues>({
    resolver: zodResolver(createHouseSchema),
    defaultValues: {
      name: "",
      noOfMembers: undefined,
      location: "",
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (values: CreateHouseFormValues) => {
    const result = await createHouseAction(values)

    if (result.error) {
      toast.error(result.error.message)
      return
    }

    toast.success("House created successfully")
    setOpen(false)
    router.refresh()
  }

  const handleOpenChange = (next: boolean) => {
    if (isSubmitting) return
    if (!next) form.reset()
    setOpen(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => isSubmitting && e.preventDefault()}
        onEscapeKeyDown={(e) => isSubmitting && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Set up your house</DialogTitle>
          <DialogDescription>
            Just a few details to get Stoq ready for you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>House Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Ahmed Household"
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="noOfMembers"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Number of Members</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="number"
                  placeholder="4"
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                  value={field.value ?? ""}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="location"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  City{" "}
                  <span className="text-xs text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Karachi"
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? "Creating..." : "Create House"}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateHouseModal