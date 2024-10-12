import { login } from "./action.ts";
import Image from "next/image";

export default function LoginPage({ searchParams }) {
	const isRegistering = searchParams.mode === "register";

	return (
		<div className="flex flex-col lg:flex-row h-screen max-h-screen bg-gray-100">
			{/* Section gauche avec nom du site, image et formulaire */}
			<div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-r from-sky-800 to-gray-300">
				{/* Ajout de l'image Welcome agrandie et responsive */}
				<div className="w-full max-w-lg lg:max-w-2xl mt-24">
					<Image
						src="/assets/images/welcome.webp"
						alt="Welcome"
						width={800}
						height={200}
						layout="responsive"
					/>
				</div>
				{/* Texte de bienvenue responsive */}
				<p className="text-lg lg:text-2xl font-medium text-white mb-4 text-center">
					Bienvenue sur{" "}
				</p>
				{/* Titre du site responsive */}
				<h1 className="text-6xl lg:text-7xl font-extra-bold text-white mb-6 text-center">
					PatientHub
				</h1>
				{/* Formulaire de connexion */}
				<div className="max-w-md w-full bg-white p-6 shadow-xl rounded-lg mt-10">
					<h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
						Connexion
					</h2>
					<form action={login} className="space-y-4">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email :
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								placeholder="Votre email"
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Mot de passe :
							</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								placeholder="Votre mot de passe"
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Se connecter
						</button>
						<p className="text-sm text-gray-600 text-center">
							Entrez vos identifiants et mot de passe.
						</p>
						<p className="text-sm text-gray-600 text-center">
							Vous n'avez pas accès ?{" "}
							<a
								href="mailto:afdevflo@gmail.com?subject=Demande%20d'accès%20à%20PatientHub&body=Bonjour%20[Nom%20complet%20ou%20société],%0A%0AJ'aimerais%20demander%20un%20acc%C3%A8s%20%C3%A0%20la%20plateforme.%0A%0AVoici%20quelques%20informations%20:%0A%0A-%20Nom%20complet%20ou%20société%20:%20[Nom%20complet%20ou%20société]%0A- %20Email%20:%20[Votre%20adresse%20e-mail]%0A- %20Raison%20de%20la%20demande%20:%20[Expliquez%20bri%C3%A8vement%20pourquoi%20vous%20souhaitez%20acc%C3%A9der%20%C3%A0%20la%20plateforme]%0A%0AJe%20vous%20remercie%20d'avance%20pour%20votre%20aide.%0A%0AMerci%20pour%20l'intérêt%20porté.%0A%0ACordialement,%0AAFDEV"
								className="text-indigo-600 underline hover:text-indigo-800"
							>
								Contactez l'administrateur
							</a>{" "}
							pour plus d'informations.
						</p>
					</form>
				</div>
				{/* Section pour les droits réservés */}
				<footer className="mt-auto mb-4">
					<p className="text-slate-900 text-sm md:text-base mt-4">
						© 2024 AFDEV. Tous droits réservés.
					</p>
				</footer>
			</div>

			{/* Image côté droit */}
			<div className="hidden lg:block lg:w-1/2 relative">
				<Image
					src="/assets/images/welcome-img.png"
					alt="Image de connexion Welcome"
					layout="fill"
					objectFit="cover"
					className="h-full w-full object-cover"
				/>
			</div>
		</div>
	);
}
