import useSWR from "swr";

const fetcher = async (url) => {
	const res = await fetch(url);
	if (!res.ok) throw new Error("An error occurred while fetching the data.");
	return res.json();
};

export function usePatients(page, search = "", letter = "") {
	const { data, error, mutate } = useSWR(
		`/api/patients?page=${page}&search=${search}&letter=${letter}`,
		fetcher,
		{
			revalidateOnFocus: true, // Revalidation sur focus
			dedupingInterval: 0, // Désactivation de la déduplication
			keepPreviousData: false, // Désactivation de la conservation des données précédentes
			revalidateIfStale: true, //Revalidation si les données sont périmées
		}
	);

	return {
		patients: data?.patients || [],
		totalPages: data?.totalPages || 1,
		isLoading: !error && !data,
		isError: error,
		mutate,
	};
}
