import React, { useEffect, useState } from "react";
import AddModal from "@/components/AddModal/AddModal";

interface CabinetInfo {
	id?: number;
	name: string;
	address: string;
	phone: string | null;
	osteopathId: number | null;
}

const CabinetContent: React.FC = () => {
	const [cabinetInfo, setCabinetInfo] = useState<CabinetInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [isAddMode, setIsAddMode] = useState(false);

	const fetchCabinetInfo = async () => {
		try {
			const response = await fetch("/api/cabinet");
			if (!response.ok)
				throw new Error("Erreur de récupération du cabinet");
			const data = await response.json();
			setCabinetInfo(data[0]);
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Une erreur inconnue s'est produite"
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCabinetInfo();
	}, []);

	const handleAddCabinet = async (cabinetData: CabinetInfo) => {
		try {
			const response = await fetch("/api/cabinet", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(cabinetData),
			});
			if (response.ok) fetchCabinetInfo();
		} catch (error) {
			console.error("Erreur d'ajout :", error);
		}
	};

	const handleUpdateCabinet = async (updatedCabinet: CabinetInfo) => {
		try {
			const response = await fetch(`/api/cabinet`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updatedCabinet),
			});
			if (response.ok) fetchCabinetInfo();
		} catch (error) {
			console.error("Erreur de mise à jour :", error);
		}
	};

	const handleDeleteCabinet = async () => {
		if (!cabinetInfo?.id) return;
		try {
			const response = await fetch(`/api/cabinet?id=${cabinetInfo.id}`, {
				method: "DELETE",
			});
			if (response.ok) setCabinetInfo(null);
		} catch (error) {
			console.error("Erreur de suppression :", error);
		}
	};

	if (loading) return <p>Chargement des informations...</p>;
	if (error) return <p>Erreur : {error}</p>;

	return (
		<div className="flex-1 p-4 sm:p-6 md:p-10 bg-white dark:bg-neutral-900 flex flex-col gap-4 sm:gap-6 overflow-y-auto">
			<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 sm:p-6 rounded-lg shadow-lg mb-4">
				<h1 className="text-2xl sm:text-3xl font-bold mb-2">
					Bienvenue dans votre Cabinet
				</h1>
				<h2 className="text-xl sm:text-2xl font-semibold mb-4">
					{cabinetInfo
						? cabinetInfo.name
						: "Nom du Cabinet Non Disponible"}
				</h2>
				<p className="text-base sm:text-lg">
					Voici des informations sur votre cabinet et vos paramètres.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-white dark:bg-neutral-800 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
					<h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
						Adresse
					</h2>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						<a
							href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
								cabinetInfo?.address || ""
							)}`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-500 hover:underline"
						>
							{cabinetInfo?.address || "Non disponible"}
						</a>
					</p>
				</div>

				<div className="bg-white dark:bg-neutral-800 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
					<h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
						Téléphone
					</h2>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						<a
							href={`tel:${cabinetInfo?.phone}`}
							className="text-blue-500 hover:underline"
						>
							{cabinetInfo?.phone || "Non disponible"}
						</a>
					</p>
				</div>
			</div>

			<div className="flex gap-4 mt-6">
				<button
					onClick={() => setIsEditMode(true)}
					className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Modifier les Infos
				</button>
				<button
					onClick={() => setIsAddMode(true)}
					className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
				>
					Ajouter un Cabinet
				</button>
				<button
					onClick={handleDeleteCabinet}
					className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
				>
					Supprimer le Cabinet
				</button>
			</div>

			{/* Modal pour ajouter ou modifier les informations */}
			{isEditMode && (
				<EditModal
					initialData={cabinetInfo}
					onSubmit={(data) => {
						handleUpdateCabinet(data);
						setIsEditMode(false);
					}}
					onCancel={() => setIsEditMode(false)}
				/>
			)}
			{isAddMode && (
				<AddModal
					onSubmit={(data) => {
						handleAddCabinet(data);
						setIsAddMode(false);
					}}
					onCancel={() => setIsAddMode(false)}
				/>
			)}
		</div>
	);
};

// Composants EditModal et AddModal non définis ici, à créer séparément avec des champs pour nom, adresse, téléphone, etc.

export default CabinetContent;
