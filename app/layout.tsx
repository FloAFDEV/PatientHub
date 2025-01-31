// app/layout.tsx
import { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/theme-provider";
import AppLayout from "@/components/AppLayout";
import ClientLayout from "./ClientLayout";
import { Analytics } from "@vercel/analytics/next";
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
	const defaultTheme = "enableSystem";

	return (
		<html
			lang="fr"
			className={`${GeistSans.variable}`}
			suppressHydrationWarning
		>
			<body className={`${defaultTheme}`} suppressHydrationWarning>
				<ThemeProvider
					attribute="class"
					defaultTheme={defaultTheme}
					enableSystem
					disableTransitionOnChange
				>
					<ClientLayout>
						<AppLayout>{children}</AppLayout>
						<Analytics />
					</ClientLayout>
				</ThemeProvider>
			</body>
		</html>
	);
}
