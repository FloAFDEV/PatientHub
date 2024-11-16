export const fetcher = async (url: string) => {
	const res = await fetch(url);
	if (!res.ok) throw new Error("An error occurred while fetching the data.");
	return res.json();
};

export const getPatientKey = (
	page: number,
	search: string = "",
	letter: string = ""
) => {
	const params = new URLSearchParams();
	if (page) params.append("page", String(page));
	if (search) params.append("search", search);
	if (letter) params.append("letter", letter);
	return `/api/patients?${params.toString()}`;
};

export const getAllPatientsKey = () => `/api/patients?fetchAll=true`;

export const mutatePatients = async () => {
	// Cette fonction sera utilisée pour invalider le cache après les modifications
	const event = new CustomEvent("mutate-patients");
	window.dispatchEvent(event);
};
