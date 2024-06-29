import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "../ui/select";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { SynthesizeStorySpeech } from "@/lib/actions/storyGeneration.action";
import { Loader } from 'lucide-react'
import { SynthesizeSpeech } from "@/lib/actions/audioGeneration.action";


const voiceCategories = ["en-US-Journey-D","en-US-Journey-F","en-US-Journey-O","en-US-News-L","en-US-News-N","en-US-Polyglot-1","en-US-Studio-O","en-US-Wavenet-D","hi-IN-Neural2-A","hi-IN-Neural2-D","hi-IN-Wavenet-A","hi-IN-Wavenet-D","hi-IN-Neural2-B","hi-IN-Neural2-C","hi-IN-Wavenet-B","hi-IN-Wavenet-C",];

const GenerateStories = ({ setAudio, audio, setVoicePrompt, audioTestRef, voiceTypeRef, setIsStory}: any) => {
  const [lines, setLines] = useState<any>([
    { characterName: "", voiceType: "", speech: "", speechAudio:null },
  ]);
  const [isGenerating, setIsGenerating]=useState(false)
  const [isLinesGenerating, setIsLinesGenerating]=useState(false)
  const lineAudioTestRef=useRef<any>(null)
  const audioExampleRef=useRef<any>(null)

  useEffect(()=>{
    voiceTypeRef.current.style.display="none"
    setIsStory(true)
  }, [])

  const handleLineChange = (index: number, field: string, value: string) => {
    const newLines = [...lines];
    newLines[index][field] = value;
    setLines(newLines);
  };

  const addLine=async()=>{
    setLines([...lines, { characterName: "", voiceType: "", speech: "", speechAudio:null }]);
  };

  const saveSpeech=async(index:number, speech:string, voiceType:string)=>{
    setIsLinesGenerating(true)
    try{ 
      const { publicUrl, outputFilename } = await SynthesizeSpeech({ text: speech, voiceType:voiceType, language:voiceType.includes("hi-IN") ? "hi-IN" : "en-US", save: false });
      lines[index]['speechAudio']=publicUrl;
    }catch(err:any){
      console.error("There is an error in saving the change")
      setIsLinesGenerating(false)
    }
    setIsLinesGenerating(false)
  }

  const handleGenerate=async ()=>{
    if(audioExampleRef!=null){
      audioExampleRef?.current.pause()
    }
    setIsGenerating(true)
    setAudio(null)
    try {
      const { publicUrl, outputFilename } = await SynthesizeStorySpeech({dialouges:lines});
      setAudio(publicUrl);
      setIsGenerating(false)
      setVoicePrompt(lines)
    } catch (error) {
      console.error('Error generating podcast', error);
      setIsGenerating(false)
    }
    setIsGenerating(false)
  }

  return (
    <div>
      <div>
        <div className="flex flex-col gap-2.5">
          <Label className="text-16 font-bold text-white-1">
            Add Character Name, Voice and Speech that your character will speak&nbsp;<span className="text-tiny-medium text-white-2">Use correct spellings, shortforms, and punctuations to get the best result!</span>
          </Label>
          {lines.map((line:any, index:any) => (
            <div className="flex flex-col gap-3 bg-dark-2 p-2 justify-center items-center rounded-lg my-1 w-full" key={index}>
              <div key={index}className="flex gap-3 items-center w-full">
                <Select onValueChange={(value) => {
                  handleLineChange(index, "voiceType", value)
                  if (audioTestRef.current != null) {
                    audioTestRef?.current.pause();
                  }
                  if (lineAudioTestRef.current != null) {
                    lineAudioTestRef?.current.pause();
                  }
                }}>
                  <SelectTrigger className={cn("text-16 border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1 w-[20rem]")}>
                    <SelectValue placeholder="Select AI Voice"className="placeholder:text-gray-1 "/>
                  </SelectTrigger>
                  <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
                    {voiceCategories.map((category) => (
                      <div key={category}>
                        {category.includes("Journey") ? (
                          <SelectItem
                            key={category}
                            value={category}
                            className="capitalize flex justify-between w-full items-center  focus:bg-orange-1"
                          >
                            {category}
                          </SelectItem>
                        ) : (
                          <SelectItem
                            key={category}
                            value={category}
                            className="capitalize focus:bg-orange-1"
                          >
                            {category}
                          </SelectItem>
                        )}
                      </div>
                    ))}
                  </SelectContent>
                  {line.voiceType && (
                    <audio
                      ref={audioExampleRef}
                      src={`/${line.voiceType}.wav`}
                      autoPlay
                      className="hidden"
                    />
                  )}
                </Select>

                <Input className="input-class font-light focus-visible:ring-offset-orange-1 w-full"placeholder="Add Character Name"value={line.characterName}onChange={(e) =>handleLineChange(index, "characterName", e.target.value)}/>
              </div>

              <Textarea className="input-class font-light focus-visible:ring-offset-orange-1"placeholder="Enter the text that character needs to speak"
              value={line.speech}onChange={(e) =>handleLineChange(index, "speech", e.target.value)} rows={7}/>

              <div className="w-full flex justify-between items-center gap-5">
                <Button type="button" className="text-10 bg-orange-1 py-4 font-bold text-white-1" onClick={()=>saveSpeech(index, line.speech, line.voiceType)}>
                  {isLinesGenerating ? (
                    <>Saving <Loader size={20} className="animate-spin ml-2" /></>
                  ) : (
                    'Save after changing'
                  )}
                </Button>

                {lines[index].speechAudio && (
                  <audio
                  ref={lineAudioTestRef}
                  controls
                  src={lines[index].speechAudio}
                  autoPlay
                  />
                )}
              </div>
            </div>
          ))}
          
          <div className="w-full flex justify-end items-center">
            <Button type="button" className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={addLine}>+ &nbsp; Add </Button>
          </div>

        </div>
        <div className="mt-5 w-full max-w-[200px] flex">
          <Button
            type="button"
            className="text-16 bg-orange-1 py-4 font-bold text-white-1"
            onClick={() => handleGenerate()}
          >
            {isGenerating ? (
              <>Generating<Loader size={20} className="animate-spin ml-2" /></>
            ) : (
              'Generate'
            )}
          </Button>
        </div>
      </div>
      {audio && (
        <audio
          ref={audioTestRef}
          controls
          src={audio}
          autoPlay
          className="mt-5"
        />
      )}
    </div>
  );
};

export default GenerateStories;
