"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import pour la redirection
import Image from "next/image";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/client";
import { ModeToggle } from "@/components/ModeToggle";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { PasskeyModal } from "@/components/PassKeyModal";
import Link from "next/link";

const supabase = createClient();

export default function LoginPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [hiddenField] = useState(""); // Champ caché pour le spam
	const [isMounted, setIsMounted] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Vérifier si l'utilisateur est déjà authentifié à chaque chargement de la page
	useEffect(() => {
		setIsMounted(true);
		const isUserAuthenticated = localStorage.getItem("authToken");
		if (isUserAuthenticated) {
			router.push("/success");
		}
	}, [router]);

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

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		if (!validateForm()) return;

		setIsLoading(true);

		try {
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
				localStorage.setItem("authToken", data.session.access_token); // Enregistre le token
				setIsModalOpen(true); // Ouvrir la modale après une connexion réussie
			}
		} catch (error) {
			setError("Une erreur est survenue. Veuillez réessayer plus tard.");
			console.error("Erreur inattendue:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div className="flex h-screen max-h-screen flex-col lg:flex-row">
			<BackgroundBeamsWithCollision className="flex-grow">
				<div
					suppressHydrationWarning
					className="flex-grow flex flex-col justify-between min-h-screen"
				>
					{/* Affichage de la modal si authentifié */}
					{isModalOpen && (
						<PasskeyModal open={isModalOpen} onClose={closeModal} />
					)}
					<div className="flex-1 flex flex-col items-center justify-center p-2">
						{/* Toggle du mode d'affichage si monté */}
						{isMounted && (
							<div className="absolute top-4 right-4 z-10">
								<ModeToggle />
							</div>
						)}

						{/* Texte d'accueil */}
						<div className="mx-auto max-w-md w-full px-4 sm:px-6 lg:max-w-2xl lg:px-8 lg:py-16 mt-20 lg:mt-28">
							<div className="text-center">
								<h1 className="text-3xl font-bold tracking-tight mt-10 sm:text-3xl md:text-4xl lg:text-5xl">
									Votre espace dédié aux ostéopathes
								</h1>
								<p className="mt-4 text-base leading-7 sm:mt-6 sm:text-lg">
									Suivez vos patients en toute simplicité.
									Connectez-vous pour consulter vos dossiers.
								</p>
							</div>
						</div>
						<h1 className="absolute top-4 left-4 text-3xl sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
							PatientHub
						</h1>

						{/* Formulaire de connexion */}
						<div className="w-full max-w-md text-card-foreground border p-8 shadow-lg rounded-lg mt-6 mb-12 sm:mb-24 bg-slate-100">
							<h2 className="text-lg font-bold text-center mb-2">
								Connexion
							</h2>
							<form onSubmit={handleSubmit} className="space-y-4">
								{/* Champ Email */}
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium"
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
										className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										aria-describedby="email-error"
									/>
								</div>

								{/* Champ Mot de Passe */}
								<div>
									<label
										htmlFor="password"
										className="block text-sm font-medium"
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
										className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										aria-describedby="password-error"
									/>
								</div>

								<input
									type="hidden"
									name="hiddenField"
									value={hiddenField}
								/>

								{/* Bouton de soumission */}
								<button
									type="submit"
									className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-md hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
										isLoading ? "opacity-50" : ""
									}`}
									disabled={isLoading}
									aria-busy={isLoading}
								>
									{isLoading
										? "Connexion en cours..."
										: "Se connecter"}
								</button>

								{/* Message d'erreur */}
								{error && (
									<p
										className="text-red-500 text-xs text-center"
										role="alert"
									>
										{error}
									</p>
								)}

								<p className="text-sm text-muted-foreground text-center">
									Vous n&apos;avez pas accès ?{" "}
									<Link
										href="mailto:afdevflo@gmail.com?subject=Demande%20d'accès%20à%20PatientHub&body=Bonjour%20[Nom%20complet%20ou%20société],%0A%0AJ'aimerais%20demander%20un%20acc%C3%A8s%20%C3%A0%20la%20plateforme.%0A%0AVoici%20quelques%20informations%20:%0A%0A-%20Nom%20complet%20ou%20société%20:%20[Nom%20complet%20ou%20société]%0A- %20Email%20:%20[Votre%20adresse%20e-mail]%0A- %20Raison%20de%20la%20demande%20:%20[Expliquez%20bri%C3%A8vement%20pourquoi%20vous%20souhaitez%20acc%C3%A9der%20%C3%A0%20la%20plateforme]%0A%0AJe%20vous%20remercie%20d'avance%20pour%20votre%20aide.%0A%0AMerci%20pour%20l'intérêt%20porté.%0A%0ACordialement,%0AAFDEV"
										className="text-sky-700 underline hover:text-sky-800"
									>
										Contactez l&apos;administrateur
									</Link>{" "}
									pour plus d&apos;informations.
								</p>
							</form>
						</div>

						{/* Informations supplémentaires */}
						<div className="hidden md:block mt-4 text-center text-muted-foreground px-4">
							<p className="text-base leading-tight">
								La plateforme conçue pour faciliter la gestion
								des données médicales.
							</p>
							<p className="text-base leading-tight">
								Gérez vos rendez-vous (Bientôt disponible sur la
								plateforme).
							</p>
						</div>
						<Footer />
					</div>
				</div>
			</BackgroundBeamsWithCollision>

			{/* Image latérale */}
			<Image
				src="/assets/images/onboarding-img.png"
				height={1000}
				width={1000}
				priority
				alt="Image d'accueil"
				className="side-img max-w-[50%] hidden lg:block object-cover"
			/>
		</div>
	);
}
