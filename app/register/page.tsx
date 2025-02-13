"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LucideShieldCheck } from "lucide-react";

function App() {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [hiddenField] = useState(""); // Champ caché pour le spam

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
		if (password !== confirmPassword) {
			setError("Les mots de passe ne correspondent pas.");
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
			// Simulation d'une requête d'inscription
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log("Inscription réussie");
			// Ici, vous ajouteriez la logique d'inscription avec Supabase
		} catch (error) {
			setError("Une erreur est survenue. Veuillez réessayer plus tard.");
			console.error("Erreur inattendue:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex h-screen max-h-screen flex-col lg:flex-row">
			<div className="flex-grow bg-gradient-to-br from-blue-50 via-white to-pink-50">
				<div className="flex-grow flex flex-col justify-between min-h-screen px-4">
					<div className="flex-1 flex flex-col items-center justify-center p-4">
						<div className="absolute top-4 left-4 flex items-center space-x-2">
							<LucideShieldCheck className="w-8 h-8 text-blue-500" />
							<span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
								PatientHub
							</span>
						</div>

						<div className="mx-auto max-w-md w-full px-4 sm:px-6 lg:max-w-2xl lg:px-8 lg:py-16 mt-20 lg:mt-28">
							<div className="text-center">
								<h1 className="text-3xl sm:text-lg md:text-4xl lg:text-4xl font-bold tracking-tight mt-6">
									Rejoignez la communauté des ostéopathes
								</h1>
								<p className="mt-4 text-base leading-7 sm:mt-2 sm:text-xl lg:mt-2">
									Créez votre compte pour commencer à gérer
									vos patients efficacement.
								</p>
							</div>
						</div>

						<div className="w-full max-w-md text-card-foreground border p-8 shadow-lg rounded-lg mt-4 mb-12 sm:mb-24 lg:mb-6 bg-white">
							<h2 className="text-lg font-bold text-center mb-6">
								Inscription
							</h2>
							<form onSubmit={handleSubmit} className="space-y-4">
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
										placeholder="Votre email professionnel"
										className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
									/>
								</div>

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
										autoComplete="new-password"
										placeholder="Créez votre mot de passe"
										className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
									/>
								</div>

								<div>
									<label
										htmlFor="confirmPassword"
										className="block text-sm font-medium"
									>
										Confirmer le mot de passe :
									</label>
									<input
										id="confirmPassword"
										name="confirmPassword"
										type="password"
										required
										autoComplete="new-password"
										placeholder="Confirmez votre mot de passe"
										className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
										value={confirmPassword}
										onChange={(e) =>
											setConfirmPassword(e.target.value)
										}
									/>
								</div>

								<input
									type="hidden"
									name="hiddenField"
									value={hiddenField}
								/>

								<button
									type="submit"
									className={`w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2 rounded-md hover:scale-105 transition-transform duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
										isLoading ? "opacity-50" : ""
									}`}
									disabled={isLoading}
								>
									{isLoading
										? "Inscription en cours..."
										: "S'inscrire"}
								</button>

								{error && (
									<p
										className="text-red-500 text-xs text-center"
										role="alert"
									>
										{error}
									</p>
								)}

								<p className="text-sm text-gray-600 text-center">
									Déjà inscrit ?{" "}
									<a
										href="/login"
										className="text-sky-700 underline hover:text-sky-800"
									>
										Connectez-vous
									</a>
								</p>
							</form>
						</div>

						<div className="hidden md:block mt-4 text-center text-gray-600 px-4">
							<p className="text-base leading-tight">
								Accédez à des outils professionnels pour la
								gestion de vos patients.
							</p>
							<p className="text-base leading-tight">
								Sécurité et confidentialité garanties.
							</p>
						</div>
					</div>

					<div className="mt-auto py-4">
						<p className="text-gray-600 text-sm md:text-base font-light text-center">
							© 2024 AFDEV. Tous droits réservés.
						</p>
					</div>
				</div>
			</div>

			<div className="hidden lg:block w-1/2">
				<Image
					src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
					alt="Medical professional at work"
					layout="fill"
					objectFit="cover"
				/>
			</div>
		</div>
	);
}

export default App;
