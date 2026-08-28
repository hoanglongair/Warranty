import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("LỖI BẢO MẬT: Biến môi trường JWT_SECRET chưa được cấu hình.");
    }
    return "warranty_super_secret_jwt_key_2026_dev_only";
  }
  return secret;
}

export interface AuthSession {
  walletAddress: string;
  role: string;
}

export async function getAuthSession(req: NextRequest): Promise<AuthSession | null> {
  try {
    const JWT_SECRET = getJwtSecret();

    // 1. Check Cookie
    const tokenFromCookie = req.cookies.get("warranty_token")?.value;
    
    // 2. Check Authorization Header
    const authHeader = req.headers.get("authorization");
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    
    const token = tokenFromCookie || tokenFromHeader;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { walletAddress: string; role: string };
        if (decoded && decoded.walletAddress) {
          return {
            walletAddress: decoded.walletAddress.toLowerCase(),
            role: decoded.role
          };
        }
      } catch (jwtErr) {
        console.warn("[AUTH] JWT verify failed:", jwtErr instanceof Error ? jwtErr.message : String(jwtErr));
      }
    }

    return null;
  } catch (err) {
    console.error("[AUTH] Unexpected auth error:", err);
    return null;
  }
}

/**
 * Require valid authentication token. Returns AuthSession or NextResponse 401.
 */
export async function requireAuth(
  req: NextRequest
): Promise<{ session: AuthSession } | { errorResponse: NextResponse }> {
  const session = await getAuthSession(req);
  if (!session) {
    return {
      errorResponse: NextResponse.json(
        { error: "Unauthorized: Bạn chưa đăng nhập hoặc token đã hết hạn." },
        { status: 401 }
      )
    };
  }
  return { session };
}

/**
 * Require valid authentication AND specified role(s). Returns 401 if unauthenticated, 403 if wrong role.
 */
export async function requireRole(
  req: NextRequest,
  allowedRoles: (Role | "EMPLOYER" | "FREELANCER" | "ADMIN")[]
): Promise<{ session: AuthSession } | { errorResponse: NextResponse }> {
  const authRes = await requireAuth(req);
  if ("errorResponse" in authRes) return authRes;

  const { session } = authRes;
  const userRole = session.role.toUpperCase();

  const isAllowed = allowedRoles.some((r) => r.toUpperCase() === userRole);
  if (!isAllowed) {
    return {
      errorResponse: NextResponse.json(
        {
          error: `Forbidden: Tài khoản role '${session.role}' không có quyền truy cập tính năng này.`,
          requiredRoles: allowedRoles,
          currentRole: session.role
        },
        { status: 403 }
      )
    };
  }

  return { session };
}

/**
 * Check ownership between session user and target resource owner wallet address.
 */
export function verifyOwnership(
  session: AuthSession,
  resourceOwnerAddress: string
): { isOwner: boolean; errorResponse?: NextResponse } {
  const isOwner = session.walletAddress.toLowerCase() === resourceOwnerAddress.toLowerCase();
  if (!isOwner && session.role.toUpperCase() !== "ADMIN") {
    return {
      isOwner: false,
      errorResponse: NextResponse.json(
        { error: "Forbidden: Bạn không có quyền thao tác trên tài nguyên của người dùng khác." },
        { status: 403 }
      )
    };
  }
  return { isOwner: true };
}

