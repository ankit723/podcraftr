import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'


const GenerateStories = () => {
  return (
    <div>
        <div>
            <div className="flex flex-col gap-2.5">
                <Label className="text-16 font-bold text-white-1">
                AI Prompt to generate Podcast &nbsp;
                <span className='text-tiny-medium text-white-2'>Use correct spellings, shortforms, and punctuations to get the best result!</span>
                </Label>
                <Input
                    className="input-class font-light focus-visible:ring-offset-orange-1"
                    placeholder='Provide text to generate audio'
                />
            </div>
            <div className="mt-5 w-full max-w-[200px] flex">
                <Button type='button'className="text-16 bg-orange-1 py-4 font-bold text-white-1">Generate</Button>
            </div>
        </div>
    </div>
  )
}

export default GenerateStories
