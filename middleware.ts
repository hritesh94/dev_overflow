import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes (with wildcard matching for subpaths)
const publicRoutes = [
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
  "/api/rapidapi(.*)",
  "/question/:id(.*)",
  "/tags(.*)",
  "/tags/:id(.*)",
  "/profile/:id(.*)",
  "/community(.*)",
  "/jobs(.*)",
];

// Define routes to be completely ignored by Clerk’s middleware (with wildcard matching)
const ignoredRoutes = [
  "/api/webhook(.*)",
  "/api/openai(.*)",
  "/api/rapidapi(.*)",
];

const isPublicRoute = createRouteMatcher(publicRoutes);
const isIgnoredRoute = createRouteMatcher(ignoredRoutes);

export default clerkMiddleware(async (auth, request) => {
  // Bypass authentication completely for ignored routes
  if (isIgnoredRoute(request)) {
    return;
  }

  // For routes not listed as public, enforce authentication
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
