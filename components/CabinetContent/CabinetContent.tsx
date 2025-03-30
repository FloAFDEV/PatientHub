import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddModal from "@/components/AddModal/AddModal";
import EditModal from "@/components/EditModal/EditModal";
import DeleteModal from "@/components/DeleteModal/DeleteModal";
import InfoCard from "../InfoCards";
import ActionButton from "../Buttons";
import {
	MapPinIcon,
	PhoneIcon,
	PencilSquareIcon,
	PlusIcon,
	TrashIcon,
	BuildingOfficeIcon,
	UserGroupIcon,
	ArrowPathIcon,
} from "@heroicons/react/24/outline";

// --------------------------------------------------
// TypeScript Interface pour nos données
// --------------------------------------------------
interface CabinetInfo {
	id?: number;
	name: string;
	address: string;
	phone: string | undefined;
	osteopathId?: number | null;
	patientCount?: number;
}

// --------------------------------------------------
// Composant Principal
// --------------------------------------------------
const CabinetContent: React.FC = () => {
	// ------------------------------------------------
	// States
	// ------------------------------------------------
	const [cabinetInfo, setCabinetInfo] = useState<CabinetInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Gère l'ouverture/fermeture de modales
	const [isEditMode, setIsEditMode] = useState(false);
	const [isAddMode, setIsAddMode] = useState(false);
	const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

	// ------------------------------------------------
	// Récupération des infos Cabinet
	// ------------------------------------------------
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
			// Stocke les informations localement (optionnel)
			localStorage.setItem("cabinetInfo", JSON.stringify(data[0]));
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Une erreur inconnue s'est produite."
			);
		} finally {
			setLoading(false);
		}
	}, []);

	// On exécute `fetchCabinetInfo` au montage
	useEffect(() => {
		fetchCabinetInfo();
	}, [fetchCabinetInfo]);

	// ------------------------------------------------
	// Handlers: Création, Modification, Suppression
	// ------------------------------------------------

	/**
	 * Ajoute un nouveau cabinet
	 */
	const handleAddCabinet = useCallback(async (newCabinet: CabinetInfo) => {
		try {
			if (newCabinet.osteopathId && isNaN(newCabinet.osteopathId)) {
				throw new Error(
					"L'ID de l'ostéopathe doit être un entier valide."
				);
			}
			const response = await fetch("/api/cabinet", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newCabinet),
			});
			if (!response.ok) {
				throw new Error("Erreur lors de l'ajout du cabinet.");
			}

			const data = await response.json();
			setCabinetInfo(data);

			toast.success("Nouveau cabinet ajouté avec succès !");
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Une erreur inconnue s'est produite."
			);
			toast.error("Échec de l'ajout du cabinet !");
		}
	}, []);

	/**
	 * Met à jour un cabinet existant
	 */
	const handleUpdateCabinet = useCallback(
		async (updatedCabinet: CabinetInfo) => {
			try {
				const response = await fetch(`/api/cabinet`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updatedCabinet),
				});

				if (!response.ok) {
					throw new Error("Erreur lors de la mise à jour.");
				}

				// Si tout est ok
				setCabinetInfo(updatedCabinet);
				localStorage.setItem(
					"cabinetInfo",
					JSON.stringify(updatedCabinet)
				);
				toast.success(
					"Informations du cabinet mises à jour avec succès !"
				);
			} catch (err) {
				console.error("Erreur de mise à jour :", err);
				setError("Erreur lors de la mise à jour du cabinet.");
				toast.error("Échec de la mise à jour du cabinet !");
			}
		},
		[]
	);

	/**
	 * Supprime un cabinet (via ID)
	 */
	const deleteCabinet = useCallback(async (id: number) => {
		if (!id) return;

		try {
			const response = await fetch(`/api/cabinet?id=${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setCabinetInfo(null);
				toast.success("Cabinet supprimé avec succès !");
			} else {
				throw new Error("Erreur lors de la suppression du cabinet.");
			}
		} catch (err) {
			console.error("Erreur de suppression :", err);
			setError("Erreur lors de la suppression du cabinet.");
			toast.error("Échec de la suppression du cabinet !");
		}
	}, []);

	/**
	 * Ouvre la modale de confirmation de suppression
	 */
	const handleDeleteCabinet = useCallback(() => {
		if (cabinetInfo?.id) {
			setIsConfirmDeleteOpen(true);
		}
	}, [cabinetInfo]);

	// ------------------------------------------------
	// Rendu: Gestion des états
	// ------------------------------------------------

	/**
	 * État de chargement
	 */
	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100 dark:bg-gray-900">
				<div className="flex justify-center items-center h-screen">
					<div className="w-full h-full flex justify-center items-center">
						<div className="absolute animate-ping h-[16rem] w-[16rem] rounded-full border-t-4 border-b-4 border-red-500"></div>
						<div className="absolute animate-spin h-[14rem] w-[14rem] rounded-full border-t-4 border-b-4 border-purple-500"></div>
						<div className="absolute animate-ping h-[12rem] w-[12rem] rounded-full border-t-4 border-b-4 border-pink-500"></div>
						<div className="absolute animate-spin h-[10rem] w-[10rem] rounded-full border-t-4 border-b-4 border-yellow-500"></div>
						<div className="absolute animate-ping h-[8rem] w-[8rem] rounded-full border-t-4 border-b-4 border-green-500"></div>
						<div className="absolute animate-spin h-[6rem] w-[6rem] rounded-full border-t-4 border-b-4 border-blue-500"></div>
						<div className="rounded-full h-28 w-28 animate-bounce flex items-center justify-center text-gray-500 font-semibold text-3xl dark:text-gray-100">
							Chargement...
						</div>
					</div>
				</div>
			</div>
		);
	}

	/**
	 * État d'erreur
	 */
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100 dark:bg-gray-900 p-4">
				<div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 max-w-md w-full text-center">
					<div className="text-red-500 dark:text-red-400 text-lg font-medium mb-2">
						{error}
					</div>
					<button
						onClick={fetchCabinetInfo}
						className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
					>
						<ArrowPathIcon className="h-4 w-4 mr-2" />
						Réessayer
					</button>
				</div>
			</div>
		);
	}

	// ------------------------------------------------
	// Rendu principal
	// ------------------------------------------------
	return (
		<div className="flex-1 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto min-h-screen">
			<ToastContainer />

			{/* En-tête */}
			<header className="mb-8">
				<div className="relative w-full h-48 md:h-64 lg:h-72 overflow-hidden rounded-lg shadow-xl mb-8">
					<Image
						src="/assets/images/CabinetDetails.webp"
						alt="Cabinet design et moderne"
						fill
						style={{
							objectFit: "cover",
							objectPosition: "center 30%",
						}}
						className="opacity-80"
						priority
					/>
					<div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 bg-black bg-opacity-40 rounded-lg backdrop-blur-sm">
						<h1 className="mt-2 text-3xl font-bold drop-shadow-sm">
							Votre cabinet
						</h1>
						<p className="hidden sm:block text-base sm:text-lg md:text-xl drop-shadow-sm max-w-2xl">
							Informations et paramètres de votre cabinet
						</p>
					</div>
				</div>
			</header>

			{/* Contenu principal */}
			<main className="space-y-6 sm:space-y-8">
				{/* Section: Cartes d'information */}
				<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
						explanation="Nombre total de patients enregistrés (décédés ou vivants)."
					/>
				</section>

				{/* Section: Boutons d'actions */}
				<section className="flex flex-wrap justify-center gap-3 sm:gap-4">
					<ActionButton
						onClick={() => setIsEditMode(true)}
						icon={<PencilSquareIcon className="h-5 w-5" />}
						text="Modifier les Infos"
						color="blue"
						aria-label="Modifier les informations du cabinet"
					/>
					<ActionButton
						onClick={() => setIsAddMode(true)}
						icon={<PlusIcon className="h-5 w-5" />}
						text="Ajouter un Cabinet"
						color="green"
						aria-label="Ajouter un cabinet"
					/>
					<ActionButton
						onClick={handleDeleteCabinet}
						icon={<TrashIcon className="h-5 w-5" />}
						text="Supprimer le Cabinet"
						color="red"
						aria-label="Supprimer le cabinet"
					/>
				</section>
			</main>

			{/* Modales conditionnelles */}
			{isEditMode && cabinetInfo && (
				<EditModal
					initialData={cabinetInfo}
					onSubmit={(data) => {
						handleUpdateCabinet(data);
						setIsEditMode(false);
					}}
					onCancel={() => setIsEditMode(false)}
					aria-labelledby="edit-modal-title"
					aria-modal="true"
				/>
			)}

			{isAddMode && (
				<AddModal
					onSubmit={(data) => {
						handleAddCabinet(data);
						setIsAddMode(false);
					}}
					onCancel={() => setIsAddMode(false)}
					aria-labelledby="add-modal-title"
					aria-modal="true"
				/>
			)}

			{isConfirmDeleteOpen && (
				<DeleteModal
					onDelete={() => {
						if (cabinetInfo?.id) deleteCabinet(cabinetInfo.id);
						setIsConfirmDeleteOpen(false);
					}}
					onCancel={() => setIsConfirmDeleteOpen(false)}
					cabinetName={cabinetInfo?.name}
					aria-labelledby="delete-modal-title"
					aria-modal="true"
				/>
			)}
		</div>
	);
};

export default CabinetContent;
