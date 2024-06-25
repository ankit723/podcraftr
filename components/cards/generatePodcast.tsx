import { GeneratePodcastProps } from '@/types'
import React, { useState, useEffect } from 'react'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Loader } from 'lucide-react'
import { SynthesizeSpeech } from '@/lib/actions/audioGeneration.action'

const useGeneratePodcast = ({ setAudio, voiceType, voicePrompt, language, audioExampleRef}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePodcast = async () => {
    setAudio(null)
    audioExampleRef?.current.pause()
    if (voiceType !== '') {
      setIsGenerating(true);

      if (!voicePrompt) {
        alert("Please provide a voice prompt to generate a podcast");
        setIsGenerating(false);
        return;
      }

      try {
        const { publicUrl, outputFilename } = await SynthesizeSpeech({ text: voicePrompt, voiceType, language, save: false });
        setAudio(publicUrl);
      } catch (error) {
        console.error('Error generating podcast', error);
      } finally {
        setIsGenerating(false);
      }
    } else {
      alert('Select the voice')
    }
  };

  const savePodcast = async () => {
    setIsGenerating(true);

    if (!voicePrompt) {
      alert("Please provide a voice prompt to generate a podcast");
      setIsGenerating(false);
      return;
    }

    try {
      const { publicUrl, outputFilename } = await SynthesizeSpeech({
        text: voicePrompt,
        voiceType,
        language,
        save: true
      });
      setAudio(publicUrl);
    } catch (error) {
      console.error('Error generating podcast', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, generatePodcast, savePodcast };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast, savePodcast } = useGeneratePodcast(props);
  const [characterCount, setCharacterCount] = useState(props.voicePrompt ? props.voicePrompt.length : 0);
  const isJourneyVoice = false;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (!isJourneyVoice || newText.length <= 1400) {
      props.setVoicePrompt(newText);
      setCharacterCount(newText.length);
    }
  }

  const handleGeneratePodcast = async () => {
    await generatePodcast();
  }

  const handleSavePodcast = async () => {
    await savePodcast();
  }

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate Podcast &nbsp;
          <span className='text-tiny-medium text-white-2'>Use correct spellings, shortforms, and punctuations to get the best result!</span>
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder='Provide text to generate audio'
          rows={(Math.floor((characterCount)*(1/133))*2)<10?10:Math.floor((characterCount)*(1/133))*2}
          value={props.voicePrompt}
          onChange={handleTextChange}
        />
        <div className="text-right text-small-regular text-white-3">
          {characterCount} 
        </div>
      </div>
      <div className="mt-5 w-full max-w-[200px] flex">
        <Button
          type='button'
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
          onClick={handleGeneratePodcast}
        >
          {isGenerating ? (
            <>Generating<Loader size={20} className="animate-spin ml-2" /></>
          ) : (
            'Generate'
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          controls
          src={props.audio}
          ref={props.audioTestRef}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) => {
            props.setAudioDuration(e.currentTarget.duration)
          }}
        />
      )}
    </div>
  )
}

export default GeneratePodcast;
