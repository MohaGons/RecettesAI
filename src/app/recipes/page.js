"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import RecipeCard from "../components/ui/RecipeCard";
import SearchBar from "../components/ui/SearchBar";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Construire l'URL de l'API en fonction de la présence d'une requête de recherche
        const apiUrl = query
          ? `/api/recipes?query=${encodeURIComponent(query)}`
          : "/api/recipes";

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des recettes");
        }

        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-800 mb-4">
            {query ? `Résultats pour "${query}"` : "Toutes les recettes"}
          </h1>

          <div className="max-w-xl mb-8">
            <SearchBar />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
        ) : recipes.length === 0 ? (
          <div className="bg-amber-50 p-8 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-amber-800 mb-2">
              Aucune recette trouvée
            </h3>
            <p className="text-gray-600">
              {query
                ? `Aucune recette ne correspond à votre recherche "${query}"`
                : "Aucune recette n'a encore été créée."}
            </p>
            {query && (
              <button
                onClick={() => (window.location.href = "/recipes")}
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Voir toutes les recettes
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
