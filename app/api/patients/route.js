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
	try {
		const { searchParams } = new URL(request.url);
		const name = searchParams.get("name");
		const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1); // Définit `page` à 1 si `NaN` ou négatif
		const pageSize = 15;

		// Fonction pour construire la condition where de recherche
		const buildWhereCondition = (name) => {
			return name
				? {
						OR: [
							{ name: { contains: name, mode: "insensitive" } },
							{
								firstName: {
									contains: name,
									mode: "insensitive",
								},
							},
						],
				  }
				: {};
		};
		const whereCondition = buildWhereCondition(name);
		// Obtenir le nombre total de patients pour la pagination
		const totalPatients = await prisma.patient.count({
			where: whereCondition,
		});
		const totalPages = Math.ceil(totalPatients / pageSize);
		// Obtenir les patients en fonction de la pagination et des filtres
		const patients = await prisma.patient.findMany({
			where: whereCondition,
			skip: (page - 1) * pageSize,
			take: pageSize,
			include: {
				osteopath: true,
				cabinet: true,
			},
		});
		// Retourner les données avec les informations de pagination
		return new Response(
			JSON.stringify({
				patients,
				totalPatients,
				totalPages,
				currentPage: page,
				pageSize,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (error) {
		console.error("Erreur lors de la récupération des patients :", error);
		return new Response(
			JSON.stringify({
				message: "Erreur lors de la récupération des patients",
				error: error.message,
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
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
		if (patientData.cabinetId) {
			const cabinetExists = await prisma.cabinet.findUnique({
				where: { id: parseInt(patientData.cabinetId) },
			});
			if (!cabinetExists) {
				return new Response("Cabinet not found", { status: 404 });
			}
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
		const patient = await prisma.patient.findUnique({ where: { email } });
		if (!patient) {
			return new Response("Patient not found", { status: 404 });
		}
		await prisma.patient.delete({ where: { email } });
		return new Response("Patient deleted successfully", { status: 204 });
	} catch (error) {
		console.error("Error deleting patient:", error);
		return handleErrorResponse(error, "Could not delete patient");
	}
}
