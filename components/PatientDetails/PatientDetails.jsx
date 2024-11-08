import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const PatientDetails = ({ patient, onClose }) => {
	const [error, setError] = useState(null);
	const [openSections, setOpenSections] = useState({
		basicInfo: true,
		medicalProblems: false,
		children: false,
	});

	const formatPhoneNumber = (phone) => {
		if (!phone) return "";
		return phone
			.replace(/\D/g, "")
			.replace(/(\d{2})(?=\d)/g, "$1 ")
			.trim();
	};

	const validatePatientData = useCallback(() => {
		if (!patient) {
			setError("Aucune donnée patient disponible.");
			return false;
		}
		setError(null);
		return true;
	}, [patient]);

	useEffect(() => {
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

			{/* Patient Info Header */}
			<div className="flex flex-col md:flex-row items-center md:items-start mb-6 space-y-4 md:space-y-0 md:space-x-6">
				<Image
					src={
						patient.avatarUrl ||
						"/assets/images/default-avatar.webp"
					}
					alt={`Avatar de ${patient.name || "inconnu"}`}
					className="w-32 h-32 md:w-36 md:h-36 rounded-lg border-2 border-slate-950 shadow-md shadow-gray-400"
					width={144}
					height={144}
				/>
				<div className="flex flex-col items-center md:items-start">
					<h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
						{patient.name || "Nom inconnu"}
					</h1>
					<button
						className="mt-4 bg-blue-500 text-white p-2 md:p-3 text-sm md:text-base rounded-lg hover:bg-blue-600 w-full md:w-auto"
						onClick={() => alert("Édition du patient")}
					>
						Éditer le patient
					</button>
				</div>
			</div>

			{/* Basic Information Section */}
			<div className="mb-4">
				<button
					className="flex justify-between items-center w-full bg-gray-700 p-2 rounded-md hover:bg-gray-600 text-gray-200"
					onClick={() => toggleSection("basicInfo")}
				>
					<span className="font-semibold text-sm md:text-base">
						Informations de base
					</span>
					<span>{openSections.basicInfo ? "−" : "+"}</span>
				</button>
				{openSections.basicInfo && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
						{/* Basic info fields */}
						<p>
							<strong>Email:</strong>{" "}
							{patient.email || "Non renseigné"}
						</p>
						<p>
							<strong>Téléphone:</strong>{" "}
							{formatPhoneNumber(patient.phone) ||
								"Non renseigné"}
						</p>
						<p>
							<strong>Date de Naissance:</strong>{" "}
							{patient.birthDate
								? new Date(
										patient.birthDate
								  ).toLocaleDateString("fr-FR")
								: "Non renseignée"}
						</p>
						<p>
							<strong>Genre:</strong>{" "}
							{patient.gender || "Non renseigné"}
						</p>
						<p>
							<strong>Adresse:</strong>{" "}
							{patient.address || "Non renseignée"}
						</p>
						<p>
							<strong>Statut marital:</strong>{" "}
							{maritalStatusTranslations[patient.maritalStatus] ||
								"Non renseigné"}
						</p>
						<p>
							<strong>Métier:</strong>{" "}
							{patient.occupation || "Non renseigné"}
						</p>
						<p>
							<strong>Latéralité:</strong>{" "}
							{handednessTranslations[patient.handedness] ||
								"Non renseignée"}
						</p>
						<p>
							<strong>Méthode de contraception:</strong>{" "}
							{contraceptionTranslations[patient.contraception] ||
								"Non renseignée"}
						</p>
						<p>
							<strong>Fumeur ?</strong>{" "}
							{yesNoTranslations[patient.isSmoker] ||
								"Non renseigné"}
						</p>
						<p>
							<strong>Correction visuelle ?</strong>{" "}
							{yesNoTranslations[patient.hasVisionCorrection] ||
								"Non renseignée"}
						</p>
						<p>
							<strong>Le patient est-il décédé ?</strong>{" "}
							{yesNoTranslations[patient.isDeceased] ||
								"Non renseigné"}
						</p>
						<p>
							<strong>Activité physique:</strong>{" "}
							{patient.physicalActivity || "Non renseignée"}
						</p>
					</div>
				)}
			</div>

			{/* Medical Problems Section */}
			<div className="mb-4">
				<button
					className="flex justify-between items-center w-full bg-gray-700 p-2 rounded-md hover:bg-gray-600 text-gray-200"
					onClick={() => toggleSection("medicalProblems")}
				>
					<span className="font-semibold text-sm md:text-base">
						Antécédents médicaux
					</span>
					<span>{openSections.medicalProblems ? "−" : "+"}</span>
				</button>
				{openSections.medicalProblems && (
					<div className="p-4">
						<p>
							<strong>Antécédents chirurgicaux:</strong>{" "}
							{patient.surgicalHistory || "Non renseigné"}
						</p>
						<p>
							<strong>Problèmes digestifs:</strong>{" "}
							{patient.digestiveProblems || "Non renseigné"}
						</p>
						<p>
							<strong>Nom du médecin gastro-entérologue:</strong>{" "}
							{patient.digestiveDoctorName || "Non renseigné"}
						</p>
						<p>
							<strong>Problèmes ORL:</strong>{" "}
							{patient.entProblems || "Non renseigné"}
						</p>
						<p>
							<strong>Nom du médecin ORL:</strong>{" "}
							{patient.entDoctorName || "Non renseigné"}
						</p>
						<p>
							<strong>Antécédents traumatiques:</strong>{" "}
							{patient.traumaHistory || "Non renseigné"}
						</p>
						<p>
							<strong>Antécédents rhumatologiques:</strong>{" "}
							{patient.rheumatologicalHistory || "Non renseigné"}
						</p>
					</div>
				)}
			</div>

			{/* Children Section */}
			<div className="mb-4">
				<button
					className="flex justify-between items-center w-full bg-gray-700 p-2 rounded-md hover:bg-gray-600 text-gray-200"
					onClick={() => toggleSection("children")}
				>
					<span className="font-semibold text-sm md:text-base">
						Enfants
					</span>
					<span>{openSections.children ? "−" : "+"}</span>
				</button>
				{openSections.children && (
					<div className="p-4">
						<p>
							<strong>Le patient a des enfants ?</strong>{" "}
							{yesNoTranslations[patient.hasChildren] ||
								"Non renseigné"}
						</p>
						{patient.hasChildren &&
						patient.childrenAges &&
						patient.childrenAges.length > 0 ? (
							<p>
								<strong>Âges des enfants:</strong>{" "}
								{patient.childrenAges
									.map(
										(age) =>
											`${age} ${age === 1 ? "an" : "ans"}`
									)
									.join(", ")}
							</p>
						) : null}
					</div>
				)}
			</div>
		</div>
	);
};

export default PatientDetails;
