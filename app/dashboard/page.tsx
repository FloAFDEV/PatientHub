"use client";

import React from "react";
import SidebarDashboard from "@/components/SidebarDashboard/SidebarDashboard";

const DashboardPage = () => {
	return (
		<SidebarDashboard>
			{/* Contenu spécifique à la page du tableau de bord */}
			<h1 className="text-2xl font-bold">Tableau de bord</h1>
			{/* Vous pouvez ajouter d'autres composants ou éléments ici */}
		</SidebarDashboard>
	);
};

export default DashboardPage;
