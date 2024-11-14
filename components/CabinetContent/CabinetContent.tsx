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
		<div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
			<header className="mb-8">
				<div className="flex items-center justify-between mt-8 mr-8">
					<div>
						<h1 className="text-3xl font-bold mb-2">
							Fiche de votre cabinet
						</h1>
						<p className="text-lg opacity-90">
							Informations et paramètres de votre cabinet
						</p>
					</div>
					<Image
						src="/assets/icons/logo-full.svg"
						alt="Logo"
						width={100}
						height={100}
						className="object-contain rounded-xl"
						priority
					/>
				</div>
			</header>

			<main className="space-y-8">
				<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
				</section>

				<section className="flex flex-wrap justify-center gap-4">
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
				</section>
			</main>

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
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
			<Image
				src={image}
				alt={title}
				className="w-full h-40 object-cover"
				loading="lazy"
				width={400}
				height={200}
			/>
			<div className="p-4">
				<div className="flex items-center mb-2">
					{icon}
					<h2 className="text-lg font-semibold text-gray-800 dark:text-white ml-2">
						{title}
					</h2>
				</div>
				<p className="text-gray-600 dark:text-gray-300 break-words">
					{link ? (
						<a
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline text-blue-600 dark:text-blue-400"
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
		const colorClasses = {
			blue: "border-2 border-blue-500 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-white",
			green: "border-2 border-green-500 hover:bg-green-600 hover:text-white text-slate-700 dark:text-white",
			red: "bg-red-500 hover:bg-red-700 text-white",
		};

		return (
			<button
				onClick={onClick}
				className={`${colorClasses[color]} px-6 py-3 rounded-lg font-medium flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105`}
			>
				{icon}
				<span className="ml-2">{text}</span>
			</button>
		);
	}
);
ActionButton.displayName = "ActionButton";
