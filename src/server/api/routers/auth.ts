import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const GITHUB_CLIENT_ID = "Iv1.b507a3d251145465"; // Standard VS Code Copilot Client ID (often used for legit access)

export const authRouter = createTRPCRouter({
  getGitHubStatus: publicProcedure.query(async ({ ctx }) => {
    const auth = await ctx.db.gitHubAuth.findFirst();
    return {
      isConnected: !!auth?.accessToken,
    };
  }),

  startDeviceFlow: publicProcedure.mutation(async () => {
    const response = await fetch("https://github.com/login/device/code", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        scope: "read:user copilot",
      }),
    });

    return await response.json() as {
      device_code: string;
      user_code: string;
      verification_uri: string;
      expires_in: number;
      interval: number;
    };
  }),

  pollToken: publicProcedure
    .input(z.object({ device_code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const response = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          device_code: input.device_code,
          grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        }),
      });

      const data = await response.json() as {
        access_token?: string;
        error?: string;
      };

      if (data.access_token) {
        await ctx.db.gitHubAuth.upsert({
          where: { id: 1 },
          update: { accessToken: data.access_token },
          create: { id: 1, accessToken: data.access_token },
        });
        return { success: true };
      }

      return { success: false, error: data.error };
    }),

  deleteGitHubToken: publicProcedure.mutation(async ({ ctx }) => {
    return ctx.db.gitHubAuth.deleteMany({
      where: { id: 1 },
    });
  }),
});
