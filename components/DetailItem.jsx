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
			<span className="font-semibold text-xs sm:text-sm text-gray-600 dark:text-gray-200 mb-1 sm:mb-0">
				{label}
			</span>
			{editable ? (
				field === "birthDate" ? (
					<input
						key={field} // Utilisation d'une clé dynamique pour éviter les re-rendus complets
						ref={inputRef}
						type="date"
						value={
							value
								? new Date(value).toISOString().split("T")[0] // Format date en format "YYYY-MM-DD"
								: ""
						}
						onChange={handleDateChange}
						className="text-xs sm:text-sm bg-inherit text-gray-800 dark:bg-inherit dark:text-gray-200 sm:w-56 w-auto sm:text-right p-2 border border-gray-300 dark:border-gray-700 rounded-md"
					/>
				) : (
					<input
						key={field} // Utilisation d'une clé dynamique pour éviter les re-rendus complets
						ref={inputRef}
						type="text"
						value={value}
						onChange={handleDateChange}
						className="text-xs sm:text-sm bg-inherit text-gray-800 dark:bg-inherit dark:text-gray-200 sm:w-56 w-auto sm:text-right p-2 border border-gray-300 dark:border-gray-700 rounded-md"
					/>
				)
			) : field === "birthDate" ? (
				<p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 break-words sm:w-auto sm:text-right">
					{value
						? new Date(value).toLocaleDateString("fr-FR")
						: "Non renseignée"}{" "}
				</p>
			) : (
				<p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 break-words sm:w-auto sm:text-right">
					{value}
				</p>
			)}
		</div>
	);
};

export default DetailItem;
