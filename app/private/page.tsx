import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function PrivatePage() {
	const supabase = createClient();

	try {
		const {
			data: { session },
			error,
		} = await supabase.auth.getSession();

		if (error) throw error;
		if (!session) {
			console.log(
				"Aucune session trouvée, redirection vers la page de connexion"
			);
			redirect("/login");
		}

		// Récupérer les informations de l'utilisateur depuis la base de données
		const { data: userData, error: userError } = await supabase
			.from("users")
			.select("email, name, role")
			.eq("id", session.user.id)
			.single();

		if (userError) throw userError;

		if (!userData) {
			console.log(
				"Données utilisateur non trouvées, redirection vers la page de connexion"
			);
			redirect("/login");
		}

		return (
			<div>
				<h1>Page Privée</h1>
				<p>Bonjour {userData.name || userData.email}</p>
				<p>Votre rôle : {userData.role}</p>
				<p>Email de session : {session.user.email}</p>
				{/* Ajoutez ici plus de contenu pour votre page privée */}
			</div>
		);
	} catch (error) {
		console.error(
			"Erreur d'authentification ou de récupération des données:",
			error
		);
		redirect("/login");
	}
}
