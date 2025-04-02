import React, { useState, useEffect, useCallback } from "react";
import { PencilIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import ConfirmDeletePatientModal from "@/components/DeleteModal/ConfirmDeletePatientModal";
import ErrorDisplay from "@/components/ErrorDisplay";
import {
	maritalStatusTranslations,
	contraceptionTranslations,
	handednessTranslations,
	yesNoTranslations,
} from "@/utils/translations";
import Image from "next/image";
import { toast } from "react-toastify";
import SectionToggle from "@/components/SectionToggle";
import DetailItem from "@/components/DetailItem";

// Utilisation des hooks d'état (useState)
const PatientDetails = ({ patient, onClose, onPatientUpdated }) => {
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
	const [setIsLoading] = useState(false);

	// Fonction de gestion des enfants (ajouter, supprimer, modifier)
	const handleAddChild = () => {
		const updatedChildren = [...(editedPatient.childrenAges || []), ""];
		setEditedPatient({ ...editedPatient, childrenAges: updatedChildren });
	};

	const handleRemoveChild = (index) => {
		const updatedChildren = editedPatient.childrenAges.filter(
			(_, i) => i !== index
		);
		setEditedPatient({ ...editedPatient, childrenAges: updatedChildren });
	};

	const handleChildAgeChange = (index, value) => {
		const updatedChildren = [...editedPatient.childrenAges];
		updatedChildren[index] = parseInt(value, 10) || 0;
		setEditedPatient({ ...editedPatient, childrenAges: updatedChildren });
	};

	// Validation des données du patient
	const validatePatientData = useCallback(() => {
		if (!patient) {
			setError("Aucune donnée patient disponible.");
			return false;
		}
		setError(null);
		return true;
	}, [patient]);

	// Effet pour valider les données au changement de patient
	useEffect(() => {
		validatePatientData();
	}, [patient, validatePatientData]);

	// Toggle des sections
	const toggleSection = (section) => {
		setOpenSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	// Formattage des données
	const formatPhoneNumber = (phone) => {
		if (!phone) return "";
		return phone
			.replace(/\D/g, "")
			.replace(/(\d{2})(?=\d)/g, "$1 ")
			.trim();
	};

	const handleDeletePatient = async () => {
		setIsLoading(true);
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
		} finally {
			setIsLoading(false);
		}
	};

	// Mise à jour des données du patient
	const handleChange = (field, value) => {
		if (field === "birthDate" && value) {
			const formattedDate = new Date(value).toISOString().split("T")[0];
			setEditedPatient((prevState) => ({
				...prevState,
				[field]: formattedDate,
			}));
		} else {
			setEditedPatient((prevState) => ({
				...prevState,
				[field]: value,
			}));
		}
	};

	// Effet pour remettre à jour le patient si l'on n'est pas en mode édition
	useEffect(() => {
		if (!isEditing) {
			setEditedPatient(patient);
		}
	}, [patient, isEditing]);

	useEffect(() => {
		if (isEditing) {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, [isEditing]);

	// Gestion des erreurs d'affichage
	if (error) {
		return <ErrorDisplay error={error} onClose={onClose} />;
	}

	// Fonction pour mettre à jour les informations du patient
	const handleUpdatePatient = async () => {
		try {
			const preparedPatient = {
				...editedPatient,
				id: patient.id,
				childrenAges: editedPatient.childrenAges.map((age) =>
					Number(age)
				),
			};

			console.log("Données envoyées au serveur:", preparedPatient);

			const response = await fetch(`/api/patients`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(preparedPatient),
			});

			console.log("Réponse du serveur:", response);

			if (response.ok) {
				toast.success(
					<div className="relative">
						🎉 Le patient{" "}
						<b>
							{preparedPatient.firstName}{" "}
							{preparedPatient.lastName}
						</b>{" "}
						a été mis à jour avec succès !
					</div>,
					{
						className: `absolute z-50 left-1/2 w-72 p-4 border border-gray-200 dark:border-gray-700 
			  bg-gradient-to-br from-gray-50 to-gray-200 dark:from-slate-700 dark:to-gray-800
			  text-sm rounded-lg shadow-xl transform -translate-x-1/2 
			  opacity-100 pointer-events-auto transition-all duration-300 ease-in-out !important`,
						position: "top-right",
						icon: "🎉",
					}
				);

				onPatientUpdated();
				setIsEditing(false);
			} else {
				const errorData = await response.json();
				console.error("Erreur du serveur:", errorData);
				toast.error(
					`Erreur: ${
						errorData.error || "Erreur lors de la mise à jour"
					}`
				);
			}
		} catch (error) {
			console.error("Erreur:", error);
			toast.error("Erreur lors de la mise à jour du patient");
		}
	};

	return (
		<div className="p-1 w-full min-h-screen mx-auto dark:text-gray-300 overflow-y-auto mt-4">
			<div className="flex items-center space-x-4 md:space-x-6 mb-6">
				<Image
					src={
						patient.avatarUrl ||
						"/assets/images/default-avatar.webp"
					}
					alt={`Avatar de ${patient.firstName || "Prénom Inconnu"} ${
						patient.lastName || "Nom Inconnu"
					}`}
					className={`w-32 h-32 sm:w-32 rounded-lg border-4 shadow-md ${
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
					<div className="mt-2 flex flex-col space-y-2">
						<button
							className="border border-gray-200 bg-blue-300 dark:text-zinc-900 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white p-1 text-xs rounded-md transition-all duration-200"
							onClick={() => setIsEditing(!isEditing)}
							aria-label="Éditer les informations du patient"
						>
							<PencilIcon className="h-4 w-4 inline-block mr-2" />
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
							className="border border-gray-200 bg-red-400 dark:text-zinc-900 hover:bg-red-600 hover:text-white dark:hover:text-white p-1 text-xs rounded-md transition-all duration-200"
							onClick={() => setIsConfirmDeleteOpen(true)}
						>
							<TrashIcon className="h-4 w-4 inline-block mr-2" />
							Supprimer le patient
						</button>
					</div>
				</div>
			</div>
			<SectionToggle
				title="Informations générales"
				isOpen={openSections.basicInfo}
				onToggle={() => toggleSection("basicInfo")}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 md:gap-6 mb-1">
					<DetailItem
						label="Prénom"
						value={editedPatient.firstName || "Non renseigné"}
						editable={isEditing}
						onChange={(value) => handleChange("firstName", value)}
					/>

					{/* Nom */}
					<DetailItem
						label="Nom"
						value={editedPatient.lastName || "Non renseigné"}
						editable={isEditing}
						onChange={(value) => handleChange("lastName", value)}
					/>
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
								? new Date(editedPatient.birthDate)
										.toISOString()
										.split("T")[0]
								: "Non renseignée"
						}
						editable={isEditing}
						onChange={(value) => handleChange("birthDate", value)}
						field="birthDate"
					/>
					<DetailItem
						label="Genre"
						value={
							isEditing ? (
								<select
									value={editedPatient.gender || ""}
									onChange={(e) =>
										handleChange("gender", e.target.value)
									}
									className="text-xs sm:text-sm bg-inherit text-gray-800 dark:text-gray-200 w-full sm:text-right p-2 border border-gray-300 rounded-md"
									required // Champ obligatoire
								>
									<option value="" disabled>
										Sélectionner...
									</option>
									<option value="Homme">Homme</option>
									<option value="Femme">Femme</option>
								</select>
							) : (
								editedPatient.gender || "Non renseigné"
							)
						}
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
							isEditing ? (
								<select
									value={editedPatient.maritalStatus || ""}
									onChange={(e) =>
										handleChange(
											"maritalStatus",
											e.target.value
										)
									}
									className="text-xs sm:text-sm bg-inherit text-gray-800 dark:text-gray-200 dark:bg-slate-600 w-full sm:text-right p-2 border border-gray-300 rounded-md"
								>
									<option value="">Non renseigné</option>
									<option value="SINGLE">Célibataire</option>
									<option value="MARRIED">Marié(e)</option>
									<option value="DIVORCED">Divorcé(e)</option>
									<option value="WIDOWED">Veuf/veuve</option>
									<option value="SEPARATED">Séparé(e)</option>
									<option value="ENGAGED">Fiancé(e)</option>
									<option value="PARTNERED">En couple</option>
								</select>
							) : (
								maritalStatusTranslations[
									editedPatient.maritalStatus
								] || "Non renseigné"
							)
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
							isEditing ? (
								<select
									value={editedPatient.handedness || ""}
									onChange={(e) =>
										handleChange(
											"handedness",
											e.target.value
										)
									}
									className="text-xs sm:text-sm bg-inherit text-gray-800 dark:text-gray-200 w-full sm:text-right p-2 border border-gray-300 rounded-md"
								>
									<option value="">Non renseigné</option>
									<option value="LEFT">Gaucher</option>
									<option value="RIGHT">Droitier</option>
									<option value="AMBIDEXTROUS">
										Ambidextre
									</option>
								</select>
							) : (
								handednessTranslations[
									editedPatient.handedness
								] || "Non renseigné"
							)
						}
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
						label="Fumeur"
						value={
							isEditing ? (
								<select
									value={
										editedPatient.isSmoker === null
											? ""
											: editedPatient.isSmoker
									}
									onChange={(e) =>
										handleChange(
											"isSmoker",
											e.target.value === "true"
										)
									}
									className="text-xs sm:text-sm bg-inherit text-gray-800 dark:text-gray-200 w-full sm:text-right p-2 border border-gray-300 rounded-md"
								>
									<option value="">Non renseigné</option>
									<option value="true">Oui</option>
									<option value="false">Non</option>
								</select>
							) : (
								yesNoTranslations[editedPatient.isSmoker] ??
								"Non renseigné"
							)
						}
					/>

					{/* Champ pour la mention du décès */}
					<DetailItem
						label="Décédé"
						value={
							isEditing ? (
								<select
									value={editedPatient.isDeceased || ""}
									onChange={(e) =>
										handleChange(
											"isDeceased",
											e.target.value
										)
									}
									className="text-xs sm:text-sm bg-inherit text-gray-800 dark:text-gray-200 w-full sm:text-right p-2 border border-gray-300 rounded-md"
								>
									<option value="">Non renseigné</option>
									<option value="true">Oui</option>
									<option value="false">Non</option>
								</select>
							) : (
								yesNoTranslations[editedPatient.isDeceased] ||
								"Non renseigné"
							)
						}
					/>
				</div>
			</SectionToggle>
			{/* Informations sur la famille */}
			<SectionToggle
				title="Informations familiales"
				isOpen={openSections.familyInfo}
				onToggle={() => toggleSection("familyInfo")}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-7 mb-1">
					<DetailItem
						label="Contraception"
						value={
							isEditing ? (
								// Mode édition : afficher le select avec les valeurs de l'énumération
								<>
									<select
										value={
											editedPatient?.contraception || ""
										}
										onChange={(e) => {
											const selectedValue =
												e.target.value;

											console.log(
												"Valeur sélectionnée :",
												selectedValue
											);

											handleChange(
												"contraception",
												selectedValue
											);

											// Si "Autre" est sélectionné, effacez la valeur actuelle
											if (selectedValue !== "OTHER") {
												handleChange(
													"customContraception",
													""
												);
											}
										}}
										className="text-xs sm:text-sm bg-inherit text-gray-800 dark:text-gray-200 w-full sm:text-right p-2 border border-gray-300 rounded-md"
									>
										<option value="">Non renseigné</option>
										<option value="NONE">Aucune</option>
										<option value="PILLS">Pilule</option>
										<option value="CONDOM">
											Préservatifs
										</option>
										<option value="IMPLANTS">
											Implants
										</option>
										<option value="DIAPHRAGM">
											Diaphragme
										</option>
										<option value="IUD">DIU</option>
										<option value="INJECTION">
											Injection
										</option>
										<option value="PATCH">Patch</option>
										<option value="RING">Anneau</option>
										<option value="NATURAL_METHODS">
											Méthodes naturelles
										</option>
										<option value="STERILIZATION">
											Stérilisation
										</option>
									</select>
								</>
							) : (
								// Mode lecture : afficher la traduction de la contraception ou "Non renseigné" si vide
								contraceptionTranslations[
									editedPatient.contraception
								] ||
								editedPatient.customContraception ||
								"Non renseigné"
							)
						}
					/>

					{editedPatient.childrenAges && (
						<div>
							<h4 className="text-sm font-normal mt-3 dark:text-zinc-400">
								Âges des enfants
							</h4>
							{isEditing ? (
								<div>
									{editedPatient.childrenAges.map(
										(age, index) => (
											<div
												key={index}
												className="flex items-center mb-2 gap-2"
											>
												<input
													type="number"
													value={age}
													placeholder="Âge en années"
													onChange={(e) => {
														const newAge = Math.max(
															0,
															parseInt(
																e.target.value,
																10
															) || 0
														);
														handleChildAgeChange(
															index,
															newAge
														);
													}}
													min="0"
													className="text-xs sm:text-sm bg-inherit text-gray-800 dark:text-gray-200 w-full sm:text-right p-2 border border-gray-300 rounded-md"
												/>
												<button
													type="button"
													className="text-red-500"
													onClick={() =>
														handleRemoveChild(index)
													}
												>
													Supprimer
												</button>
											</div>
										)
									)}
									{editedPatient.childrenAges.length < 10 && (
										<button
											type="button"
											className="mt-2 text-blue-500"
											onClick={handleAddChild}
										>
											Ajouter un enfant
										</button>
									)}
									{editedPatient.childrenAges.length >=
										10 && (
										<p className="text-red-600 text-sm mt-1">
											Vous avez atteint le nombre maximum
											de 10 enfants.
										</p>
									)}
								</div>
							) : (
								<div>
									{editedPatient.childrenAges.length > 0 ? (
										editedPatient.childrenAges.map(
											(age, index) => (
												<div
													key={index}
													className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 break-words w-full sm:text-right"
												>
													{`Enfant ${
														index + 1
													} : ${age} ans`}
												</div>
											)
										)
									) : (
										<p>Pas d&apos;enfants renseignés</p>
									)}
								</div>
							)}
						</div>
					)}
				</div>
			</SectionToggle>
			{/* Informations médicales */}
			<SectionToggle
				title="Informations médicales"
				isOpen={openSections.medicalInfo}
				onToggle={() => toggleSection("medicalInfo")}
				editable={isEditing}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-7 mb-1">
					{/* Problèmes ORL */}
					<DetailItem
						label="Problèmes ORL"
						value={editedPatient.entProblems || "Non renseignés"}
						editable={isEditing}
						onChange={(value) => handleChange("entProblems", value)}
					/>
					{/* Nom du Médecin ORL */}
					<DetailItem
						label="Nom du Médecin ORL"
						value={editedPatient.entDoctorName || "Non renseigné"}
						editable={isEditing}
						onChange={(value) =>
							handleChange("entDoctorName", value)
						}
					/>
					{/* Problèmes Digestifs */}
					<DetailItem
						label="Problèmes Digestifs"
						value={
							editedPatient.digestiveProblems || "Non renseignés"
						}
						editable={isEditing}
						onChange={(value) =>
							handleChange("digestiveProblems", value)
						}
					/>
					{/* Nom du Médecin Digestif */}
					<DetailItem
						label="Nom du Médecin Digestif"
						value={
							editedPatient.digestiveDoctorName || "Non renseigné"
						}
						editable={isEditing}
						onChange={(value) =>
							handleChange("digestiveDoctorName", value)
						}
					/>
					{/* Traitement Actuel */}
					<DetailItem
						label="Traitement Actuel"
						value={
							editedPatient.currentTreatment || "Non renseigné"
						}
						editable={isEditing}
						onChange={(value) =>
							handleChange("currentTreatment", value)
						}
					/>
					{/* Antécédents Chirurgicaux */}
					<DetailItem
						label="Antécédents Chirurgicaux"
						value={
							editedPatient.surgicalHistory || "Non renseignés"
						}
						editable={isEditing}
						onChange={(value) =>
							handleChange("surgicalHistory", value)
						}
					/>
					{/* Antécédents Traumatiques */}
					<DetailItem
						label="Antécédents Traumatiques"
						value={editedPatient.traumaHistory || "Non renseignés"}
						editable={isEditing}
						onChange={(value) =>
							handleChange("traumaHistory", value)
						}
					/>
					{/* Antécédents Rhumatologiques */}
					<DetailItem
						label="Antécédents Rhumatologiques"
						value={
							editedPatient.rheumatologicalHistory ||
							"Non renseignés"
						}
						editable={isEditing}
						onChange={(value) =>
							handleChange("rheumatologicalHistory", value)
						}
					/>
					{/* Informations HDLM */}
					<DetailItem
						label="Informations HDLM"
						value={editedPatient.hdlm || "Non renseignées"}
						editable={isEditing}
						onChange={(value) => handleChange("hdlm", value)}
					/>{" "}
				</div>
			</SectionToggle>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Informations du praticien et cabinet */}
				<SectionToggle
					title="Informations praticiens et cabinet"
					isOpen={openSections.practitionerInfo}
					onToggle={() => toggleSection("practitionerInfo")}
					editable={isEditing}
				>
					<div className="grid grid-cols-1 gap-4">
						<DetailItem
							label="Médecin traitant"
							value={
								editedPatient.generalPractitioner ||
								"Non renseigné"
							}
							editable={isEditing}
							onChange={(value) =>
								handleChange("generalPractitioner", value)
							}
						/>
						<DetailItem
							label="Ostéopathe"
							value={patient.osteopath?.name || "Non renseigné"}
							editable={isEditing}
							onChange={(value) =>
								handleChange("osteopath.name", value)
							}
						/>
						<DetailItem
							label="Cabinet"
							value={patient.cabinet?.name || "Non renseigné"}
							editable={isEditing}
							onChange={(value) =>
								handleChange("cabinet.name", value)
							}
						/>
					</div>
				</SectionToggle>

				{/* Documents médicaux et consultations */}
				<SectionToggle
					title="Documents médicaux"
					isOpen={openSections.documentsAndConsultations}
					onToggle={() => toggleSection("documentsAndConsultations")}
				>
					<div className="grid grid-cols-1 gap-4">
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
							value={new Date(
								patient.createdAt
							).toLocaleDateString("fr-FR")}
						/>
						<DetailItem
							label="Mis à jour le"
							value={new Date(
								patient.updatedAt
							).toLocaleDateString("fr-FR")}
						/>
					</div>
				</SectionToggle>
			</div>
			<div className="flex justify-end m-4">
				{isEditing && (
					<button
						onClick={handleUpdatePatient}
						className="border border-gray-200 bg-green-400 dark:text-zinc-900 hover:bg-green-500 dark:hover:bg-green-500 hover:text-white dark:hover:text-white p-1 text-sm rounded-md transition-all duration-200"
					>
						<CheckIcon className="h-4 w-4 inline-block mr-2" />
						Mettre à jour
					</button>
				)}
			</div>
		</div>
	);
};

export default PatientDetails;
