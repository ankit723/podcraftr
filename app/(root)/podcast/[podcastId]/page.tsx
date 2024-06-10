import React from 'react'

const PodcastDetails = ({params}:{params:{podcastId:string}}) => {
  return (
    <div>
      <p className="text-white-1">Podcast details for {params.podcastId}</p>
    </div>
  )
}

export default PodcastDetails
