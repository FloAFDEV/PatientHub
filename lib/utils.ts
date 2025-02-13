import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const parseStringify = <T>(value: T): T =>
	JSON.parse(JSON.stringify(value));

export const convertFileToUrl = (file: File): string =>
	URL.createObjectURL(file);

// FORMAT DATE TIME
export const formatDateTime = (
	dateString: Date | string,
	timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
): {
	dateTime: string;
	dateDay: string;
	dateOnly: string;
	timeOnly: string;
} => {
	const dateTimeOptions: Intl.DateTimeFormatOptions = {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: timeZone,
	};

	const dateDayOptions: Intl.DateTimeFormatOptions = {
		weekday: "short",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		timeZone: timeZone,
	};

	const dateOptions: Intl.DateTimeFormatOptions = {
		month: "short",
		year: "numeric",
		day: "numeric",
		timeZone: timeZone,
	};

	const timeOptions: Intl.DateTimeFormatOptions = {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: timeZone,
	};

	const date = new Date(dateString);

	return {
		dateTime: date.toLocaleString("fr-FR", dateTimeOptions),
		dateDay: date.toLocaleString("fr-FR", dateDayOptions),
		dateOnly: date.toLocaleString("fr-FR", dateOptions),
		timeOnly: date.toLocaleString("fr-FR", timeOptions),
	};
};
