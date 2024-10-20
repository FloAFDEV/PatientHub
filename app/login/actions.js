"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Fonction pour vérifier si l'utilisateur actuel est un administrateur
async function isAdmin(supabase) {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();
	if (error || !user) return false;

	const { data, error: roleError } = await supabase
		.from("users")
		.select("role")
		.eq("id", user.id)
		.single();

	if (roleError || !data) return false;
	return data.role === "admin";
}

// Gestion des erreurs
function handleError(message) {
	redirect(`/error?message=${encodeURIComponent(message)}`);
}

// Redirection vers une page 404
function handleNotFound() {
	redirect("/404"); // Redirection vers la page 404
}

// Fonction de connexion
export async function login(formData) {
	const supabase = createClient();

	const email = formData.get("email");
	const password = formData.get("password");

	if (!email || !password) {
		handleError("Email et mot de passe sont requis");
		return;
	}

	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) throw new Error("Email ou mot de passe incorrect");

		if (data.session) {
			cookies().set("session", JSON.stringify(data.session), {
				httpOnly: true,
				secure: true, // Toujours utiliser HTTPS en production
				sameSite: "strict", // Ajout de la politique SameSite pour plus de sécurité
				maxAge: 60 * 60 * 24 * 7, // 1 semaine
				path: "/",
			});
		}

		revalidatePath("/"); // Invalide le cache pour la page d'accueil
		redirect("/dashboard");
	} catch (err) {
		console.error("Login error:", err); // Ajout de logs d'erreur
		handleError(err.message); // Utilisez err.message pour afficher l'erreur réelle
	}
}

// Fonction d'inscription pour les administrateurs
export async function adminAddUser(formData) {
	const supabase = createClient();

	if (!(await isAdmin(supabase))) {
		handleNotFound(); // Redirection vers 404 si l'utilisateur n'est pas admin
		return;
	}

	const email = formData.get("email");
	const password = formData.get("password");
	const role = formData.get("role");

	if (!email || !password || !role) {
		handleError("Tous les champs sont requis");
		return;
	}

	if (password.length < 12) {
		handleError("Le mot de passe doit contenir au moins 12 caractères");
		return;
	}

	try {
		const { data: userData, error: signUpError } =
			await supabase.auth.signUp({ email, password });

		if (signUpError)
			throw new Error(
				`Erreur lors de la création de l'utilisateur: ${signUpError.message}`
			);
		if (!userData.user)
			throw new Error(
				"Erreur inattendue lors de la création de l'utilisateur"
			);

		const { error: insertError } = await supabase
			.from("users")
			.insert({ id: userData.user.id, email, role });

		if (insertError) {
			await supabase.auth.admin.deleteUser(userData.user.id);
			throw new Error(
				`Erreur lors de l'ajout des informations de l'utilisateur: ${insertError.message}`
			);
		}

		revalidatePath("/"); // Invalide le cache pour la page d'accueil
		return { success: true, message: "Utilisateur ajouté avec succès" };
	} catch (err) {
		console.error("Admin Add User error:", err); // Ajout de logs d'erreur
		handleError(err.message); // Utilisez err.message pour afficher l'erreur réelle
	}
}

// Fonction de déconnexion
export async function logout() {
	const supabase = createClient();
	await supabase.auth.signOut();
	cookies().delete("session");
	revalidatePath("/");
	redirect("/login");
}
