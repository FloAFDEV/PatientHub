import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fonction pour formater les données du patient
function formatPatientData(data) {
	return {
		name: data.name || "",
		email: data.email || null,
		phone: data.phone || null,
		address: data.address || null,
		gender: data.gender === "Homme" ? "HOMME" : "FEMME",
		maritalStatus:
			data.maritalStatus === "Marié(e)"
				? "MARRIED"
				: data.maritalStatus || null,
		occupation: data.occupation || null,
		children: data.children || null,
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
		allergies: data.allergies || null,
		digestiveProblems: data.digestiveProblems || null,
		digestiveDoctorName: data.digestiveDoctorName || null,
		osteopathName: data.osteopathName || null,
		osteopathId: data.osteopathId || null,
		userId: data.userId || null,
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
		cabinetId: data.cabinetId || null,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}
// Méthode GET pour récupérer tous les patients ou un patient par e-mail
export async function GET(request) {
	const { searchParams } = new URL(request.url);

	const name = searchParams.get("name");
	const page = parseInt(searchParams.get("page")) || 1;
	const pageSize = 15; // Nombre d'éléments par page

	try {
		const whereCondition = name
			? {
					OR: [
						{ name: { contains: name, mode: "insensitive" } },
						{ firstName: { contains: name, mode: "insensitive" } },
					],
			  }
			: {}; // Si pas de nom fourni, on récupère tous les patients

		// Requête avec pagination et recherche
		const patients = await prisma.patient.findMany({
			where: whereCondition,
			skip: (page - 1) * pageSize,
			take: pageSize,
			include: {
				cabinet: true,
				osteopath: true,
			},
		});

		// Si des patients sont trouvés
		if (patients.length > 0) {
			return new Response(JSON.stringify(patients), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
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

// Méthode POST pour créer un nouveau patient
export async function POST(request) {
	const patientData = await request.json();

	try {
		const formattedPatientData = formatPatientData(patientData);

		if (formattedPatientData.userId) {
			const user = await prisma.user.findUnique({
				where: { id: formattedPatientData.userId },
			});

			if (!user) {
				return new Response("User not found", { status: 404 });
			}
		}

		const newPatient = await prisma.patient.create({
			data: formattedPatientData,
		});

		return new Response(JSON.stringify(newPatient), {
			status: 201,
			headers: {
				"Content-Type": "application/json",
			},
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

	if (!email) {
		return new Response("Email is required", { status: 400 });
	}

	try {
		const formattedPatientData = formatPatientData(patientData);

		const updatedPatient = await prisma.patient.update({
			where: { email: email },
			data: formattedPatientData,
		});
		return new Response(JSON.stringify(updatedPatient), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
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

	if (!email) {
		return new Response("Email is required", { status: 400 });
	}

	try {
		await prisma.patient.delete({
			where: { email: email },
		});
		return new Response("Patient deleted successfully", { status: 204 });
	} catch (error) {
		console.error("Error deleting patient:", error);
		return new Response("Could not delete patient", { status: 500 });
	}
}
