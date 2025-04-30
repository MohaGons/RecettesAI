import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';

export default function SearchForm({ initialQuery = '', onSearch }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch(query);
    } else {
      // Rediriger vers la page de recherche avec le paramètre de requête
      router.push(`/recipes/search?q=${encodeURIComponent(query)}`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative flex-1">
      <Input 
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher une recette..."
        className="w-full"
        startIcon={<Search className="text-gray-400" size={18} />}
        endIcon={
          query && (
            <button 
              type="button"
              className="text-gray-400" 
              onClick={() => setQuery('')}
            >
              <X size={18} />
            </button>
          )
        }
      />
    </form>
  );
}