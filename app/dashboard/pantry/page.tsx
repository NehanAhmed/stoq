import { checkIfFirstTime } from '@/lib/actions/pantry.actions'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import EmptyPantryState from '../_components/empty-pantry-state'

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.session) {
    redirect('/login')
  }

  const isFirstTime = await checkIfFirstTime()

  if(isFirstTime){
    return (
      <div>
        <EmptyPantryState />
      </div>
    )
  }
  return (
    <div>
      <h1>Pantry</h1>
    </div>
  )
}

export default Page