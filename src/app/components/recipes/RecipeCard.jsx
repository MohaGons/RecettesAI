// components/recipes/RecipeCard.jsx
import Link from 'next/link';
import Image from 'next/image';
import { Clock, User } from 'lucide-react';

export default function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.id}`} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow block h-full">
      <div className="h-48 relative">
        {recipe.Photo ? (
          <Image 
            src={recipe.Photo} 
            alt={recipe.Nom}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Pas d'image</span>
          </div>
        )}
        {recipe.TypeDePlat && (
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
            {recipe.TypeDePlat}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg text-gray-800 mb-2">{recipe.Nom}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Clock size={14} className="mr-1" />
          <span>{recipe.TempsDePréparation} min</span>
          <span className="mx-2">•</span>
          <User size={14} className="mr-1" />
          <span>{recipe.NombreDePersonnes} pers.</span>
        </div>
        
        {recipe.CaloriesTotales && (
          <div className="text-sm">
            <span className="font-medium">{recipe.CaloriesTotales}</span> calories par portion
          </div>
        )}
        
        {recipe.IntolérancesAlimentaires && recipe.IntolérancesAlimentaires.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {recipe.IntolérancesAlimentaires.map(allergen => (
              <span 
                key={allergen} 
                className="px-2 py-0.5 bg-red-100 text-xs rounded-full text-red-600"
              >
                {allergen}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}