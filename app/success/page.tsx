"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
	const [progress, setProgress] = useState(0);
	const [secondsLeft, setSecondsLeft] = useState(3);
	const duration = 3000;
	const [isMounted, setIsMounted] = useState(true);

	useEffect(() => {
		setIsMounted(true);
		const startTime = Date.now();

		const interval = setInterval(() => {
			const elapsed = Date.now() - startTime;
			if (isMounted) {
				setProgress((elapsed / duration) * 100);
				setSecondsLeft(Math.ceil((duration - elapsed) / 1000));
			}

			if (elapsed >= duration) {
				clearInterval(interval);
				if (isMounted) {
					console.log("Redirection vers /dashboard...");
					router.push("/dashboard");
				}
			}
		}, 50);

		return () => {
			setIsMounted(false);
			clearInterval(interval);
		};
	}, [router, isMounted]);

	return (
		<div className="flex flex-col h-screen w-full items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-4 sm:px-6 md:px-8">
			{/* Logo avec lien vers l'accueil */}
			<Link
				href="/"
				className="mb-4 sm:mb-6 mt-8 sm:mt-16 transition-transform transform hover:scale-110"
			>
				<Image
					src="/assets/icons/logo-full.svg"
					height={120}
					width={120}
					alt="logo"
					className="rounded-full shadow-xl dark:shadow-gray-700"
				/>
			</Link>

			{/* Message de bienvenue */}
			<div className="text-center">
				<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-blue-400 mt-4 sm:mt-6">
					Bienvenue !
				</h1>
			</div>

			{/* Section de succès avec animation et message */}
			<section className="flex flex-col items-center text-center mt-8 sm:mt-10">
				<Image
					src="/assets/gifs/success.gif"
					width={200}
					height={200}
					alt="success"
					className="rounded-lg shadow-lg max-w-full h-auto"
					unoptimized
				/>
				<h2
					className="text-xl sm:text-2xl font-medium text-blue-600 dark:text-blue-300 mt-6 sm:mt-8"
					style={{ whiteSpace: "pre-line" }}
				>
					{message}
				</h2>
			</section>

			{/* Barre de progression */}
			<div className="w-full max-w-md mt-8 sm:mt-10">
				<div className="relative w-full bg-gray-300 rounded-full h-3 overflow-hidden shadow-inner">
					<div
						className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-[50ms]"
						style={{ width: `${progress}%` }}
					/>
				</div>
				{/* Affichage du pourcentage */}
				<div className="text-center text-sm mt-3 text-gray-600 dark:text-gray-400">
					Téléchargement : {Math.round(progress)}%
				</div>
			</div>

			{/* Notification de redirection */}
			<p className="mt-6 sm:mt-8 text-base sm:text-lg text-gray-800 dark:text-gray-300 text-center">
				Vous serez redirigé vers le tableau de bord dans{" "}
				<span className="font-bold">{secondsLeft}</span> secondes...
			</p>

			{/* Bouton pour aller directement au tableau de bord */}
			<Link href="/dashboard" prefetch={false}>
				<button className="mt-8 sm:mt-10 px-6 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg hover:bg-gradient-to-l hover:scale-[1.05] transition-transform duration-[300ms]">
					Tableau de bord immédiat
				</button>
			</Link>

			{/* Footer */}
			<footer className="w-screen mt-auto py-4 bg-gray-200 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
				<p className="text-center text-sm sm:text-base font-light text-gray-600 dark:text-gray-400">
					Copyright © 2024 AFDEV. Tous droits réservés.
				</p>
			</footer>
		</div>
	);
}
