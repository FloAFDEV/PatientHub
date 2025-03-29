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
		<div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
			{/* Header */}
			<header className="flex flex-col items-center py-6">
				<Link href="/" className="transition-transform hover:scale-110">
					<Image
						src="/assets/icons/logo-full.svg"
						alt="Logo"
						width={120}
						height={120}
						className="rounded-full shadow-xl dark:shadow-gray-700"
					/>
				</Link>
				<h1 className="mt-4 text-4xl font-extrabold text-blue-700 dark:text-blue-400">
					Bienvenue !
				</h1>
			</header>

			{/* Contenu principal */}
			<main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6 md:px-8">
				<section className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-10 max-w-lg w-full">
					<Image
						src="/assets/gifs/success.gif"
						width={200}
						height={200}
						alt="Success"
						className="rounded-lg shadow-lg"
						unoptimized
					/>
					<h2
						className="mt-6 text-2xl sm:text-3xl font-medium text-blue-600 dark:text-blue-300 text-center"
						style={{ whiteSpace: "pre-line" }}
					>
						{message}
					</h2>

					{/* Barre de progression */}
					<div className="w-full mt-8">
						<div className="relative w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
							<div
								className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-100"
								style={{ width: `${progress}%` }}
							/>
						</div>
						<div className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
							Téléchargement : {Math.round(progress)}%
						</div>
					</div>

					{/* Notification de redirection */}
					<p className="mt-6 text-base text-gray-800 dark:text-gray-300 text-center">
						Vous serez redirigé vers le tableau de bord dans{" "}
						<span className="font-bold">{secondsLeft}</span> seconde
						{secondsLeft > 1 ? "s" : ""}...
					</p>

					{/* Bouton de redirection immédiate */}
					<Link href="/dashboard" prefetch={false}>
						<button className="mt-8 px-6 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
							Accéder au tableau de bord
						</button>
					</Link>
				</section>
			</main>

			{/* Footer */}
			<footer className="py-4 bg-gray-200 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
				<p className="text-center text-sm font-light text-gray-600 dark:text-gray-400">
					© 2024 AFDEV. Tous droits réservés.
				</p>
			</footer>
		</div>
	);
}
