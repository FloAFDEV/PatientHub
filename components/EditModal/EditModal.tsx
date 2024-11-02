import React, { useState } from "react";

// Define the CabinetInfo type
interface CabinetInfo {
	name: string;
	address: string;
	phone?: string;
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
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-neutral-800 p-6 rounded-lg w-80 sm:w-96">
				<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
					Modifier Cabinet
				</h2>
				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleChange}
					placeholder="Nom du cabinet"
					className="w-full mb-4 p-2 rounded border border-gray-300"
				/>
				<input
					type="text"
					name="address"
					value={formData.address}
					onChange={handleChange}
					placeholder="Adresse"
					className="w-full mb-4 p-2 rounded border border-gray-300"
				/>
				<input
					type="tel"
					name="phone"
					value={formData.phone || ""}
					onChange={handleChange}
					placeholder="Téléphone"
					className="w-full mb-4 p-2 rounded border border-gray-300"
				/>
				<div className="flex justify-end gap-2">
					<button
						onClick={onCancel}
						className="bg-gray-400 text-white px-4 py-2 rounded"
					>
						Annuler
					</button>
					<button
						onClick={() => onSubmit(formData)}
						className="bg-blue-600 text-white px-4 py-2 rounded"
					>
						Enregistrer
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditModal;
