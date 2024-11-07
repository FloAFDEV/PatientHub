import React from "react";

interface ConfirmDeleteModalProps {
	onDelete: () => void;
	onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
	onCancel,
	onDelete,
}) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6 sm:p-10">
			<div className="bg-white dark:bg-slate-700 rounded-lg shadow-xl w-full max-w-md border-4 border-red-600">
				<div className="p-6 sm:p-8">
					<h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
						Suppression Définitive du Cabinet
					</h2>
					<p className="text-gray-600 dark:text-gray-300 mb-6">
						Attention : cette action est{" "}
						<span className="font-semibold text-red-600">
							irréversible
						</span>{" "}
						et entraînera la{" "}
						<span className="font-semibold">perte permanente </span>
						de toutes les données associées à ce cabinet. Êtes-vous
						sûr de vouloir continuer ?
					</p>
				</div>
				<div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
					<button
						onClick={onCancel}
						className="px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-200"
					>
						Annuler
					</button>
					<button
						onClick={onDelete}
						className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-200"
					>
						Supprimer définitivement
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmDeleteModal;
