import { PantryListSkeleton } from '../_components/pantry-list'

export default function Loading() {
  return (
    <div className="container mx-auto max-w-5xl p-6">
      <PantryListSkeleton />
    </div>
  )
}