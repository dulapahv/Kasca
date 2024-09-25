export const BASE_SERVER_URL =
  process.env.VERCEL_ENV === "development" ||
  process.env.NEXT_PUBLIC_ENV === "development"
    ? "http://localhost:3001"
    : "https://occp-server.dulapahv.dev";

export const NAME_MAX_LENGTH = 255;
