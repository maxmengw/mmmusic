import { CorsOptions } from "cors";

function parseAllowedOrigins(): string[] {
  const primary = process.env.FRONTEND_URL;
  const extras = (process.env.FRONTEND_URLS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return [primary, ...extras, "http://localhost:3000", "http://localhost:5173"].filter(
    (origin): origin is string => Boolean(origin)
  );
}

function isVercelPreviewOrigin(origin: string): boolean {
  try {
    const hostname = new URL(origin).hostname;
    return hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

// configure the type of requests that CORS will allow to be made to the backend
const corsOptions: CorsOptions = {
  // throw an error if the request does not come from the list of allowed origins
  origin: function (origin, callback) {
    const allowedOrigins = parseAllowedOrigins();

    // invoke callback (eg. next middleware) if  origin matches or no origin
    // some services (like postman) do not include an origin in their request
    if (!origin || allowedOrigins.includes(origin) || isVercelPreviewOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS restriction"), false);
    }
  },
  // allow specific headers, methods, and inclusion of credentials
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  credentials: true,
};

export default corsOptions;