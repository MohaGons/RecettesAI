import { useState } from 'react';

export default function useNutrition() {
  const [nutritionInfo, setNutritionInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const analyzeRecipe = async (ingredients, servings) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyse-nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients, personnes: servings }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse nutritionnelle');
      }
      
      const data = await response.json();
      setNutritionInfo(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    nutritionInfo,
    isLoading,
    error,
    analyzeRecipe,
  };
}