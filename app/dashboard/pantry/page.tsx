'use client'
import { scanReceiptAction } from '@/lib/actions/reciept.actions'
import React from 'react'
import { useForm } from 'react-hook-form'

const Page = () => {
const form = useForm()

async function onSubmit() {
  const file = form.getValues("receipt") // gets the File object

  const formData = new FormData()
  formData.append("file", file[0])      // file input returns a FileList

  const result = await scanReceiptAction(formData)
  console.log(result);
}
  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
  <input type="file" {...form.register("receipt")} />
  <button type="submit">Scan</button>
</form>
    </div>
  )
}

export default Page