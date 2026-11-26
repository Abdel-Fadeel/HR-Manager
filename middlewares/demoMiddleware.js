import { UnauthorizedError } from "../errors/customErrors.js";

// When DEMO_MODE=true the app is read-only: visitors can browse everything
// and run every report, but nothing can be created, edited or deleted.
// Report endpoints use POST only to send filters, so they stay allowed.
const READ_ONLY_POSTS = [
  "/api/v1/auth/login",
  "/api/v1/employees/id-renewal",
  "/api/v1/employees/sponsor",
  "/api/v1/employees/passport",
  "/api/v1/employees/driver",
];

export const demoReadOnly = (req, res, next) => {
  if (process.env.DEMO_MODE !== "true") return next();
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  if (req.method === "POST" && READ_ONLY_POSTS.includes(req.originalUrl.split("?")[0])) return next();
  throw new UnauthorizedError("This is a read-only demo. Changes are disabled.");
};
