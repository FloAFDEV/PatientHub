"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
	ArrowLeftIcon,
	DocumentIcon,
	Cog6ToothIcon,
	UserCircleIcon,
	ChartBarIcon,
	BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
import { cn } from "@/components/lib/utils";
import { signOut } from "@/app/logout/actions";
import { createClient } from "@/utils/supabase/client";
import PatientList from "@/components/PatientList/PatientList";
import CabinetContent from "@/components/CabinetContent/CabinetContent";
import { Logo, LogoIcon } from "@/components/Logo/Logo";
import Dashboard from "@/components/Dashboard/Dashboard";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export default function SidebarDashboard({
	children,
}: {
	children: React.ReactNode;
}) {
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
			console.error(result.error || "Erreur lors de la déconnexion.");
		}
		setIsLoggingOut(false);
	};

	const links = [
		{
			label: "Tableau de bord",
			href: "#",
			icon: (
				<ChartBarIcon className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
			),
			onClick: () => {
				setActiveTab("dashboard");
				setOpen(false);
			},
		},
		{
			label: "Patients",
			href: "#",
			icon: (
				<UserCircleIcon className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
			),
			onClick: () => {
				setActiveTab("patients");
				setOpen(false);
			},
		},
		{
			label: "Cabinet",
			href: "#",
			icon: (
				<BuildingOfficeIcon className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
			),
			onClick: () => {
				setActiveTab("Cabinet");
				setOpen(false);
			},
		},
		{
			label: "Contact",
			href: "mailto:afdevflo@gmail.com?subject=Contact%20Request&body=Bonjour%2C%0A%0AJe%20souhaite%20vous%20contacter%20au%20sujet%20de...%0A%0AMerci%21",
			icon: (
				<DocumentIcon className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
			),
		},
		{
			label: isLoggingOut ? "Déconnexion..." : "Se déconnecter",
			href: "#",
			icon: (
				<ArrowLeftIcon className="text-neutral-700 dark:text-neutral-200 h-7 w-7" />
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
				"flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 w-full h-screen border border-neutral-200 dark:border-neutral-700 overflow-y-auto"
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
					<div className="bg-white dark:bg-slate-800 flex items-center gap-3 rounded-xl">
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
				<main className="flex-1 overflow-auto p-4">
					{activeTab === "dashboard" && <Dashboard user={user} />}
					{activeTab === "patients" && (
						<PatientList initialPatients={undefined} user={user} />
					)}
					{activeTab === "Cabinet" && <CabinetContent />}
					{children}
				</main>
				<footer className="bg-gray-200 dark:bg-slate-800 text-center p-4 border-t border-neutral-300 dark:border-neutral-700">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						© 2024 - PatientHub. Tous droits réservés.
					</p>
				</footer>
			</div>
		</div>
	);
}
