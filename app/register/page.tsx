"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Création du client Supabase en dehors du composant
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: "http://localhost:3000/success",
				},
			});

			if (error) {
				setError(error.message);
			} else {
				setSuccess(true);
			}
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
			<h2 className="text-2xl font-semibold text-center mb-4">
				Inscription
			</h2>

			{error && <p className="text-red-500 text-sm">{error}</p>}
			{success && (
				<p className="text-green-500 text-sm">
					Inscription réussie ! Vérifiez votre e-mail pour confirmer
					votre compte.
				</p>
			)}

			<form onSubmit={handleRegister} className="space-y-4">
				<div>
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-700"
					>
						Nom de votre cabinet:
					</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={loading}
						className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
					/>
				</div>

				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						Email:
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={loading}
						className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
					/>
				</div>

				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						Mot de passe:
					</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						autoComplete="current-password"
						placeholder="Votre mot de passe"
						className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={loading}
					/>
				</div>

				<Button type="submit" disabled={loading} className="w-full">
					{loading ? "Loading..." : "S'inscrire"}
				</Button>
			</form>

			<p className="mt-4 text-sm text-center">
				Déjà inscrit ?{" "}
				<Link href="/login" className="text-primary font-medium">
					Se connecter
				</Link>
			</p>
		</div>
	);
}
