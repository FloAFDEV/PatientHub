// testConnectionSupabase.js
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
	throw new Error(
		"Supabase URL or key is missing in the environment variables."
	);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
	try {
		const { data: patients, error } = await supabase
			.from("patients") // Assurez-vous que le nom de la table correspond à votre base de données Supabase
			.select("*"); // Récupérer toutes les colonnes

		if (error) {
			throw error; // Lancer l'erreur pour qu'elle soit capturée par le bloc catch
		}

		// console.log("Patients:", patients);
		if (patients) {
			console.log("Connexion Supabase réussie et données récupérées.");
			// Si tu veux, afficher les patients: console.log(patients);
		} else {
			console.log(
				"Connexion Supabase réussie, mais aucune donnée trouvée."
			);
		}
	} catch (error) {
		console.error("Erreur de connexion Supabase :", error);
	}
}

testSupabaseConnection();
