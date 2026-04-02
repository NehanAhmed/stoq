import { createAuthClient } from "better-auth/react";
import type { Auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export type AuthClient = typeof authClient;
