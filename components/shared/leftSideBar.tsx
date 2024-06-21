'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { sidebarLinks } from '@/constants'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SignedOut, SignedIn } from '@clerk/nextjs'
import { SignOutButton } from '@clerk/nextjs'
import { Button } from '../ui/button'
import { useUser } from '@clerk/nextjs'

const LeftSideBar = () => {
  const pathname=usePathname()
  const router = useRouter()
  const {user}=useUser()
  return (
    <section className='left_sidebar '>
      <nav className='flex flex-col gap-6'>
        <Link href="/" className='flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center'>
          <Image src="/icons/logo.svg" alt="Podcast Logo" width={23} height={27}/>
          <h1 className='text-24 font-extrabold text-white max-lg:hidden'>Podcraftr</h1>
        </Link>

        {sidebarLinks.map(({route, label, imgURL})=>{
          const isActive = pathname===route || route.startsWith(`${route}/`)
          if(route==='/profile')route=`${route}/${user?.id}`
          return(
            <Link href={route} key={label} className={cn('flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start', {'bg-nav-focus border-r-4 border-orange-1':isActive})}>
              <Image src={imgURL} alt={label} width={24} height={24}/>
              <p>{label}</p>
            </Link>
          )
        })}
      </nav>
      <SignedOut>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button asChild className="text-16 w-full bg-orange-1 font-extrabold">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
        <Button className="text-16 w-full bg-orange-1 font-extrabold"><SignOutButton /></Button>
        </div>
      </SignedIn>
    </section>
  )
}

export default LeftSideBar
