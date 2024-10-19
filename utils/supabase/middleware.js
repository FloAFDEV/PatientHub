import { createServerClient, CookieOptions } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server"; // retirer `type`

const SESSION_EXPIRATION = 30 * 60 * 1000; // 30 minutes en millisecondes

export async function updateSession(request) {
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get(name) {
					return request.cookies.get(name)?.value;
				},
				set(name, value, options) {
					response.cookies.set({ name, value, ...options });
				},
				remove(name, options) {
					response.cookies.set({
						name,
						value: "",
						...options,
						maxAge: 0,
					});
				},
			},
		}
	);

	try {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (session) {
			const expirationTime = Date.now() + SESSION_EXPIRATION;
			response.cookies.set({
				name: "sessionExpiration",
				value: expirationTime.toString(),
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: SESSION_EXPIRATION / 1000, // en secondes
			});
		} else {
			const sessionExpiration = request.cookies.get("sessionExpiration");
			if (
				sessionExpiration &&
				Date.now() > parseInt(sessionExpiration.value)
			) {
				await supabase.auth.signOut();
				return NextResponse.redirect(new URL("/login", request.url));
			}
		}

		if (
			!session &&
			!request.nextUrl.pathname.startsWith("/login") &&
			!request.nextUrl.pathname.startsWith("/auth")
		) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		return response;
	} catch (error) {
		console.error("Erreur lors de la mise à jour de la session:", error);
		return response;
	}
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
