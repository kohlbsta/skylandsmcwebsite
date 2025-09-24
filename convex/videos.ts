import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveVideo = mutation({
  args: { 
    storageId: v.id("_storage"),
    name: v.string(),
    type: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("videos", {
      storageId: args.storageId,
      name: args.name,
      type: args.type,
      isBackground: true, // Mark as background video
    });
    return args.storageId;
  },
});

export const getBackgroundVideo = query({
  args: {},
  handler: async (ctx) => {
    const video = await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("isBackground"), true))
      .order("desc")
      .first();
    
    if (!video) return null;
    
    const url = await ctx.storage.getUrl(video.storageId);
    return {
      ...video,
      url,
    };
  },
});
