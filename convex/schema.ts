import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  videos: defineTable({
    storageId: v.id("_storage"),
    name: v.string(),
    type: v.string(),
    isBackground: v.boolean(),
  }),
  voteLinks: defineTable({
    name: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
  }).index("by_order", ["order"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
