export function formatPatientData(data) {
	const fullName = data.name || "";
	const nameParts = fullName.split(" "); // Sépare le nom complet en fonction des espaces

	const firstName =
		nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : nameParts[0]; // Prénom
	const lastName =
		nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""; // Nom de famille
	return {
		firstName: firstName || "Prénom inconnu",
		lastName: lastName || "Nom inconnu",
		email: data.email || null,
		phone: data.phone || null,
		address: data.address || null,
		gender:
			data.gender === "Homme"
				? "Homme"
				: data.gender === "Femme"
				? "Femme"
				: null,
		maritalStatus: data.maritalStatus
			? data.maritalStatus.toUpperCase()
			: null,
		occupation: data.occupation || null,
		hasChildren: data.hasChildren === "true" ? "true" : "false",
		childrenAges: Array.isArray(data.childrenAges)
			? data.childrenAges.map((age) => parseInt(age, 10))
			: [],
		physicalActivity: data.physicalActivity || null,
		isSmoker: data.isSmoker === "true",
		handedness:
			data.handedness === "Droitier"
				? "RIGHT"
				: data.handedness === "Gaucher"
				? "LEFT"
				: "AMBIDEXTROUS",
		contraception:
			data.contraception === "Préservatifs"
				? "CONDOM"
				: data.contraception || null,
		currentTreatment: data.currentTreatment || null,
		generalPractitioner: data.generalPractitioner || null,
		surgicalHistory: data.surgicalHistory || null,
		digestiveProblems: data.digestiveProblems || null,
		digestiveDoctorName: data.digestiveDoctorName || null,
		birthDate: data.birthDate ? new Date(data.birthDate) : null,
		avatarUrl: data.avatarUrl || null,
		traumaHistory: data.traumaHistory || null,
		rheumatologicalHistory: data.rheumatologicalHistory || null,
		hasVisionCorrection: data.hasVisionCorrection === "true",
		ophtalmologistName: data.ophtalmologistName || null,
		entProblems: data.entProblems || null,
		entDoctorName: data.entDoctorName || null,
		hdlm: data.hdlm || null,
		isDeceased: data.isDeceased === true || data.isDeceased === "true",
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}
