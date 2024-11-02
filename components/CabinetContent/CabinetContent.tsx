import React, { useEffect, useState } from "react";
import AddModal from "@/components/AddModal/AddModal";
import EditModal from "@/components/EditModal/EditModal";
import DeleteModal from "@/components/DeleteModal/DeleteModal";
import {
	MapPinIcon,
	PhoneIcon,
	PencilSquareIcon,
	PlusIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";

interface CabinetInfo {
	id?: number;
	name: string;
	address: string;
	phone: string | undefined;
	osteopathId?: number | null;
}

const CabinetContent: React.FC = () => {
	const [cabinetInfo, setCabinetInfo] = useState<CabinetInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [isAddMode, setIsAddMode] = useState(false);
	const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

	const fetchCabinetInfo = async () => {
		setLoading(true);
		setError(null); // Reset error state
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

	const deleteCabinet = async (id: number) => {
		if (!id) return;
		try {
			const response = await fetch(`/api/cabinet?id=${id}`, {
				method: "DELETE",
			});
			if (response.ok) {
				setCabinetInfo(null);
			}
		} catch (error) {
			console.error("Erreur de suppression :", error);
		}
	};

	const handleDeleteCabinet = () => {
		if (cabinetInfo?.id) {
			setIsConfirmDeleteOpen(true);
		}
	};

	return (
		<div className="flex-1 p-4 sm:p-6 md:p-10 bg-white dark:bg-neutral-900 flex flex-col gap-6 overflow-y-auto">
			<div className="mt-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
				<h1 className="text-3xl font-bold mb-2">
					Bienvenue dans votre Cabinet
				</h1>
				<h2 className="text-2xl font-semibold mb-4">
					{cabinetInfo
						? cabinetInfo.name
						: "Nom du Cabinet Non Disponible"}
				</h2>
				<p className="text-lg">
					Voici des informations sur votre cabinet et vos paramètres.
				</p>
			</div>

			{loading && <p>Chargement des informations du cabinet...</p>}
			{error && <p className="text-red-500">{error}</p>}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<InfoCard
					icon={<MapPinIcon className="h-6 w-6 text-blue-500" />}
					title="Adresse"
					content={cabinetInfo?.address}
					link={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
						cabinetInfo?.address || ""
					)}`}
				/>
				<InfoCard
					icon={<PhoneIcon className="h-6 w-6 text-green-500" />}
					title="Téléphone"
					content={cabinetInfo?.phone}
					link={`tel:${cabinetInfo?.phone}`}
				/>
			</div>

			<div className="flex flex-wrap gap-4 mt-6">
				<ActionButton
					onClick={() => setIsEditMode(true)}
					icon={<PencilSquareIcon className="h-5 w-5" />}
					text="Modifier les Infos"
					color="blue"
				/>
				<ActionButton
					onClick={() => setIsAddMode(true)}
					icon={<PlusIcon className="h-5 w-5" />}
					text="Ajouter un Cabinet"
					color="green"
				/>
				<ActionButton
					onClick={handleDeleteCabinet}
					icon={<TrashIcon className="h-5 w-5" />}
					text="Supprimer le Cabinet"
					color="red"
				/>
			</div>

			{isEditMode && cabinetInfo && (
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
			{isConfirmDeleteOpen && (
				<DeleteModal
					onDelete={() => {
						if (cabinetInfo?.id) {
							deleteCabinet(cabinetInfo.id);
						}
						setIsConfirmDeleteOpen(false);
					}}
					onCancel={() => setIsConfirmDeleteOpen(false)}
				/>
			)}
		</div>
	);
};

// Composant pour afficher les informations du cabinet
const InfoCard: React.FC<{
	icon: React.ReactNode;
	title: string;
	content?: string | null;
	link?: string;
}> = ({ icon, title, content, link }) => (
	<div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
		<div className="flex items-center mb-4">
			{icon}
			<h2 className="text-xl font-semibold text-gray-800 dark:text-white ml-2">
				{title}
			</h2>
		</div>
		<p className="text-gray-600 dark:text-gray-300">
			{link ? (
				<a
					href={link}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-500 hover:underline"
				>
					{content || "Non disponible"}
				</a>
			) : (
				content || "Non disponible"
			)}
		</p>
	</div>
);

// Composant pour les boutons d'action
const ActionButton: React.FC<{
	onClick: () => void;
	icon: React.ReactNode;
	text: string;
	color: string;
}> = ({ onClick, icon, text, color }) => (
	<button
		onClick={onClick}
		className={`bg-${color}-500 hover:bg-${color}-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300 ease-in-out transform hover:scale-105`}
	>
		{icon}
		<span className="ml-2">{text}</span>
	</button>
);

export default CabinetContent;
