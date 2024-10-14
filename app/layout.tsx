import { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import IdleLogout from "@/components/useIdleLogout";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ModeToggle";
import "./globals.css";

export const metadata: Metadata = {
	title: "PatientHub",
	description:
		"Application de suivi et de gestion de patients en osthéopathie",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="fr" className={`${GeistSans.variable}`}>
			<head />
			<body className={`antialiased flex flex-col min-h-screen`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<IdleLogout />
					<ModeToggle />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
