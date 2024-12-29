import React from "react";

interface ConfirmDeletePatientModalProps {
	onDelete: () => void;
	onCancel: () => void;
	patientName: string;
}

const ConfirmDeletePatientModal: React.FC<ConfirmDeletePatientModalProps> = ({
	onCancel,
	onDelete,
	patientName,
}) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-10">
			<div className="bg-white dark:bg-slate-700 rounded-lg shadow-xl w-full max-w-md border-4 border-red-600">
				<div className="p-6 sm:p-6">
					<h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
						Suppression des Données Patient
					</h2>
					<p className="text-gray-600 dark:text-gray-300 mb-6">
						Attention : cette action est{" "}
						<span className="font-semibold text-red-600">
							irréversible
						</span>{" "}
						et entraînera la perte permanente de toutes les données
						associées à ce patient. Cependant, certaines
						informations peuvent être nécessaires pour des raisons
						légales, médicales ou administratives (par exemple, la
						conservation des dossiers médicaux).{" "}
						<span className="font-bold">
							Êtes-vous sûr de vouloir supprimer{" "}
						</span>
						<div className="font-semibold text-accent text-3xl text-amber-500 mt-2">
							{patientName}
						</div>
						<span className="font-bold">
							{" "}
							de manière définitive ?
						</span>
					</p>
					<div className="text-sm text-gray-500 dark:text-gray-400">
						<span className="font-semibold">Remarque : </span> en
						fonction des régulations locales (comme le RGPD ou le
						Code de la Santé Publique), certaines données doivent
						être conservées pendant une période déterminée, par
						exemple :
					</div>
					<ul className="list-disc pl-6 mt-2">
						<li>
							Selon l&apos;**Article L1142-28 du Code de la Santé
							Publique** en France, les dossiers médicaux doivent
							être conservés pendant **20 ans** après le dernier
							contact avec le patient.
						</li>
						<li>
							Le **Règlement Général sur la Protection des Données
							(RGPD)** permet la conservation des données
							médicales pour des raisons de santé publique, de
							suivi médical, ou d&apos;archivage scientifique,
							même en cas de demande de suppression.
						</li>
					</ul>
					<div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
						Assurez-vous que cette suppression est conforme aux
						exigences légales et aux besoins de suivi médical.
					</div>
				</div>
				<div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
					<button
						onClick={onCancel}
						className="px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
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

export default ConfirmDeletePatientModal;
