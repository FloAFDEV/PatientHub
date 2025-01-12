import { NextResponse } from "next/server";
import prisma from "@/lib/connect";
import { formatPatientData } from "@/utils/formatPatientData";

// Fonction de gestion des requêtes GET
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
					osteopathId: true, // Inclure l'ID de l'ostéopathe
					osteopath: {
						select: {
							name: true, // Inclure le nom de l'ostéopathe
						},
					},
				},
				orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
			});

			// Log des informations liées à l'ostéopathe pour chaque patient
			patients.forEach((patient) => {
				console.log(
					`Patient: ${patient.firstName} ${patient.lastName}`
				);
				console.log(`Osteopath ID: ${patient.osteopathId}`);
				console.log(`Osteopath Name: ${patient.osteopath?.name}`);
			});

			// Retourner la réponse des patients avec l'ostéopathe
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
					osteopath: {
						select: {
							id: true,
							name: true, // Inclure l'ID et le nom de l'ostéopathe
						},
					},
					cabinet: true,
					medicalDocuments: true,
					consultations: true,
					appointments: true,
				},
			}),
			prisma.patient.count({ where: whereCondition }),
		]);

		// Log des informations liées à l'ostéopathe pour chaque patient
		patients.forEach((patient) => {
			console.log(`Patient: ${patient.firstName} ${patient.lastName}`);
			console.log(`Osteopath ID: ${patient.osteopath.id}`);
			console.log(`Osteopath Name: ${patient.osteopath.name}`);
		});

		// Formatage des dates avant l'envoi
		const formattedPatients = patients.map((patient) => ({
			...patient,
			birthDate: patient.birthDate
				? patient.birthDate.toISOString()
				: null,
			createdAt: patient.createdAt.toISOString(),
			updatedAt: patient.updatedAt.toISOString(),
		}));

		// Retourner les patients avec l'ostéopathe et les autres informations
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

// Fonction de gestion des requêtes POST
export async function POST(request) {
	const patientData = await request.json();

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

		// Validation de l'ostéopathe
		const osteopathId = patientData.osteopathId || 1; // Valeur d'ostéopathe par défaut pour tests
		if (!osteopathId) {
			return new Response("Osteopath ID is required", { status: 400 });
		}

		// Connexion de l'ostéopathe à la donnée du patient
		const osteopathExists = await prisma.osteopath.findUnique({
			where: { id: osteopathId },
		});
		if (!osteopathExists) {
			return new Response("Osteopath not found", { status: 404 });
		}

		formattedPatientData.osteopath = {
			connect: { id: osteopathId },
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
				connect: { id: patientData.cabinetId },
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

		// Log de la création du patient et de l'ostéopathe associé
		console.log("New Patient created:", newPatient);
		if (newPatient.osteopath) {
			console.log("Osteopath ID:", newPatient.osteopath.id);
			console.log("Osteopath Name:", newPatient.osteopath.name);
		}

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

// Fonction de gestion des requêtes DELETE
export async function DELETE(request) {
	try {
		// Récupérer l'ID du patient depuis les paramètres de l'URL
		const { searchParams } = new URL(request.url);
		const patientId = searchParams.get("id");

		// Vérification si l'ID est fourni et s'il est valide
		if (!patientId || isNaN(patientId)) {
			return NextResponse.json(
				{ error: "ID is required and must be a valid number" },
				{ status: 400 }
			);
		}

		// Chercher le patient dans la base de données
		const patient = await prisma.patient.findUnique({
			where: { id: parseInt(patientId) },
		});

		// Vérification si le patient existe
		if (!patient) {
			return NextResponse.json(
				{ error: "Patient not found" },
				{ status: 404 }
			);
		}

		// Log de l'existence du patient avant la suppression
		console.log(
			`Patient found for deletion: ${patient.firstName} ${patient.lastName}, ID: ${patient.id}`
		);

		// Transaction pour supprimer les relations et le patient
		const deletedPatient = await prisma.$transaction(async (prisma) => {
			// Supprimer le patient
			return await prisma.patient.delete({
				where: { id: patient.id },
			});
		});

		// Log de la suppression du patient
		console.log(
			`Patient successfully deleted: ${deletedPatient.firstName} ${deletedPatient.lastName}, ID: ${deletedPatient.id}`
		);

		// Retourner une réponse de succès
		return NextResponse.json(
			{ message: "Patient deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		// Log de l'erreur si elle survient
		console.error("Error deleting patient:", error);

		// Retourner une réponse d'erreur avec des détails sur l'erreur
		return NextResponse.json(
			{
				error: "Could not delete patient",
				details: error.message || "An unexpected error occurred.",
			},
			{ status: 500 }
		);
	}
}

// Fonction de gestion des requêtes PATCH
export async function PATCH(request) {
	try {
		const patientData = await request.json();

		if (!patientData.id) {
			return NextResponse.json(
				{ error: "Patient ID is required" },
				{ status: 400 }
			);
		}

		// Récupérer le patient existant dans la base de données
		const existingPatient = await prisma.patient.findUnique({
			where: { id: parseInt(patientData.id) },
			include: { osteopath: true }, // Inclure l'ostéopathe existant si nécessaire
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

		// Si un nouvel ID d'ostéopathe est fourni, l'ajouter dans les données mises à jour
		if (patientData.osteopathId) {
			const osteopathExists = await prisma.osteopath.findUnique({
				where: { id: parseInt(patientData.osteopathId) },
			});
			if (!osteopathExists) {
				return NextResponse.json(
					{ error: "Osteopath not found" },
					{ status: 404 }
				);
			}
			updatedPatientData.osteopath = {
				connect: { id: patientData.osteopathId },
			};
		} else if (existingPatient.osteopath) {
			// Si aucun ID d'ostéopathe n'est fourni mais qu'il existe déjà, le maintenir
			updatedPatientData.osteopath = {
				connect: { id: existingPatient.osteopath.id },
			};
		}

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
