import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

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
		<div className="mb-4 border rounded-lg overflow-hidden">
			<button
				className="flex justify-between items-center w-full bg-gray-200 dark:bg-gray-700 p-2 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
				onClick={onToggle}
			>
				<span className="font-semibold">{title}</span>
				{isOpen ? (
					<ChevronUpIcon className="h-5 w-5" />
				) : (
					<ChevronDownIcon className="h-5 w-5" />
				)}
			</button>
			<div
				className={`transition-all duration-300 ease-in-out overflow-hidden ${
					isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="p-4 bg-white dark:bg-gray-800">{children}</div>
			</div>
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
		<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-300 dark:border-gray-700">
			<span className="font-semibold text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-0">
				{label}
			</span>
			<p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 break-words sm:text-right sm:max-w-[60%]">
				{value}
			</p>
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
					className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg border-2 border-slate-950 shadow-md"
					width={128}
					height={128}
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
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
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
						<h4 className="text-sm font-normal m-2 mt-4">
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
			<div className="mb-4 border rounded-lg overflow-hidden">
				<div className="bg-gray-100 dark:bg-gray-700 p-3 text-gray-800 dark:text-gray-200">
					<span className="font-semibold">
						Documents médicaux et consultations
					</span>
				</div>
				<div className="p-4 bg-white dark:bg-gray-800">
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
						value={`${
							patient.appointments?.length || 0
						} rendez-vous`}
					/>
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
		</div>
	);
};

export default PatientDetails;
