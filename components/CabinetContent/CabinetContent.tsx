import React, { useEffect, useState, useCallback } from "react";
import AddModal from "@/components/AddModal/AddModal";
import EditModal from "@/components/EditModal/EditModal";
import DeleteModal from "@/components/DeleteModal/DeleteModal";
import {
	MapPinIcon,
	PhoneIcon,
	PencilSquareIcon,
	PlusIcon,
	TrashIcon,
	BuildingOfficeIcon,
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

	const fetchCabinetInfo = useCallback(async () => {
		setLoading(true);
		setError(null);
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
	}, []);

	useEffect(() => {
		fetchCabinetInfo();
	}, [fetchCabinetInfo]);

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
			setError("Erreur lors de l'ajout du cabinet");
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
			setError("Erreur lors de la mise à jour du cabinet");
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
			setError("Erreur lors de la suppression du cabinet");
		}
	};

	const handleDeleteCabinet = () => {
		if (cabinetInfo?.id) {
			setIsConfirmDeleteOpen(true);
		}
	};

	if (loading) {
		return (
			<p className="text-center">
				Chargement des informations du cabinet...
			</p>
		);
	}

	if (error) {
		return <p className="text-red-500 text-center">{error}</p>;
	}

	return (
		<div className="flex flex-col flex-1 p-4 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
			{/* En-tête */}
			<header className="mb-6">
				<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
					<h1 className="text-2xl sm:text-3xl font-bold mb-2">
						Bienvenue sur la fiche de votre cabinet
					</h1>
					<p className="text-base sm:text-lg">
						Retrouvez ici les informations sur votre cabinet et vos
						paramètres.
					</p>
				</div>
			</header>

			{/* Contenu principal */}
			<main className="flex-grow">
				{loading && (
					<p className="text-center text-gray-600 dark:text-gray-400">
						Chargement des informations du cabinet...
					</p>
				)}
				{error && <p className="text-red-500 text-center">{error}</p>}

				{/* Cartes d'information */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
					<InfoCard
						icon={
							<BuildingOfficeIcon className="h-6 w-6 text-blue-500" />
						}
						title="Nom du Cabinet"
						content={
							cabinetInfo ? cabinetInfo.name : "Non Disponible"
						}
					/>
					<InfoCard
						icon={<MapPinIcon className="h-6 w-6 text-amber-500" />}
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

				{/* Boutons d'action */}
				<div className="flex flex-wrap justify-center gap-4">
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
			</main>

			{/* Modales */}
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

interface InfoCardProps {
	icon: React.ReactNode;
	title: string;
	content: string | undefined;
	link?: string;
}

const InfoCard: React.FC<InfoCardProps> = React.memo(
	({ icon, title, content, link }) => (
		<div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex-1">
			<div className="flex items-center mb-2 sm:mb-4">
				{icon}
				<h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white ml-2">
					{title}
				</h2>
			</div>
			<p className="text-gray-600 text-lg dark:text-amber-300 break-words">
				{link ? (
					<a
						href={link}
						target="_blank"
						rel="noopener noreferrer"
						className="dark:text-amber-300 hover:underline"
					>
						{content || "Non disponible"}
					</a>
				) : (
					content || "Non disponible"
				)}
			</p>
		</div>
	)
);

interface ActionButtonProps {
	onClick: () => void;
	icon: React.ReactNode;
	text: string;
	color: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
	onClick,
	icon,
	text,
	color,
}) => (
	<button
		onClick={onClick}
		className={`w-full sm:w-auto bg-${color}-500 hover:bg-${color}-600 text-slate-900 font-bold py-2 px-4 rounded flex items-center justify-center transition duration-300 ease-in-out`}
	>
		{icon}
		<span className="ml-2">{text}</span>
	</button>
);

export default CabinetContent;
