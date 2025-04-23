import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const sessionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string(),
        model: z.enum(["gemini", "gpt", "claude"]).default("gemini"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      return ctx.db.session.create({
        data: {
          title: input.title,
          description: input.description,
          model: input.model,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        model: z.enum(["gemini", "gpt", "claude"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // First verify the session belongs to the user
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      return ctx.db.session.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
          model: input.model,
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.session.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        posts: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          posts: true,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      return session;
    }),

  addPost: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // First verify the session belongs to the user
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.sessionId,
          userId: ctx.session.user.id,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      return ctx.db.post.create({
        data: {
          content: input.content,
          sessionId: session.id,
          userId: session.userId,
        },
      });
    }),

  updatePostOrder: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        postIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // First verify the session belongs to the user
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.sessionId,
          userId: ctx.session.user.id,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      // In a real implementation, you would update the order in the database
      // For now, we'll just return success
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // First verify the session belongs to the user
      const session = await ctx.db.session.findUnique({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      return ctx.db.session.delete({
        where: {
          id: input.id,
        },
      });
    }),
});

