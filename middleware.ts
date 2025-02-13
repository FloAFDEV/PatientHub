import { createServerClient, type CookieOptions } from "@supabase/ssr";
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
				setAll(cookies) {
					cookies.forEach(({ name, value, ...options }) => {
						response.cookies.set({ name, value, ...options });
					});
				},
			},
		}
	);

	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
	if (!session && !request.nextUrl.pathname.startsWith("/")) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/";
		return NextResponse.redirect(redirectUrl);
	}

	// Si l'utilisateur est connecté et tente d'accéder à la page d'accueil ("/"), on le redirige vers "/dashboard"
	if (session && request.nextUrl.pathname === "/") {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/success";
		return NextResponse.redirect(redirectUrl);
	}

	return response;
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
