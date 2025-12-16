import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const healthRouter = createTRPCRouter({
  check: publicProcedure.query(() => {
    return {
      message: "works!"
    }
  }),
})
