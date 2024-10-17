"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { ModeToggle } from "@/components/ModeToggle";

export default function LoginPage() {
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const honeypot = formData.get("honeypot") as string;

		if (honeypot) {
			setError("Formulaire invalide.");
			return;
		}

		const result = await signIn("credentials", {
			redirect: false,
			email,
			password,
		});

		if (result?.error) {
			setError("Identifiants invalides. Veuillez réessayer.");
			console.error("Erreur de connexion:", result.error);
		} else {
			router.push("/dashboard");
		}
	};

	return (
		<div className="flex flex-col lg:flex-row h-screen max-h-screen bg-background text-foreground">
			<div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-r from-sky-800 to-muted dark:from-sky-900 dark:to-muted-foreground relative">
				<div className="absolute top-4 right-4 z-10">
					<ModeToggle />
				</div>
				<div className="w-full max-w-lg lg:max-w-2xl mt-24">
					<Image
						src="/assets/images/welcome.webp"
						alt="Welcome"
						width={800}
						height={400}
						sizes="(max-width: 768px) 100vw, (max-width: 600px) 50vw, 33vw"
						className="w-full h-auto"
						priority
					/>
				</div>
				<p className="text-lg lg:text-3xl font-medium text-foreground mb-4 text-center">
					Bienvenue sur
				</p>
				<h1 className="text-6xl lg:text-6xl font-extra-bold text-foreground mb-6 text-center">
					PatientHub
				</h1>
				<div className="max-w-md w-full text-card-foreground p-6 shadow-2xl rounded-2xl mt-10">
					<h2 className="text-2xl font-bold text-foreground mb-4 text-center">
						Connexion
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
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
							/>
						</div>
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
							/>
						</div>
						<input type="hidden" name="honeypot" value="" />
						<button
							type="submit"
							className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
						>
							Se connecter
						</button>
						{error && (
							<p className="text-red-500 text-sm text-center">
								{error} {/* Affichage du message d'erreur */}
							</p>
						)}
						<p className="text-sm text-muted-foreground text-center">
							Entrez vos identifiants et mot de passe.
						</p>
						<p className="text-sm text-muted-foreground text-center">
							Vous n&apos;avez pas accès ?{" "}
							<a
								href="mailto:afdevflo@gmail.com?subject=Demande%20d'accès%20à%20PatientHub&body=Bonjour%20[Nom%20complet%20ou%20société],%0A%0AJ'aimerais%20demander%20un%20acc%C3%A8s%20%C3%A0%20la%20plateforme.%0A%0AVoici%20quelques%20informations%20:%0A%0A-%20Nom%20complet%20ou%20société%20:%20[Nom%20complet%20ou%20société]%0A- %20Email%20:%20[Votre%20adresse%20e-mail]%0A- %20Raison%20de%20la%20demande%20:%20[Expliquez%20bri%C3%A8vement%20pourquoi%20vous%20souhaitez%20acc%C3%A9der%20%C3%A0%20la%20plateforme]%0A%0AJe%20vous%20remercie%20d'avance%20pour%20votre%20aide.%0A%0AMerci%20pour%20l'intérêt%20porté.%0A%0ACordialement,%0AAFDEV"
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
			<div className="hidden lg:block lg:w-1/2 relative">
				<Image
					src="/assets/images/welcome-img.png"
					alt="Image de connexion Welcome"
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					className="object-cover"
				/>
			</div>
		</div>
	);
}
