// app/components/PatientList/PatientList.jsx

import { useEffect, useState } from "react";
import { IconGenderMale, IconGenderFemale } from "@tabler/icons-react";
import PatientDetails from "../PatientDetails/PatientDetails";

const PatientList = () => {
	const [patients, setPatients] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedPatientId, setSelectedPatientId] = useState(null);

	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const response = await fetch("/api/patients");
				if (!response.ok) throw new Error("Failed to fetch");
				const patientsData = await response.json();
				setPatients(patientsData);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPatients();
	}, []);

	const handlePatientClick = (id) => {
		// Si le patient est déjà sélectionné, on le désélectionne
		setSelectedPatientId((prevId) => (prevId === id ? null : id));
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-full">
				<span className="text-lg text-gray-500">
					Chargement des patients...
				</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center h-full">
				<span className="text-lg text-red-500">Erreur: {error}</span>
			</div>
		);
	}

	return (
		<div>
			<h1 className="p-2 text-2xl font-bold mb-4">
				Liste de vos patients
			</h1>
			<ul className="space-y-4">
				{patients.map((patient) => (
					<li
						key={patient.id}
						className="p-4 border rounded-lg hover:shadow-md transition-shadow duration-200 flex flex-col"
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
						{/* Afficher les détails du patient si son ID est sélectionné */}
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

export default PatientList;
