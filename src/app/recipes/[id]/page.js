"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/layouts/Header";
import Footer from "../../components/layouts/Footer";
import NutritionalInfoCard from "../../components/ui/NutritionalInfoCard";

export default function RecipeDetailPage() {
  const params = useParams();
  const { id } = params;

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/recipes?id=${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Recette non trouvée");
          }
          throw new Error("Erreur lors de la récupération de la recette");
        }

        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Erreur</h2>
            <p>{error}</p>
            <Link
              href="/recipes"
              className="mt-4 inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Retour aux recettes
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-amber-50 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Recette non trouvée</h2>
            <p>
              La recette que vous recherchez n'existe pas ou a été supprimée.
            </p>
            <Link
              href="/recipes"
              className="mt-4 inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Retour aux recettes
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Récupérer les infos nutritionnelles (s'assurer qu'elles sont un objet)
  const nutritionalInfo =
    typeof recipe.NutritionalInfo === "string"
      ? JSON.parse(recipe.NutritionalInfo)
      : recipe.NutritionalInfo;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/recipes"
            className="inline-flex items-center text-amber-700 hover:text-amber-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour aux recettes
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* En-tête de la recette */}
          <div className="relative h-64 w-full">
            {recipe.Image && recipe.Image[0] ? (
              <Image
                src={recipe.Image[0].url}
                alt={recipe.Name}
                fill
                objectFit="cover"
              />
            ) : (
              <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                <span className="text-amber-700 text-xl font-medium">
                  {recipe.Name}
                </span>
              </div>
            )}
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-amber-800 mb-2">
              {recipe.Name}
            </h1>

            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                {recipe.Type}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                Préparation: {recipe.PreparationTime} min
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                Cuisson: {recipe.CookingTime} min
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                Pour {recipe.Servings} personnes
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              {/* Ingrédients */}
              <div>
                <h2 className="text-2xl font-semibold text-amber-800 mb-4">
                  Ingrédients
                </h2>
                <ul className="space-y-2">
                  {recipe.ingredients &&
                    recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-amber-600 mr-2">•</span>
                        <span>
                          {ingredient.quantity} {ingredient.unit} de{" "}
                          {ingredient.name}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h2 className="text-2xl font-semibold text-amber-800 mb-4">
                  Instructions
                </h2>
                <div className="prose max-w-none text-gray-700">
                  {/* Afficher les instructions en respectant les sauts de ligne */}
                  {recipe.Instructions.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Informations nutritionnelles */}
            <div className="mt-10">
              <NutritionalInfoCard nutritionalInfo={nutritionalInfo} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
