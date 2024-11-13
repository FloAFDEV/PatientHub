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
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

interface CabinetInfo {
	id?: number;
	name: string;
	address: string;
	phone: string | undefined;
	osteopathId?: number | null;
	patientCount?: number;
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
			if (!response.ok) {
				throw new Error(
					`Erreur de récupération du cabinet : ${response.status} ${response.statusText}`
				);
			}
			const data = await response.json();
			setCabinetInfo(data[0]);
			localStorage.setItem("cabinetInfo", JSON.stringify(data[0]));
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

	const handleAddCabinet = useCallback(async (newCabinet: CabinetInfo) => {
		try {
			const response = await fetch("/api/cabinet", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newCabinet),
			});
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

	const handleUpdateCabinet = useCallback(
		async (updatedCabinet: CabinetInfo) => {
			try {
				const response = await fetch(`/api/cabinet`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updatedCabinet),
				});
				if (response.ok) {
					setCabinetInfo(updatedCabinet);
					localStorage.setItem(
						"cabinetInfo",
						JSON.stringify(updatedCabinet)
					);
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
			<div className="flex items-center justify-center min-h-screen bg-slate-800">
				<div className="animate-spin h-16 w-16 border-t-4 border-blue-500 rounded-full mb-6"></div>{" "}
				<p className="text-xl text-gray-300 mt-6">
					{" "}
					Chargement en cours...
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center text-red-500 font-bold p-4">
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div className="flex-1 p-4 sm:p-6 md:p-10 mr-4 bg-gray-100 dark:bg-gray-900 flex flex-col gap-4 sm:gap-6 overflow-y-auto">
			<div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-3 sm:p-4 rounded-lg shadow-lg mb-4 flex items-center justify-between">
				<div className="flex flex-col flex-grow pr-2">
					<h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
						Bienvenue sur la fiche de votre cabinet
					</h1>
					<p className="text-sm sm:text-base">
						Retrouvez ici les informations sur votre cabinet et vos
						paramètres.
					</p>
				</div>
				<div className="flex-shrink-0 ml-2 sm:ml-4">
					<Image
						src="/assets/icons/logo-full.svg"
						alt="Logo"
						width={100}
						height={100}
						className="object-contain rounded-xl w-[60px] sm:w-[80px] md:w-[100px]"
						priority
					/>
				</div>
			</div>
			{/* Contenu principal */}
			<main className="flex-grow p-4">
				{/* Cartes d'information */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 ">
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
							<UserGroupIcon className="h-6 w-6 text-purple-500" />
						}
						title="Nombre de Patients"
						content={
							cabinetInfo?.patientCount
								? cabinetInfo.patientCount.toString()
								: "Aucune donnée disponible"
						}
						image="/assets/images/NombrePatients.webp"
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
				<span className="ml-4">{text}</span>
			</button>
		);
	}
);
ActionButton.displayName = "ActionButton";
