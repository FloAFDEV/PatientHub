// Définition du type SearchParamProps
export type SearchParamProps = {
	params: { [key: string]: string }; // Paramètres de recherche avec des clés et des valeurs de type string
	searchParams: { [key: string]: string | string[] | undefined }; // Paramètres de recherche pouvant être une chaîne ou un tableau de chaînes
};

export interface PatientListProps {
	user?: LocalUser | null;
}

export interface Patient {
	id: number;
	name: string;
	email?: string;
	phone?: string;
	gender?: "Homme" | "Femme";
	birthDate?: string;
	isDeceased?: boolean;
}

// Définition de l'interface User
export interface LocalUser {
	email?: string; // Email de l'utilisateur (optionnel)
	user_metadata?: {
		first_name?: string; // Prénom de l'utilisateur (optionnel)
		last_name?: string; // Nom de l'utilisateur (optionnel)
	};
}

export interface Appointment {
	id: number;
	patientId?: number;
	date: string;
	time: string;
	reason: string;
	patientName: string;
}
