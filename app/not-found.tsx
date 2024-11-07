// app/not-found.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

function ErrorContent() {
	const searchParams = useSearchParams();
	const message = searchParams ? searchParams.get("message") : null;

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-gray-200 p-6">
			{/* Image humoristique 404 */}
			<div className="w-full h-1/2 flex items-center justify-center">
				<Image
					src="/assets/images/funny-404-image.png"
					alt="404 error illustration"
					className="max-h-full object-contain"
					height={700}
					width={700}
					unoptimized
				/>
			</div>

			{/* Contenu de l'erreur */}
			<div className="text-center mt-4">
				<h1
					className="text-5xl font-bold text-yellow-500 mb-2"
					aria-label="Erreur"
				>
					Oups ! Erreur 404
				</h1>
				<p className="text-lg text-gray-300 mb-2">
					Désolé, la page que vous cherchez n&apos;existe pas ou a été
					déplacée.
				</p>
				{message && (
					<p className="text-md text-red-500 font-semibold mb-4">
						Erreur : {decodeURIComponent(message)}
					</p>
				)}
				<p className="text-base text-gray-400">
					Pas de panique, vous pouvez toujours retourner à la page
					d'accueil !
				</p>
				<Link
					href="/"
					className="inline-block mt-6 px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
				>
					Retour à l&apos;accueil
				</Link>
			</div>
		</div>
	);
}

export default function NotFound() {
	return (
		<Suspense
			fallback={
				<div className="text-center text-lg text-gray-400">
					Chargement en cours...
				</div>
			}
		>
			<ErrorContent />
		</Suspense>
	);
}
