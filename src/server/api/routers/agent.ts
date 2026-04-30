import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const agentRouter = createTRPCRouter({
  chat: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      const msg = input.message.toLowerCase();
      let response = "";

      if (msg.includes("headache")) {
        response = "I'm sorry to hear you have a headache. Please dim your lights, drink some water, and take a 15-minute screen break. I'll handle your tasks in the meantime.";
      } else {
        response = `I'm your Personal Manager. I've noted your message: "${input.message}". How can I assist you with your schedule or well-being today?`;
      }
      
      return {
        reply: response,
      };
    }),
});
