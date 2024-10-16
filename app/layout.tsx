import { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/theme-provider";
import Head from "@/app/head";
import ClientLayout from "./ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
	title: "PatientHub",
	description:
		"Application de suivi et de gestion de patients en ostéopathie",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="fr" className={`${GeistSans.variable}`}>
			<Head />
			<body className="antialiased flex flex-col min-h-screen">
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<ClientLayout>{children}</ClientLayout>
				</ThemeProvider>
			</body>
		</html>
	);
}
