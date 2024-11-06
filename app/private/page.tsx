import { redirect } from "next/navigation";
import { createSupabaseClient } from "@/utils/supabase/server";

export default async function PrivatePage() {
	const supabase = await createSupabaseClient(); // Assurez-vous d'attendre la création du client

	try {
		// Récupérer la session de l'utilisateur
		const {
			data: { session },
			error,
		} = await supabase.auth.getSession();

		if (error) throw error;

		// Si pas de session, rediriger vers la page de connexion
		if (!session) {
			console.log(
				"Aucune session trouvée, redirection vers la page de connexion"
			);
			redirect("/login");
		}

		// Récupérer les informations de l'utilisateur
		const { data: userData, error: userError } = await supabase
			.from("users")
			.select("email, name, role")
			.eq("id", session.user.id)
			.single();

		if (userError) throw userError;

		// Si les données utilisateur sont manquantes, rediriger vers la page de connexion
		if (!userData) {
			console.log(
				"Données utilisateur non trouvées, redirection vers la page de connexion"
			);
			redirect("/login");
		}

		// Retourner le rendu de la page si tout est valide
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
		redirect("/login"); // Rediriger en cas d'erreur
	}
}
