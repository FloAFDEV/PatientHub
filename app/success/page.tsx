"use client";

import { useEffect } from "react";
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

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push("/dashboard");
		}, 3000); // Redirection après 3 secondes

		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="flex h-screen max-h-screen px-4 sm:px-6 md:px-8 bg-gray-50 dark:bg-gray-900 w-full flex-col items-center justify-center">
			{/* Logo avec lien vers l'accueil */}
			<Link href="/">
				<Image
					src="/assets/icons/logo-full.svg"
					height={180}
					width={180}
					alt="logo"
					className="mb-6 sm:mb-4 mt-12 sm:mt-20 rounded-3xl shadow-lg dark:shadow-gray-700 transition-all duration-300 transform hover:scale-105"
				/>
			</Link>

			{/* Message de bienvenue */}
			<div className="text-center">
				<h1 className="text-3xl sm:text-4xl font-semibold text-blue-600 dark:text-blue-400 mt-4 sm:mt-6">
					Bienvenue !
				</h1>
			</div>

			{/* Section de succès avec animation et message */}
			<section className="flex flex-col items-center text-center mt-8 sm:mt-12">
				<Image
					src="/assets/gifs/success.gif"
					width={250}
					height={250}
					alt="success"
					sizes="(max-width: 768px) 80vw, (max-width: 500px) 50vw, 33vw"
					className="max-w-full h-auto"
					unoptimized
				/>
				<h2
					className="text-xl sm:text-xl font-semibold text-blue-600 dark:text-blue-400 mt-4 sm:mt-6"
					style={{ whiteSpace: "pre-line" }}
				>
					{message}
				</h2>
			</section>

			{/* Notification de redirection */}
			<p className="mt-6 text-lg sm:text-xl text-gray-700 dark:text-gray-300">
				Redirection automatique vers le tableau de bord dans 3
				secondes...
			</p>

			{/* Bouton pour aller directement au tableau de bord */}
			<Link href="/dashboard" className="mt-6 sm:mt-8">
				<button className="px-6 m-4 py-3 text-lg sm:text-xl bg-blue-600 text-white shadow-md rounded-md hover:bg-blue-800 transition duration-300 transform hover:scale-105">
					Accéder immédiatement au tableau de bord
				</button>
			</Link>

			{/* Footer */}
			<Footer />
		</div>
	);
}
