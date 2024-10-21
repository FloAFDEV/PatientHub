"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
	IconArrowLeft,
	IconBrandTabler,
	IconSettings,
	IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
import { cn } from "@/components/lib/utils";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function SidebarDashboard() {
	const [open, setOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const router = useRouter();

	const handleLogout = async (e: React.MouseEvent) => {
		e.preventDefault();
		setIsLoggingOut(true);
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;

			// Nettoyage du localStorage
			localStorage.removeItem("accessKey");
			localStorage.removeItem("accessKeyExpiration");

			// Suppression manuelle des cookies Supabase
			document.cookie =
				"sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
			document.cookie =
				"sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

			// Redirection vers la page de connexion
			router.push("/login");
		} catch (error) {
			console.error("Erreur lors de la déconnexion:", error);
		} finally {
			setIsLoggingOut(false);
		}
	};

	const links = [
		{
			label: "Dashboard",
			href: "/dashboard",
			icon: (
				<IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
		},
		{
			label: "Patients",
			href: "/patients",
			icon: (
				<IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
		},
		{
			label: "Settings",
			href: "/settings",
			icon: (
				<IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
		},
		{
			label: isLoggingOut ? "Déconnexion..." : "Se déconnecter",
			href: "#",
			icon: (
				<IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
			onClick: handleLogout,
			disabled: isLoggingOut,
		},
	];

	return (
		<div
			className={cn(
				"flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full h-screen border border-neutral-200 dark:border-neutral-700 overflow-hidden"
			)}
		>
			<Sidebar open={open} setOpen={setOpen}>
				<SidebarBody className="justify-between gap-10">
					<div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
						{open ? <Logo /> : <LogoIcon />}
						<div className="mt-8 flex flex-col gap-2">
							{links.map((link, idx) => (
								<SidebarLink key={idx} link={link} />
							))}
						</div>
					</div>
					<div>
						<SidebarLink
							link={{
								label: "Franck BLANCHET",
								href: "#",
								icon: (
									<Image
										src="/assets/images/admin.jpg"
										className="h-7 w-7 flex-shrink-0 rounded-full"
										width={50}
										height={50}
										alt="Avatar"
									/>
								),
							}}
						/>
					</div>
				</SidebarBody>
			</Sidebar>

			<div className="flex-1 flex flex-col">
				<div className="fixed top-4 right-4 z-50 xs:top-10 xs:m">
					<ModeToggle />
				</div>

				<Dashboard />

				<footer className="bg-gray-200 dark:bg-neutral-900 text-center p-4 border-t border-neutral-300 dark:border-neutral-700">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						© 2024 - PatientHub. Tous droits réservés.
					</p>
				</footer>
			</div>
		</div>
	);
}

export const Logo = () => {
	return (
		<Link
			href="#"
			className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
		>
			<div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="font-medium text-black dark:text-white whitespace-pre"
			>
				PatientHub
			</motion.span>
		</Link>
	);
};

export const LogoIcon = () => {
	return (
		<Link
			href="#"
			className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
		>
			<div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
		</Link>
	);
};

const Dashboard = () => {
	return (
		<>
			<div className="flex-1 p-6 md:p-10 bg-white dark:bg-neutral-900 flex flex-col gap-6">
				<h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
					Bienvenue sur votre tableau de bord
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="bg-gray-100 dark:bg-neutral-800 p-4 rounded-lg shadow-md">
						<h2 className="text-lg font-medium text-gray-700 dark:text-white">
							Statistique 1
						</h2>
						<p className="mt-2 text-gray-600 dark:text-gray-400">
							Détails sur la statistique 1...
						</p>
					</div>

					<div className="bg-gray-100 dark:bg-neutral-800 p-4 rounded-lg shadow-md">
						<h2 className="text-lg font-medium text-gray-700 dark:text-white">
							Statistique 2
						</h2>
						<p className="mt-2 text-gray-600 dark:text-gray-400">
							Détails sur la statistique 2...
						</p>
					</div>

					<div className="bg-gray-100 dark:bg-neutral-800 p4 rounded-lg shadow-md">
						<h2 className="text-lg font-medium text-gray-700 dark:text-white">
							Statistique 3
						</h2>
						<p className="mt2 text-gray600 dark:text-gray-400">
							Détails sur la statistique 3...
						</p>
					</div>
				</div>

				<div className="flex1 bg-gray-100 dark:bg-neutral-800 p4 rounded-lg shadow-md">
					<h2 className="text-lg font-medium text-gray-700 dark:text-white">
						Graphiques et autres visualisations
					</h2>
					<p className="mt2 text-gray600 dark:text-gray-400">
						Contenu supplémentaire, comme des graphiques, des
						tableaux...
					</p>
				</div>
			</div>
		</>
	);
};

export default SidebarDashboard;
