"use client";

import { useIdleLogout } from "@/hooks/useIdleLogout";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	useIdleLogout(); // Ce hook ne s'exécute que côté client
	return <>{children}</>; // Rend les enfants comme ils sont
}
