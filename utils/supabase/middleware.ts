import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request: {
	cookies: { get: (arg0: string) => { (): any; new (): any; value: any } };
	nextUrl: { pathname: string; clone: () => any };
}) {
	let supabaseResponse = NextResponse.next();

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
	const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name) {
				// Récupérer un cookie spécifique
				return request.cookies.get(name)?.value || null;
			},
			set(name, value, options) {
				// Définir un cookie avec des options spécifiques
				supabaseResponse.cookies.set(name, value, options);
			},
			remove(name) {
				// Supprimer un cookie
				supabaseResponse.cookies.set(name, "", { maxAge: -1 });
			},
		},
	});

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

	// Redirection vers la page de login si l'utilisateur n'est pas authentifié
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
