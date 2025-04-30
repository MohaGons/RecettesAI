"use client";
import RecipeCard from './RecipeCard';

export default function RecipeList({ 
  recipes, 
  layout = 'grid',
  emptyMessage = "Aucune recette trouvée" 
}) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }
  
  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    );
  }
  
  if (layout === 'list') {
    return (
      <div className="space-y-4">
        {recipes.map(recipe => (
          <div key={recipe.id} className="flex bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="w-24 h-24 bg-gray-200 relative flex-shrink-0">
              {recipe.Photo && recipe.Photo[0] && (
                <Image
                  src={recipe.Photo[0].url}
                  alt={recipe.Nom}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1 p-3">
              <h3 className="font-medium">{recipe.Nom}</h3>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span className="mr-2">{recipe.TempsDePréparation} min</span>
                <span>•</span>
                <span className="ml-2">{recipe.CaloriesTotales} kcal</span>
              </div>
              {recipe.TypeDePlat && (
                <div className="mt-2">
                  <span className="mr-2 px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-600">
                    {recipe.TypeDePlat}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Compact layout
  return (
    <div className="space-y-2">
      {recipes.map(recipe => (
        <div key={recipe.id} className="flex items-center p-2 bg-white rounded-lg hover:bg-gray-50">
          <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 relative flex-shrink-0">
            {recipe.Photo && recipe.Photo[0] && (
              <Image
                src={recipe.Photo[0].url}
                alt={recipe.Nom}
                fill
                className="object-cover rounded-full"
              />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium">{recipe.Nom}</h3>
            <div className="text-xs text-gray-500">
              {recipe.TempsDePréparation} min • {recipe.CaloriesTotales} kcal
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}