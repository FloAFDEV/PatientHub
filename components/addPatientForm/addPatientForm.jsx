"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const AddPatientForm = ({}) => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
		setValue,
	} = useForm();

	const [hasChildren, setHasChildren] = useState(false);
	const [childrenAges, setChildrenAges] = useState([0]);

	const handleChildrenAgesChange = (index, event) => {
		const value = parseInt(event.target.value, 10) || 0;
		const updatedAges = [...childrenAges];
		updatedAges[index] = value;
		setChildrenAges(updatedAges);
	};

	const addChildAgeField = () => setChildrenAges([...childrenAges, 0]);

	const removeChildAgeField = (index) => {
		const updatedAges = childrenAges.filter((_, i) => i !== index);
		setChildrenAges(updatedAges);
	};

	// Define mappings
	const genderOptions = {
		Homme: "Homme",
		Femme: "Femme",
	};

	const maritalStatusOptions = {
		SINGLE: "Célibataire",
		MARRIED: "Marié(e)",
		DIVORCED: "Divorcé(e)",
		WIDOWED: "Veuf(ve)",
		SEPARATED: "Séparé(e)",
	};

	const handednessOptions = {
		LEFT: "Gaucher",
		RIGHT: "Droitier",
		AMBIDEXTROUS: "Ambidextre",
	};

	const contraceptionOptions = {
		NONE: "Aucun",
		PILLS: "Pilule",
		CONDOM: "Préservatifs",
		IMPLANTS: "Implant",
	};

	const yesOptions = {
		Yes: "Oui",
		No: "Non",
	};

	const cabinetId = 3;

	const onSubmit = async (data) => {
		const validChildrenAges = childrenAges.filter((age) => age >= 0);
		const finalData = {
			...data,
			gender: data.gender,
			childrenAges: hasChildren ? validChildrenAges : [],
			activityLevel: data.activityLevel || "",
			hasVisionCorrection: data.hasVisionCorrection === "Yes",
			isDeceased: data.isDeceased === "Yes",
			isSmoker: data.isSmoker === "Yes",
			birthDate: new Date(data.birthDate).toISOString(),
			hasChildren: hasChildren,
			generalPractitioner: data.generalPractitioner || "",
			maritalStatus: data.maritalStatus || "",
			osteopathId: data.osteopathId,
			cabinetId: cabinetId,
		};
		console.log("Données du patient à envoyer :", finalData);
		try {
			const response = await fetch("/api/patients", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(finalData),
			});
			if (!response.ok)
				throw new Error(`Erreur serveur: ${await response.text()}`);
			await response.json();
			toast.success(
				<div>
					🎉 Patient <b>{data.name}</b> ajouté avec succès !
				</div>,
				{
					position: "top-center",
					className: "custom-toast",
					icon: "🎉",
				}
			);

			reset({
				name: "",
				email: "",
				phone: "",
				address: "",
				birthDate: null,
				gender: "",
				maritalStatus: "",
				occupation: "",
				handedness: "",
				contraception: "",
				generalPractitioner: "",
				isSmoker: "",
				hasVisionCorrection: "",
				isDeceased: "",
				activityLevel: "",
				entProblems: "",
				entDoctorName: "",
				digestiveProblems: "",
				digestiveDoctorName: "",
				currentTreatment: "",
				surgicalHistory: "",
				traumaHistory: "",
				rheumatologicalHistory: "",
				hdlm: "",
			});

			// Réinitialisation des états locaux
			setHasChildren(false);
			setChildrenAges([0]);

			// Réinitialisation des champs qui ne sont pas directement gérés par react-hook-form
			setValue("birthDate", null);
		} catch (error) {
			toast.error(
				`Erreur lors de la création du patient: ${error.message}`,
				{
					position: "top-center",
					icon: "❌",
				}
			);
		}
	};

	return (
		<div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
			{/* En-tête de l'ajout de patient */}
			<header className="mb-8">
				<div className="relative w-full h-48 md:h-64 lg:h-72 overflow-hidden rounded-lg shadow-xl mb-8">
					<Image
						src="/assets/images/WelcomePatient.webp"
						alt="Salon design et moderne"
						fill
						style={{
							objectFit: "cover",
						}}
						className="opacity-90 object-[center_50%] sm:object-[center_50%] sm:object-cover"
						priority
					/>
					<div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 bg-black bg-opacity-40 rounded-lg">
						<Image
							src="/assets/icons/logo-full.svg"
							alt="Logo"
							width={80}
							height={80}
							className="object-contain shadow-xl rounded-xl mb-4"
							priority
						/>
						<h1 className="mt-2 text-3xl font-bold drop-shadow-sm">
							Ajouter un Patient
						</h1>
						<p className="mt-2 text-xl drop-shadow-sm hidden sm:block">
							Gestion des patients et des rendez-vous
						</p>
					</div>
				</div>
			</header>
			<div className="p-5 w-full max-w-7xl border border-blue-300 rounded-lg shadow-md bg-white dark:bg-slate-800 relative mx-auto">
				<ToastContainer />
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<h2 className="text-2xl font-bold mb-6 text-center">
						Ajouter un Patient
					</h2>
					<div className="mb-8">
						<h3 className="text-xl font-semibold mb-4 text-center">
							Informations Personnelles
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
							<FormField
								name="name"
								control={control}
								label="Nom"
								placeholder="Entrez le nom"
								required
								rules={{ required: "Le nom est requis" }}
								error={errors.name?.message}
							/>
							<FormField
								name="email"
								control={control}
								label="Email"
								type="email"
								placeholder="Entrez l'email"
								rules={{
									pattern: {
										value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
										message: "L'email doit être valide",
									},
								}}
								error={errors.email?.message}
							/>
							<Controller
								name="phone"
								label="Téléphone"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<div className="flex flex-col">
										<label
											htmlFor="phone"
											className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-300"
										>
											Téléphone
										</label>
										<input
											{...field}
											type="tel"
											inputMode="numeric"
											pattern="[0-9]*"
											id="phone"
											className={`w-full p-2 border border-blue-500 rounded-md focus:outline-none focus:border-violet-500 dark:bg-gray-900 dark:text-gray-200 transition duration-200 ease-in-out ${
												field.value
													? "bg-blue-100 dark:bg-zinc-900"
													: ""
											}`}
											placeholder="Numéro de téléphone"
											onKeyDown={(e) => {
												// Autoriser les touches de contrôle (retour arrière, suppression, flèches, etc.)
												if (
													e.ctrlKey ||
													e.altKey ||
													e.metaKey ||
													e.key.length > 1
												) {
													return;
												}
												// Empêcher la saisie si ce n'est pas un chiffre
												if (!/^[0-9]$/.test(e.key)) {
													e.preventDefault();
												}
											}}
											onChange={(e) => {
												const value =
													e.target.value.replace(
														/\D/g,
														""
													); // Filtrer pour garder uniquement les chiffres
												field.onChange(value);
											}}
										/>
										{/* Afficher les erreurs */}
										{errors.phone && (
											<p className="text-red-600 text-sm mt-1">
												{errors.phone.message}
											</p>
										)}
									</div>
								)}
							/>

							<FormField
								name="address"
								control={control}
								label="Adresse"
								placeholder="Entrez l'adresse"
								rules={{ required: "L'adresse est requise" }}
								error={errors.address?.message}
							/>
							<DatePickerField
								name="birthDate"
								control={control}
								label="Date de Naissance"
								rules={{
									required:
										"La date de naissance est requise",
								}}
								error={errors.birthDate?.message}
							/>
							<SelectField
								name="gender"
								control={control}
								label="Genre"
								options={genderOptions}
								required
								rules={{ required: "Le genre est requis" }}
								error={errors.gender?.message}
							/>
							<SelectField
								name="maritalStatus"
								control={control}
								label="Statut Marital"
								options={maritalStatusOptions}
								required
								rules={{
									required: "Le statut marital est requis",
								}}
								error={errors.maritalStatus?.message}
							/>
							<FormField
								name="occupation"
								control={control}
								label="Métier"
								placeholder="Entrez le métier"
							/>

							<label className="flex items-center mb-2 ">
								<input
									type="checkbox"
									checked={hasChildren}
									onChange={() =>
										setHasChildren(!hasChildren)
									}
									className="mr-2 rounded-md"
								/>
								Le patient a-t-il des enfants ?
							</label>
							{hasChildren && (
								<div>
									<h4 className="text-lg font-semibold mb-2">
										Âges des enfants
									</h4>
									{childrenAges.map((age, index) => (
										<div
											key={index}
											className="flex items-center mb-2"
										>
											<label className="mr-2 font-medium text-sm text-gray-700 dark:text-gray-300">
												Âge de l&apos;enfant {index + 1}
											</label>
											<input
												type="number"
												placeholder="Âge en années"
												value={age}
												onChange={(e) => {
													const value = parseInt(
														e.target.value,
														10
													);
													if (
														!isNaN(value) &&
														value >= 0
													) {
														handleChildrenAgesChange(
															index,
															e
														);
													} else if (isNaN(value)) {
														return;
													}
												}}
												className="w-full p-2 border border-blue-500 rounded-md focus:outline-none focus:border-violet-500 dark:bg-gray-900 dark:text-gray-200 transition duration-200 ease-in-out"
											/>
											<button
												type="button"
												className="ml-2 text-red-500"
												onClick={() =>
													removeChildAgeField(index)
												}
											>
												Supprimer
											</button>
										</div>
									))}
									<button
										type="button"
										className="mt-2 text-blue-500"
										onClick={addChildAgeField}
									>
										Ajouter un enfant
									</button>
								</div>
							)}
						</div>
					</div>
					<div className="mb-8">
						<h3 className="text-xl font-semibold mb-4 text-center">
							Informations médicales
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<SelectField
								name="handedness"
								control={control}
								label="Latéralité"
								options={handednessOptions}
								required
								rules={{
									required: "La latéralité est requise",
								}}
								error={errors.handedness?.message}
							/>
							<SelectField
								name="contraception"
								control={control}
								label="Méthode de Contraception"
								options={contraceptionOptions}
								required
								rules={{
									required:
										"La méthode de contraception est requise",
								}}
								error={errors.contraception?.message}
							/>
							<FormField
								name="generalPractitioner"
								control={control}
								label="Médecin Traitant"
								placeholder="Nom du médecin traitant"
							/>
							<SelectField
								name="isSmoker"
								control={control}
								label="Fumeur ?"
								options={yesOptions}
								required
								rules={{
									required: "Le statut fumeur est requis",
								}}
								error={errors.isSmoker?.message}
							/>
							<SelectField
								name="hasVisionCorrection"
								control={control}
								label="Correction Visuelle ?"
								options={yesOptions}
								required
								rules={{
									required:
										"Le statut de correction visuelle est requis",
								}}
								error={errors.hasVisionCorrection?.message}
							/>
							<SelectField
								name="isDeceased"
								control={control}
								label="Le patient est-il décédé ?"
								options={yesOptions}
								required
								rules={{ required: "Le statut est requis" }}
								error={errors.isDeceased?.message}
							/>{" "}
							<FormField
								name="activityLevel"
								control={control}
								label="Activité physique"
								placeholder="Indiquez votre activité physique"
								rules={{
									required: "L'activité physique est requise",
								}}
								error={errors.activityLevel?.message}
							/>
							<TextAreaField
								name="entProblems"
								control={control}
								label="Problèmes ORL"
								placeholder="Décrire les problèmes ORL"
							/>
							<FormField
								name="entDoctorName"
								control={control}
								label="Nom du Médecin ORL"
								placeholder="Entrez le nom du médecin ORL"
							/>
							<TextAreaField
								name="digestiveProblems"
								control={control}
								label="Problèmes Digestifs"
								placeholder="Décrire les problèmes digestifs"
							/>
							<FormField
								name="digestiveDoctorName"
								control={control}
								label="Nom du Médecin Digestif"
								placeholder="Entrez le nom du médecin digestif"
							/>
							<TextAreaField
								name="currentTreatment"
								control={control}
								label="Traitement Actuel"
								placeholder="Liste des traitements en cours"
							/>
							<TextAreaField
								name="surgicalHistory"
								control={control}
								label="Antécédents Chirurgicaux"
								placeholder="Liste des antécédents chirurgicaux"
							/>
							<TextAreaField
								name="traumaHistory"
								control={control}
								label="Antécédents Traumatiques"
								placeholder="Liste des antécédents traumatiques"
							/>
							<TextAreaField
								name="rheumatologicalHistory"
								control={control}
								label="Antécédents Rhumatologiques"
								placeholder="Liste des antécédents rhumatologiques"
							/>
							<TextAreaField
								name="hdlm"
								control={control}
								label="Informations HDLM"
								placeholder="Décrire les informations HDLM"
							/>
						</div>
					</div>
					<div className="flex justify-center">
						<button
							type="submit"
							className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ease-in-out"
							disabled={isSubmitting}
						>
							{isSubmitting
								? "Ajout en cours..."
								: "Ajouter Patient"}
						</button>
					</div>
				</form>{" "}
			</div>
		</div>
	);
};

const FormField = ({
	name,
	control,
	label,
	placeholder,
	required,
	rules,
	error,
}) => (
	<div className="flex flex-col">
		<label
			htmlFor={name}
			className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-300"
		>
			{label} {required && <span className="text-red-500">*</span>}
		</label>
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field }) => (
				<input
					{...field}
					id={name}
					placeholder={placeholder}
					className={`w-full p-2 border border-blue-500 rounded-md focus:outline-none focus:border-violet-500 dark:bg-gray-900 dark:text-gray-200 transition duration-200 ease-in-out ${
						field.value ? "bg-blue-100 dark:bg-zinc-900" : ""
					}`}
				/>
			)}
		/>
		{error && <p className="text-red-600 text-sm mt-1">{error}</p>}
	</div>
);

const TextAreaField = ({ name, control, label, placeholder }) => (
	<div className="flex flex-col">
		<label
			htmlFor={name}
			className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-300"
		>
			{label}
		</label>
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<textarea
					{...field}
					id={name}
					placeholder={placeholder}
					className="w-full p-2 border border-blue-500 rounded-md focus:outline-none focus:border-violet-500 dark:bg-gray-900 dark:text-gray-200 transition duration-200 ease-in-out"
				/>
			)}
		/>
	</div>
);

const SelectField = ({
	name,
	control,
	label,
	options,
	required,
	rules,
	error,
}) => (
	<div className="flex flex-col">
		<label
			htmlFor={name}
			className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-300"
		>
			{label} {required && <span className="text-red-500">*</span>}
		</label>
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field }) => (
				<select
					{...field}
					id={name}
					className="w-full p-2 border border-blue-500 rounded-md focus:outline-none focus:border-violet-500 dark:bg-gray-900 dark:text-gray-200 transition duration-200 ease-in-out"
				>
					<option value="">Sélectionnez une option</option>
					{Object.entries(options).map(([value, label]) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</select>
			)}
		/>
		{error && <p className="text-red-600 text-sm mt-1">{error}</p>}
	</div>
);

const DatePickerField = ({ name, control, label, rules, error }) => (
	<div className="flex flex-col">
		<label
			htmlFor={name}
			className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-300"
		>
			{label} <span className="text-red-500">*</span>
		</label>
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field: { onChange, onBlur, value } }) => (
				<DatePicker
					selected={value}
					onChange={onChange}
					onBlur={onBlur}
					dateFormat="dd/MM/yyyy"
					className="w-full p-2 border border-blue-500 rounded-md focus:outline-none focus:border-violet-500 dark:bg-gray-900 dark:text-gray-200 transition duration-200 ease-in-out"
					placeholderText="Sélectionnez une date"
				/>
			)}
		/>
		{error && <p className="text-red-600 text-sm mt-1">{error}</p>}
	</div>
);

export default AddPatientForm;
