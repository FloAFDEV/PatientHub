import { createServerClient, CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

	const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name: string) {
				return request.cookies.get(name)?.value;
			},
			set(name: string, value: string, options: CookieOptions) {
				supabaseResponse.cookies.set(name, value, options);
			},
			remove(name: string, options: CookieOptions) {
				supabaseResponse.cookies.set(name, "", {
					...options,
					maxAge: 0,
				});
			},
		},
	});

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	console.log("User session:", user);
	if (error) {
		console.error(
			"Erreur lors de la récupération de l'utilisateur:",
			error
		);
	}

	if (
		!user &&
		!request.nextUrl.pathname.startsWith("/login") &&
		!request.nextUrl.pathname.startsWith("/auth")
	) {
		const url = new URL("/login", request.url);
		console.log(`Redirection vers ${url.pathname}`);
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}
