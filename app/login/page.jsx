// app/login/page.tsx
import { login, signup } from "./action.ts";

export default function LoginPage({ searchParams }) {
	const isRegistering = searchParams.mode === "register"; // Vérifie si c'est le mode d'inscription

	return (
		<div className="max-w-md mx-auto bg-white p-6 shadow-md rounded-lg">
			{isRegistering ? (
				<form action={signup} className="space-y-4">
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
						S'inscrire
					</button>
					<p className="text-sm text-gray-600 text-center">
						Vous avez déjà un compte ?{" "}
						<a href="?mode=login" className="text-indigo-600">
							Se connecter
						</a>
					</p>
				</form>
			) : (
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
						Vous n'avez pas de compte ?{" "}
						<a href="?mode=register" className="text-indigo-600">
							S'inscrire
						</a>
					</p>
				</form>
			)}
		</div>
	);
}
