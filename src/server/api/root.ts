import { createTRPCRouter } from "@/server/api/trpc";
import { postRouter } from "./routers/post";
import { sessionRouter } from "./routers/session";
import { blogRouter } from "./routers/blog";
import { userRouter } from "./routers/user";
import { createCallerFactory } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  session: sessionRouter,
  blog: blogRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
