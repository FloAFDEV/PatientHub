// hooks/usePatients.ts
import useSWR from "swr";
import { fetcher } from "../components/lib/api";

export function usePatients(
	page: number,
	search: string = "",
	letter: string = ""
) {
	const { data, error, mutate } = useSWR(
		`/api/patients?page=${page}&search=${search}&letter=${letter}`,
		fetcher,
		{
			revalidateOnFocus: false, // Désactive le refetch au focus
			revalidateOnReconnect: false, // Désactive le refetch à la reconnexion
			revalidateIfStale: false, // Désactive le refetch si les données sont périmées
			dedupingInterval: 10000, // Augmente l'intervalle de déduplication à 10s
			keepPreviousData: true, // Garde les données précédentes pendant le chargement
			shouldRetryOnError: false, // Désactive les retry en cas d'erreur
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

export function useAllPatients() {
	const { data, error, mutate } = useSWR(
		"/api/patients?fetchAll=true",
		fetcher,
		{
			revalidateOnFocus: false,
			dedupingInterval: 5000,
		}
	);

	return {
		patients: data || [],
		isLoading: !error && !data,
		isError: error,
		mutate,
	};
}
