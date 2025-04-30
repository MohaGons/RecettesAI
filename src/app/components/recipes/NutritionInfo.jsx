import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function NutritionInfo({ nutrition }) {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {nutrition.calories}
          </div>
          <div className="text-sm text-blue-800 mt-1">Calories</div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">
            {nutrition.protein}g
          </div>
          <div className="text-sm text-red-800 mt-1">Protéines</div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {nutrition.carbs}g
          </div>
          <div className="text-sm text-yellow-800 mt-1">Glucides</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {nutrition.fat}g
          </div>
          <div className="text-sm text-green-800 mt-1">Lipides</div>
        </div>
      </div>
            <button 
        className="flex items-center justify-center w-full text-gray-600 hover:text-gray-800 transition-colors"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? (
          <>
            Moins de détails <ChevronUp size={16} className="ml-1" />
          </>
        ) : (
          <>
            Plus de détails <ChevronDown size={16} className="ml-1" />
          </>
        )}
      </button>
      
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Répartition des macronutriments</h3>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="flex h-full">
                <div 
                  className="bg-red-500" 
                  style={{ width: `${(nutrition.protein * 4 / nutrition.calories) * 100}%` }}
                  title={`Protéines: ${Math.round((nutrition.protein * 4 / nutrition.calories) * 100)}%`}
                ></div>
                <div 
                  className="bg-yellow-500" 
                  style={{ width: `${(nutrition.carbs * 4 / nutrition.calories) * 100}%` }}
                  title={`Glucides: ${Math.round((nutrition.carbs * 4 / nutrition.calories) * 100)}%`}
                ></div>
                <div 
                  className="bg-green-500" 
                  style={{ width: `${(nutrition.fat * 9 / nutrition.calories) * 100}%` }}
                  title={`Lipides: ${Math.round((nutrition.fat * 9 / nutrition.calories) * 100)}%`}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Protéines</span>
              <span>Glucides</span>
              <span>Lipides</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            Cette recette contient {nutrition.calories} calories par portion, avec {nutrition.protein}g de protéines, 
            {nutrition.carbs}g de glucides et {nutrition.fat}g de lipides.
          </p>
        </div>
      )}
    </div>
  );
}