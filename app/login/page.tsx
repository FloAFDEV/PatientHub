"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/client";
import { ModeToggle } from "@/components/ModeToggle";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { PasskeyModal } from "@/components/PassKeyModal";

const supabase = createClient();

export default function LoginPage() {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [hiddenField, setHiddenField] = useState("");
	const [isMounted, setIsMounted] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

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
			// Vérifie si le champ caché est non vide
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
				setIsAuthenticated(true);
			}
		} catch (error) {
			setError("Une erreur est survenue. Veuillez réessayer plus tard.");
			console.error("Erreur inattendue:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<BackgroundBeamsWithCollision>
			<div
				suppressHydrationWarning
				className="flex-grow flex flex-col justify-between"
			>
				{isAuthenticated && <PasskeyModal />}
				<div className="flex-1 flex flex-col items-center justify-center p-6">
					{isMounted && (
						<div className="absolute top-4 right-4 z-10">
							<ModeToggle />
						</div>
					)}
					<div className="w-1/3 max-w-lg lg:max-w-2xl">
						<Image
							src="/assets/images/welcome.webp"
							alt="Welcome"
							width={800}
							height={400}
							sizes="(max-width: 768px) 100vw, (max-width: 600px) 50vw, 33vw"
							className="w-full h-auto mt-36"
							priority
						/>
					</div>
					<h1 className="text-6xl lg:text-6xl font-black text-foreground mb-6 text-center">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
							PatientHub
						</span>
					</h1>
					<div className="max-w-md w-full text-card-foreground border p-6 shadow-2xl rounded-2xl mt-6 mb-24">
						<h2 className="text-2xl font-bold text-foreground mb-4 text-center">
							Connexion
						</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Champ Email */}
							<div>
								<label
									htmlFor="email"
									className="block text-m font-medium text-foreground"
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
									className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									aria-describedby="email-error"
								/>
							</div>
							{/* Champ Mot de Passe */}
							<div>
								<label
									htmlFor="password"
									className="block text-m font-medium text-foreground"
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
									className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									aria-describedby="password-error"
								/>
							</div>{" "}
							<input
								type="hidden"
								name="hiddenField"
								value={hiddenField}
							/>
							{/* Bouton de soumission */}
							<button
								type="submit"
								className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-md hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
									className="text-red-500 text-sm text-center"
									role="alert"
								>
									{error}
								</p>
							)}
							<p className="text-sm text-muted-foreground text-center">
								Entrez vos identifiants et mot de passe.
							</p>
							<p className="text-sm text-muted-foreground text-center">
								Vous n&apos;avez pas accès ?{" "}
								<a
									href={`mailto:afdevflo@gmail.com?subject=${encodeURIComponent(
										"Demande d'accès à PatientHub"
									)}&body=${encodeURIComponent(
										`Bonjour AFDEV,

Je suis [Nom complet ou société],

J'aimerais demander un accès à la plateforme PatientHub.

Voici quelques informations me concernant:

- Nom complet ou société : [Nom complet ou société]
- Email : [Votre adresse e-mail]
- Raison de la demande : [Expliquez brièvement pourquoi vous souhaitez accéder à la plateforme]

Je vous remercie d'avance pour votre aide.

Cordialement,
[Nom complet ou société]`
									)}`}
									className="text-sky-700 underline hover:text-sky-800"
								>
									Contactez l&apos;administrateur
								</a>{" "}
								pour plus d&apos;informations.
							</p>
						</form>
					</div>
					<Footer />
				</div>
			</div>
		</BackgroundBeamsWithCollision>
	);
}
