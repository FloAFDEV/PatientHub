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
		hasChildren: "true",
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
		// Récupérer le cabinet et les patients avec la pagination
		const cabinetInfo = await prisma.cabinet.findFirst({
			where: whereCondition,
			include: {
				patients: {
					skip: (page - 1) * pageSize,
					take: pageSize,
				},
			},
		});
		if (cabinetInfo) {
			const patientsOnPage = cabinetInfo.patients; // Liste des patients récupérés pour cette page
			// Récupérer le nombre total de patients dans la base de données
			const totalPatients = await prisma.patient.count({
				where: whereCondition, // Appliquez le même filtre de recherche s'il y en a un
			});
			return new Response(
				JSON.stringify({
					...cabinetInfo,
					totalPatients, // Ajout du nombre total de patients
					page,
					pageSize,
				}),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else {
			return new Response("Cabinet non trouvé", { status: 404 });
		}
	} catch (error) {
		console.error("Erreur lors de la récupération du cabinet :", error);
		return new Response("Erreur interne du serveur", { status: 500 });
	}
}

export async function POST(request) {
	const patientData = await request.json();

	try {
		// Formater les données du patient
		const formattedPatientData = formatPatientData(patientData);

		// Valeur d'ostéopathe, ici elle est en dur pour tester
		const osteopathId = 1;
		if (!osteopathId) {
			return new Response("Osteopath ID is required", { status: 400 });
		}

		// Connexion de l'ostéopathe à la donnée du patient
		formattedPatientData.osteopath = {
			connect: {
				id: osteopathId,
			},
		};

		// Vérification de l'ID du cabinet si fourni
		if (
			patientData.cabinetId &&
			isNaN(parseInt(patientData.cabinetId, 10))
		) {
			return new Response("Invalid cabinet ID", { status: 400 });
		}

		// Si un cabinet ID est fourni, on l'ajoute à la donnée patient
		if (patientData.cabinetId) {
			formattedPatientData.cabinet = {
				connect: {
					id: patientData.cabinetId,
				},
			};
		}

		// Traitement de `hasChildren` : Conversion en booléen si nécessaire
		if (patientData.hasChildren === "true") {
			formattedPatientData.hasChildren = true;
		} else if (patientData.hasChildren === "false") {
			formattedPatientData.hasChildren = false;
		}

		// Vérification des âges des enfants si `hasChildren` est vrai
		if (
			patientData.hasChildren === "true" &&
			Array.isArray(patientData.childrenAges)
		) {
			formattedPatientData.childrenAges = patientData.childrenAges.map(
				(age) => parseInt(age, 10)
			);
		}

		// Création d'un nouveau patient dans la base de données avec Prisma
		const newPatient = await prisma.patient.create({
			data: formattedPatientData,
		});

		// Retourner la réponse de création avec les données du patient
		return new Response(JSON.stringify(newPatient), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error creating patient:", error);
		return new Response(
			JSON.stringify({
				message: "Could not create patient",
				error: error.message,
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
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
