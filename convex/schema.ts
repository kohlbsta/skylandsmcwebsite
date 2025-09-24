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
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
