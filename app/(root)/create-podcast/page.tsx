"use client";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import GeneratePodcast from "@/components/cards/generatePodcast";
import GenerateStories from "@/components/cards/generateStories";
import GenerateThumbnail from "@/components/cards/generateThumbnail";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPodcast, createStory } from "@/lib/actions/podcast.action";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const podcastCategoryList = ["Romance", "Sci-Fi", "Mystry", "Horror", "Humour"];

const CreatePodcast = () => {
  const { user } = useUser();
  const router = useRouter();
  if (!user) router.push("/sign-in");
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [voiceType, setVoiceType] = useState<string>("");
  const [podcastCategory, setPodcastCategory] = useState<string>("");
  const [voicePrompt, setVoicePrompt] = useState("");
  const [storyVoicePrompt, setStoryVoicePrompt] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStory, setIsStory]=useState(false)
  const audioExampleRef = useRef<any>(null);
  const audioTestRef = useRef<any>(null);
  const voiceTypeRef = useRef<any>(null);

  const form = useForm<any>({
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
      podcastCategory: "",
      audioUrl: "",
      imageUrl: "",
      voicePrompt: "",
      voiceType: "",
      audioDuration: 0,
    },
  });

  const { reset, setValue } = form;

  const podcastTitle = useWatch({
    control: form.control,
    name: "podcastTitle",
  });

  const podcastDescription = useWatch({
    control: form.control,
    name: "podcastDescription",
  });

  useEffect(() => {
    reset({
      podcastTitle,
      podcastDescription,
      podcastCategory,
      audioUrl,
      imageUrl,
      voicePrompt,
      voiceType,
      audioDuration,
    });
  }, [
    audioUrl,
    imageUrl,
    voicePrompt,
    voiceType,
    podcastCategory,
    audioDuration,
    podcastTitle,
    podcastDescription,
    reset,
  ]);

  async function onSubmit(data: any) {
    try {
      setIsSubmitting(true);

      if(!isStory){
        const podcast = await createPodcast({
          podcastTitle: data.podcastTitle,
          podcastDescription: data.podcastDescription,
          podcastCategory: data.podcastCategory,
          audioUrl: data.audioUrl,
          audioDuration: data.audioDuration,
          imageUrl: data.imageUrl,
          voiceType: data.voiceType,
          voicePrompt: data.voicePrompt,
          views: 0,
        });
      }else{
        const story = await createStory({
          podcastTitle: data.podcastTitle,
          podcastDescription: data.podcastDescription,
          podcastCategory: data.podcastCategory,
          audioUrl: data.audioUrl,
          audioDuration: data.audioDuration,
          imageUrl: data.imageUrl,
          storyPrompt: storyVoicePrompt,
          views: 0,
          isStory
        });
      }

      // alert({ title: 'Podcast created' });
      setIsSubmitting(false);
      // router.push('/');
    } catch (error) {
      console.log(error);
      alert({
        title: "Error",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex w-full flex-col"
        >
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="Podcast..."
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2.5" ref={voiceTypeRef}>
              <Label className="text-16 font-bold text-white-1">
                Select AI Voice
              </Label>
              <Select
                onValueChange={(value) => {
                  setVoiceType(value);
                  if (audioTestRef.current != null) {
                    audioTestRef?.current.pause();
                  }
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
                    ref={audioExampleRef}
                    src={`/${voiceType}.wav`}
                    autoPlay
                    className="hidden"
                  />
                )}
              </Select>
            </div>

            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="Write a short podcast description"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">
                Select Podcast Category
              </Label>
              <Select onValueChange={(value) => setPodcastCategory(value)}>
                <SelectTrigger
                  className={cn(
                    "text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1"
                  )}
                >
                  <SelectValue
                    placeholder="Select Podcast Category"
                    className="placeholder:text-gray-1 "
                  />
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
                  {podcastCategoryList.map((category: any) => (
                    <div key={category}>
                      <SelectItem
                        key={category}
                        value={category}
                        className="capitalize focus:bg-orange-1"
                      >
                        {category}
                      </SelectItem>
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col pt-10">
            <Tabs defaultValue="account">
              <TabsList className="grid w-full grid-cols-2 tab">
                <TabsTrigger value="account" className="text-white-1 tab">Single-Lingual && Single-Vocal Podcast</TabsTrigger>
                <TabsTrigger value="password" className="text-white-1 tab">Multi-Lingual && Multi-Vocal Stories, Dramas etc...</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="mt-10">
                <GeneratePodcast
                  setAudio={setAudioUrl}
                  voiceType={voiceType.trim()}
                  audio={audioUrl}
                  voicePrompt={voicePrompt}
                  setVoicePrompt={setVoicePrompt}
                  setAudioDuration={setAudioDuration}
                  language={voiceType.includes("hi-IN") ? "hi-IN" : "en-US"}
                  audioExampleRef={audioExampleRef}
                  audioTestRef={audioTestRef}
                  voiceTypeRef={voiceTypeRef}
                  setIsStory={setIsStory}
                />
              </TabsContent>
              <TabsContent value="password" className="mt-10">
                <GenerateStories 
                  setAudio={setAudioUrl}
                  audio={audioUrl}
                  setVoicePrompt={setStoryVoicePrompt}
                  audioExampleRef={audioExampleRef}
                  audioTestRef={audioTestRef}
                  voiceTypeRef={voiceTypeRef}
                  setIsStory={setIsStory}
                />
              </TabsContent>
            </Tabs>

            <GenerateThumbnail setImage={setImageUrl} image={imageUrl} />

            <div className="mt-10 w-full">
              <Button
                type="submit"
                className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
              >
                {isSubmitting ? (
                  <>
                    Submitting
                    <Loader size={20} className="animate-spin ml-2" />
                  </>
                ) : (
                  "Submit & Publish Podcast"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreatePodcast;
