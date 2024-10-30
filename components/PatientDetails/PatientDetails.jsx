// app/components/PatientDetails/PatientDetails.jsx

import React from "react";

const PatientDetails = ({ patient, onClose }) => {
	if (!patient) return null;

	// Fonction pour formatter le numéro de téléphone
	const formatPhoneNumber = (phone) => {
		return phone
			.replace(/\D/g, "")
			.replace(/(\d{2})(?=\d)/g, "$1 ")
			.trim();
	};

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

	return (
		<div className="p-4 w-full mx-auto">
			<button className="mb-4 text-red-500" onClick={onClose}>
				&times; Fermer
			</button>
			<div className="flex flex-col items-center mb-6">
				<img
					src={patient.avatarUrl}
					alt={`avatar de ${patient.name}`}
					className="w-24 h-24 mb-4 rounded-full border-2 border-gray-300"
				/>
				<h1 className="text-3xl font-bold">{patient.name}</h1>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				<p>
					<strong>Email:</strong>{" "}
					<a
						href={`mailto:${patient.email}`}
						className="hover:underline"
					>
						{patient.email}
					</a>
				</p>
				<p>
					<strong>Téléphone:</strong>{" "}
					<a
						href={`tel:${patient.phone.replace(/\D/g, "")}`}
						className="hover:underline"
					>
						{formatPhoneNumber(patient.phone)}
					</a>
				</p>
				<p>
					<strong>Date de Naissance:</strong>{" "}
					{new Date(patient.birthDate).toLocaleDateString("fr-FR")}{" "}
					{/* Format européen */}
				</p>
				<p>
					<strong>Genre:</strong> {patient.gender}
				</p>
				<p>
					<strong>Adresse:</strong>{" "}
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
				</p>
				<p>
					<strong>Statut Marital:</strong>{" "}
					{maritalStatusTranslations[patient.maritalStatus]}
				</p>
				<p>
					<strong>Méthode de contraception:</strong>{" "}
					{contraceptionTranslations[patient.contraception]}
				</p>
				<p>
					<strong>Traitements en cours:</strong>{" "}
					{patient.currentTreatment}
				</p>
				<p>
					<strong>Antécédents chirurgicaux:</strong>{" "}
					{patient.surgicalHistory}
				</p>
				<p>
					<strong>Antécédents traumatiques:</strong>{" "}
					{patient.traumaHistory}
				</p>
				<p>
					<strong>Antécédents rhumatologiques:</strong>{" "}
					{patient.rheumatologicalHistory}
				</p>
				<p>
					<strong>Nom du médecin traitant:</strong>{" "}
					{patient.generalPractitioner}
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
									{doc.description}
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
								: {consultation.notes}
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
