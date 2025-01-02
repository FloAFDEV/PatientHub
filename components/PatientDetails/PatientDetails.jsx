import React, { useState, useEffect, useCallback } from "react";
import ConfirmDeletePatientModal from "@/components/DeleteModal/ConfirmDeletePatientModal";
import Image from "next/image";
import { toast } from "react-toastify";
import {
	ChevronUpIcon,
	ChevronDownIcon,
	UserIcon,
} from "@heroicons/react/24/solid";

const PatientDetails = ({ patient, onClose }) => {
	const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
	const [error, setError] = useState(null);
	const [openSections, setOpenSections] = useState({
		basicInfo: true,
		medicalHistory: false,
		familyInfo: false,
		practitionerInfo: false,
	});
	const [isEditing, setIsEditing] = useState(false);
	const [editedPatient, setEditedPatient] = useState(patient);

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
					isOpen ? "max-h-max opacity-100" : "max-h-0 opacity-0"
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

	const DetailItem = ({ label, value, editable, onChange }) => (
		<div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-300 dark:border-gray-700">
			<span className="font-semibold text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-0">
				{label}
			</span>
			{editable ? (
				<input
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 w-full sm:text-right p-2 border border-gray-300 rounded-md"
				/>
			) : (
				<p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 break-words w-full sm:text-right">
					{value}
				</p>
			)}
		</div>
	);

	const handleDeletePatient = async () => {
		try {
			const response = await fetch(`/api/patients?id=${patient.id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				toast.success("Patient supprimé avec succès !");
				setIsConfirmDeleteOpen(false);
				onClose();
			} else {
				const result = await response.json();
				toast.error(`Erreur: ${result.error}`);
			}
		} catch (error) {
			console.error("Erreur lors de la suppression :", error);
			toast.error("Erreur lors de la suppression du patient.");
		}
	};

	const handleChange = (field, value) => {
		setEditedPatient((prevState) => ({
			...prevState,
			[field]: value,
		}));
	};

	const handleUpdatePatient = async () => {
		try {
			const response = await fetch(`/api/patients/${patient.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(editedPatient),
			});

			if (response.ok) {
				toast.success("Patient mis à jour avec succès");
				setIsEditing(false);
			} else {
				toast.error("Erreur lors de la mise à jour du patient");
			}
		} catch (error) {
			console.error("Erreur:", error);
			toast.error("Erreur lors de la mise à jour du patient");
		}
	};

	return (
		<div className="p-1 w-full h-screen mx-auto dark:text-gray-300 overflow-y-auto">
			<div className="flex items-center space-x-4 md:space-x-6 mb-6">
				<Image
					src={
						patient.avatarUrl ||
						"/assets/images/default-avatar.webp"
					}
					alt={`Avatar de ${patient.firstName || "Prénom Inconnu"} ${
						patient.lastName || "Nom Inconnu"
					}`}
					className={`w-24 h-24 sm:w-32 sm:h-32 rounded-lg border-4 shadow-md ${
						patient.gender === "Homme"
							? "border-blue-500"
							: patient.gender === "Femme"
							? "border-pink-500"
							: "border-gray-300"
					}`}
					width={128}
					height={128}
				/>
				<div className="flex flex-col">
					<div className="text-lg sm:text-xl md:text-2xl font-bold text-center md:text-left">
						<div className="flex items-center">
							<span className="font-semibold text-xs text-gray-600 dark:text-gray-300">
								Prénom:
							</span>
							<span className="ml-2 text-lg">
								{patient.firstName || "Prénom inconnu"}
							</span>
						</div>
						<div className="flex items-center mt-2">
							<span className="font-semibold text-xs text-gray-600 dark:text-gray-300">
								Nom:
							</span>
							<span className="ml-2 text-lg">
								{patient.lastName || "Nom inconnu"}
							</span>
						</div>
					</div>
					<div className="mt-2 flex flex-col space-y-2">
						<button
							className="border border-green-500 hover:bg-green-600 hover:text-white p-2 text-sm md:text-base rounded-lg"
							onClick={() => setIsEditing(!isEditing)}
							aria-label="Éditer les informations du patient"
						>
							{isEditing ? "Annuler" : "Éditer le patient"}
						</button>
						{isConfirmDeleteOpen && (
							<ConfirmDeletePatientModal
								onDelete={handleDeletePatient}
								onCancel={() => setIsConfirmDeleteOpen(false)}
								patientName={
									patient.firstName && patient.lastName
										? `${patient.firstName} ${patient.lastName}`
										: "Nom inconnu"
								}
							/>
						)}
						<button
							className="border border-red-500 hover:bg-red-600 hover:text-white p-2 text-sm md:text-base rounded-lg"
							onClick={() => setIsConfirmDeleteOpen(true)}
						>
							Supprimer le patient
						</button>
					</div>
				</div>
			</div>
			<SectionToggle
				title="Informations de base"
				isOpen={openSections.basicInfo}
				onToggle={() => toggleSection("basicInfo")}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-7">
					<DetailItem
						label="Email"
						value={editedPatient.email || "Non renseigné"}
						editable={isEditing}
						onChange={(value) => handleChange("email", value)}
					/>
					<DetailItem
						label="Téléphone"
						value={
							formatPhoneNumber(editedPatient.phone) ||
							"Non renseigné"
						}
						editable={isEditing}
						onChange={(value) => handleChange("phone", value)}
					/>
					<DetailItem
						label="Date de Naissance"
						value={
							editedPatient.birthDate
								? new Date(
										editedPatient.birthDate
								  ).toLocaleDateString("fr-FR")
								: "Non renseignée"
						}
						editable={isEditing}
						onChange={(value) => handleChange("birthDate", value)}
					/>
					<DetailItem
						label="Genre"
						value={editedPatient.gender || "Non renseigné"}
						editable={isEditing}
						onChange={(value) => handleChange("gender", value)}
					/>
					<DetailItem
						label="Adresse"
						value={editedPatient.address || "Non renseignée"}
						editable={isEditing}
						onChange={(value) => handleChange("address", value)}
					/>
					<DetailItem
						label="Statut marital"
						value={
							maritalStatusTranslations[
								editedPatient.maritalStatus
							] || "Non renseigné"
						}
						editable={isEditing}
						onChange={(value) =>
							handleChange("maritalStatus", value)
						}
					/>
					<DetailItem
						label="Métier"
						value={editedPatient.occupation || "Non renseigné"}
						editable={isEditing}
						onChange={(value) => handleChange("occupation", value)}
					/>
					<DetailItem
						label="Latéralité"
						value={
							handednessTranslations[editedPatient.handedness] ||
							"Non renseignée"
						}
						editable={isEditing}
						onChange={(value) => handleChange("handedness", value)}
					/>
					<DetailItem
						label="Activité physique"
						value={
							editedPatient.physicalActivity || "Non renseignée"
						}
						editable={isEditing}
						onChange={(value) =>
							handleChange("physicalActivity", value)
						}
					/>
					<DetailItem
						label="Fumeur ?"
						value={
							yesNoTranslations[editedPatient.isSmoker] ||
							"Non renseigné"
						}
						editable={isEditing}
						onChange={(value) => handleChange("isSmoker", value)}
					/>
					{/* Champ pour la mention du décès */}
					<DetailItem
						label="Décédé ?"
						value={
							yesNoTranslations[editedPatient.isDeceased] ||
							"Non renseigné"
						}
						editable={isEditing}
						onChange={(value) => handleChange("isDeceased", value)}
					/>
				</div>
			</SectionToggle>
			{/* Informations sur la famille */}
			<SectionToggle
				title="Informations familiales"
				isOpen={openSections.familyInfo}
				onToggle={() => toggleSection("familyInfo")}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-7">
					<DetailItem
						label="Contraception"
						value={
							contraceptionTranslations[patient.contraception] ||
							"Non renseignée"
						}
						editable={isEditing}
					/>
					<DetailItem
						label="Enfants"
						value={patient.hasChildren === "true" ? "Oui" : "Non"}
						editable={isEditing}
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
										label={
											<div className="flex items-center space-x-2">
												<UserIcon className="h-4 w-4 text-blue-500" />{" "}
												<span>{`Enfant ${
													index + 1
												}`}</span>
											</div>
										}
										value={`${age} ans`}
									/>
								))
							) : (
								<p>Pas d&apos;enfants renseignés</p>
							)}
						</div>
					)}
				</div>
			</SectionToggle>
			{/* Informations du praticien et cabinet */}
			<SectionToggle
				title="Informations du praticien et cabinet"
				isOpen={openSections.practitionerInfo}
				onToggle={() => toggleSection("practitionerInfo")}
				editable={isEditing}
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
			</div>{" "}
			<button
				onClick={handleUpdatePatient}
				className="mt-4 p-2 text-white bg-blue-600 rounded-lg"
			>
				Mettre à jour les informations
			</button>
		</div>
	);
};

export default PatientDetails;
