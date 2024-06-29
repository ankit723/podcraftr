import React from 'react'

const StoryCard = ({storyPrompt}:any) => {
  return (
    <div>
      {
        storyPrompt.map((prompt:any, index:number)=>(
          <div key={index} className="my-2 border-b border-black-4 py-3 text-white-2">
            <span className='text-white-1 '>{prompt.characterName}: </span> &nbsp; {prompt.speech}
          </div>
        ))
      }
    </div>
  )
}

export default StoryCard
