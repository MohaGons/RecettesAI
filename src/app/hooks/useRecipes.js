import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export function useRecipes(filters = {}) {
  let url = '/api/recettes';
  const params = new URLSearchParams();
  
  if (filters.nom) {
    params.append('nom', filters.nom);
  }
  
  if (filters.type) {
    params.append('type', filters.type);
  }
  
  if (filters.ingredient) {
    params.append('ingredient', filters.ingredient);
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  
  return {
    recipes: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

export function useRecipe(id) {
  const { data, error, isLoading, mutate } = useSWR(id ? `/api/recettes/${id}` : null, fetcher);
  
  return {
    recipe: data || null,
    isLoading,
    isError: error,
    mutate
  };
}