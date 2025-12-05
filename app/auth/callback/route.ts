import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/dashboard";
    const plan = searchParams.get("plan");

    if (code) {
        const cookieStore = {
            getAll() {
                return [] // We can't access cookies directly in this simple object, 
                // but createServerClient needs an adapter. 
                // In a route handler, we use request.cookies and response.cookies
            },
            setAll(cookiesToSet: any[]) {
                // handled below
            }
        }

        // We need a proper cookie adapter for the route handler
        // But actually, we can just use the standard pattern:

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return request.headers.get("cookie")?.split("; ").find((c) => c.startsWith(`${name}=`))?.split("=")[1];
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        // We'll handle setting cookies in the response
                    },
                    remove(name: string, options: CookieOptions) {
                        // We'll handle removing cookies in the response
                    },
                },
            }
        );

        // Actually, the above manual cookie handling is a bit messy in a route handler if we want to set cookies on the response.
        // The standard Next.js + Supabase SSR pattern for route handlers is:

        const response = NextResponse.redirect(`${origin}/auth/confirm${plan ? `?plan=${plan}` : ""}`);

        const supabaseClient = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        // @ts-ignore
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            // @ts-ignore
                            request.cookies.set(name, value)
                        );
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        const { error } = await supabaseClient.auth.exchangeCodeForSession(code);

        if (!error) {
            return response;
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}
