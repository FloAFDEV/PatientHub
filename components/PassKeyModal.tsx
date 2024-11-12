import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogOverlay,
} from "@/components/ui/alert-dialog";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";

// Fonctions d'encryption et de décryption
export function encryptKey(passkey: string) {
	return btoa(passkey); // Encode en base64 pour l'encryption
}

export function decryptKey(passkey: string) {
	return atob(passkey); // Décode en base64 pour la décryption
}

interface PasskeyModalProps {
	open: boolean;
	onClose: () => void;
}

export const PasskeyModal: React.FC<PasskeyModalProps> = ({
	open,
	onClose,
}) => {
	const router = useRouter();
	const [passkey, setPasskey] = useState("");
	const [error, setError] = useState("");

	const EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes en millisecondes

	// Vérification si la clé d'accès est déjà stockée et valide
	useEffect(() => {
		if (typeof window !== "undefined") {
			const encryptedKey = localStorage.getItem("accessKey");
			const accessKey = encryptedKey ? decryptKey(encryptedKey) : null;
			const expirationTimestamp = localStorage.getItem(
				"accessKeyExpiration"
			);

			if (
				accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY &&
				expirationTimestamp &&
				Date.now() < Number(expirationTimestamp)
			) {
				router.push("/dashboard"); // Redirige vers le tableau de bord si la clé est valide
			}
		}
	}, [router]);

	const closeModal = () => {
		onClose();
		setPasskey("");
		setError("");
	};

	// Fonction de validation du code d'accès admin
	const validatePasskey = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
			const encryptedKey = encryptKey(passkey); // Encrypte la clé avant de la stocker
			const expirationTimestamp = Date.now() + EXPIRATION_TIME;

			localStorage.setItem("accessKey", encryptedKey);
			localStorage.setItem(
				"accessKeyExpiration",
				expirationTimestamp.toString()
			);

			console.log("Validation réussie, redirection...");
			closeModal(); // Ferme la modale
			router.push(
				`/success?message=${encodeURIComponent(
					"Validation réussie, vous pouvez accéder au tableau de bord et à \nvotre espace PatientHub"
				)}`
			);
		} else {
			setError("Code d'accès invalide. Veuillez réessayer.");
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={onClose}>
			<AlertDialogOverlay className="fixed inset-0 bg-transparent/5" />
			<AlertDialogContent className="shad-alert-dialog max-w-lg w-full mx-auto p-6 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4">
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-start justify-between font-bold">
						Vérification d&apos;accès administrateur
						<Image
							src="/assets/icons/close.svg"
							alt="fermer"
							width={20}
							height={20}
							onClick={closeModal} // Ferme la modal
							className="cursor-pointer hover:bg-red-500 rounded-xl bg-red-700"
						/>
					</AlertDialogTitle>
					<AlertDialogDescription className="font-normal">
						Pour accéder à la page admin, veuillez entrer le code
						d&apos;accès.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="mt-4">
					<InputOTP
						maxLength={6}
						value={passkey}
						onChange={(value: string) => setPasskey(value)}
					>
						<InputOTPGroup className="shad-otp w-full flex justify-between p-2 text-gray-500">
							{Array.from({ length: 6 }, (_, index) => (
								<InputOTPSlot
									key={index}
									className="shad-otp-slot flex justify-center items-center text-2xl md:text-3xl font-bold border border-green-400 rounded-lg w-10 md:w-12 h-10 md:h-12 gap-2 md:gap-4 text-green-500"
									index={index}
								/>
							))}
						</InputOTPGroup>
					</InputOTP>

					{error && (
						<p className="shad-error text-14-regular mt-4 flex justify-center text-red-600">
							{error}
						</p>
					)}
				</div>

				<AlertDialogFooter className="mt-6">
					<AlertDialogAction
						onClick={validatePasskey}
						className="shad-primary-btn w-full transition duration-300 ease-in-out transform hover:scale-105 text-xl bg-teal-500 hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
					>
						Entrer le code d&apos;accès admin
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
