import { PrismaClient } from "@prisma/client";

declare global {
	namespace NodeJS {
		interface Global {
			prisma: PrismaClient | undefined;
		}
	}
}

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
	global.prisma = prisma;
}

export default prisma;
