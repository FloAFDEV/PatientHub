// utils/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

// Fonction pour créer une instance de Supabase côté client
export function createClient() {
	// Vérification des variables d'environnement
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error(
			"Les variables d'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies."
		);
	}

	// Retourner une instance configurée de Supabase
	return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
