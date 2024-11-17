// Définition du type SearchParamProps
export type SearchParamProps = {
	params: { [key: string]: string }; // Paramètres de recherche avec des clés et des valeurs de type string
	searchParams: { [key: string]: string | string[] | undefined }; // Paramètres de recherche pouvant être une chaîne ou un tableau de chaînes
};

// Définition de l'interface Patient
export interface Patient {
	id: number; // Identifiant unique du patient
	name: string; // Nom du patient
	email?: string; // Email (optionnel)
	phone?: string; // Téléphone (optionnel)
	gender?: "Homme" | "Femme"; // Sexe du patient (optionnel)
	birthDate?: string; // Date de naissance du patient (optionnel)
	isDeceased?: boolean; // Indicateur si le patient est décédé (optionnel)
}

// Définition de l'interface User
export interface User {
	email?: string; // Email de l'utilisateur (optionnel)
	user_metadata?: {
		first_name?: string; // Prénom de l'utilisateur (optionnel)
		last_name?: string; // Nom de l'utilisateur (optionnel)
	};
}
