import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Onboarding from './_components/onboarding'

const Page = async () => {
const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
})    

if(!session?.session) {
    redirect('/login')
}

if(!session?.user?.onboarding) {
    return (
      <Onboarding />
    )
}


  return (
    <div>Page</div>
  )
}

export default Page