'use client'
import RecipeCard from '@/app/components/recipes/RecipeCard';
import { Link, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useRecipes } from '../hooks/useRecipes';

export default function RecipesPage() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const { recipes, isLoading } = useRecipes();
  
  const categories = ["Tous", "Entrée", "Plat principal", "Dessert", "Salade", "Soupe"];
  
  const filteredRecipes = activeCategory === 'Tous' 
    ? recipes 
    : recipes.filter(recipe => recipe.TypeDePlat === activeCategory);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Toutes les recettes</h1>
        
        <div className="flex space-x-3">
          <Link 
            href="/recipes/search" 
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
          >
            <Search size={18} className="mr-2" />
            Recherche avancée
          </Link>
          
          <Link 
            href="/recipes/create" 
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <Plus size={18} className="mr-2" />
            Nouvelle recette
          </Link>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg ${
                activeCategory === category 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des recettes...</p>
        </div>
      ) : filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-3">Aucune recette trouvée dans cette catégorie.</p>
          <Link 
            href="/recipes/create" 
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <Plus size={18} className="mr-2" />
            Créer une recette
          </Link>
        </div>
      )}
    </div>
  );
}