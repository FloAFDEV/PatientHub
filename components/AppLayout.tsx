// components/AppLayout.tsx
import { Sidebar } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen">
			<Sidebar />
			<main className="flex-grow overflow-auto">{children}</main>
		</div>
	);
}
