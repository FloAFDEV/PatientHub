import React, { useRef, useEffect } from "react";

const DetailItem = ({ label, value, editable, onChange, field }) => {
	const inputRef = useRef(null);

	// Utilisation de useEffect pour mettre le focus uniquement quand editable change
	useEffect(() => {
		if (editable && inputRef.current) {
			inputRef.current.focus();
		}
	}, [editable]);

	// Fonction pour formater la date avant de l'envoyer
	const formatDateToISO = (date) => {
		if (!date) return "";
		if (date.includes("T")) return date;
		return new Date(date).toISOString();
	};

	const handleDateChange = (e) => {
		let inputValue = e.target.value;
		if (field === "birthDate") {
			inputValue = formatDateToISO(inputValue);
		}
		onChange(inputValue);
	};

	return (
		<div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-300 dark:border-gray-700 gap-2">
			<span className="font-semibold text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-0">
				{label}
			</span>
			{editable ? (
				field === "birthDate" ? (
					<input
						key={field}
						ref={inputRef}
						type="date"
						value={
							value
								? new Date(value).toISOString().split("T")[0]
								: ""
						}
						onChange={handleDateChange}
						className="text-xs sm:text-sm bg-inherit text-gray-800 dark:text-gray-200 w-full sm:text-right p-2 border border-gray-300 dark:border-gray-700 rounded-md"
					/>
				) : (
					<select
						key={field}
						value={value}
						onChange={handleDateChange}
						className="text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 w-full sm:text-right p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring focus:ring-blue-500"
					>
						<option value="" disabled>
							Sélectionnez une option
						</option>
						{/* Ajouter vos options dynamiquement ici */}
						<option value="option1">Option 1</option>
						<option value="option2">Option 2</option>
					</select>
				)
			) : field === "birthDate" ? (
				<p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 break-words w-full sm:text-right">
					{value
						? new Date(value).toLocaleDateString("fr-FR")
						: "Non renseignée"}{" "}
				</p>
			) : (
				<p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 break-words w-full sm:text-right">
					{value}
				</p>
			)}
		</div>
	);
};

export default DetailItem;
