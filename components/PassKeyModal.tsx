// PassKeyModal.tsx
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

// Encryption and decryption functions
export function encryptKey(passkey: string) {
	return btoa(passkey);
}

export function decryptKey(passkey: string) {
	return atob(passkey);
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
	const [isKeyValid, setIsKeyValid] = useState(false);

	const EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

	useEffect(() => {
		if (typeof window !== "undefined") {
			const encryptedKey = localStorage.getItem("accessKey");
			const accessKey = encryptedKey ? decryptKey(encryptedKey) : null;
			const expirationTimestamp = localStorage.getItem(
				"accessKeyExpiration"
			);

			const isValidKey =
				accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY &&
				expirationTimestamp &&
				Date.now() < Number(expirationTimestamp);

			if (isValidKey) {
				setIsKeyValid(true);
				router.push("/success");
			} else {
				setIsKeyValid(false);
			}
		}
	}, [router, onClose]);

	const closeModal = () => {
		onClose();
		setPasskey("");
		setError("");
	};

	const validatePasskey = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
			const encryptedKey = encryptKey(passkey); // Encrypt the key before saving
			const expirationTimestamp = Date.now() + EXPIRATION_TIME;

			localStorage.setItem("accessKey", encryptedKey);
			localStorage.setItem(
				"accessKeyExpiration",
				expirationTimestamp.toString()
			);

			setIsKeyValid(true); // Indiquer que la clé est valide
			onClose(); // Fermer la modal
			router.push("/success"); // Rediriger après validation
		} else {
			setError("Code d'accès invalide. Veuillez réessayer.");
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={onClose}>
			<AlertDialogOverlay className="fixed inset-0 bg-transparent/5" />
			<AlertDialogContent className="shad-alert-dialog max-w-lg w-full mx-auto p-6 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-start justify-between font-bold">
						Vérification d&apos;accès administrateur
						<Image
							src="/assets/icons/close.svg"
							alt="fermer"
							width={20}
							height={20}
							onClick={closeModal} // Fonction pour fermer la modale
							className="cursor-pointer hover:bg-red-500 rounded-xl bg-red-700"
						/>
					</AlertDialogTitle>
					<AlertDialogDescription className="font-thin">
						Pour accéder à la page admin, veuillez entrer le code
						d&apos;accès.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div suppressHydrationWarning className="mt-4">
					<InputOTP
						maxLength={6}
						value={passkey}
						onChange={(value: string) => setPasskey(value)}
					>
						<InputOTPGroup className="shad-otp w-full flex justify-between p-2 text-gray-500">
							{Array.from({ length: 6 }, (_, index) => (
								<InputOTPSlot
									key={index}
									className="shad-otp-slot flex justify-center items-center text-2xl md:text-3xl font-bold border border-gray-500 rounded-lg w-10 md:w-12 h-10 md:h-12 gap-2 md:gap-4 text-green-500"
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
