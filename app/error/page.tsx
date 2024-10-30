"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
	const searchParams = useSearchParams();
	const message = searchParams ? searchParams.get("message") : null;

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800 p-4">
			<h1 className="text-4xl font-bold text-red-600" aria-label="Erreur">
				Oups ! Erreur 404
			</h1>
			<p className="text-lg mt-2">
				Désolé, la page demandée n&apos;existe pas ou a été déplacée.
			</p>
			{message && (
				<p className="text-md text-red-600 font-semibold mt-2">
					Erreur : {decodeURIComponent(message)}
				</p>
			)}
			<p className="mt-4">
				<Link
					href="/login"
					className="text-blue-500 hover:underline font-semibold"
				>
					Retour à l&apos;accueil
				</Link>
			</p>
		</div>
	);
}

export default function ErrorPage() {
	return (
		<Suspense
			fallback={
				<div className="text-center text-lg text-gray-600">
					Chargement en cours...
				</div>
			}
		>
			<ErrorContent />
		</Suspense>
	);
}
