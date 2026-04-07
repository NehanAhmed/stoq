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
  const result = await getPantryItemsByHouseId(houseId!)
  return (
    <div>
      <PantryList items={result.data || []} />
    </div>
  )
}

export default Page