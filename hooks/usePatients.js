import useSWR from "swr";
import { fetcher, getPatientKey, getAllPatientsKey } from "@/lib/api";

export function usePatients(page, search, letter) {
	const { data, error, mutate } = useSWR(
		getPatientKey(page, search, letter),
		fetcher,
		{
			revalidateOnFocus: false,
			dedupingInterval: 5000,
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
	const { data, error, mutate } = useSWR(getAllPatientsKey(), fetcher, {
		revalidateOnFocus: false,
		dedupingInterval: 5000,
	});

	return {
		patients: data || [],
		isLoading: !error && !data,
		isError: error,
		mutate,
	};
}
