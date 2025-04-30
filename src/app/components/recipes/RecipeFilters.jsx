import { useState } from 'react';

export default function RecipeFilters({ activeFilters, applyFilters, closeFilters }) {
  const [filters, setFilters] = useState({
    dishType: activeFilters.type || 'Tous',
    diets: [...(activeFilters.diets || [])],
    prepTime: activeFilters.prepTime || null,
  });
  
  const dishTypes = ['Tous', 'Entrées', 'Plats', 'Desserts', 'Soupes', 'Salades'];
  const dietTypes = ['Végétarien', 'Végétalien', 'Sans gluten', 'Sans lactose', 'Faible en calories'];
  const prepTimes = [
    { label: '< 15 min', value: 15 },
    { label: '< 30 min', value: 30 },
    { label: '< 45 min', value: 45 },
    { label: '< 60 min', value: 60 },
  ];
  
  const handleDishTypeClick = (type) => {
    setFilters({ ...filters, dishType: type });
  };
  
  const handleDietToggle = (diet) => {
    const updatedDiets = filters.diets.includes(diet)
      ? filters.diets.filter(d => d !== diet)
      : [...filters.diets, diet];
    
    setFilters({ ...filters, diets: updatedDiets });
  };
  
  const handlePrepTimeClick = (time) => {
    setFilters({ ...filters, prepTime: time === filters.prepTime ? null : time });
  };
  
  const handleReset = () => {
    setFilters({
      dishType: 'Tous',
      diets: [],
      prepTime: null,
    });
  };
  
  const handleApply = () => {
    const apiFilters = {
      type: filters.dishType === 'Tous' ? '' : filters.dishType,
      diets: filters.diets,
      prepTime: filters.prepTime
    };
    
    applyFilters(apiFilters);
  };
  
  return (
    <div className="mt-4 pt-4 border-t">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Type de plat</h3>
          <div className="flex flex-wrap gap-2">
            {dishTypes.map(type => (
              <button
                key={type}
                onClick={() => handleDishTypeClick(type)}
                className={`px-3 py-1 rounded-full text-sm ${
                  type === filters.dishType ? 'bg-primary-600 text-white' : 'bg-white border'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Régimes alimentaires</h3>
          <div className="flex flex-wrap gap-2">
            {dietTypes.map(diet => (
              <button
                key={diet}
                onClick={() => handleDietToggle(diet)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.diets.includes(diet) ? 'bg-primary-600 text-white' : 'bg-white border'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Temps de préparation</h3>
          <div className="flex flex-wrap gap-2">
            {prepTimes.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handlePrepTimeClick(value)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.prepTime === value ? 'bg-primary-600 text-white' : 'bg-white border'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-3">
          <button 
            className="px-4 py-2 text-gray-600 border rounded-lg"
            onClick={handleReset}
          >
            Réinitialiser
          </button>
          <button 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg"
            onClick={handleApply}
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}