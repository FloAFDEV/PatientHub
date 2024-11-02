import React from "react";

interface ConfirmDeleteModalProps {
	onDelete: () => void;
	onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
	onDelete,
	onCancel,
}) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-neutral-800 p-6 rounded-lg w-80 sm:w-96">
				<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
					Supprimer Cabinet
				</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-4">
					Êtes-vous sûr de vouloir supprimer ce cabinet ?
				</p>
				<div className="flex justify-end gap-2">
					<button
						onClick={onCancel}
						className="bg-gray-400 text-white px-4 py-2 rounded"
					>
						Annuler
					</button>
					<button
						onClick={onDelete}
						className="bg-red-600 text-white px-4 py-2 rounded"
					>
						Supprimer
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmDeleteModal;
