import React from "react";

interface ConfirmDeleteModalProps {
	onDelete: () => void;
	onCancel: () => void;
	cabinetName: string | undefined;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
	onCancel,
	onDelete,
	cabinetName,
}) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8">
			<div className="bg-white dark:bg-slate-700 rounded-lg shadow-xl w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-4xl border-4 border-red-600">
				<div className="p-4 sm:p-6 md:p-8">
					<h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
						Suppression Définitive du Cabinet
					</h2>
					<p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6">
						<span className="font-bold text-lg sm:text-xl">
							Attention:
						</span>{" "}
						Cette action est{" "}
						<span className="font-semibold text-red-600 text-lg sm:text-xl">
							irréversible
						</span>{" "}
						et entraînera la{" "}
						<span className="font-semibold text-lg sm:text-xl">
							perte permanente
						</span>{" "}
						de toutes les données associées au cabinet.
						<p className="font-extrabold text-xl text-amber-500 mt-4">
							{cabinetName}
						</p>
						Êtes-vous sûr de vouloir continuer ?
					</p>
				</div>
				<div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-4 rounded-b-lg flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
					<button
						onClick={onCancel}
						className="px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
					>
						Annuler
					</button>
					<button
						onClick={onDelete}
						className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-200 w-full sm:w-auto"
					>
						Supprimer définitivement
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmDeleteModal;
