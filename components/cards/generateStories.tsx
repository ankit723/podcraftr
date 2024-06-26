import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import Image from "next/image";

const voiceCategories = [
  "en-US-Journey-D",
  "en-US-Journey-F",
  "en-US-Journey-O",
  "en-US-News-L",
  "en-US-News-N",
  "en-US-Polyglot-1",
  "en-US-Studio-O",
  "en-US-Studio-Q",
  "en-US-Wavenet-D",
  "hi-IN-Neural2-A",
  "hi-IN-Neural2-D",
  "hi-IN-Wavenet-A",
  "hi-IN-Wavenet-D",
  "hi-IN-Neural2-B",
  "hi-IN-Neural2-C",
  "hi-IN-Wavenet-B",
  "hi-IN-Wavenet-C",
];

const inputSizeClasses = [
  "w-1/4", // Small
  "w-1/2", // Medium
  "w-3/4", // Large
];

const GenerateStories = ({
  setAudio,
  audio,
  voicePrompt,
  setVoicePrompt,
}: any) => {
  const [voiceType, setVoiceType] = useState<string>("");
  const [countLines, setCountLines] = useState<number>(1);

  return (
    <div>
      <div>
        <div className="flex flex-col gap-2.5">
          <Label className="text-16 font-bold text-white-1">
            Add Character Name, Voice and Speech that your character will speak
            &nbsp;
            <span className="text-tiny-medium text-white-2">
              Use correct spellings, shortforms, and punctuations to get the
              best result!
            </span>
          </Label>
          {Array.from({ length: countLines }).map((_, index) => (
            <div key={index}className="flex gap-3 bg-black-2 p-2 items-center rounded-lg my-1">
              <Select
                onValueChange={(value) => {
                  setVoiceType(value);
                }}
              >
                <SelectTrigger
                  className={cn(
                    "text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1"
                  )}
                >
                  <SelectValue
                    placeholder="Select AI Voice"
                    className="placeholder:text-gray-1 "
                  />
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
                {voiceType && (
                  <audio
                    src={`/${voiceType}.wav`}
                    autoPlay
                    className="hidden"
                  />
                )}
              </Select>

              <Input className={`input-class font-light focus-visible:ring-offset-orange-1 w-1/2`}placeholder="Add Character Name"/>

              <Textarea className="input-class font-light focus-visible:ring-offset-orange-1"placeholder="Enter the text that character needs to speak"rows={3}/>
            </div>
          ))}

          <Button type="button"className="text-16 bg-orange-1 py-4 font-bold text-white-1"onClick={() => setCountLines(countLines + 1)}>+ Add Lines</Button>
        </div>
        <div className="mt-5 w-full max-w-[200px] flex">
          <Button type="button"className="text-16 bg-orange-1 py-4 font-bold text-white-1">Generate</Button>
        </div>
      </div>
    </div>
  );
};

export default GenerateStories;
