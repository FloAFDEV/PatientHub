import { createBrowserClient } from "@supabase/ssr";

// Fonction pour créer une instance de Supabase côté client
export function createClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error(
			"Les variables d'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies."
		);
	}

	const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

	// 🌟 Vérification de la session côté client
	supabase.auth.getSession().then(({ data, error }) => {
		if (error) {
			console.error("Erreur récupération session client:", error);
		} else {
			console.log("Session côté client:", data);
		}
	});

	return supabase;
}
