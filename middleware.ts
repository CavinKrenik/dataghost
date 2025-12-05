import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect dashboard route
  // if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public routes like pricing, login, signup are implicitly allowed by not matching a specific "protected" pattern
     *   OR we can just match the protected ones.
     *
     * The user requested:
     * matcher: ['/dashboard/:path*'],
     *
     * But the current matcher is a negative lookahead for static files.
     * To strictly follow the user's request "Remove /pricing from any auth middleware matcher... change it to matcher: ['/dashboard/:path*']",
     * I will update it to target the protected routes specifically, as that is cleaner for this requirement.
     */
    "/dashboard/:path*",
  ],
};
