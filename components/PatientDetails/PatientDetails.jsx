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
		true: "Oui",
		false: "Non",
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
		<div className="p-4 w-full h-screen mx-auto dark:text-gray-300 overflow-y-auto">
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
					className="w-28 h-28 mb-4 rounded-lg border-2 border-slate-950 shadow-md shadow-gray-400"
					width={112}
					height={112}
				/>
				<h1 className="text-2xl md:text-3xl font-bold text-center">
					{patient.name || "Nom inconnu"}
				</h1>
			</div>
			{/* Basic Information Section */}
			<div className="mb-4">
				<button
					className="flex justify-between items-center w-full bg-gray-700 p-2 rounded-md hover:bg-gray-600 focus:outline-none text-gray-200"
					onClick={() => toggleSection("basicInfo")}
				>
					<span className="font-semibold text-sm md:text-base">
						Informations de base
					</span>
					<span>{openSections.basicInfo ? "−" : "+"}</span>
				</button>
				{openSections.basicInfo && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
						<p className="text-sm md:text-base">
							<strong>Email:</strong>{" "}
							<a
								href={`mailto:${patient.email || ""}`}
								className="hover:underline"
							>
								{patient.email || "Email non disponible"}
							</a>
						</p>
						<p className="text-sm md:text-base">
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
						<p className="text-sm md:text-base">
							<strong>Date de Naissance:</strong>{" "}
							{patient.birthDate
								? new Date(
										patient.birthDate
								  ).toLocaleDateString("fr-FR")
								: "Inconnu"}
						</p>
						<p className="text-sm md:text-base">
							<strong>Genre:</strong>{" "}
							{patient.gender || "Non renseigné"}
						</p>
						<p className="text-sm md:text-base">
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
						<p className="text-sm md:text-base">
							<strong>Statut Marital:</strong>{" "}
							{maritalStatusTranslations[patient.maritalStatus] ||
								"Non renseigné"}
						</p>
						<p className="text-sm md:text-base">
							<strong>Métier:</strong>{" "}
							{patient.occupation || "Non renseigné"}
						</p>
						<p className="text-sm md:text-base">
							<strong>Latéralité:</strong>{" "}
							{handednessTranslations[patient.handedness] ||
								"Non renseigné"}
						</p>
						<p className="text-sm md:text-base">
							<strong>Méthode de Contraception:</strong>{" "}
							{contraceptionTranslations[patient.contraception] ||
								"Non renseigné"}
						</p>
						<p className="text-sm md:text-base">
							<strong>Le patient a-t-il des enfants ?</strong>{" "}
							{yesNoTranslations[patient.hasChildren] ||
								"Non renseigné"}
						</p>
						<p className="text-sm md:text-base">
							<strong>Nom du médecin traitant:</strong>{" "}
							{patient.generalPractitioner || "Non renseigné"}
						</p>
						<p className="text-sm md:text-base">
							<strong>Fumeur ?</strong>{" "}
							{yesNoTranslations[patient.isSmoker] ||
								"Non renseigné"}
						</p>
						<p className="text-sm md:text-base">
							<strong>Correction Visuelle ?</strong>{" "}
							{yesNoTranslations[patient.hasVisionCorrection] ||
								"Non renseigné"}
						</p>
						<p className="text-sm md:text-base">
							<strong>Le patient est-il décédé ?</strong>{" "}
							{yesNoTranslations[patient.isDeceased] ||
								"Non spécifié"}
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
					<span className="font-semibold text-sm md:text-base">
						Problèmes médicaux
					</span>
					<span>{openSections.medicalProblems ? "−" : "+"}</span>
				</button>
				{openSections.medicalProblems && (
					<div className="p-4">
						<p className="text-sm md:text-base">
							<strong>Problèmes ORL:</strong>{" "}
							{patient.entProblems || "Aucun"}
						</p>
						<p className="text-sm md:text-base">
							<strong>Nom du Médecin ORL:</strong>{" "}
							{patient.entDoctorName || "Non renseigné"}
						</p>
						<p className="text-sm md:text-base">
							<strong>Problèmes Digestifs:</strong>{" "}
							{patient.digestiveProblems || "Aucun"}
						</p>
						<p className="text-sm md:text-base">
							<strong>Traitement Actuel:</strong>{" "}
							{patient.currentTreatment || "Aucun"}
						</p>
						<p className="text-sm md:text-base">
							<strong>Antécédents Chirurgicaux:</strong>{" "}
							{patient.surgicalHistory || "Aucun"}
						</p>
						<p className="text-sm md:text-base">
							<strong>Antécédents Traumatiques:</strong>{" "}
							{patient.traumaHistory || "Aucun"}
						</p>
						<p className="text-sm md:text-base">
							<strong>Antécédents Rhumatologiques:</strong>{" "}
							{patient.rheumatologicalHistory || "Aucun"}
						</p>
						<p className="text-sm md:text-base">
							<strong>Informations HDLM:</strong>{" "}
							{patient.hdlm || "Non renseigné"}
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
					<span className="font-semibold text-sm md:text-base">
						Documents médicaux
					</span>
					<span>{openSections.medicalDocuments ? "−" : "+"}</span>
				</button>
				{openSections.medicalDocuments && (
					<div className="p-4">
						<ul className="list-disc list-inside">
							{patient.medicalDocuments &&
							patient.medicalDocuments.length > 0 ? (
								patient.medicalDocuments.map((doc) => (
									<li
										key={doc.id}
										className="text-sm md:text-base"
									>
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
								<li className="text-sm md:text-base">
									Aucun document médical disponible.
								</li>
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
					<span className="font-semibold text-sm md:text-base">
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
									<li
										key={consultation.id}
										className="text-sm md:text-base"
									>
										{new Date(
											consultation.date
										).toLocaleDateString("fr-FR")}
										:{" "}
										{consultation.notes || "Aucunes notes"}
									</li>
								))
							) : (
								<li className="text-sm md:text-base">
									Aucune consultation disponible.
								</li>
							)}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default PatientDetails;
