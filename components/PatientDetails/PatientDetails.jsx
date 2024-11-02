import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image"; // Ensure you have this if using Next.js

const PatientDetails = ({ patient, onClose }) => {
	const [error, setError] = useState(null);

	// Fonction pour formatter le numéro de téléphone
	const formatPhoneNumber = (phone) => {
		if (!phone) return ""; // Gestion des numéros nuls
		return phone
			.replace(/\D/g, "")
			.replace(/(\d{2})(?=\d)/g, "$1 ")
			.trim();
	};

	// Vérifier si le patient a toutes les propriétés nécessaires
	const validatePatientData = useCallback(() => {
		if (!patient) {
			setError("Aucune donnée patient disponible.");
			return false;
		}
		setError(null);
		return true;
	}, [patient]);

	useEffect(() => {
		// Validation initiale des données du patient
		validatePatientData();
	}, [patient, validatePatientData]);

	const maritalStatusTranslations = {
		SINGLE: "Célibataire",
		MARRIED: "Marié(e)",
		DIVORCED: "Divorcé(e)",
		WIDOWED: "Veuf/veuve",
		SEPARATED: "Séparé(e)",
	};

	const contraceptionTranslations = {
		NONE: "Aucun",
		PILLS: "Pilule",
		CONDOM: "Préservatifs",
		IMPLANTS: "Implants",
	};

	if (error) {
		return (
			<div className="p-4 w-full mx-auto">
				<button className="mb-4 text-red-500" onClick={onClose}>
					&times; Fermer
				</button>
				<div className="text-red-500">
					<strong>Erreur:</strong> {error}
				</div>
			</div>
		);
	}

	return (
		<div className="p-4 w-full mx-auto dark:text-gray-300">
			<button className="mb-4 text-red-500" onClick={onClose}>
				&times; Fermer
			</button>
			<div className="flex flex-col items-center mb-6">
				<Image
					src={patient.avatarUrl || "default-avatar.png"} // Image par défaut
					alt={`Avatar de ${patient.name || "inconnu"}`} // Gérer les noms inconnus
					className="w-28 h-28 mb-4 rounded-lg border-2 border-gray-300"
					width={112} // Provide a width for Next.js <Image />
					height={112} // Provide a height for Next.js <Image />
				/>
				<h1 className="text-3xl font-bold">
					{patient.name || "Nom inconnu"}
				</h1>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				<p>
					<strong>Email:</strong>{" "}
					<a
						href={`mailto:${patient.email || ""}`} // Gérer email manquant
						className="hover:underline"
					>
						{patient.email || "Email non disponible"}
					</a>
				</p>
				<p>
					<strong>Téléphone:</strong>{" "}
					<a
						href={
							patient.phone
								? `tel:${patient.phone.replace(/\D/g, "")}`
								: "#"
						} // Gérer téléphone manquant
						className="hover:underline"
					>
						{formatPhoneNumber(patient.phone) ||
							"Téléphone non disponible"}
					</a>
				</p>
				<p>
					<strong>Date de Naissance:</strong>{" "}
					{patient.birthDate
						? new Date(patient.birthDate).toLocaleDateString(
								"fr-FR"
						  )
						: "Inconnu"}
				</p>
				<p>
					<strong>Genre:</strong> {patient.gender || "Inconnu"}
				</p>
				<p>
					<strong>Adresse:</strong>{" "}
					{patient.address ? (
						<a
							href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
								patient.address
							)}`}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline"
						>
							{patient.address}
						</a>
					) : (
						"Inconnue"
					)}
				</p>
				<p>
					<strong>Statut Marital:</strong>{" "}
					{maritalStatusTranslations[patient.maritalStatus] ||
						"Inconnu"}
				</p>
				<p>
					<strong>Méthode de contraception:</strong>{" "}
					{contraceptionTranslations[patient.contraception] ||
						"Inconnue"}
				</p>
				<p>
					<strong>Traitements en cours:</strong>{" "}
					{patient.currentTreatment || "Aucun"}
				</p>
				<p>
					<strong>Antécédents chirurgicaux:</strong>{" "}
					{patient.surgicalHistory || "Aucun"}
				</p>
				<p>
					<strong>Antécédents traumatiques:</strong>{" "}
					{patient.traumaHistory || "Aucun"}
				</p>
				<p>
					<strong>Antécédents rhumatologiques:</strong>{" "}
					{patient.rheumatologicalHistory || "Aucun"}
				</p>
				<p>
					<strong>Nom du médecin traitant:</strong>{" "}
					{patient.generalPractitioner || "Inconnu"}
				</p>
			</div>
			<div className="mb-6">
				<h2 className="text-xl font-semibold mb-2">
					Documents médicaux:
				</h2>
				<ul className="list-disc list-inside">
					{patient.medicalDocuments &&
					patient.medicalDocuments.length > 0 ? (
						patient.medicalDocuments.map((doc) => (
							<li key={doc.id}>
								<a
									href={doc.url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500 hover:underline"
								>
									{doc.description ||
										"Document sans description"}
								</a>
							</li>
						))
					) : (
						<li>Aucun document médical disponible.</li>
					)}
				</ul>
			</div>
			<div>
				<h2 className="text-xl font-semibold mb-2">
					Historique des consultations:
				</h2>
				<ul className="list-disc list-inside">
					{patient.consultations &&
					patient.consultations.length > 0 ? (
						patient.consultations.map((consultation) => (
							<li key={consultation.id}>
								{new Date(consultation.date).toLocaleDateString(
									"fr-FR"
								)}
								: {consultation.notes || "Pas de notes"}
							</li>
						))
					) : (
						<li>Aucune consultation disponible.</li>
					)}
				</ul>
			</div>
		</div>
	);
};

export default PatientDetails;
