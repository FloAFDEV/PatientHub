"use client";

import React from "react";
import SidebarDashboard from "@/components/SidebarDashboard/SidebarDashboard";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <SidebarDashboard>{children}</SidebarDashboard>;
}
