"use client";

import { useIdleLogout } from "@/hooks/useIdleLogout";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	useIdleLogout();
	return <>{children}</>;
}
