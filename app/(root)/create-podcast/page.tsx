"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import GeneratePodcast from "@/components/cards/generatePodcast"
// import GenerateThumbnail from "@/components/GenerateThumbnail"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"

const voiceCategories = ['en-US-Journey-D', 'en-US-Journey-F', 'en-US-Journey-O', 'en-US-News-L', 'en-US-News-N', 'en-US-Polyglot-1', 'en-US-Studio-O', 'en-US-Studio-Q', 'en-US-Wavenet-D', 'hi-IN-Neural2-A', 'hi-IN-Neural2-D', 'hi-IN-Wavenet-A', 'hi-IN-Wavenet-D', 'hi-IN-Neural2-B', 'hi-IN-Neural2-C', 'hi-IN-Wavenet-B', 'hi-IN-Wavenet-C'];

const CreatePodcast = () => {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [voiceType, setVoiceType] = useState<string>('');
  const [voicePrompt, setVoicePrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<any>({
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
      audioUrl: '',
      imageUrl: '',
      voicePrompt: '',
      voiceType: '',
      audioDuration: 0,
    },
  });

  const { reset, setValue } = form;

  const podcastTitle = useWatch({
    control: form.control,
    name: 'podcastTitle',
  });

  const podcastDescription = useWatch({
    control: form.control,
    name: 'podcastDescription',
  });

  useEffect(() => {
    reset({
      podcastTitle,
      podcastDescription,
      audioUrl,
      imageUrl,
      voicePrompt,
      voiceType,
      audioDuration,
    });
  }, [audioUrl, imageUrl, voicePrompt, voiceType, audioDuration, podcastTitle, podcastDescription, reset]);

  async function onSubmit(data: any) {
    try {
      setIsSubmitting(true);
      
      console.log(data, voiceType);

      // const podcast = await createPodcast({
      //   podcastTitle: data.podcastTitle,
      //   podcastDescription: data.podcastDescription,
      //   audioUrl,
      //   imageUrl,
      //   voiceType,
      //   imagePrompt,
      //   voicePrompt,
      //   views: 0,
      //   audioDuration,
      //   audioStorageId: audioStorageId!,
      //   imageStorageId: imageStorageId!,
      // })

      // alert({ title: 'Podcast created' });
      setIsSubmitting(false);
      // router.push('/');
    } catch (error) {
      console.log(error);
      alert({
        title: 'Error',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col">
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField control={form.control} name="podcastTitle" render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">Title</FormLabel>
                  <FormControl>
                    <Input className="input-class focus-visible:ring-offset-orange-1" placeholder="Podcast..." {...field} required/>
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">Select AI Voice</Label>
              <Select onValueChange={(value) => setVoiceType(value)}>
                <SelectTrigger className={cn('text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1')}>
                  <SelectValue placeholder="Select AI Voice" className="placeholder:text-gray-1 " />
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
                  {voiceCategories.map((category) => (
                    <div key={category}>
                    {category.includes('Journey')?
                      <SelectItem key={category} value={category} className="capitalize flex justify-between w-full items-center  focus:bg-orange-1">
                        {category} &nbsp; <span className=" text-tiny-medium text-white-2">Only 1450 chars with Standard Plan</span>
                      </SelectItem>:<SelectItem key={category} value={category} className="capitalize focus:bg-orange-1">{category}</SelectItem>}
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
            </div>

            <FormField control={form.control} name="podcastDescription" render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">Description</FormLabel>
                  <FormControl>
                    <Textarea className="input-class focus-visible:ring-offset-orange-1" placeholder="Write a short podcast description" {...field} required/>
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col pt-10">
              <GeneratePodcast 
                setAudio={setAudioUrl}
                voiceType={voiceType.trim()}
                audio={audioUrl}
                voicePrompt={voicePrompt}
                setVoicePrompt={setVoicePrompt}
                setAudioDuration={setAudioDuration}
                language={voiceType.includes('hi-IN')?"hi-IN":"en-US"}
              />

              {/* <GenerateThumbnail 
               setImage={setImageUrl}
               setImageStorageId={setImageStorageId}
               image={imageUrl}
               imagePrompt={imagePrompt}
               setImagePrompt={setImagePrompt}
              /> */}

              <div className="mt-10 w-full">
                <Button type="submit" className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1">
                  {isSubmitting ? (
                    <>
                      Submitting
                      <Loader size={20} className="animate-spin ml-2" />
                    </>
                  ) : (
                    'Submit & Publish Podcast'
                  )}
                </Button>
              </div>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default CreatePodcast;
