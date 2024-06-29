import EmptyState from '@/components/shared/emptyState'
import PodcastCard from '@/components/cards/podcastCard'
import Searchbar from '@/components/forms/searchBar'
import React from 'react'
import { fetchPodcasts } from '@/lib/actions/podcast.action'

const Discover = async({ searchParams: { search} }: { searchParams : { search: string }}) => {
  const podcastsData = await fetchPodcasts()
  const searchedPodcast = podcastsData.filter(({ podcastTitle, podcastDescription, podcastCategory, voiceType, author }) => {
    return (
        podcastTitle.toLowerCase().includes(search) ||
        podcastDescription.toLowerCase().includes(search) ||
        podcastCategory.toLowerCase().includes(search) ||
        voiceType?.toLowerCase().includes(search) ||
        (author.name).toLowerCase().includes(search) ||
        (author.username).toLowerCase().includes(search)
    );
});


  return (
    <div className="flex flex-col gap-9">
      <Searchbar />
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white-1">
          {!search ? 'Discover Trending Podcasts' : 'Search results for '}
          {search && <span className="text-white-2">{search}</span>}
        </h1>
        {podcastsData ? (
          <>
            {podcastsData.length > 0 ? (
              <div className="podcast_grid">
              {search===undefined?(
                <>
                  {podcastsData?.map(({ id, podcastTitle, podcastDescription, imageUrl }) => (
                  <PodcastCard 
                    key={id}
                    imgUrl={imageUrl!}
                    title={podcastTitle}
                    description={podcastDescription}
                    podcastId={id}
                  />
                  ))}
                </>
              ):(
                <>
                  {searchedPodcast?.map(({ id, podcastTitle, podcastDescription, imageUrl }) => (
                  <PodcastCard 
                    key={id}
                    imgUrl={imageUrl!}
                    title={podcastTitle}
                    description={podcastDescription}
                    podcastId={id}
                  />
                ))}
                </>
              )}
            </div>
            ) : <EmptyState title="No results found" />}
          </>
        ) : ""}
      </div>
    </div>
  )
}

export default Discover