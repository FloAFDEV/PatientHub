import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						request.cookies.set(name, value)
					);
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options)
					);
				},
			},
		}
	);

	// Récupérer l'utilisateur à partir de Supabase
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	// Log de l'utilisateur et de l'erreur
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
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		console.log(`Redirection vers ${url.pathname}`); // Log de redirection
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}
