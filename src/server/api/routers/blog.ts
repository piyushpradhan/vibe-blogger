import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { generateBlogFromSession } from "@/lib/ai";

export const blogRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        model: z.enum(["gemini", "gpt", "claude"]).default("gemini"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authenticated",
          });
        }

        // Get the session and its posts
        const session = await ctx.db.session.findUnique({
          where: {
            id: input.sessionId,
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

        if (session.posts.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot generate blog from empty session",
          });
        }

        // Generate blog content using AI
        const generatedContent = await generateBlogFromSession(
          session.title,
          session.posts,
          input.model
        );

        if (!generatedContent) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate blog content",
          });
        }

        return await ctx.db.generatedBlog.create({
          data: {
            title: session.title,
            content: generatedContent,
            userId: ctx.session.user.id,
            sessionId: input.sessionId,
          },
        });
      } catch (error) {
        console.error("Error in blog creation:", error);
        
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create blog",
        });
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const blog = await ctx.db.generatedBlog.findUnique({
          where: {
            id: input.id,
            userId: ctx.session.user.id,
          },
        });

        if (!blog) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Blog not found",
          });
        }

        return blog;
      } catch (error) {
        console.error("Error fetching blog:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch blog",
        });
      }
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.generatedBlog.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch blogs",
      });
    }
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // First verify the blog belongs to the user
      const blog = await ctx.db.generatedBlog.findUnique({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!blog) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog not found",
        });
      }

      return ctx.db.generatedBlog.delete({
        where: {
          id: input.id,
        },
      });
    }),
}); 