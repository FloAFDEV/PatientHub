import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const PatientDetails = ({ patient, onClose }) => {
	const [error, setError] = useState(null);
	const [openSections, setOpenSections] = useState({
		basicInfo: true,
		medicalHistory: false,
		familyInfo: false,
		practitionerInfo: false,
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

	const SectionToggle = ({ title, isOpen, onToggle, children }) => (
		<div className="mb-4">
			<button
				className="flex justify-between items-center w-full bg-gray-700 p-2 rounded-md hover:bg-gray-600 text-gray-200"
				onClick={onToggle}
			>
				<span className="font-semibold text-sm md:text-base">
					{title}
				</span>
				<span>{isOpen ? "−" : "+"}</span>
			</button>
			{isOpen && <div className="p-4">{children}</div>}
		</div>
	);

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

	const DetailItem = ({ label, value }) => (
		<div className="flex justify-between items-center py-2 border-b border-gray-300">
			<span className="font-semibold text-sm">{label}:</span>
			<span className="text-sm">{value}</span>
		</div>
	);

	return (
		<div className="p-1 w-full h-screen mx-auto dark:text-gray-300 overflow-y-auto">
			{/* Bouton de fermeture */}
			<button className="mb-4 text-red-500" onClick={onClose}>
				&times; Fermer
			</button>

			{/* En-tête d'informations du patient */}
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

			{/* Informations de base */}
			<SectionToggle
				title="Informations de base"
				isOpen={openSections.basicInfo}
				onToggle={() => toggleSection("basicInfo")}
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
					<DetailItem
						label="Email"
						value={patient.email || "Non renseigné"}
					/>
					<DetailItem
						label="Téléphone"
						value={
							formatPhoneNumber(patient.phone) || "Non renseigné"
						}
					/>
					<DetailItem
						label="Date de Naissance"
						value={
							patient.birthDate
								? new Date(
										patient.birthDate
								  ).toLocaleDateString("fr-FR")
								: "Non renseignée"
						}
					/>
					<DetailItem
						label="Genre"
						value={patient.gender || "Non renseigné"}
					/>
					<DetailItem
						label="Adresse"
						value={patient.address || "Non renseignée"}
					/>
					<DetailItem
						label="Statut marital"
						value={
							maritalStatusTranslations[patient.maritalStatus] ||
							"Non renseigné"
						}
					/>
					<DetailItem
						label="Métier"
						value={patient.occupation || "Non renseigné"}
					/>
					<DetailItem
						label="Latéralité"
						value={
							handednessTranslations[patient.handedness] ||
							"Non renseignée"
						}
					/>
					<DetailItem
						label="Activité physique"
						value={patient.physicalActivity || "Non renseignée"}
					/>
				</div>
			</SectionToggle>

			{/* Antécédents médicaux */}
			<SectionToggle
				title="Antécédents médicaux"
				isOpen={openSections.medicalHistory}
				onToggle={() => toggleSection("medicalHistory")}
			>
				<DetailItem
					label="Antécédents chirurgicaux"
					value={patient.surgicalHistory || "Non renseigné"}
				/>
				<DetailItem
					label="Antécédents traumatiques"
					value={patient.traumaHistory || "Non renseigné"}
				/>
				<DetailItem
					label="Antécédents rhumatologiques"
					value={patient.rheumatologicalHistory || "Non renseigné"}
				/>
				<DetailItem
					label="Correction visuelle ?"
					value={
						yesNoTranslations[patient.hasVisionCorrection] ||
						"Non renseignée"
					}
				/>
				<DetailItem
					label="Nom de l'ophtalmologiste"
					value={patient.ophtalmologistName || "Non renseigné"}
				/>
				<DetailItem
					label="Problèmes ORL"
					value={patient.entProblems || "Non renseigné"}
				/>
				<DetailItem
					label="Nom du médecin ORL"
					value={patient.entDoctorName || "Non renseigné"}
				/>
				<DetailItem
					label="Problèmes digestifs"
					value={patient.digestiveProblems || "Non renseigné"}
				/>
				<DetailItem
					label="Nom du médecin digestif"
					value={patient.digestiveDoctorName || "Non renseigné"}
				/>
				<DetailItem
					label="Informations HDLM"
					value={patient.hdlm || "Non renseignées"}
				/>
				<DetailItem
					label="Traitements en cours"
					value={patient.currentTreatment || "Non renseigné"}
				/>
			</SectionToggle>

			{/* Informations sur la famille */}
			<SectionToggle
				title="Informations sur la famille"
				isOpen={openSections.familyInfo}
				onToggle={() => toggleSection("familyInfo")}
			>
				<DetailItem
					label="Fumeur ?"
					value={
						yesNoTranslations[patient.isSmoker] || "Non renseigné"
					}
				/>
				<DetailItem
					label="Contraception"
					value={
						contraceptionTranslations[patient.contraception] ||
						"Non renseignée"
					}
				/>
				<DetailItem
					label="Enfants"
					value={patient.hasChildren === "true" ? "Oui" : "Non"}
				/>
				{patient.childrenAges && (
					<div>
						<h4 className="text-md font-semibold m-2 mt-4">
							Âges des enfants
						</h4>
						{patient.childrenAges.length > 0 ? (
							patient.childrenAges.map((age, index) => (
								<DetailItem
									key={index}
									label={`Enfant ${index + 1}`}
									value={`${age} ans`}
								/>
							))
						) : (
							<p>Pas d&apos;enfants renseignés</p>
						)}
					</div>
				)}
			</SectionToggle>

			{/* Informations du praticien et cabinet */}
			<SectionToggle
				title="Informations du praticien et cabinet"
				isOpen={openSections.practitionerInfo}
				onToggle={() => toggleSection("practitionerInfo")}
			>
				<DetailItem
					label="Médecin traitant"
					value={patient.generalPractitioner || "Non renseigné"}
				/>
				<DetailItem
					label="Ostéopathe"
					value={patient.osteopath?.name || "Non renseigné"}
				/>
				<DetailItem
					label="Cabinet"
					value={patient.cabinet?.name || "Non renseigné"}
				/>
			</SectionToggle>

			{/* Documents médicaux et consultations */}
			<div className="mb-4">
				<h3 className="text-lg font-semibold">
					Documents et consultations
				</h3>
				<DetailItem
					label="Documents médicaux"
					value={`${
						patient.medicalDocuments?.length || 0
					} document(s)`}
				/>
				<DetailItem
					label="Consultations"
					value={`${
						patient.consultations?.length || 0
					} consultation(s)`}
				/>
				<DetailItem
					label="Rendez-vous"
					value={`${patient.appointments?.length || 0} rendez-vous`}
				/>
			</div>

			{/* Dates de création et de mise à jour */}
			<div className="mb-4">
				<DetailItem
					label="Créé le"
					value={new Date(patient.createdAt).toLocaleDateString(
						"fr-FR"
					)}
				/>
				<DetailItem
					label="Mis à jour le"
					value={new Date(patient.updatedAt).toLocaleDateString(
						"fr-FR"
					)}
				/>
			</div>
		</div>
	);
};

export default PatientDetails;
