import React, { useEffect, useState } from "react";
import { IconGenderMale, IconGenderFemale } from "@tabler/icons-react";
import PatientDetails from "../PatientDetails/PatientDetails";

const PatientList = ({ initialPatients }) => {
	const [patients, setPatients] = useState(initialPatients || []);
	const [loading, setLoading] = useState(!initialPatients);
	const [error, setError] = useState(null);
	const [selectedPatientId, setSelectedPatientId] = useState(null);

	useEffect(() => {
		if (!initialPatients) {
			const fetchPatients = async () => {
				try {
					const response = await fetch("/api/patients");
					if (!response.ok) {
						throw new Error(
							"Erreur dans le chargement des données."
						);
					}
					const patientsData = await response.json();
					setPatients(patientsData);
				} catch (err) {
					setError(err.message);
				} finally {
					setLoading(false);
				}
			};
			fetchPatients();
		}
	}, [initialPatients]);

	const handlePatientClick = (id) => {
		setSelectedPatientId((prevId) => (prevId === id ? null : id));
	};

	if (loading) {
		return (
			<div className="text-lg text-gray-500 mt-20">
				Chargement des patients...
			</div>
		);
	}

	if (error) {
		return <div className="text-lg text-red-500">Erreur: {error}</div>;
	}

	return (
		<div className="max-w-full h-screen overflow-y-auto">
			<h1 className="p-2 text-2xl font-bold mb-4">
				Liste de vos patients
			</h1>
			<ul className="space-y-2">
				{patients.map((patient) => (
					<li
						key={patient.id}
						className="p-1 border rounded-lg hover:shadow-md transition-shadow duration-200 flex flex-col"
					>
						<div
							className="flex items-center cursor-pointer"
							onClick={() => handlePatientClick(patient.id)}
						>
							{patient.gender === "Homme" ? (
								<IconGenderMale className="text-blue-500 mr-2" />
							) : (
								<IconGenderFemale className="text-pink-500 mr-2" />
							)}
							<h2 className="font-semibold text-lg">
								{patient.name}
							</h2>
						</div>
						{/* Affichage des détails du patient sélectionné */}
						{selectedPatientId === patient.id && (
							<PatientDetails
								patient={patient}
								onClose={() => setSelectedPatientId(null)}
							/>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

export default React.memo(PatientList);
