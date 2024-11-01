"use client";

import React from "react";
import PatientList from "@/components/PatientList/PatientList";

const PatientsPage = () => {
	const user = {};

	return (
		<div className="p-4 sm:p-6 md:p-10 bg-white dark:bg-neutral-900 flex flex-col gap-4">
			<PatientList initialPatients={undefined} user={user} />
		</div>
	);
};

export default PatientsPage;
