'use client';
import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Header from './header';
import Carousel from './carousel';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

const RightSideBarDetails = ({ podcasts }:any) => {
    const {user}=useUser()
    const router =useRouter()
  return (
    <section className='right_sidebar'>
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className='flex gap-3 pb-12'>
          <UserButton />
          <div className="flex w-full items-center justify-between">
            <h1 className='text-16 truncate font-semibold text-white-1'>{user?.firstName} {user?.lastName}</h1>
            <Image src="/icons/right-arrow.svg" alt="arrow" width={24} height={24}/>
          </div>
        </Link>
      </SignedIn>

      <section>
        <Header headerTitle="Fans Like You" />
        <Carousel fansLikeDetail={podcasts} />
      </section>

      <section className='flex flex-col gap-8 pt-12'>
        <Header headerTitle="Top Podcraftrs" />

        <div className="flex flex-col gap-6">
            {podcasts.slice(0, 5).map((pod:any)=>(
                <div key={pod._doc.id} className="flex cursor-pointer justify-between" onClick={()=>router.push(`/profile/${pod._doc.author.id}`)}>
                    <figure className='flex items-center gap-2'>
                        <Image src={pod._doc.author.imageUrl} alt='podcaster-name' width={44} height={44} className='aspect-square rounded-lg'/>
                        <h2 className='text-14 font-semibold text-white-1'>{pod._doc.author.name} <br /> <span className=' text-white-3 text-tiny-medium'>{pod._doc.author.username}</span></h2>
                    </figure>
                    <div className="flex items-center">
                        <Button className="text-12 bg-orange-1 font-normal text-white-1">
                            <Link href={`/profile/${pod._doc.author.id}`}>View</Link>
                        </Button>
                    </div>
                </div>
            ))}
        </div>

      </section>
    </section>
  );
};

export default RightSideBarDetails;
