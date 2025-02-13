"use client";

import React, { useState, useLayoutEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import AppointmentsManager from "@/components/Appointments/AppointmentsManager";
import {
	ArrowLeftIcon,
	DocumentIcon,
	UserCircleIcon,
	ChartBarIcon,
	CalendarIcon,
	BuildingOfficeIcon,
	UserPlusIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/logout/actions";
import { createClient } from "@/utils/supabase/client";
import PatientList from "@/components/PatientList/PatientList";
import CabinetContent from "@/components/CabinetContent/CabinetContent";
import AddPatientForm from "@/components/addPatientForm/addPatientForm";
import { Logo, LogoIcon } from "@/components/Logo/Logo";
import Dashboard from "@/components/Dashboard/Dashboard";
import { User } from "@supabase/supabase-js";
import Footer from "@/components/Footer";

const MemoizedDashboard = React.memo(Dashboard);
const MemoizedPatientList = React.memo(PatientList);
const MemoizedCabinetContent = React.memo(CabinetContent);
const MemoizedAppointmentsManager = React.memo(AppointmentsManager);

function SidebarDashboard({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [activeTab, setActiveTab] = useState("dashboard");
	const [isReady, setIsReady] = useState(false);
	const router = useRouter();

	const handleLogout = useCallback(
		async (e: React.MouseEvent) => {
			e.preventDefault();
			setIsLoggingOut(true);
			try {
				const result = await signOut();
				if (result.success) {
					router.push("/");
				} else {
					throw new Error(
						result.error || "Erreur lors de la déconnexion."
					);
				}
			} catch (error) {
				console.error("Erreur lors de la déconnexion:", error);
			} finally {
				setIsLoggingOut(false);
			}
		},
		[router]
	);

	const handleTabChange = useCallback((tab: string) => {
		setActiveTab(tab);
		setOpen(false);
	}, []);

	useLayoutEffect(() => {
		const checkSession = async () => {
			const supabase = createClient();
			try {
				const { data, error } = await supabase.auth.getSession();
				if (error) throw error;
				if (data.session) {
					setUser(data.session.user);
				} else {
					router.push("/");
				}
			} catch (error) {
				console.error(
					"Erreur lors de la récupération de la session :",
					error
				);
				router.push("/error");
			} finally {
				setIsReady(true);
			}
		};
		checkSession();
	}, [router]);

	const links = useMemo(
		() => [
			{
				label: "Tableau de bord",
				href: "#",
				icon: (
					<ChartBarIcon className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
				),
				onClick: () => handleTabChange("dashboard"),
			},
			{
				label: "Vos patients",
				href: "#",
				onClick: () => handleTabChange("patients"),
				icon: (
					<UserCircleIcon className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
				),
			},
			{
				label: "Ajouter un patient",
				href: "#",
				onClick: () => handleTabChange("addPatient"),
				icon: (
					<UserPlusIcon className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
				),
			},
			{
				label: "Cabinet",
				href: "#",
				icon: (
					<BuildingOfficeIcon className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
				),
				onClick: () => handleTabChange("Cabinet"),
			},
			{
				label: "Rendez-vous",
				href: "#",
				icon: (
					<CalendarIcon className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
				),
				onClick: () => handleTabChange("appointments"),
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
		],
		[isLoggingOut, handleLogout, handleTabChange]
	);

	const activeComponent = useMemo(() => {
		switch (activeTab) {
			case "dashboard":
				return <MemoizedDashboard user={user} />;
			case "patients":
				return (
					<MemoizedPatientList
						onAddPatientClick={() => handleTabChange("addPatient")}
					/>
				);
			case "Cabinet":
				return <MemoizedCabinetContent />;
			case "appointments":
				return <MemoizedAppointmentsManager />;
			case "addPatient":
				return <AddPatientForm />;
			default:
				return null;
		}
	}, [activeTab, user, handleTabChange]);

	if (!isReady) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="w-full h-full flex justify-center items-center">
					<div className="absolute animate-ping h-[16rem] w-[16rem] rounded-full  border-t-4 border-b-4 border-red-500 "></div>
					<div className="absolute animate-spin h-[14rem] w-[14rem] rounded-full  border-t-4 border-b-4 border-purple-500 "></div>
					<div className="absolute animate-ping h-[12rem] w-[12rem] rounded-full  border-t-4 border-b-4 border-pink-500 "></div>
					<div className="absolute animate-spin h-[10rem] w-[10rem] rounded-full border-t-4 border-b-4 border-yellow-500"></div>
					<div className="absolute animate-ping h-[8rem] w-[8rem] rounded-full border-t-4 border-b-4 border-green-500"></div>
					<div className="absolute animate-spin h-[6rem] w-[6rem] rounded-full border-t-4 border-b-4 border-blue-500"></div>
					<div className="rounded-full h-28 w-28 animate-bounce flex items-center justify-center text-gray-500 font-semibold text-3xl dark:text-gray-100">
						Chargement...
					</div>
				</div>
			</div>
		);
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
					<div className="dark:bg-gray-800 flex items-center gap-3 rounded-xl mb-4">
						{user ? (
							<>
								<Image
									src="/assets/images/admin.jpg"
									className="h-7 w-auto rounded-full"
									width={40}
									height={40}
									alt="User Avatar"
								/>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-800 dark:text-white truncate">
										{user.user_metadata?.user_metadata
											?.first_name ||
											"Nom non disponible"}{" "}
										{user.user_metadata?.user_metadata
											?.last_name ||
											"Prénom non disponible"}
									</p>
									<p className="text-xs text-gray-600 dark:text-gray-400 truncate">
										{user.email || "Email non disponible"}
									</p>
								</div>
							</>
						) : (
							<div className="flex justify-center items-center h-screen">
								<div className="w-full h-full flex justify-center items-center">
									<div className="absolute animate-ping h-[16rem] w-[16rem] rounded-full  border-t-4 border-b-4 border-red-500 "></div>
									<div className="absolute animate-spin h-[14rem] w-[14rem] rounded-full  border-t-4 border-b-4 border-purple-500 "></div>
									<div className="absolute animate-ping h-[12rem] w-[12rem] rounded-full  border-t-4 border-b-4 border-pink-500 "></div>
									<div className="absolute animate-spin h-[10rem] w-[10rem] rounded-full border-t-4 border-b-4 border-yellow-500"></div>
									<div className="absolute animate-ping h-[8rem] w-[8rem] rounded-full border-t-4 border-b-4 border-green-500"></div>
									<div className="absolute animate-spin h-[6rem] w-[6rem] rounded-full border-t-4 border-b-4 border-blue-500"></div>
									<div className="rounded-full h-28 w-28 animate-bounce flex items-center justify-center text-gray-500 font-semibold text-3xl dark:text-gray-100">
										Chargement...
									</div>
								</div>
							</div>
						)}
					</div>
				</SidebarBody>
			</Sidebar>
			<div className="flex-1 flex flex-col">
				<div className="fixed z-50 top-1 left-2 md:top-4 md:right-4 md:left-auto">
					<ModeToggle />
				</div>
				<main className="flex-1 overflow-auto p-1">
					{activeComponent}
					{children}
				</main>
				<Footer />
			</div>
		</div>
	);
}

export default React.memo(SidebarDashboard);
