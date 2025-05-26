"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { useRecipes } from "@/app/hooks/useRecipes";
import { useIngredients } from "@/app/hooks/useIngredients";
import RecipeCard from "@/app/components/recipes/RecipeCard";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    ingredient: "",
  });
  const [sortBy, setSortBy] = useState("recent");

  // Récupération des ingrédients depuis Airtable
  const { ingredients, isLoading: ingredientsLoading } = useIngredients();

  // Charger les paramètres de l'URL
  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) setQuery(queryParam);

    const typeParam = searchParams.get("type");
    if (typeParam) setFilters((prev) => ({ ...prev, type: typeParam }));

    const ingredientParam = searchParams.get("ingredient");
    if (ingredientParam)
      setFilters((prev) => ({ ...prev, ingredient: ingredientParam }));
  }, [searchParams]);

  // Récupérer les recettes avec les filtres actuels
  const { recipes, isLoading, isError } = useRecipes({
    nom: query,
    ...filters,
  });

  // Appliquer les filtres et mettre à jour l'URL
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (filters.type) params.append("type", filters.type);
    if (filters.ingredient) params.append("ingredient", filters.ingredient);

    router.push(`/recipes/search?${params.toString()}`);
  };

  // Trier les recettes
  const sortedRecipes = [...(recipes || [])].sort((a, b) => {
    if (sortBy === "calories-asc")
      return (a.CaloriesTotales || 0) - (b.CaloriesTotales || 0);
    if (sortBy === "calories-desc")
      return (b.CaloriesTotales || 0) - (a.CaloriesTotales || 0);
    if (sortBy === "time-asc")
      return (a.TempsDePréparation || 0) - (b.TempsDePréparation || 0);
    if (sortBy === "time-desc")
      return (b.TempsDePréparation || 0) - (a.TempsDePréparation || 0);

    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recherche de recettes</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher des recettes..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center border ${
              showFilters
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-white border-gray-300"
            }`}
          >
            <Filter size={18} className="mr-2" />
            Filtres
          </button>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Rechercher
          </button>
        </form>

        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de plat
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Tous les types</option>
                <option value="Entrée">Entrée</option>
                <option value="Plat principal">Plat principal</option>
                <option value="Dessert">Dessert</option>
                <option value="Salade">Salade</option>
                <option value="Soupe">Soupe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingrédient spécifique
              </label>
              <select
                value={filters.ingredient}
                onChange={(e) =>
                  setFilters({ ...filters, ingredient: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Tous les ingrédients</option>
                {ingredientsLoading ? (
                  <option disabled>Chargement des ingrédients...</option>
                ) : (
                  ingredients.map((ingredient) => (
                    <option key={ingredient.id} value={ingredient.id}>
                      {ingredient.Nom}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setFilters({ type: "", ingredient: "" });
                  setQuery("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 mr-2"
              >
                Réinitialiser
              </button>

              <button
                type="button"
                onClick={applyFilters}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Appliquer
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          {!isLoading && (
            <p className="text-gray-600">
              {sortedRecipes.length} résultat
              {sortedRecipes.length !== 1 ? "s" : ""} trouvé
              {sortedRecipes.length !== 1 ? "s" : ""}
              {query && ` pour "${query}"`}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <label className="text-sm text-gray-600 mr-2">Trier par:</label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="recent">Plus récentes</option>
              <option value="calories-asc">Calories (croissant)</option>
              <option value="calories-desc">Calories (décroissant)</option>
              <option value="time-asc">Temps (plus rapide)</option>
              <option value="time-desc">Temps (plus long)</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-3 text-gray-500 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des recettes...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600">
            Une erreur est survenue lors de la recherche.
          </p>
        </div>
      ) : sortedRecipes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-2">
            Aucune recette ne correspond à votre recherche.
          </p>
          <p className="text-gray-500">
            Essayez d&apos;autres mots-clés ou de modifier vos filtres.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

function SearchLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recherche de recettes</h1>
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement de la recherche...</p>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}