import { createServerClient, CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const SESSION_EXPIRATION = 5 * 60 * 1000; // 5 minutes en millisecondes

export async function updateSession(
	request: NextRequest
): Promise<NextResponse> {
	let response = NextResponse.next({
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
				response.cookies.set({ name, value, ...options });
			},
			remove(name: string, options: CookieOptions) {
				response.cookies.set({
					name,
					value: "",
					...options,
					maxAge: 0,
				});
			},
		},
	});

	try {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (session) {
			console.log(
				"Session trouvée pour l'utilisateur:",
				session.user.email
			);

			// Mettre à jour l'expiration de la session
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
			console.log("Aucune session trouvée");

			// Vérifier si la session a expiré
			const sessionExpiration = request.cookies.get("sessionExpiration");
			if (
				sessionExpiration &&
				Date.now() > parseInt(sessionExpiration.value)
			) {
				if (
					!request.nextUrl.pathname.startsWith("/login") &&
					!request.nextUrl.pathname.startsWith("/auth")
				) {
					const redirectUrl = new URL("/login", request.url);
					console.log(
						`Session expirée. Redirection vers ${redirectUrl.pathname}`
					);
					return NextResponse.redirect(redirectUrl);
				}
			}
		}

		if (
			!session &&
			!request.nextUrl.pathname.startsWith("/login") &&
			!request.nextUrl.pathname.startsWith("/auth")
		) {
			const redirectUrl = new URL("/login", request.url);
			console.log(`Redirection vers ${redirectUrl.pathname}`);
			return NextResponse.redirect(redirectUrl);
		}

		return response;
	} catch (error) {
		console.error("Erreur lors de la récupération de la session:", error);
		return response;
	}
}
