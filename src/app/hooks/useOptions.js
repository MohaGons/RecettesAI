import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function useIntoleranceOptions() {
  const { data, error, isLoading } = useSWR("/api/options", fetcher);

  // Assure-toi que options est toujours un tableau
  const options = Array.isArray(data) ? data : [];

  return {
    options,
    isLoading,
    isError: error,
  };
}
