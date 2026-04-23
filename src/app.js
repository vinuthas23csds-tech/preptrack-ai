const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");

const env = require("./config/env");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const { authLimiter, apiLimiter } = require("./middleware/rateLimit");

const app = express();

// Required behind Render/other proxies so rate limiting and IP handling behave correctly.
app.set("trust proxy", 1);

const allowedOrigins = new Set(
  String(env.clientUrl || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
);

app.use(helmet());
app.use(
  cors((req, callback) => {
    const requestOrigin = req.header("Origin");

    // Allow non-browser requests (curl/postman/health checks) with no Origin header.
    if (!requestOrigin) {
      return callback(null, { origin: true, credentials: true });
    }

    let isAllowed = allowedOrigins.has(requestOrigin);

    // Same-origin API calls should work even if CLIENT_URL is not set correctly.
    if (!isAllowed) {
      try {
        const originHost = new URL(requestOrigin).host;
        const requestHost = req.get("host");
        isAllowed = Boolean(requestHost && originHost === requestHost);
      } catch (_error) {
        isAllowed = false;
      }
    }

    return callback(null, { origin: isAllowed, credentials: true });
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "PrepTrack AI Backend" });
});

app.use("/api", routes);

const frontendDistCandidates = [
  path.resolve(process.cwd(), "frontend/dist"),
  path.resolve(process.cwd(), "dist"),
  path.resolve(__dirname, "../frontend/dist"),
  path.resolve(__dirname, "../dist"),
  path.resolve(__dirname, "../../frontend/dist"),
  path.resolve(__dirname, "../../dist"),
];

const frontendDistPath = frontendDistCandidates.find((candidate) => fs.existsSync(candidate));
const shouldServeFrontend = Boolean(frontendDistPath);

if (shouldServeFrontend) {
  console.log(`Serving frontend from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));

  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    return res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  console.warn("Frontend dist not found; serving API routes only.");
}

app.use(errorHandler);

module.exports = app;
