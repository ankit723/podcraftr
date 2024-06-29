'use server'
import { connectToDB } from "../mongoose"
import User from "../models/user.model"
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import Podcast from "../models/podcast.model";
import { redirect } from "next/navigation";

export async function createPodcast({podcastTitle, podcastDescription, podcastCategory, audioUrl, audioDuration, imageUrl, voiceType, voicePrompt, views, type, isStory}:any){
    try{
        connectToDB()
        const cUser = await currentUser()
        const user = await User.findOne({id:cUser?.id})

        if (!user) {
            throw new Error("User not found");
        }

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        const newPodcast = new Podcast({
            id: `pod_${user.id}_${result}`,
            type:type==='personal'?'personal':'public',
            podcastTitle,
            podcastDescription,
            podcastCategory,
            audioUrl,
            audioDuration,
            imageUrl,
            voiceType,
            voicePrompt,
            views,
            author:user._id,
            authorId:cUser?.id,
            isStory:isStory===true?true:false
        });

        const createdPodcast = await newPodcast.save();

        await User.findOneAndUpdate({id:cUser?.id}, {
            $push: { podcasts: createdPodcast._id },
        });

        redirect("/discover")
    }catch(error:any){
        console.error("Error creating podcast:", error);
        throw error;
    }
}

export async function createStory({podcastTitle, podcastDescription, podcastCategory, audioUrl, audioDuration, imageUrl, storyPrompt, views, type, isStory}:any){
    try{
        connectToDB()
        const cUser = await currentUser()
        const user = await User.findOne({id:cUser?.id})

        if (!user) {
            throw new Error("User not found");
        }

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        const newPodcast = new Podcast({
            id: `pod_${user.id}_${result}`,
            type:type==='personal'?'personal':'public',
            podcastTitle,
            podcastDescription,
            podcastCategory,
            audioUrl,
            audioDuration,
            imageUrl,
            storyPrompt,
            views,
            author:user._id,
            authorId:cUser?.id,
            isStory
        });

        const createdPodcast = await newPodcast.save();

        await User.findOneAndUpdate({id:cUser?.id}, {
            $push: { podcasts: createdPodcast._id },
        });

        redirect("/discover")
    }catch(error:any){
        console.error("Error creating podcast:", error);
        throw error;
    }
}

export async function fetchPodcasts() {
    try {
        connectToDB()
        const podcasts= await Podcast.find({type:'public'})
        .populate({
            path:"author",
            model:User
        })
        return podcasts
    }catch(error:any){
        console.error("Error fetching podcasts:", error);
        throw error;
    }
}

export async function fetchPersonalPodcasts() {
    try {
        connectToDB()
        const podcasts= await Podcast.find({type:'personal'})
        .populate({
            path:"author",
            model:User
        })
        return podcasts
    }catch(error:any){
        console.error("Error fetching podcasts:", error);
        throw error;
    }
}

export async function fetchPodcastById(id:string) {
    try {
        connectToDB()
        const podcast= await Podcast.findOne({id})
        .populate({
            path:"author",
            model:User
        })
        return podcast
    }catch(error:any){
        console.error("Error fetching podcasts:", error);
        throw error;
    }
}

export async function fetchPodcastByCategory(podcastCategory:string) {
    try {
        connectToDB()
        const podcasts= await Podcast.find({podcastCategory, type:"public"})
        .populate({
            path:"author",
            model:User
        })
        return podcasts
    }catch(error:any){
        console.error("Error fetching podcasts:", error);
        throw error;
    }
}

export async function editPodcastTypeById(id: string, type:string){
    try {
        connectToDB()
        await Podcast.findOneAndUpdate({id}, {type})
    }catch(error:any){
        console.error("Error changing the the type of the podcasts:", error);
        throw error;
    }    
}


export async function deletePodcastById(id:string) {
    try {
        connectToDB()
        const podcast= await Podcast.findOneAndDelete({id})
    }catch(error:any){
        console.error("Error deleting podcast:", error);
        throw error;
    }
}
