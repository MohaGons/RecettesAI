import Link from "next/link";
import Image from "next/image";

export default function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 w-full">
          {recipe.Image && recipe.Image[0] ? (
            <Image
              src={recipe.Image[0].url}
              alt={recipe.Name}
              fill
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-full bg-amber-200 flex items-center justify-center">
              <span className="text-amber-700">Pas d'image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-amber-800 mb-2">
            {recipe.Name}
          </h3>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Préparation: {recipe.PreparationTime} min</span>
            <span>Pour {recipe.Servings} personnes</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
              {recipe.Type}
            </span>
            {/* On pourrait ajouter d'autres badges ici */}
          </div>
        </div>
      </div>
    </Link>
  );
}
