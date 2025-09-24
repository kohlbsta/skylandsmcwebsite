"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

export const getServerStatus = action({
  args: {},
  handler: async (ctx, args) => {
    try {
      // Using a Minecraft server status API
      const response = await fetch(`https://api.mcsrvstat.us/3/play.skylandsmc.com`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        online: data.online || false,
        players: {
          online: data.players?.online || 0,
          max: data.players?.max || 0,
        },
        version: data.version || "Unknown",
        motd: data.motd?.clean?.[0] || "SkyLandsMC",
        lastUpdated: Date.now(),
      };
    } catch (error) {
      console.error("Failed to fetch server status:", error);
      return {
        online: false,
        players: {
          online: 0,
          max: 0,
        },
        version: "Unknown",
        motd: "SkyLandsMC",
        lastUpdated: Date.now(),
        error: "Failed to fetch server status",
      };
    }
  },
});
