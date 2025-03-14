import React from 'react'

interface StoryPrompt {
  characterName: string;
  speech: string;
}

interface StoryCardProps {
  storyPrompt: StoryPrompt[];
}

const StoryCard = ({ storyPrompt }: StoryCardProps) => {
  return (
    <div>
      {
        storyPrompt.map((prompt, index) => (
          <div key={index} className="my-2 border-b border-black-4 py-3 text-white-2">
            <span className='text-white-1 '>{prompt.characterName}: </span> &nbsp; {prompt.speech}
          </div>
        ))
      }
    </div>
  )
}

export default StoryCard
