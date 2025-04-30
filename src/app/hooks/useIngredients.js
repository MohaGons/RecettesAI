import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export function useIngredients(filters = {}) {
  let url = '/api/ingredients';
  const params = new URLSearchParams();
  
  if (filters.nom) {
    params.append('nom', filters.nom);
  }
  
  if (filters.categorie) {
    params.append('categorie', filters.categorie);
  }
  
  if (filters.unite) {
    params.append('unite', filters.unite);
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  
  return {
    ingredients: data || [],
    isLoading,
    isError: error,
    mutate
  };
}