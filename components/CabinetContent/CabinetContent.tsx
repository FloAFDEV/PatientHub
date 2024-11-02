import React from "react";

const CabinetContent: React.FC = () => (
	<div className="flex-1 p-4 sm:p-6 md:p-10 bg-white dark:bg-neutral-900">
		<h1 className="text-2xl sm:text-3xl font-bold mb-4">
			Bienvenue dans votre Cabinet
		</h1>
		<p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
			Voici des informations sur votre cabinet et vos paramètres.
		</p>
		<div className="bg-gray-100 dark:bg-neutral-800 p-4 sm:p-6 rounded-lg shadow-lg">
			<h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
				Détails du Cabinet
			</h2>
			<p className="text-sm text-gray-600 dark:text-gray-400">
				Informations sur le cabinet, telles que l'adresse, les horaires,
				les contacts, etc.
			</p>
		</div>
	</div>
);

export default CabinetContent;
