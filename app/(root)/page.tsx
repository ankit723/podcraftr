import React from 'react'
import { Button } from '@/components/ui/button'
import { podcastData } from '@/constants'
import PodcastCard from '@/components/cards/podcastCard'
import { fetchPodcasts } from '@/lib/actions/podcast.action'

const page = async() => {
  const trendingPodcasts=await fetchPodcasts()
  return (
    <div className='mt-9 flex flex-col gap-9'>
      <section className='flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Trending Podcasts</h1>

        <div className="podcast_grid">
          {trendingPodcasts?.map(({id, imageUrl, podcastTitle, podcastDescription})=>(
            <PodcastCard 
              key={id}
              imgUrl={imageUrl}
              title={podcastTitle}
              description={podcastDescription}
              podcastId={id}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default page
