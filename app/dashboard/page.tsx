"use client";

import React, { useState } from "react";
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
import { logout } from "@/app/logout/actions";

export function SidebarDashboard() {
	const [open, setOpen] = useState(false); // État pour l'ouverture de la sidebar

	const links = [
		{
			label: "Dashboard",
			href: "/dashboard", // Mettez ici le lien correct
			icon: (
				<IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
		},
		{
			label: "Patients",
			href: "/patients", // Mettez ici le lien correct
			icon: (
				<IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
		},
		{
			label: "Settings",
			href: "/settings", // Mettez ici le lien correct
			icon: (
				<IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
		},
		{
			label: "Se déconnecter",
			href: "#",
			icon: (
				<IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
			onClick: async (e: React.MouseEvent) => {
				e.preventDefault(); // Empêche le comportement par défaut du lien
				await logout(); // Appelle la fonction de déconnexion
			},
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

			{/* Déplacement du sélecteur de thème en dehors de la sidebar */}
			<div className="flex-1 flex flex-col">
				{/* Sélecteur de thème placé en haut à droite */}
				<div className="fixed top-4 right-4 z-50s:top-10 xs:">
					<ModeToggle />
				</div>

				<Dashboard />

				{/* Footer */}
				<footer className="bg-gray-200 dark:bg-neutral-900 text-center p-4 border-t border-neutral-300 dark:border-neutral-700">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						© 2024 - PatientHub. Tous droits réservés.
					</p>
				</footer>
			</div>
		</div>
	);
}

// ... reste du code (Logo, LogoIcon, Dashboard, logout)

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

// Composant Dashboard avec contenu
const Dashboard = () => {
	return (
		<>
			<div className="flex-1 p-6 md:p-10 bg-white dark:bg-neutral-900 flex flex-col gap-6">
				<h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
					Bienvenue sur votre tableau de bord
				</h1>

				{/* Exemple de section personnalisée */}
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

					<div className="bg-gray-100 dark:bg-neutral-800 p-4 rounded-lg shadow-md">
						<h2 className="text-lg font-medium text-gray-700 dark:text-white">
							Statistique 3
						</h2>
						<p className="mt-2 text-gray-600 dark:text-gray-400">
							Détails sur la statistique 3...
						</p>
					</div>
				</div>

				<div className="flex-1 bg-gray-100 dark:bg-neutral-800 p-4 rounded-lg shadow-md">
					<h2 className="text-lg font-medium text-gray-700 dark:text-white">
						Graphiques et autres visualisations
					</h2>
					<p className="mt-2 text-gray-600 dark:text-gray-400">
						Contenu supplémentaire, comme des graphiques, des
						tableaux...
					</p>
				</div>
			</div>
		</>
	);
};

export default SidebarDashboard;
