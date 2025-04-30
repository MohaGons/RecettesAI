import { useState } from 'react';
import { Check, AlertTriangle } from 'lucide-react';

export default function IngredientsList({ 
  ingredients, 
  servings, 
  allergens = [], 
  editable = false,
  onChange
}) {
  const [checkedIngredients, setCheckedIngredients] = useState({});
  
  const toggleIngredient = (index) => {
    if (!editable) return;
    
    const newChecked = { 
      ...checkedIngredients, 
      [index]: !checkedIngredients[index] 
    };
    
    setCheckedIngredients(newChecked);
    
    if (onChange) {
      onChange(
        ingredients.filter((_, i) => !newChecked[i])
      );
    }
  };
  
  return (
    <div className="space-y-3">
      {servings && (
        <p className="text-sm text-gray-500">Pour {servings} personnes</p>
      )}
      
      <ul className="space-y-3">
        {ingredients.map((ingredient, i) => (
          <li 
            key={i} 
            className={`
              flex justify-between p-3 bg-gray-50 rounded-lg cursor-pointer
              ${checkedIngredients[i] ? 'opacity-60' : ''}
            `}
            onClick={() => toggleIngredient(i)}
          >
            <span className={checkedIngredients[i] ? 'line-through text-gray-500' : ''}>{ingredient}</span>
            {editable && (
              <span className="text-gray-400">
                {checkedIngredients[i] ? <Check size={18} className="text-primary-500" /> : null}
              </span>
            )}
          </li>
        ))}
      </ul>
      
      {allergens && allergens.length > 0 && (
        <div className="mt-6">
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-start">
            <div className="bg-yellow-200 p-1 rounded mr-3 mt-0.5">
              <AlertTriangle size={16} className="text-yellow-700" />
            </div>
            <div>
              <p className="text-sm text-yellow-800 font-medium">Information allergie</p>
              <p className="text-sm text-yellow-700 mt-1">
                Cette recette contient des {allergens.join(', ')}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}