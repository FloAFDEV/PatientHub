import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const genders = ["Homme", "Femme"];
const maritalStatuses = [
	"Célibataire",
	"Marié(e)",
	"Divorcé(e)",
	"Veuf(ve)",
	"Séparé(e)",
];
const handednessOptions = ["Gaucher", "Droitier", "Ambidextre"];
const contraceptionOptions = ["Aucune", "Pilule", "Préservatifs", "Implant"];

const AddPatientForm = () => {
	const { control, handleSubmit, reset } = useForm();
	const [message, setMessage] = useState("");

	const onSubmit = async (data) => {
		try {
			const response = await fetch("/api/patients", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				throw new Error(
					"Une erreur est survenue lors de la création du patient."
				);
			}
			const newPatient = await response.json();
			setMessage(`Patient créé avec succès : ${newPatient.name}`);
			reset();
		} catch (error) {
			console.error(
				"Erreur lors de la soumission du formulaire :",
				error
			);
			setMessage("Erreur lors de la création du patient.");
		}
	};

	return (
		<div className="p-4 w-full max-w-full border border-blue-300 rounded-lg shadow-md bg-white dark:bg-neutral-900">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<h2 className="text-2xl font-bold mb-6 text-center">
					Ajouter un Patient
				</h2>
				{/* Affichage du message */}
				{message && (
					<div className="text-center text-lg font-semibold mb-4">
						{message}
					</div>
				)}
				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-center">
						Informations Personnelles
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<FormField
							name="name"
							control={control}
							label="Nom"
							placeholder="Entrez le nom"
							required
						/>
						<FormField
							name="email"
							control={control}
							label="Email"
							type="email"
							placeholder="Entrez l'email"
							required
						/>
						<FormField
							name="phone"
							control={control}
							label="Téléphone"
							type="tel"
							placeholder="Entrez le numéro de téléphone"
							required={false}
							onChange={(value) => {
								// Filtrer uniquement les chiffres
								const filteredValue = value.replace(/\D/g, "");
								return filteredValue; // Retourner uniquement les chiffres
							}}
						/>
						<FormField
							name="address"
							control={control}
							label="Adresse"
							placeholder="Entrez l'adresse"
							required
						/>
						<DatePickerField
							name="birthDate"
							control={control}
							label="Date de naissance"
						/>
						<SelectField
							name="gender"
							control={control}
							label="Genre"
							options={genders}
							required
						/>
						<SelectField
							name="maritalStatus"
							control={control}
							label="Statut marital"
							options={maritalStatuses}
							required
						/>
						<FormField
							name="occupation"
							control={control}
							label="Métier"
							placeholder="Entrez le métier"
						/>
						<FormField
							name="children"
							control={control}
							label="Enfants"
							placeholder="Âges des enfants, séparés par des virgules"
						/>
						<TextAreaField
							name="physicalActivity"
							control={control}
							label="Activité physique"
							placeholder="Décrivez l'activité physique ou sportive"
						/>
					</div>
				</div>

				<div className="mb-8">
					<h3 className="text-xl font-semibold mb-4 text-center">
						Informations Médicales
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<SelectField
							name="isSmoker"
							control={control}
							label="Fumeur"
							options={[
								{ value: true, label: "Oui" },
								{ value: false, label: "Non" },
							]}
							required
						/>
						<SelectField
							name="handedness"
							control={control}
							label="Latéralité"
							options={handednessOptions}
							required
						/>
						<SelectField
							name="contraception"
							control={control}
							label="Contraception"
							options={contraceptionOptions}
							required
						/>
						<TextAreaField
							name="currentTreatment"
							control={control}
							label="Traitements en cours"
							placeholder="Décrivez les traitements en cours"
						/>
						<FormField
							name="generalPractitioner"
							control={control}
							label="Médecin traitant"
							placeholder="Nom du médecin traitant"
						/>
						<TextAreaField
							name="surgicalHistory"
							control={control}
							label="Antécédents chirurgicaux"
							placeholder="Décrivez les antécédents chirurgicaux"
						/>
						<TextAreaField
							name="allergies"
							control={control}
							label="Allergies"
							placeholder="Listez les allergies"
						/>
						<TextAreaField
							name="digestiveProblems"
							control={control}
							label="Problèmes digestifs"
							placeholder="Décrivez les problèmes digestifs"
						/>
						<FormField
							name="digestiveDoctorName"
							control={control}
							label="Médecin digestif"
							placeholder="Nom du médecin digestif"
						/>
						<FormField
							name="osteopathName"
							control={control}
							label="Nom de l'ostéopathe"
							placeholder="Entrez le nom de l'ostéopathe"
							required={false}
						/>
					</div>
				</div>

				<button
					type="submit"
					className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-lg font-semibold"
				>
					Ajouter Patient
				</button>
			</form>
		</div>
	);
};

// Composants réutilisables pour les champs du formulaire
const FormField = ({
	name,
	control,
	label,
	type = "text",
	placeholder,
	required = false,
	onChange, // Ajouter cette ligne
}) => (
	<Controller
		name={name}
		control={control}
		defaultValue=""
		render={({ field }) => (
			<div className="flex flex-col">
				<label
					htmlFor={name}
					className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-300"
				>
					{label}
				</label>
				<input
					{...field}
					type={type}
					id={name}
					placeholder={placeholder}
					className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-gray-200"
					required={required}
					aria-label={label}
					onChange={(e) => {
						const value = e.target.value;
						field.onChange(onChange ? onChange(value) : value); // Appliquer le filtre uniquement si une fonction onChange est fournie
					}}
				/>
			</div>
		)}
	/>
);

const TextAreaField = ({ name, control, label, placeholder, rows = 3 }) => (
	<Controller
		name={name}
		control={control}
		defaultValue=""
		render={({ field }) => (
			<div className="flex flex-col">
				<label
					htmlFor={name}
					className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-300"
				>
					{label}
				</label>
				<textarea
					{...field}
					id={name}
					placeholder={placeholder}
					className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-gray-200"
					rows={rows}
					aria-label={label}
				/>
			</div>
		)}
	/>
);

const SelectField = ({ name, control, label, options, required = false }) => (
	<Controller
		name={name}
		control={control}
		defaultValue=""
		render={({ field }) => (
			<div className="flex flex-col">
				<label
					htmlFor={name}
					className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-300"
				>
					{label}
				</label>
				<select
					{...field}
					id={name}
					className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-gray-200"
					required={required}
					aria-label={label}
				>
					<option value="" disabled>
						Sélectionnez une option
					</option>
					{options.map((option) => (
						<option
							key={option.value || option}
							value={option.value || option}
						>
							{option.label || option}
						</option>
					))}
				</select>
			</div>
		)}
	/>
);

const DatePickerField = ({ name, control, label }) => (
	<Controller
		name={name}
		control={control}
		render={({ field }) => (
			<div className="flex flex-col">
				<label
					htmlFor={name}
					className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-300"
				>
					{label}
				</label>
				<DatePicker
					{...field}
					id={name}
					selected={field.value}
					onChange={(date) => field.onChange(date)}
					className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-gray-200"
					placeholderText="Sélectionnez une date"
					aria-label={label}
				/>
			</div>
		)}
	/>
);

export default AddPatientForm;
