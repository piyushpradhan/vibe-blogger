import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const healthRouter = createTRPCRouter({
  check: publicProcedure.query(async () => {
    try {
      // Ping the database to keep it active (prevents Supabase from pausing)
      await db.$queryRaw`SELECT 1`;

      return {
        message: "works!",
        database: "connected"
      }
    } catch (error) {
      return {
        message: "works!",
        database: "error",
        error: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }),
})
