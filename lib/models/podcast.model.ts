import mongoose from "mongoose";

const PodcastSchema = new mongoose.Schema({
    id: { type: String, required: true },
    podcastTitle: { type: String, required: true },
    podcastDescription: { type: String, required: true },
    podcastCategory: { type: String, required: true },
    audioUrl: { type: String, required: true },
    audioDuration: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    voiceType: { type: String },
    voicePrompt: { type: String },
    storyPrompt: { type: [] },
    views: { type: Number, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    authorId:{type:String, required:true},
    type:{type:String, required:true, default:"public"},
    isStory:{type:Boolean,required:true, default:false}
});

const Podcast = mongoose.models.Podcast || mongoose.model('Podcast', PodcastSchema);

export default Podcast;


// export default defineSchema({
//     podcasts: defineTable({
//          podcastTitle: v.string(),
//         podcastDescription: v.string(),
//       audioDuration: v.float64(),
//       audioUrl: v.optional(v.string()),
//       author: v.string(),
//       imageUrl: v.string(),
//       views: v.float64(),
//       voicePromt: v.string(),
//       voiceType: v.string(),
//     })
//   });