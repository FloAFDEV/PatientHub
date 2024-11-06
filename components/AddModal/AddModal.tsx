import React, { useState } from "react";

interface CabinetInfo {
	id?: number;
	name: string;
	address: string;
	phone: string | undefined;
	osteopathId?: number | null;
}

interface AddModalProps {
	onSubmit: (data: CabinetInfo) => void;
	onCancel: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ onSubmit, onCancel }) => {
	const [formData, setFormData] = useState<CabinetInfo>({
		name: "",
		address: "",
		phone: undefined,
		osteopathId: null,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6 sm:p-10">
			<div className="bg-white dark:bg-gray-900rounded-lg shadow-xl w-full max-w-md">
				<div className="p-4 sm:p-6">
					<h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
						Ajouter Cabinet
					</h2>
					<form className="space-y-3 sm:space-y-4">
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="Nom du cabinet"
							className="text-xs sm:text-sm w-full p-2 sm:p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition duration-200"
						/>
						<input
							type="text"
							name="address"
							value={formData.address}
							onChange={handleChange}
							placeholder="Adresse"
							className="text-xs sm:text-sm w-full p-2 sm:p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition duration-200"
						/>
						<input
							type="tel"
							name="phone"
							value={formData.phone || ""}
							onChange={handleChange}
							placeholder="Téléphone"
							className="text-xs sm:text-sm w-full p-2 sm:p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition duration-200"
						/>
					</form>
				</div>
				<div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 rounded-b-lg flex justify-end space-x-2 sm:space-x-3">
					<button
						onClick={onCancel}
						className="px-3 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-200"
					>
						Annuler
					</button>
					<button
						onClick={() => onSubmit(formData)}
						className="px-3 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
					>
						Ajouter
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddModal;
