import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  ROLES,
  MENTOR_STATUS,
  DASHBOARD_ROUTES,
  PUBLIC_AUTHENTICATED_ROUTES,
  isPathAccessible,
  getDashboardHomeRoute
} from "@/lib/roles";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get the session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !sessionData?.session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userId = sessionData.session.user.id;

  // 1️⃣ Get role(s) for this user using new normalized role system
  let role = "guest";
  
  // Get user roles from the new user_roles table
  const { data: rolesData, error: rolesError } = await supabase
    .from("user_roles")
    .select("roles(name)")
    .eq("user_id", userId);

  if (rolesError || !rolesData?.length) {
    console.log(`❌ No roles found for user ${userId}`);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const userRoles = rolesData.map(r => r.roles.name);
  console.log(`👤 User roles from user_roles table:`, userRoles);

  // 2️⃣ Determine primary role based on hierarchy
  if (userRoles.includes("admin")) {
    role = ROLES.ADMIN;
    console.log(`🔐 Admin role detected for user ${userId}`);
  } else if (userRoles.includes("mentor")) {
    // Check mentor status for approved/pending
    const { data: mentorData, error: mentorError } = await supabase
      .from("mentor_data")
      .select("status")
      .eq("user_id", userId)
      .maybeSingle();

    if (!mentorError && mentorData) {
      if (mentorData.status === MENTOR_STATUS.APPROVED) {
        role = ROLES.MENTOR;
        console.log(`👨‍🏫 Approved mentor role detected for user ${userId}`);
      } else if (mentorData.status === MENTOR_STATUS.PENDING) {
        role = ROLES.PENDING_MENTOR;
        console.log(`⏳ Pending mentor role detected for user ${userId}`);
      }
    }
  } else if (userRoles.includes("mentee")) {
    role = ROLES.MENTEE;
    console.log(`👨‍🎓 Mentee role detected for user ${userId}`);
  }


  // 3️⃣ Log final role resolution
  console.log(`🎯 Final role resolved for user ${userId}: ${role}`);
  console.log(`📍 Requested path: ${pathname}`);

  // 4️⃣ If still no role, send to role-selection dashboard
  if (role === "guest") {
    console.log(`❌ No role found for user ${userId}, redirecting to /dashboard`);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 5️⃣ Handle dashboard root
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    const homeRoute = getDashboardHomeRoute(role);
    console.log(`🏠 Dashboard home route for ${role}: ${homeRoute}`);
    if (homeRoute !== "/dashboard") {
      console.log(`🔄 Redirecting to home route: ${homeRoute}`);
      return NextResponse.redirect(new URL(homeRoute, request.url));
    }
    return NextResponse.next();
  }

  // 5️⃣ Fast path for public authenticated routes
  if (
    PUBLIC_AUTHENTICATED_ROUTES.includes(pathname) ||
    PUBLIC_AUTHENTICATED_ROUTES.some(route => pathname === route + "/")
  ) {
    return NextResponse.next();
  }

  // 6️⃣ Check access permissions
  const isAccessible = isPathAccessible(role, pathname);
  console.log(`🔒 Path access check for ${role} on ${pathname}: ${isAccessible ? '✅ ALLOWED' : '❌ DENIED'}`);
  
  if (!isAccessible) {
    const homeDashboard = getDashboardHomeRoute(role);
    console.log(`🚫 Access denied, redirecting to: ${homeDashboard}`);
    return NextResponse.redirect(
      new URL(
        `${homeDashboard}?error=unauthorized&requestedPath=${encodeURIComponent(pathname)}`,
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
