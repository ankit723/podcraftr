'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useDebounce } from '@/lib/useDebounce'

const ExploreSearchBar = () => {
  const [search, setSearch] = useState('');
  const router = useRouter(); 
  const pathname = usePathname();

  const debouncedValue = useDebounce(search, 500);

  useEffect(() => {
    if(debouncedValue) {
      router.push(`/explore?search=${debouncedValue}`)
    } else if (!debouncedValue && pathname === '/explore') router.push('/explore')
  }, [router, pathname, debouncedValue])

  return (
    <div className="relative mt-8 block">
      <Input 
        className="input-class py-6 pl-12 focus-visible:ring-offset-orange-1"
        placeholder='Search for anything you want to listen...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onLoad={() => setSearch('')}
      />
      <Image 
        src="/icons/reddit.webp"
        alt="search"
        height={45}
        width={45}
        className="absolute left-1 top-0.5"
      />
    </div>
  )
}

export default ExploreSearchBar