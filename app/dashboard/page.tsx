"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
	IconArrowLeft,
	IconBrandTabler,
	IconContract,
	IconSettings,
	IconUserBolt,
} from "@tabler/icons-react";
import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
import { cn } from "@/components/lib/utils";
import { signOut } from "@/app/logout/actions";
import { createClient } from "@/utils/supabase/client";
import PatientList from "@/components/PatientList/PatientList";
import AddPatientForm from "@/components/addPatientForm/addPatientForm";
import { User } from "@supabase/supabase-js";
import CabinetContent from "@/components/CabinetContent/CabinetContent";
import { Logo, LogoIcon } from "@/components/Logo/Logo";

const supabase = createClient();

export default function SidebarDashboard() {
	const [open, setOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [loadingUser, setLoadingUser] = useState(true);
	const [activeTab, setActiveTab] = useState("dashboard");
	const router = useRouter();

	useEffect(() => {
		const checkSession = async () => {
			try {
				const { data, error } = await supabase.auth.getSession();
				if (error) throw new Error(error.message);
				if (data.session) {
					setUser(data.session.user);
				} else {
					router.push("/login");
				}
			} catch (error) {
				console.error(
					"Erreur lors de la récupération de la session :",
					error
				);
			} finally {
				setLoadingUser(false);
			}
		};

		checkSession();
	}, [router]);

	const handleLogout = async (e: React.MouseEvent) => {
		e.preventDefault();
		setIsLoggingOut(true);
		const result = await signOut();
		if (result.success) {
			router.push("/login");
		} else {
			// You can create a state to manage error messages and show them in the UI
			console.error(result.error || "Erreur lors de la déconnexion.");
		}
		setIsLoggingOut(false);
	};

	const links = [
		{
			label: "Dashboard",
			href: "#",
			icon: (
				<IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
			onClick: () => setActiveTab("dashboard"),
		},
		{
			label: "Patients",
			href: "#",
			icon: (
				<IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
			onClick: () => setActiveTab("patients"),
		},
		{
			label: "Cabinet",
			href: "#",
			icon: (
				<IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
			onClick: () => setActiveTab("Cabinet"),
		},
		{
			label: "Contact",
			href: "mailto:afdevflo@gmail.com?subject=Contact%20Request&body=Bonjour%2C%0A%0AJe%20souhaite%20vous%20contacter%20au%20sujet%20de...%0A%0AMerci%21",
			icon: (
				<IconContract className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
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
	];

	if (loadingUser) {
		return <p className="text-center text-gray-500">Chargement...</p>;
	}

	return (
		<div
			className={cn(
				"flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full h-screen border border-neutral-200 dark:border-neutral-700 overflow-hidden"
			)}
		>
			<Sidebar open={open} setOpen={setOpen}>
				<SidebarBody className="justify-between gap-10">
					<div className="flex flex-col flex-1 overflow-y-auto">
						{open ? <Logo /> : <LogoIcon />}
						<div className="mt-8 flex flex-col gap-2">
							{links.map((link, idx) => (
								<SidebarLink key={idx} link={link} />
							))}
						</div>
					</div>

					<div className="bg-gray-100 dark:bg-neutral-800 rounded-md flex items-center gap-3">
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
										{user.user_metadata?.user_metadata
											?.first_name ||
											"Nom non disponible"}{" "}
										{user.user_metadata?.user_metadata
											?.last_name ||
											"Prénom non disponible"}
									</p>
									<p className="ml-4 text-xs text-gray-600 dark:text-gray-400">
										{user.email || "Email non disponible"}
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
				{/* Render the active tab's content */}
				{activeTab === "dashboard" && <Dashboard user={user} />}
				{activeTab === "patients" && (
					<PatientList initialPatients={undefined} user={user} />
				)}
				{activeTab === "Cabinet" && <CabinetContent />}

				<footer className="bg-gray-200 dark:bg-neutral-900 text-center p-4 border-t border-neutral-300 dark:border-neutral-700">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						© 2024 - PatientHub. Tous droits réservés.
					</p>
				</footer>
			</div>
		</div>
	);
}

interface DashboardProps {
	user: User | null;
}
const Dashboard: React.FC<DashboardProps> = ({ user }) => {
	return (
		<div className="flex-1 p-4 sm:p-6 md:p-10 bg-white dark:bg-neutral-900 flex flex-col gap-4 sm:gap-6 overflow-y-auto">
			<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 mt-10 sm:p-6 rounded-lg shadow-lg mb-4 sm:mb-6">
				<h1 className="text-2xl sm:text-3xl font-bold mb-2">
					Bienvenue,{" "}
					{user
						? user.user_metadata?.user_metadata?.first_name ||
						  user.email
						: "Utilisateur"}
				</h1>
				<p className="text-base sm:text-lg">
					Voici un aperçu de votre tableau de bord
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
				<div className="bg-white dark:bg-neutral-800 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
					<h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-4">
						Patients actifs
					</h2>
					<p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
						152
					</p>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						+12% par rapport au mois dernier
					</p>
				</div>

				<div className="bg-white dark:bg-neutral-800 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
					<h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-4">
						Rendez-vous aujourd&apos;hui
					</h2>
					<p className="text-3xl font-bold text-green-600 dark:text-green-400">
						8
					</p>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Prochain RDV à 14h30
					</p>
				</div>

				<div className="bg-white dark:bg-neutral-800 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
					<h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-4">
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
			<div className="mt-6 sm:mt-8">
				<h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
					Actions rapides
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
					<button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm sm:text-base">
						Ajouter un patient
					</button>
					<button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm sm:text-base">
						Voir les rendez-vous
					</button>
					<button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm sm:text-base">
						Voir le listing patient
					</button>
					<button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm sm:text-base">
						Rapports mensuels
					</button>
				</div>
			</div>
			<div className="bg-white dark:bg-neutral-800 p-4 sm:p-6 rounded-lg shadow-lg mt-4 sm:mt-6">
				<h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-4">
					Graphiques et autres visualisations
				</h2>
				<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
					Contenu supplémentaire, comme des graphiques, des
					tableaux...
				</p>
			</div>
			<AddPatientForm />
		</div>
	);
};
