import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image"; // Assurez-vous d'avoir ceci si vous utilisez Next.js

const PatientDetails = ({ patient, onClose }) => {
	const [error, setError] = useState(null);
	const [openSections, setOpenSections] = useState({
		basicInfo: true,
		medicalProblems: false,
		medicalDocuments: false,
		consultations: false,
	});

	// Fonction pour formater les numéros de téléphone
	const formatPhoneNumber = (phone) => {
		if (!phone) return ""; // Gestion des numéros null
		return phone
			.replace(/\D/g, "")
			.replace(/(\d{2})(?=\d)/g, "$1 ")
			.trim();
	};

	// Valider les données du patient
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

	const toggleSection = (section) => {
		setOpenSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
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

	const handednessTranslations = {
		LEFT: "Gaucher",
		RIGHT: "Droitier",
		AMBIDEXTROUS: "Ambidextre",
	};

	const yesNoTranslations = {
		YES: "Oui",
		NO: "Non",
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
		<div className="p-4 w-full min-h-screen mx-auto dark:text-gray-300">
			<button className="mb-4 text-red-500" onClick={onClose}>
				&times; Fermer
			</button>
			<div className="flex flex-col items-center mb-6">
				<Image
					src={
						patient.avatarUrl ||
						"/assets/images/default-avatar.webp"
					}
					alt={`Avatar de ${patient.name || "inconnu"}`}
					className="w-28 h-28 mb-4 rounded-lg border-2 border-gray-300"
					width={112}
					height={112}
				/>
				<h1 className="text-3xl font-bold text-center">
					{patient.name || "Nom inconnu"}
				</h1>
			</div>
			{/* Basic Information Section */}
			<div className="mb-4">
				<button
					className="flex justify-between items-center w-full bg-gray-700 p-2 rounded-md hover:bg-gray-600 focus:outline-none text-gray-200"
					onClick={() => toggleSection("basicInfo")}
				>
					<span className="font-semibold">Informations de base</span>
					<span>{openSections.basicInfo ? "−" : "+"}</span>
				</button>
				{openSections.basicInfo && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
						<p>
							<strong>Email:</strong>{" "}
							<a
								href={`mailto:${patient.email || ""}`}
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
										? `tel:${patient.phone.replace(
												/\D/g,
												""
										  )}`
										: "#"
								}
								className="hover:underline"
							>
								{formatPhoneNumber(patient.phone) ||
									"Téléphone non disponible"}
							</a>
						</p>
						<p>
							<strong>Date de Naissance:</strong>{" "}
							{patient.birthDate
								? new Date(
										patient.birthDate
								  ).toLocaleDateString("fr-FR")
								: "Inconnu"}
						</p>
						<p>
							<strong>Genre:</strong>{" "}
							{patient.gender || "Inconnu"}
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
							<strong>Métier:</strong>{" "}
							{patient.occupation || "Inconnu"}
						</p>
						<p>
							<strong>Latéralité:</strong>{" "}
							{handednessTranslations[patient.handedness] ||
								"Inconnu"}
						</p>
						<p>
							<strong>Méthode de Contraception:</strong>{" "}
							{contraceptionTranslations[patient.contraception] ||
								"Inconnu"}
						</p>
						<p>
							<strong>Le patient a-t-il des enfants ?</strong>{" "}
							{yesNoTranslations[patient.hasChildren] ||
								"Inconnu"}
						</p>
						<p>
							<strong>Nom du médecin traitant:</strong>{" "}
							{patient.generalPractitioner || "Inconnu"}
						</p>
						<p>
							<strong>Fumeur ?</strong>{" "}
							{yesNoTranslations[patient.isSmoker] || "Inconnu"}
						</p>
						<p>
							<strong>Correction Visuelle ?</strong>{" "}
							{yesNoTranslations[patient.hasVisionCorrection] ||
								"Inconnu"}
						</p>
						<p>
							<strong>Le patient est-il décédé ?</strong>{" "}
							{yesNoTranslations[patient.isDeceased] || "Inconnu"}
						</p>
					</div>
				)}
			</div>
			{/* Medical Problems Section */}
			<div className="mb-4">
				<button
					className="flex justify-between items-center w-full bg-gray-700 p-2 rounded-md hover:bg-gray-600 focus:outline-none text-gray-200"
					onClick={() => toggleSection("medicalProblems")}
				>
					<span className="font-semibold">Problèmes médicaux</span>
					<span>{openSections.medicalProblems ? "−" : "+"}</span>
				</button>
				{openSections.medicalProblems && (
					<div className="p-4">
						<p>
							<strong>Problèmes ORL:</strong>{" "}
							{patient.entProblems || "Aucun"}
						</p>
						<p>
							<strong>Nom du Médecin ORL:</strong>{" "}
							{patient.entDoctorName || "Inconnu"}
						</p>
						<p>
							<strong>Problèmes Digestifs:</strong>{" "}
							{patient.digestiveProblems || "Aucun"}
						</p>
						<p>
							<strong>Traitement Actuel:</strong>{" "}
							{patient.currentTreatment || "Aucun"}
						</p>
						<p>
							<strong>Antécédents Chirurgicaux:</strong>{" "}
							{patient.surgicalHistory || "Aucun"}
						</p>
						<p>
							<strong>Antécédents Traumatiques:</strong>{" "}
							{patient.traumaHistory || "Aucun"}
						</p>
						<p>
							<strong>Antécédents Rhumatologiques:</strong>{" "}
							{patient.rheumatologicalHistory || "Aucun"}
						</p>
						<p>
							<strong>Informations HDLM:</strong>{" "}
							{patient.hdlm || "Aucune"}
						</p>
					</div>
				)}
			</div>
			{/* Medical Documents Section */}
			<div className="mb-4">
				<button
					className="flex justify-between items-center w-full bg-gray-700 p-2 rounded-md hover:bg-gray-600 focus:outline-none text-gray-200"
					onClick={() => toggleSection("medicalDocuments")}
				>
					<span className="font-semibold">Documents médicaux</span>
					<span>{openSections.medicalDocuments ? "−" : "+"}</span>
				</button>
				{openSections.medicalDocuments && (
					<div className="p-4">
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
				)}
			</div>
			{/* Consultations Section */}
			<div>
				<button
					className="flex justify-between items-center w-full bg-gray-700 p-2 rounded-md hover:bg-gray-600 focus:outline-none text-gray-200"
					onClick={() => toggleSection("consultations")}
				>
					<span className="font-semibold">
						Historique des consultations
					</span>
					<span>{openSections.consultations ? "-" : "+"}</span>
				</button>
				{openSections.consultations && (
					<div className="p-4">
						<ul className="list-disc list-inside">
							{patient.consultations &&
							patient.consultations.length > 0 ? (
								patient.consultations.map((consultation) => (
									<li key={consultation.id}>
										{new Date(
											consultation.date
										).toLocaleDateString("fr-FR")}
										: {consultation.notes || "Pas de notes"}
									</li>
								))
							) : (
								<li>Aucune consultation disponible.</li>
							)}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default PatientDetails;
