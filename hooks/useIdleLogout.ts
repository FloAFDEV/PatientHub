"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Durée d'expiration de la session (5 minutes)
const EXPIRATION_TIME = 5 * 60 * 1000;

export const useIdleLogout = () => {
	const router = useRouter();

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const checkSessionExpiration = async () => {
			// Récupération du temps d'expiration de la session à partir des cookies
			const expirationTime = document.cookie
				.split("; ")
				.find((row) => row.startsWith("sessionExpiration="))
				?.split("=")[1];

			console.log(
				"Vérification de l'expiration de la session :",
				expirationTime
			); // Journalisation du temps d'expiration

			if (expirationTime && Date.now() > parseInt(expirationTime, 10)) {
				console.log("Session expirée, déconnexion."); // Journalisation de l'expiration de la session
				// Rediriger l'utilisateur vers la page de connexion avec un message d'erreur
				router.push("/login?error=Session expirée");
			}
		};

		const handleActivity = () => {
			clearTimeout(timeoutId);
			checkSessionExpiration(); // Vérifier l'expiration lors d'une activité
			timeoutId = setTimeout(checkSessionExpiration, EXPIRATION_TIME);
		};

		// Ajouter des écouteurs d'événements pour détecter l'activité de l'utilisateur
		window.addEventListener("mousemove", handleActivity);
		window.addEventListener("keypress", handleActivity);
		window.addEventListener("click", handleActivity);
		window.addEventListener("scroll", handleActivity);

		// Appel initial pour définir le timeout
		handleActivity();

		// Nettoyage à la désinstallation du composant
		return () => {
			clearTimeout(timeoutId);
			window.removeEventListener("mousemove", handleActivity);
			window.removeEventListener("keypress", handleActivity);
			window.removeEventListener("click", handleActivity);
			window.removeEventListener("scroll", handleActivity);
		};
	}, [router]);
};
