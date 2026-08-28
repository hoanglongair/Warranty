import { NextResponse } from "next/server";
import { generateNonce } from "siwe";

// Nonce expiration time in seconds (10 minutes)
const NONCE_EXPIRATION_SECONDS = 10 * 60;

export async function GET() {
  const nonce = generateNonce();
  const expiresAt = new Date(Date.now() + NONCE_EXPIRATION_SECONDS * 1000).toISOString();
  
  const response = NextResponse.json({ 
    nonce,
    expiresAt,
    expiresInSeconds: NONCE_EXPIRATION_SECONDS
  });
  
  response.cookies.set("siwe_nonce", nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: NONCE_EXPIRATION_SECONDS,
    path: "/"
  });
  
  return response;
}
