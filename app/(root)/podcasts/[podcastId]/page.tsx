import PodcastDetailPlayer from '@/components/cards/podcastDetailPlayer'
import { fetchPodcastByCategory, fetchPodcastById } from '@/lib/actions/podcast.action'
import PodcastCard from '@/components/cards/podcastCard'
import EmptyState from '@/components/shared/emptyState'
import Image from 'next/image'
import React from 'react'
import { currentUser } from '@clerk/nextjs/server'

const PodcastDetails = async({params}:{params:{podcastId:string}}) => {
  const cUser= await currentUser()
  const podcast=await fetchPodcastById(params.podcastId)
  const similarPodcasts=await fetchPodcastByCategory(podcast.podcastCategory)
  const isOwner=cUser?.id===podcast.authorId
  return (
    <section className='flex w-full flex-col'>
      <header className='mt-9 flex items-center justify-between'>
        <h1 className='text-20 font-bold text-white-1'>
          Currently Playing
        </h1>
        <figure className='flex gap-3'>
          <Image src='/icons/headphone.svg' width={24} height={24} alt='headphone'/>
          <h2 className='text-16 font-bold text-white-1'>{podcast?.views}</h2>
        </figure>
      </header>

      <PodcastDetailPlayer
        audioUrl={podcast.audioUrl}
        podcastTitle={podcast.podcastTitle}
        author={podcast.author.name}
        isOwner={isOwner}
        imageUrl={podcast.imageUrl}
        podcastId={podcast.id}
        authorImageUrl={podcast.author.imageUrl}
        authorId={podcast.authorId}
        type={podcast.type}
      />
      <p className='text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center'>{podcast?.podcastDescription}</p>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Transcription</h1>
          <p className="text-16 font-medium text-white-2">{!(podcast?.isStory)?podcast?.voicePrompt:"It is a Story Card"}</p>
        </div>
      </div>

      <section className='mt-8 flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Similar Podcasts</h1>
        {similarPodcasts && similarPodcasts.length>0?(
          <div className="podcast_grid">
          {similarPodcasts?.map(({id, imageUrl, podcastTitle, podcastDescription})=>(
            <PodcastCard 
              key={id}
              imgUrl={imageUrl}
              title={podcastTitle}
              description={podcastDescription}
              podcastId={id}
            />
          ))}
        </div>
        ):(
          <EmptyState title={"No similar podcasts found"}/>
        )}
      </section>
    </section>
  )
}

export default PodcastDetails
