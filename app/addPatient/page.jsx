// /pages/app/addPatient/pages.jsx
import React from "react";
import AddPatientForm from "@/components/AddPatientForm/addPatientForm";

const AddPatientPage = () => {
	return (
		<div className="p-4 sm:p-6 md:p-10 bg-white dark:bg-gray-900 flex flex-col gap-4">
			<AddPatientForm />
		</div>
	);
};

export default AddPatientPage;
