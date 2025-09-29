import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("voteLinks")
      .withIndex("by_order")
      .collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the highest order number and add 1
    const existingLinks = await ctx.db
      .query("voteLinks")
      .withIndex("by_order")
      .collect();
    
    const maxOrder = existingLinks.length > 0 
      ? Math.max(...existingLinks.map(link => link.order))
      : 0;

    return await ctx.db.insert("voteLinks", {
      name: args.name,
      url: args.url,
      description: args.description,
      order: maxOrder + 1,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("voteLinks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("voteLinks"),
    name: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
      url: args.url,
      description: args.description,
    });
  },
});
