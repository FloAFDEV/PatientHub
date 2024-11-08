import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fonction pour formater les données du patient
function formatPatientData(data) {
	return {
		name: data.name || "",
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
		hasChildren: data.hasChildren || null,
		childrenAges: data.childrenAges || [],
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
		osteopathId: data.osteopathId || null,
		// Retirer la ligne userId: null, ici
		birthDate: data.birthDate ? new Date(data.birthDate) : null,
		avatarUrl: data.avatarUrl || null,
		traumaHistory: data.traumaHistory || null,
		rheumatologicalHistory: data.rheumatologicalHistory || null,
		hasVisionCorrection: data.hasVisionCorrection === "true",
		ophtalmologistName: data.ophtalmologistName || null,
		entProblems: data.entProblems || null,
		entDoctorName: data.entDoctorName || null,
		hdlm: data.hdlm || null,
		isDeceased: data.isDeceased === "true",
		cabinetId: null,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}

// Méthode GET pour récupérer les patients avec pagination
export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const name = searchParams.get("name");
	const page = parseInt(searchParams.get("page")) || 1;
	const pageSize = 15;

	try {
		const whereCondition = name
			? {
					OR: [
						{ name: { contains: name, mode: "insensitive" } },
						{ firstName: { contains: name, mode: "insensitive" } },
					],
			  }
			: {};

		const patients = await prisma.patient.findMany({
			where: whereCondition,
			skip: (page - 1) * pageSize,
			take: pageSize,
			include: {
				cabinet: true,
				osteopath: true,
			},
		});

		if (patients.length > 0) {
			return new Response(JSON.stringify(patients), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		} else {
			return new Response("No patients found with the given criteria", {
				status: 404,
			});
		}
	} catch (error) {
		console.error("Error retrieving patients:", error);
		return new Response("Could not retrieve patients", { status: 500 });
	}
}

export async function POST(request) {
	const patientData = await request.json();
	try {
		const formattedPatientData = formatPatientData(patientData);

		// Vérifiez si l'ID de l'ostéopathe est disponible
		const currentUserId = "user-id-from-session-or-token"; // Remplacez par votre logique d'authentification réelle
		if (currentUserId) {
			// Associez l'ostéopathe au patient via la relation
			formattedPatientData.osteopath = {
				connect: {
					id: currentUserId, // L'ID de l'ostéopathe récupéré depuis la session ou le token
				},
			};
		} else {
			return new Response("Osteopath (user) not found", { status: 400 });
		}

		// Si un cabinet est fourni, associez-le également au patient
		if (patientData.cabinetId) {
			formattedPatientData.cabinet = {
				connect: {
					id: patientData.cabinetId, // L'ID du cabinet fourni dans la requête
				},
			};
		} else {
			formattedPatientData.cabinet = null; // Ou vous pouvez définir une valeur par défaut si nécessaire
		}

		// Créez le patient avec les données formatées
		const newPatient = await prisma.patient.create({
			data: formattedPatientData,
		});

		return new Response(JSON.stringify(newPatient), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error creating patient:", error);
		return new Response("Could not create patient", { status: 500 });
	}
}

// Méthode PUT pour mettre à jour un patient par e-mail
export async function PUT(request) {
	const patientData = await request.json();
	const email = patientData.email;

	if (!email) return new Response("Email is required", { status: 400 });

	try {
		const formattedPatientData = formatPatientData(patientData);
		const updatedPatient = await prisma.patient.update({
			where: { email: email },
			data: formattedPatientData,
		});

		return new Response(JSON.stringify(updatedPatient), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error updating patient:", error);
		return new Response("Could not update patient", { status: 500 });
	}
}

// Méthode DELETE pour supprimer un patient par e-mail
export async function DELETE(request) {
	const { searchParams } = new URL(request.url);
	const email = searchParams.get("email");

	if (!email) return new Response("Email is required", { status: 400 });

	try {
		await prisma.patient.delete({ where: { email: email } });
		return new Response("Patient deleted successfully", { status: 204 });
	} catch (error) {
		console.error("Error deleting patient:", error);
		return new Response("Could not delete patient", { status: 500 });
	}
}
