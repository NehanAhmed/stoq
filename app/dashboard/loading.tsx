import { DashboardSkeleton } from './_components/dashboard'

export default function Loading() {
  return (
    <div className="container mx-auto max-w-5xl p-6">
      <DashboardSkeleton />
    </div>
  )
}