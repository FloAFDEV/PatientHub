import { NextResponse } from "next/server";
import prisma from "@/lib/connect";

// Fonction pour formater les données du patient
function formatPatientData(data) {
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

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const fetchAll = searchParams.get("fetchAll") === "true";
		const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
		const pageSize = parseInt(searchParams.get("pageSize") || "15", 10);
		const searchTerm =
			searchParams.get("search") || searchParams.get("term") || "";
		const letter = searchParams.get("letter") || "";

		// Normalisation du paramètre `letter`
		const normalizedLetter = letter
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toUpperCase();

		// Condition de recherche
		const whereCondition = {
			...(searchTerm && {
				OR: [
					{
						firstName: {
							contains: searchTerm,
							mode: "insensitive",
						},
					},
					{ lastName: { contains: searchTerm, mode: "insensitive" } },
					{ email: { contains: searchTerm, mode: "insensitive" } },
					{ phone: { contains: searchTerm } },
				],
			}),
			...(normalizedLetter && {
				lastName: { startsWith: normalizedLetter, mode: "insensitive" },
			}),
		};

		// Si fetchAll est vrai, récupère tous les patients
		if (fetchAll) {
			const patients = await prisma.patient.findMany({
				where: whereCondition,
				select: {
					id: true,
					firstName: true,
					lastName: true,
					email: true,
					phone: true,
				},
				orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
			});
			return NextResponse.json(patients);
		}

		// Pagination et récupération des données avec count total
		const [patients, totalCount] = await Promise.all([
			prisma.patient.findMany({
				where: whereCondition,
				skip: (page - 1) * pageSize,
				take: pageSize,
				orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
				include: {
					osteopath: true,
					cabinet: true,
					medicalDocuments: true,
					consultations: true,
					appointments: true,
				},
			}),
			prisma.patient.count({ where: whereCondition }),
		]);

		// Formatage des dates avant l'envoi
		const formattedPatients = patients.map((patient) => ({
			...patient,
			birthDate: patient.birthDate
				? patient.birthDate.toISOString()
				: null,
			createdAt: patient.createdAt.toISOString(),
			updatedAt: patient.updatedAt.toISOString(),
		}));

		return NextResponse.json({
			patients: formattedPatients,
			totalPatients: totalCount,
			totalPages: Math.ceil(totalCount / pageSize),
			currentPage: page,
			pageSize,
		});
	} catch (error) {
		console.error("Erreur lors de la récupération des patients:", error);
		return NextResponse.json(
			{ error: "Erreur lors de la récupération des patients" },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	const patientData = await request.json();

	// Log des données reçues pour vérifier leur structure
	console.log("Received patient data:", patientData);

	try {
		// Validation des champs firstName et lastName
		if (!patientData.firstName || !patientData.lastName) {
			console.log("Error: firstName or lastName missing");
			return new Response("Firstname and lastname are required", {
				status: 400,
			});
		}

		// Formater les données du patient
		const formattedPatientData = formatPatientData(patientData);

		// Ajouter firstName et lastName à formattedPatientData
		formattedPatientData.firstName = patientData.firstName;
		formattedPatientData.lastName = patientData.lastName;

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

export async function DELETE(request) {
	try {
		const { searchParams } = new URL(request.url);
		const patientId = searchParams.get("id");

		if (!patientId) {
			return NextResponse.json(
				{ error: "ID is required" },
				{ status: 400 }
			);
		}

		const patient = await prisma.patient.findUnique({
			where: { id: parseInt(patientId) },
		});

		if (!patient) {
			return NextResponse.json(
				{ error: "Patient not found" },
				{ status: 404 }
			);
		}

		// Transaction pour supprimer les relations et le patient
		const deletedPatient = await prisma.$transaction(async (prisma) => {
			await prisma.consultation.deleteMany({
				where: { patientId: patient.id },
			});
			await prisma.appointment.deleteMany({
				where: { patientId: patient.id },
			});
			await prisma.medicalDocument.deleteMany({
				where: { patientId: patient.id },
			});
			return await prisma.patient.delete({ where: { id: patient.id } });
		});

		return NextResponse.json(
			{
				message: "Patient deleted successfully",
				patient: deletedPatient,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting patient:", error);
		return NextResponse.json(
			{ error: "Could not delete patient", details: error.message },
			{ status: 500 }
		);
	}
}
export async function PATCH(request) {
	try {
		const patientData = await request.json();
		console.log("Received patient data:", patientData);

		if (!patientData.id) {
			return NextResponse.json(
				{ error: "Patient ID is required" },
				{ status: 400 }
			);
		}

		// Récupérer le patient existant dans la base de données
		const existingPatient = await prisma.patient.findUnique({
			where: { id: parseInt(patientData.id) },
		});

		if (!existingPatient) {
			return NextResponse.json(
				{ error: "Patient not found" },
				{ status: 404 }
			);
		}

		// Formatage des nouvelles données, en gardant les anciennes valeurs si elles ne sont pas présentes
		const updatedPatientData = {
			firstName: patientData.firstName || existingPatient.firstName,
			lastName: patientData.lastName || existingPatient.lastName,
			email: patientData.email || existingPatient.email,
			phone: patientData.phone || existingPatient.phone,
			address: patientData.address || existingPatient.address,
			gender: patientData.gender || existingPatient.gender,
			maritalStatus:
				patientData.maritalStatus || existingPatient.maritalStatus,
			occupation: patientData.occupation || existingPatient.occupation,
			hasChildren:
				patientData.hasChildren !== undefined
					? patientData.hasChildren
					: existingPatient.hasChildren,
			childrenAges:
				patientData.childrenAges || existingPatient.childrenAges,
			physicalActivity:
				patientData.physicalActivity ||
				existingPatient.physicalActivity,
			isSmoker:
				patientData.isSmoker !== undefined
					? patientData.isSmoker
					: existingPatient.isSmoker,
			handedness: patientData.handedness || existingPatient.handedness,
			contraception:
				patientData.contraception || existingPatient.contraception,
			currentTreatment:
				patientData.currentTreatment ||
				existingPatient.currentTreatment,
			generalPractitioner:
				patientData.generalPractitioner ||
				existingPatient.generalPractitioner,
			surgicalHistory:
				patientData.surgicalHistory || existingPatient.surgicalHistory,
			digestiveProblems:
				patientData.digestiveProblems ||
				existingPatient.digestiveProblems,
			digestiveDoctorName:
				patientData.digestiveDoctorName ||
				existingPatient.digestiveDoctorName,

			// Formatage de birthDate en ISO-8601 si présente
			birthDate: patientData.birthDate
				? new Date(patientData.birthDate).toISOString()
				: existingPatient.birthDate,

			avatarUrl: patientData.avatarUrl || existingPatient.avatarUrl,
			traumaHistory:
				patientData.traumaHistory || existingPatient.traumaHistory,
			rheumatologicalHistory:
				patientData.rheumatologicalHistory ||
				existingPatient.rheumatologicalHistory,
			hasVisionCorrection:
				patientData.hasVisionCorrection !== undefined
					? patientData.hasVisionCorrection
					: existingPatient.hasVisionCorrection,
			ophtalmologistName:
				patientData.ophtalmologistName ||
				existingPatient.ophtalmologistName,
			entProblems: patientData.entProblems || existingPatient.entProblems,
			entDoctorName:
				patientData.entDoctorName || existingPatient.entDoctorName,
			hdlm: patientData.hdlm || existingPatient.hdlm,

			// Conversion de isDeceased en booléen
			isDeceased:
				patientData.isDeceased !== undefined
					? patientData.isDeceased === "true" // Conversion de "true"/"false" en booléen
					: existingPatient.isDeceased,
		};

		// Mise à jour du patient
		const updatedPatient = await prisma.patient.update({
			where: { id: parseInt(patientData.id) },
			data: updatedPatientData,
		});

		return NextResponse.json(updatedPatient, { status: 200 });
	} catch (error) {
		console.error("Error updating patient:", error);
		return NextResponse.json(
			{ error: "Could not update patient", details: error.message },
			{ status: 500 }
		);
	}
}
