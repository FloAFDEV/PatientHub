// app/success/page.tsx
interface SuccessPageProps {
	searchParams: {
		message?: string;
	};
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
	const message = searchParams.message || "Opération réussie !";

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h1 className="text-2xl font-semibold text-green-600">{message}</h1>
			<p className="mt-4 text-gray-600">
				Vous pouvez maintenant vous connecter.
			</p>
			<a href="/" className="mt-6 text-indigo-600 hover:underline">
				Retour à la page d'accueil
			</a>
		</div>
	);
}
