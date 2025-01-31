"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

interface SuccessPageProps {
	searchParams: {
		message?: string;
	};
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
	const message = searchParams.message || "Opération réussie !";
	const router = useRouter();
	const [progress, setProgress] = useState(0); // Progression de la barre
	const [secondsLeft, setSecondsLeft] = useState(3); // Compteur de secondes
	const duration = 3000; // Durée de 3 secondes

	useEffect(() => {
		const startTime = Date.now(); // Initialisation du départ du timer
		const interval = setInterval(() => {
			const elapsed = Date.now() - startTime;
			const newProgress = (elapsed / duration) * 100;
			setProgress(newProgress);

			// Calculer le temps restant
			setSecondsLeft(Math.ceil((duration - elapsed) / 1000));

			// Si la durée est écoulée, rediriger
			if (elapsed >= duration) {
				clearInterval(interval);
				router.push("/dashboard"); // Rediriger après 3 secondes
			}
		}, 50); // Mise à jour toutes les 50ms

		// Nettoyage du timer
		return () => clearInterval(interval);
	}, [router]);

	return (
		<div className="flex h-screen max-h-screen px-4 sm:px-6 md:px-8 bg-gray-50 dark:bg-gray-900 w-full flex-col items-center justify-center">
			{/* Logo avec lien vers l'accueil */}
			<Link href="/">
				<Image
					src="/assets/icons/logo-full.svg"
					height={120}
					width={120}
					alt="logo"
					className="mb-2 sm:mb-6 mt-8 sm:mt-16 rounded-3xl shadow-lg dark:shadow-gray-700 transition-all duration-300 transform hover:scale-105"
				/>
			</Link>

			{/* Message de bienvenue */}
			<div className="text-center">
				<h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-blue-600 dark:text-blue-400 mt-4 sm:mt-6">
					Bienvenue !
				</h1>
			</div>

			{/* Section de succès avec animation et message */}
			<section className="flex flex-col items-center text-center mt-6 sm:mt-8">
				<Image
					src="/assets/gifs/success.gif"
					width={180}
					height={180}
					alt="success"
					sizes="(max-width: 768px) 80vw, (max-width: 500px) 50vw, 33vw"
					className="max-w-44 h-auto"
					unoptimized
				/>
				<h2
					className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 mt-4 sm:mt-6"
					style={{ whiteSpace: "pre-line" }}
				>
					{message}
				</h2>
			</section>

			{/* Barre de progression */}
			<div className="w-full mt-4 sm:mt-6">
				<div className="w-full bg-gray-300 rounded-full h-2.5">
					<div
						className="bg-blue-600 h-2.5 rounded-full"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			{/* Notification de redirection */}
			<p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-700 dark:text-gray-300 px-4 sm:px-8 text-center">
				Redirection automatique vers le tableau de bord dans{" "}
				{secondsLeft} secondes...
			</p>

			{/* Bouton pour aller directement au tableau de bord */}
			<Link href="/dashboard" className="mt-6 sm:mt-8">
				<button className="px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg bg-blue-600 text-white shadow-md rounded-md hover:bg-blue-800 transition duration-300 transform hover:scale-105">
					Accéder immédiatement au tableau de bord
				</button>
			</Link>

			{/* Footer */}
			<div className="w-screen mt-auto">
				<Footer />
			</div>
		</div>
	);
}
