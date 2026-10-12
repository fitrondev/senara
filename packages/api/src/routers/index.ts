import { protectedProcedure, publicProcedure, router } from "../index";
import { customContentRouter } from "./custom-content";
import { guestRouter } from "./guest";
import { invitationRouter } from "./invitation";
import { rsvpRouter } from "./rsvp";
import { sectionRouter } from "./section";
import { templateRouter } from "./template";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      userId: ctx.auth.userId,
    };
  }),
  template: templateRouter,
  invitation: invitationRouter,
  section: sectionRouter,
  customContent: customContentRouter,
  guest: guestRouter,
  rsvp: rsvpRouter,
});

export type AppRouter = typeof appRouter;
