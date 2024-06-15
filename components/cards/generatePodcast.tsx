import { GeneratePodcastProps } from '@/types'
import React, { useState, useEffect } from 'react'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Loader } from 'lucide-react'
import { SynthesizeSpeech } from '@/lib/actions/audioGeneration.action'

const useGeneratePodcast = ({ setAudio, voiceType, voicePrompt, language }: GeneratePodcastProps) => {
    const [isGenerating, setIsGenerating] = useState(false);
  
    const generatePodcast = async () => {
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
          save:false
        });
        setAudio(publicUrl);
      } catch (error) {
        console.error('Error generating podcast', error);
      } finally {
        setIsGenerating(false);
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
            save:true
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


  const handleGeneratePodcast = async () => {
    await generatePodcast();
  }

  const handleSavePodcast = async () => {
    await savePodcast();
  }



  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">AI Prompt to generate Podcast</Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder='Provide text to generate audio'
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px] flex">
        <Button
          type="submit"
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
          onClick={handleGeneratePodcast}
        >
          {isGenerating ? (
            <>Generating<Loader size={20} className="animate-spin ml-2" /></>
          ) : (
            'Generate'
          )}
        </Button>
        <Button type="button"className="text-16 bg-green-1 py-4 font-bold text-white-1 ml-3"onClick={handleSavePodcast}disabled={!props.audio}>Save</Button>
      </div>
      {props.audio && (
        <audio // Ensure key changes to force re-render of audio element
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  )
}

export default GeneratePodcast;
