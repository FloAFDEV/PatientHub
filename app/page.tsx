"use client";

import React, { Suspense } from "react";
import AppContent from "./AppContent";

export default function App() {
	return (
		<Suspense
			fallback={<div className="p-10 text-center">Chargement...</div>}
		>
			<AppContent />
		</Suspense>
	);
}
