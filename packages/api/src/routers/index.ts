import { protectedProcedure, publicProcedure, router } from "../trpc";
import { adminRouter } from "./admin";
import { analyticsRouter } from "./analytics";
import { customContentRouter } from "./custom-content";
import { guestRouter } from "./guest";
import { invitationRouter } from "./invitation";
import { orderRouter } from "./order";
import { resellerRouter } from "./reseller";
import { rsvpRouter } from "./rsvp";
import { sectionRouter } from "./section";
import { templateRouter } from "./template";
import { templateGeneratorRouter } from "./template-generator";

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
  order: orderRouter,
  analytics: analyticsRouter,
  admin: adminRouter,
  reseller: resellerRouter,
  templateGenerator: templateGeneratorRouter,
});

export type AppRouter = typeof appRouter;

