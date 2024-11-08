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
import Image from "next/image";

interface CabinetInfo {
	id?: number;
	name: string;
	address: string;
	phone: string | undefined;
	osteopathId?: number | null;
	patientsCount?: number;
}

const CabinetContent: React.FC = () => {
	const [cabinetInfo, setCabinetInfo] = useState<CabinetInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [isAddMode, setIsAddMode] = useState(false);
	const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
	const [patientCount, setPatientCount] = useState<number>(0);

	const fetchCabinetInfo = useCallback(async () => {
		setLoading(true);
		setError(null);

		// Vérification dans le cache local
		const cachedData = localStorage.getItem("cabinetInfo");
		if (cachedData) {
			setCabinetInfo(JSON.parse(cachedData));
			setLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/cabinet");
			if (!response.ok) {
				const errorMessage = `Erreur de récupération du cabinet : ${response.status} ${response.statusText}`;
				throw new Error(errorMessage);
			}
			const data = await response.json();

			if (data && data.patientsCount !== undefined) {
				setCabinetInfo(data);
				setPatientCount(data.patientsCount); // Utilisation du patientsCount retourné par l'API
			} else {
				throw new Error(
					"Les données du cabinet sont dans un format inattendu"
				);
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Une erreur inconnue s'est produite";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCabinetInfo();
	}, [fetchCabinetInfo]);

	const handleAddCabinet = useCallback(async (cabinetData: CabinetInfo) => {
		try {
			const response = await fetch("/api/cabinet");
			if (!response.ok)
				throw new Error("Erreur de récupération du cabinet");
			const data = await response.json();
			setCabinetInfo(data[0]); // Assurez-vous que data[0] contient bien les informations souhaitées
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

	const handleUpdateCabinet = useCallback(
		async (updatedCabinet: CabinetInfo) => {
			try {
				const response = await fetch(`/api/cabinet`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updatedCabinet),
				});
				if (response.ok) {
					// Mise à jour locale
					setCabinetInfo(updatedCabinet);
				}
			} catch (error) {
				console.error("Erreur de mise à jour :", error);
				setError("Erreur lors de la mise à jour du cabinet");
			}
		},
		[]
	);

	const deleteCabinet = useCallback(async (id: number) => {
		if (!id) return;
		try {
			const response = await fetch(`/api/cabinet?id=${id}`, {
				method: "DELETE",
			});
			if (response.ok) setCabinetInfo(null);
		} catch (error) {
			console.error("Erreur de suppression :", error);
			setError("Erreur lors de la suppression du cabinet");
		}
	}, []);

	const handleDeleteCabinet = useCallback(() => {
		if (cabinetInfo?.id) setIsConfirmDeleteOpen(true);
	}, [cabinetInfo]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen bg-slate-800">
				<div className="flex flex-col items-center justify-center">
					<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4"></div>
					<p className="text-lg text-gray-500 dark:text-gray-400">
						Chargement des patients...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<p className="text-center text-red-500 font-semibold">{error}</p>
		);
	}

	return (
		<div className="flex flex-col flex-1 p-8 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
			{/* En-tête */}
			<header className="mb-6">
				<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 mb-10 mt-10 sm:p-6 rounded-lg shadow-lg">
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
			<main className="flex-grow p-4">
				{/* Cartes d'information */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 ">
					<div className="cabinet-info">
						<h2>{cabinetInfo?.name}</h2>
						<p>{cabinetInfo?.address}</p>
						<p>{cabinetInfo?.phone}</p>
						{/* Affichage du nombre de patients */}
						<p>Nombre de patients : {patientCount}</p>
					</div>
					<InfoCard
						icon={
							<BuildingOfficeIcon className="h-6 w-6 text-blue-500" />
						}
						title="Nom du Cabinet"
						content={cabinetInfo?.name || "Non Disponible"}
						image="/assets/images/cabinetGratentour.webp"
					/>
					<InfoCard
						icon={<MapPinIcon className="h-6 w-6 text-amber-500" />}
						title="Adresse"
						content={cabinetInfo?.address || "Non Disponible"}
						link={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
							cabinetInfo?.address || ""
						)}`}
						image="/assets/images/adresseGratentour.webp"
					/>
					<InfoCard
						icon={<PhoneIcon className="h-6 w-6 text-green-500" />}
						title="Téléphone"
						content={cabinetInfo?.phone || "Non Disponible"}
						link={`tel:${cabinetInfo?.phone}`}
						image="/assets/images/phoneGratentour.webp"
					/>
					<InfoCard
						icon={
							<BuildingOfficeIcon className="h-6 w-6 text-purple-500" />
						}
						title="Nombre de Patients"
						content={
							patientCount
								? patientCount.toString()
								: "Aucune donnée disponible"
						}
						image="/assets/images/cabinetGratentour.webp"
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
						if (cabinetInfo?.id) deleteCabinet(cabinetInfo.id);
						setIsConfirmDeleteOpen(false);
					}}
					onCancel={() => setIsConfirmDeleteOpen(false)}
				/>
			)}
		</div>
	);
};

export default CabinetContent;

interface InfoCardProps {
	icon: React.ReactNode;
	title: string;
	image: string;
	content: string | undefined;
	link?: string;
}

const InfoCard: React.FC<InfoCardProps> = React.memo(
	({ icon, title, content, link, image }) => (
		<div
			className="bg-white dark:bg-slate-700 rounded-lg shadow-md hover:shadow-2xl  
                flex flex-col overflow-hidden border border-blue-300
                hover:scale-105 hover:border-blue-500 transition-transform transform duration-300"
		>
			{" "}
			<Image
				src={image}
				alt={title}
				className="w-full h-32 object-cover rounded-md"
				loading="lazy"
				width={400}
				height={200}
			/>
			<div className="p-4 flex flex-col flex-grow">
				<div className="flex items-center mb-2">
					{icon}
					<h2 className="text-base font-semibold text-gray-800 dark:text-white ml-2">
						{title}
					</h2>
				</div>
				<p className="text-gray-600 text-lg font-light dark:text-white break-words flex-grow">
					{link ? (
						<a
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							className="dark:text-white hover:underline"
						>
							{content}
						</a>
					) : (
						content
					)}
				</p>
			</div>
		</div>
	)
);
InfoCard.displayName = "InfoCard";

interface ActionButtonProps {
	onClick: () => void;
	icon: React.ReactNode;
	text: string;
	color: "blue" | "green" | "red";
}

const ActionButton: React.FC<ActionButtonProps> = React.memo(
	({ onClick, icon, text, color }) => {
		const getColorClasses = (color: string) => {
			switch (color) {
				case "blue":
					return "border border-blue-500 hover:bg-blue-600";
				case "green":
					return "border border-green-500 hover:bg-green-600";
				case "red":
					return "border border-red-500 hover:bg-red-600";
				default:
					return "bg-gray-500 hover:bg-gray-600";
			}
		};

		return (
			<button
				onClick={onClick}
				className={`${getColorClasses(
					color
				)} w-full sm:w-auto max-w-xs dark:text-white font-light text-zinc-700 hover:text-white py-2 px-4 rounded flex items-center justify-center transition duration-300 ease-in-out`}
			>
				{icon}
				<span className="ml-2">{text}</span>
			</button>
		);
	}
);
ActionButton.displayName = "ActionButton";
