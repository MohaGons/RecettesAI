// app/recipes/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import NextImage from "next/image";
import Link from "next/link";
import { Clock, User, Share2, Heart, Info, Printer } from "lucide-react";
import { useRecipe } from "@/app/hooks/useRecipes";
import { useIngredients } from "@/app/hooks/useIngredients";
import NutritionInfo from "@/app/components/recipes/NutritionInfo";

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [activeTab, setActiveTab] = useState("ingredients");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageValid, setIsImageValid] = useState(true);

  const { recipe, isLoading, isError } = useRecipe(id);
  const { ingredients: allIngredients, isLoading: ingredientsLoading } =
    useIngredients();

  // Log pour déboguer l'URL de l'image
  useEffect(() => {
    if (recipe && recipe.Photo) {
      console.log("URL de l'image chargée:", recipe.Photo);

      // Vérifie si l'URL est valide (en utilisant l'élément HTML Image au lieu de l'import Next.js)
      const checkImage = new globalThis.Image();
      checkImage.onload = () => setIsImageValid(true);
      checkImage.onerror = () => {
        console.error("Erreur de chargement de l'image:", recipe.Photo);
        setIsImageValid(false);
      };
      checkImage.src = recipe.Photo;
    }
  }, [recipe]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement de la recette...</p>
      </div>
    );
  }

  if (isError || !recipe) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
          <p>La recette n&apos;a pas pu être chargée</p>
        </div>
        <div className="mt-4">
          <Link href="/recipes" className="text-green-600 hover:underline">
            Retour aux recettes
          </Link>
        </div>
      </div>
    );
  }

  // Préparer les données nutritionnelles
  const nutrition = {
    calories: recipe.CaloriesTotales.toFixed(2) || 0,
    protein: recipe.ProtéinesTotales.toFixed(2) || 0,
    carbs: recipe.GlucidesTotaux.toFixed(2) || 0,
    fat: recipe.LipidesTotaux.toFixed(2) || 0,
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main content */}
        <div className="lg:col-span-8">
          {/* Header and image */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-8">
            <div className="relative h-96">
              {recipe.Photo && isImageValid ? (
                <>
                  <NextImage
                    src={recipe.Photo}
                    alt={recipe.Nom}
                    fill
                    className="object-cover"
                    priority
                    onError={() => {
                      console.error(
                        "Erreur lors de l'affichage de l'image:",
                        recipe.Photo
                      );
                      setIsImageValid(false);
                    }}
                  />
                </>
              ) : (
                <div className="h-full w-full bg-gray-200 flex flex-col items-center justify-center">
                  <span className="text-gray-400 text-lg mb-2">
                    {recipe.Photo
                      ? "Erreur de chargement de l'image"
                      : "Pas d'image disponible"}
                  </span>
                  {recipe.Photo && (
                    <span className="text-red-400 text-xs px-4 text-center max-w-full overflow-hidden">
                      URL invalide: {recipe.Photo}
                    </span>
                  )}
                  <div className="mt-4">
                    <span className="text-gray-500 text-sm">
                      Image de remplacement pour: {recipe.Nom}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <h1 className="text-3xl font-bold">{recipe.Nom}</h1>
                <div className="flex space-x-2">
                  <button
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={handlePrint}
                  >
                    <Printer size={20} className="text-gray-600" />
                  </button>
                  <button
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      // Logique de partage
                      navigator
                        .share?.({
                          title: recipe.Nom,
                          text:
                            recipe.Description || "Découvrez cette recette !",
                          url: window.location.href,
                        })
                        .catch((err) => console.log("Erreur de partage:", err));
                    }}
                  >
                    <Share2 size={20} className="text-gray-600" />
                  </button>
                  <button
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={toggleFavorite}
                  >
                    <Heart
                      size={20}
                      className={
                        isFavorite
                          ? "text-red-500 fill-red-500"
                          : "text-gray-600"
                      }
                    />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Clock size={18} className="text-gray-500 mr-2" />
                  <span className="text-gray-600">
                    {recipe.TempsDePréparation} min
                  </span>
                </div>
                <div className="flex items-center">
                  <User size={18} className="text-gray-500 mr-2" />
                  <span className="text-gray-600">
                    {recipe.NombreDePersonnes} pers.
                  </span>
                </div>
                {recipe.TypeDePlat && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {recipe.TypeDePlat}
                  </span>
                )}
                {recipe.IntolérancesAlimentaires &&
                  recipe.IntolérancesAlimentaires.map((allergen) => (
                    <span
                      key={allergen}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
                    >
                      {allergen}
                    </span>
                  ))}
              </div>

              {recipe.Description && (
                <p className="text-gray-700 mb-6">{recipe.Description}</p>
              )}

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex -mb-px">
                  <button
                    className={`py-3 px-6 font-medium ${
                      activeTab === "ingredients"
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("ingredients")}
                  >
                    Ingrédients
                  </button>
                  <button
                    className={`py-3 px-6 font-medium ${
                      activeTab === "preparation"
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("preparation")}
                  >
                    Préparation
                  </button>
                </div>
              </div>

              {/* Tab content */}
              <div className="py-6">
                {activeTab === "ingredients" && (
                  <div>
                    <p className="text-gray-500 mb-4">
                      Pour {recipe.NombreDePersonnes} personnes
                    </p>
                    <ul className="space-y-2">
                      {recipe.Ingrédients &&
                        recipe.Ingrédients.map((ingredientId) => {
                          const ingredientDetails = allIngredients.find(
                            (i) => i.id === ingredientId
                          );
                          return (
                            <li
                              key={ingredientId}
                              className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
                            >
                              <div className="flex-1">
                                <span className="font-medium">
                                  {ingredientDetails?.Nom ||
                                    "Ingrédient inconnu"}
                                </span>
                                <div className="text-sm text-gray-500">
                                  {ingredientDetails?.Catégorie && (
                                    <span className="mr-2">
                                      {ingredientDetails.Catégorie}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-gray-600">
                                  {ingredientDetails?.Calories || "0"} kcal
                                </span>
                              </div>
                            </li>
                          );
                        })}
                    </ul>

                    {recipe.IntolérancesAlimentaires &&
                      recipe.IntolérancesAlimentaires.length > 0 && (
                        <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                          <div className="flex">
                            <Info
                              size={20}
                              className="text-yellow-600 mr-2 flex-shrink-0"
                            />
                            <div>
                              <p className="font-medium text-yellow-800">
                                Information allergie
                              </p>
                              <p className="text-yellow-700 mt-1">
                                Cette recette contient des allergènes:{" "}
                                {recipe.IntolérancesAlimentaires.join(", ")}.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {activeTab === "preparation" && (
                  <div className="space-y-6">
                    {recipe.Instructions &&
                      recipe.Instructions.split("\n").map((step, index) => (
                        <div key={index} className="flex">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center text-green-600 font-medium mr-3">
                            {index + 1}
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="text-gray-700">{step}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Recettes similaires</h2>
            <p className="text-gray-500">Fonctionnalité à venir...</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">
              Information nutritionnelle
            </h2>
            <NutritionInfo nutrition={nutrition} />

            <div className="mt-6 space-y-3">
              <button
                onClick={handlePrint}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center justify-center"
              >
                <Printer size={18} className="mr-2" />
                Imprimer la recette
              </button>

              <Link href={`/recipes/edit/${recipe.id}`}>
                <button className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white">
                  Modifier la recette
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
