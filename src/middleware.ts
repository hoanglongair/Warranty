import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("LỖI BẢO MẬT: Biến môi trường JWT_SECRET chưa được cấu hình.");
    }
    return new TextEncoder().encode("warranty_super_secret_jwt_key_2026_dev_only");
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isEmployerRoute = 
    pathname === "/dashboard/employer" ||
    pathname.startsWith("/dashboard/employer/") ||
    pathname === "/post-job" ||
    pathname.startsWith("/post-job/") ||
    pathname.startsWith("/api/employer") ||
    pathname.startsWith("/api/dashboard/employer");

  const isFreelancerRoute = 
    pathname === "/dashboard/freelancer" ||
    pathname.startsWith("/dashboard/freelancer/") ||
    pathname.startsWith("/api/freelancer") ||
    pathname.startsWith("/api/dashboard/freelancer");

  const isGeneralDashboard = 
    pathname === "/dashboard" ||
    pathname === "/dashboard/";

  const isAdminRoute = 
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/api/admin");

  // If not a protected route, let it pass
  if (!isEmployerRoute && !isFreelancerRoute && !isGeneralDashboard && !isAdminRoute) {
    return NextResponse.next();
  }

  // Retrieve JWT from Cookie or Authorization Header
  const tokenFromCookie = req.cookies.get("warranty_token")?.value;
  const authHeader = req.headers.get("authorization");
  const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  const token = tokenFromCookie || tokenFromHeader;

  let session: { walletAddress: string; role: string } | null = null;

  if (token) {
    try {
      const secretKey = getSecretKey();
      const { payload } = await jwtVerify(token, secretKey);
      if (payload && payload.walletAddress && typeof payload.walletAddress === "string") {
        session = {
          walletAddress: (payload.walletAddress as string).toLowerCase(),
          role: (payload.role as string) || "FREELANCER"
        };
      }
    } catch {
      session = null;
    }
  }

  const isApiRequest = pathname.startsWith("/api/");

  // 1. Check Authentication (Unauthenticated Check)
  if (!session) {
    if (isApiRequest) {
      return NextResponse.json(
        { error: "Unauthorized: Bạn chưa đăng nhập ví (SIWE) hoặc phiên đã hết hạn." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("loginRequired", "true");
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = session.role.toUpperCase();

  // 2. Check Authorization (Role Check)
  // Admin routes: require ADMIN
  if (isAdminRoute && userRole !== "ADMIN") {
    if (isApiRequest) {
      return NextResponse.json(
        { error: "Forbidden: Chỉ có tài khoản ADMIN mới có quyền truy cập.", currentRole: session.role },
        { status: 403 }
      );
    }
    const forbiddenUrl = new URL("/dashboard", req.url);
    forbiddenUrl.searchParams.set("error", "admin_required");
    return NextResponse.redirect(forbiddenUrl);
  }

  // Employer routes: require EMPLOYER or ADMIN
  if (isEmployerRoute && userRole !== "EMPLOYER" && userRole !== "ADMIN") {
    if (isApiRequest) {
      return NextResponse.json(
        {
          error: `Forbidden: Vai trò '${session.role}' không được phép truy cập Dashboard/API dành riêng cho Employer.`,
          requiredRole: "EMPLOYER",
          currentRole: session.role
        },
        { status: 403 }
      );
    }
    const forbiddenUrl = new URL("/dashboard", req.url);
    forbiddenUrl.searchParams.set("error", "employer_role_required");
    return NextResponse.redirect(forbiddenUrl);
  }

  // Freelancer routes: require FREELANCER or ADMIN
  if (isFreelancerRoute && userRole !== "FREELANCER" && userRole !== "ADMIN") {
    if (isApiRequest) {
      return NextResponse.json(
        {
          error: `Forbidden: Vai trò '${session.role}' không được phép truy cập Dashboard/API dành riêng cho Freelancer.`,
          requiredRole: "FREELANCER",
          currentRole: session.role
        },
        { status: 403 }
      );
    }
    const forbiddenUrl = new URL("/dashboard", req.url);
    forbiddenUrl.searchParams.set("error", "freelancer_role_required");
    return NextResponse.redirect(forbiddenUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/post-job",
    "/post-job/:path*",
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/employer/:path*",
    "/api/freelancer/:path*",
    "/api/dashboard/:path*"
  ]
};
