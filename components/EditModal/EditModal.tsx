import React, { useState } from "react";

interface CabinetInfo {
	id?: number;
	name: string;
	address: string;
	phone: string | undefined;
	osteopathId?: number | null;
}

interface EditModalProps {
	initialData: CabinetInfo;
	onSubmit: (data: CabinetInfo) => void;
	onCancel: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
	initialData,
	onSubmit,
	onCancel,
}) => {
	const [formData, setFormData] = useState<CabinetInfo>(initialData);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6 sm:p-10">
			<div className="border-4 border-blue-400 bg-white dark:bg-slate-700 rounded-lg shadow-xl w-full max-w-md">
				<div className="p-6 sm:p-8 ">
					<h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
						Modifier Cabinet
					</h2>
					<form className="space-y-6">
						{/** Nom du Cabinet */}
						<div className="relative">
							<input
								id="name"
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="peer w-full p-3 rounded-md border border-blue-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-transparent"
								placeholder="Nom du cabinet"
							/>
							<label
								htmlFor="name"
								className="absolute left-3 -top-3.5 text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-1 peer-placeholder-shown:top-3 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-500"
							>
								Nom du cabinet
							</label>
						</div>

						{/** Adresse */}
						<div className="relative">
							<input
								id="address"
								type="text"
								name="address"
								value={formData.address}
								onChange={handleChange}
								className="peer w-full p-3 rounded-md border border-blue-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-transparent"
								placeholder="Adresse"
							/>
							<label
								htmlFor="address"
								className="absolute left-3 -top-3.5 text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-1 peer-placeholder-shown:top-3 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-500"
							>
								Adresse
							</label>
						</div>

						{/** Téléphone */}
						<div className="relative">
							<input
								id="phone"
								type="tel"
								name="phone"
								value={formData.phone || ""}
								onChange={handleChange}
								className="peer w-full p-3 rounded-md border border-blue-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-transparent"
								placeholder="Téléphone"
							/>
							<label
								htmlFor="phone"
								className="absolute left-3 -top-3.5 text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-1 peer-placeholder-shown:top-3 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-500"
							>
								Téléphone
							</label>
						</div>
					</form>
				</div>
				<div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 rounded-b-lg flex justify-end space-x-3">
					<button
						onClick={onCancel}
						className="px-4 py-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200"
					>
						Annuler
					</button>
					<button
						onClick={() => onSubmit(formData)}
						className="px-4 py-2 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
					>
						Enregistrer
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditModal;
