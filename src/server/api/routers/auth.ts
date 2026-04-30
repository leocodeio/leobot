import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  getGitHubStatus: publicProcedure.query(async ({ ctx }) => {
    const auth = await ctx.db.gitHubAuth.findFirst();
    return {
      isConnected: !!auth?.accessToken,
    };
  }),

  saveGitHubToken: publicProcedure
    .input(z.object({ token: z.string().startsWith("ghu_") }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.gitHubAuth.upsert({
        where: { id: 1 },
        update: { accessToken: input.token },
        create: { id: 1, accessToken: input.token },
      });
    }),

  deleteGitHubToken: publicProcedure.mutation(async ({ ctx }) => {
    return ctx.db.gitHubAuth.deleteMany({
      where: { id: 1 },
    });
  }),
});
