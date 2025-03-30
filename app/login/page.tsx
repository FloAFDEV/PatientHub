"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { ModeToggle } from "@/components/ModeToggle";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Link from "next/link";

export default function LoginPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [hiddenField] = useState(""); // Champ caché anti-spam/bot
	const [isModalOpen, setIsModalOpen] = useState(false);

	// -----------------------------------------
	// Validation de base du formulaire
	// -----------------------------------------
	const validateForm = () => {
		if (!email) {
			setError("L'email est requis.");
			return false;
		}
		if (!/\S+@\S+\.\S+/.test(email)) {
			setError("L'email n'est pas valide.");
			return false;
		}
		if (!password) {
			setError("Le mot de passe est requis.");
			return false;
		}
		if (password.length < 6) {
			setError("Le mot de passe doit contenir au moins 6 caractères.");
			return false;
		}
		if (hiddenField) {
			setError("Le champ caché ne doit pas être rempli.");
			return false;
		}
		return true;
	};

	// -----------------------------------------
	// Soumission du formulaire
	// -----------------------------------------
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		if (!validateForm()) return;
		setIsLoading(true);

		try {
			const supabase = createClient();
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				setError(
					"Email ou mot de passe incorrect. Veuillez réessayer."
				);
				console.error("Erreur de connexion:", error);
			} else if (data.session) {
				localStorage.setItem("authToken", data.session.access_token);
				setIsModalOpen(true); // On ouvre la "modale" (virtuelle) après succès
			}
		} catch (error) {
			setError("Une erreur est survenue. Veuillez réessayer plus tard.");
			console.error("Erreur inattendue:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// -----------------------------------------
	// Redirection après connexion
	// -----------------------------------------
	useEffect(() => {
		if (isModalOpen) {
			console.log("Redirection vers /success...");
			router.push("/success");
		}
	}, [isModalOpen, router]);

	// -----------------------------------------
	// Rendu principal
	// -----------------------------------------
	return (
		<div className="flex min-h-screen h-full flex-col lg:flex-row">
			{/* Background animé (beams) */}
			<BackgroundBeamsWithCollision className="flex-grow relative overflow-hidden">
				<div className="flex flex-col justify-between min-h-screen px-6 sm:px-8 lg:px-12 py-4">
					{/* Toggle Dark / Light mode */}
					<div className="absolute top-4 right-4 z-10">
						<ModeToggle />
					</div>

					{/* Logo & Titre de page */}
					<Link
						href="/"
						aria-label="Retour à l'accueil"
						className="absolute top-4 left-4 text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
					>
						PatientHub
					</Link>

					{/* Contenu principal (Formulaire) */}
					<div className="flex flex-1 flex-col items-center justify-center">
						{/* Titre principal */}
						<div className="mx-auto max-w-md w-full text-center mt-16 lg:mt-20">
							<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100">
								Votre espace dédié aux ostéopathes
							</h1>
							<p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400">
								Connectez-vous pour consulter vos dossiers.
							</p>
						</div>

						{/* Card de connexion */}
						<div className="w-full max-w-md mt-8 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 p-6 sm:p-8 shadow-lg rounded-lg transition-transform hover:shadow-xl hover:scale-[1.01]">
							<h2 className="text-lg font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
								Connexion
							</h2>

							<form onSubmit={handleSubmit} className="space-y-5">
								{/* Champ Email */}
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										Email :
									</label>
									<input
										id="email"
										name="email"
										type="email"
										required
										autoComplete="email"
										placeholder="Votre email"
										className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm dark:bg-gray-900 dark:text-gray-100"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
									/>
								</div>

								{/* Champ Mot de Passe */}
								<div>
									<label
										htmlFor="password"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										Mot de passe :
									</label>
									<input
										id="password"
										name="password"
										type="password"
										required
										autoComplete="current-password"
										placeholder="Votre mot de passe"
										className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm dark:bg-gray-900 dark:text-gray-100"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
									/>
								</div>

								{/* Champ caché anti-bot, optionnel */}
								{/* <input
                  type="text"
                  name="antiBot"
                  value={hiddenField}
                  onChange={() => {}}
                  className="hidden"
                /> */}

								{/* Bouton de soumission */}
								<button
									type="submit"
									className={`w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 transition-transform duration-300 ease-out ${
										isLoading
											? "opacity-50 cursor-not-allowed"
											: "hover:scale-105"
									}`}
									disabled={isLoading}
								>
									{isLoading
										? "Connexion en cours..."
										: "Se connecter"}
								</button>

								{/* Affichage d'erreur */}
								{error && (
									<p
										className="text-red-500 text-xs text-center mt-2"
										aria-live="assertive"
									>
										{error}
									</p>
								)}
							</form>
						</div>

						{/* Infos supplémentaires (optionnel) */}
						<div className="hidden md:block mt-8 text-center text-gray-400 dark:text-gray-500">
							<p className="text-sm">
								La plateforme conçue pour faciliter la gestion
								des données médicales.
							</p>
							<p className="text-sm">
								Gérez vos rendez-vous (Bientôt disponible)
							</p>
						</div>
					</div>

					{/* Footer */}
					<footer className="mt-auto py-4 text-center">
						<p className="text-gray-400 text-xs md:text-sm">
							© 2024 PatientHub. Tous droits réservés.
						</p>
					</footer>
				</div>
			</BackgroundBeamsWithCollision>

			{/* Image latérale (uniquement sur grands écrans) */}
			<Image
				src="/assets/images/onboarding-img.png"
				height={1000}
				width={1000}
				priority
				alt="Image d'accueil"
				className="hidden lg:block lg:w-1/2 object-cover"
			/>
		</div>
	);
}
