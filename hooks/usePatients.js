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
			revalidateOnFocus: true,
			dedupingInterval: 0,
			keepPreviousData: false,
			revalidateIfStale: true,
		}
	);

	return {
		patients: data?.patients || [],
		totalPages: data?.totalPages || 1,
		isLoading: !error && !data, // ← on détecte le chargement ici
		isError: error,
		mutate,
	};
}
