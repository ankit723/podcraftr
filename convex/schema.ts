import {defineSchema, defineTable} from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    podcasts:defineTable({
        user: v.id('users'),
        podcastTitle: v.string(),
        podcastDescription: v.string(),
        audioUrl: v.optional(v.string()),
        audioStorageId: v.optional(v.id('_storage')),
        imageUrl:v.string(),
        imageStorageId: v.optional(v.id('_storage')),
        author: v.string(),
        authorId: v.string(),
        authorImageUrl: v.string(),
        voicePromt: v.string(),
        imagePromt:v.string(),
        voiceType: v.string(),
        audioDuration: v.number(),
        views: v.number()
    })
    .searchIndex('search_author', {searchField: 'author'})
    .searchIndex('title', {searchField: 'podcastTitle'})
    .searchIndex('body', {searchField: 'podcastDescription'}),

    users:defineTable({
        email:v.string(),
        imageUrl:v.string(),
        clerkId: v.string(),
        name: v.string(),

    })
})