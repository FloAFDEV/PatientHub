"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	Sidebar,
	SidebarBody,
	SidebarLink,
	Links,
} from "@/components/ui/sidebar";
import {
	IconArrowLeft,
	IconBrandTabler,
	IconContract,
	IconSettings,
	IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
import { cn } from "@/components/lib/utils";
import { signOut } from "@/app/logout/actions";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export default function SidebarDashboard() {
	const [open, setOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();

	// Vérifier la session à l'initialisation
	useEffect(() => {
		const checkSession = async () => {
			const { data, error } = await supabase.auth.getSession();

			if (error) {
				console.error(
					"Erreur lors de la récupération de la session :",
					error
				);
			} else if (!data.session) {
				console.log("Aucune session trouvée, redirection vers /login");
				await router.push("/login");
			} else {
				console.log("Session trouvée :", data.session); // Debug
				setUser(data.session.user); // Stocker l’utilisateur
				setIsAuthenticated(true);
			}
		};

		checkSession();
	}, [router]);

	// Fonction de déconnexion
	const handleLogout = async (e: React.MouseEvent) => {
		e.preventDefault();
		setIsLoggingOut(true);

		const result = await signOut();
		if (result.success) {
			await router.push("/login"); // Redirige après la déconnexion
		} else {
			alert(
				result.error ||
					"Erreur lors de la déconnexion. Veuillez réessayer."
			);
		}
		setIsLoggingOut(false);
	};

	type Link = Omit<Links, "onClick"> & {
		onClick?: (e: React.MouseEvent) => Promise<void>;
		disabled?: boolean;
	};

	const links: Link[] = [
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
				<IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
			),
			onClick: handleLogout,
			disabled: isLoggingOut,
		},
		{
			label: "Contact",
			href: "mailto:afdevflo@gmail.com?subject=Contact%20Request&body=Bonjour%2C%0A%0AJe%20souhaite%20vous%20contacter%20au%20sujet%20de...%0A%0AMerci%21",
			icon: (
				<IconContract className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
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

					{/* Affichage des informations utilisateur */}
					<div className="bg-gray-100 dark:bg-neutral-800 rounded-md flex items-center gap-3">
						{" "}
						{user ? (
							<>
								<Image
									src="/assets/images/admin.jpg"
									className="h-7 w-auto rounded-full"
									width={40}
									height={40}
									alt="User Avatar"
								/>
								<div>
									<p className="ml-4 text-sm font-medium text-gray-800 dark:text-white">
										{user.email}
									</p>
									<p className="ml-4 text-xs text-gray-600 dark:text-gray-400">
										{user.user_metadata?.full_name ||
											"Utilisateur"}
									</p>
								</div>
							</>
						) : (
							<p className="text-xs text-gray-500">
								Chargement des informations utilisateur...
							</p>
						)}
					</div>
				</SidebarBody>
			</Sidebar>
			<div className="flex-1 flex flex-col">
				<div className="fixed z-50 top-4 left-4 md:top-4 md:right-4 md:left-auto">
					<ModeToggle />
				</div>
				<Dashboard user={user} />
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

interface DashboardProps {
	user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
	return (
		<div className="flex-1 p-6 md:p-10 bg-white dark:bg-neutral-900 flex flex-col gap-6 overflow-y-auto">
			<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-6">
				<h1 className="text-3xl font-bold mb-2">
					Bienvenue, {user ? user.email : "Utilisateur"}
				</h1>
				<p className="text-lg">
					Voici un aperçu de votre tableau de bord
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
					<h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
						Patients actifs
					</h2>
					<p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
						152
					</p>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						+12% par rapport au mois dernier
					</p>
				</div>
				<div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
					<h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
						Rendez-vous aujourd'hui
					</h2>
					<p className="text-3xl font-bold text-green-600 dark:text-green-400">
						8
					</p>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Prochain RDV à 14h30
					</p>
				</div>
				<div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
					<h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
						Nouveaux patients
					</h2>
					<p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
						24
					</p>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Ce mois-ci
					</p>
				</div>
			</div>

			<div className="mt-8">
				<h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
					Actions rapides
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
						Ajouter un patient
					</button>
					<button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">
						Voir les rendez-vous
					</button>
					<button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300">
						Gérer les dossiers
					</button>
					<button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300">
						Rapports mensuels
					</button>
				</div>
			</div>

			<div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
				<h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
					Graphiques et autres visualisations
				</h2>
				<p className="text-gray-600 dark:text-gray-400">
					Contenu supplémentaire, comme des graphiques, des
					tableaux...
				</p>
			</div>
		</div>
	);
};
