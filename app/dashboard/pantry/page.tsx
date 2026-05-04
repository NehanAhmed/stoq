import { checkIfFirstTime, getPantryItemsByHouseId } from '@/lib/actions/pantry.actions'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import EmptyPantryState from '../_components/empty-pantry-state'
import { PantryList } from '../_components/pantry-list'
import { getHouseIdByUserId } from '@/lib/actions/receipt.actions'

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.session) {
    redirect('/login')
  }

  const isFirstTime = await checkIfFirstTime()

  if (isFirstTime) {
    return (
      <div>
        <EmptyPantryState />
      </div>
    )
  }
  const userId = session.user.id
  if (!userId) {
    redirect('/login')
  }
  const houseId = await getHouseIdByUserId(userId)
  if (!houseId) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold">No House Found</h1>
        <p className="text-muted-foreground">Please complete onboarding to set up your house.</p>
      </div>
    )
  }

  const result = await getPantryItemsByHouseId(houseId)

  if (!result.success || !result.data) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold">Error</h1>
        <p className="text-muted-foreground">{result.error || "Failed to load pantry items"}</p>
      </div>
    )
  }

  return (
    <div>
      <PantryList items={result.data} />
    </div>
  )
}

export default Page