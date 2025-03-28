"use client";

import { useState, useEffect } from "react";
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
	const [hiddenField] = useState(""); // Champ caché pour le spam
	const [isModalOpen, setIsModalOpen] = useState(false);

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

	// Effectuer la redirection une fois que la modale est ouverte
	useEffect(() => {
		if (isModalOpen) {
			console.log(
				"Redirection vers /success après l'ouverture de la modale..."
			);
			router.push("/success");
		}
	}, [isModalOpen, router]);

	return (
		<div className="flex min-h-screen h-full flex-col lg:flex-row">
			<BackgroundBeamsWithCollision className="flex-grow">
				<div
					suppressHydrationWarning
					className="flex-grow flex flex-col justify-between min-h-screen px-6 sm:px-8 lg:px-12"
				>
					<div className="flex-1 flex flex-col items-center justify-center p-4">
						{/* Toggle du mode d'affichage */}
						<div className="absolute top-4 right-4 z-10">
							<ModeToggle />
						</div>
						{/* Texte d'accueil */}
						<div className="mx-auto max-w-md w-full sm:max-w-lg lg:max-w-2xl text-center mt-16 lg:mt-20">
							<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
								Votre espace dédié aux ostéopathes
							</h1>

							<p className="mt-3 sm:mt-4 text-base sm:text-lg lg:text-xl text-gray-400">
								Connectez-vous pour consulter vos dossiers.
							</p>
						</div>

						<Link href="/">
							<h1 className="absolute top-4 left-4 text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
								PatientHub
							</h1>
						</Link>

						{/* Formulaire de connexion */}
						<div className="w-full max-w-md border p-6 sm:p-8 shadow-lg rounded-lg mt-6 sm:mt-8">
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
									/>
								</div>

								{/* Bouton de soumission */}
								<button
									type="submit"
									className={`w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2 rounded-md hover:scale-105 transition-transform duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
										isLoading ? "opacity-50" : ""
									}`}
									disabled={isLoading}
								>
									{isLoading
										? "Connexion en cours..."
										: "Se connecter"}
								</button>

								{error && (
									<p className="text-red-500 text-xs text-center">
										{error}
									</p>
								)}
							</form>
						</div>

						{/* Informations supplémentaires */}
						<div className="hidden md:block mt-6 text-center text-muted-foreground">
							<p className="text-base leading-tight">
								La plateforme conçue pour faciliter la gestion
								des données médicales.
							</p>
							<p className="text-base leading-tight">
								Gérez vos rendez-vous (Bientôt disponible)
							</p>
						</div>

						<div className="mt-auto py-4 text-center">
							<p className="text-secondary text-sm md:text-base font-light">
								© 2024 PatientHub. Tous droits réservés.
							</p>
						</div>
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
				className="hidden lg:block lg:w-1/2 object-cover"
			/>
		</div>
	);
}
