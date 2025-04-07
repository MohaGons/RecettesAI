"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecipeForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState(null);

  // État pour le formulaire de génération de recette
  const [ingredients, setIngredients] = useState("");
  const [servings, setServings] = useState(4);
  const [intolerances, setIntolerances] = useState("");

  // Pour les étapes supplémentaires après génération
  const [customName, setCustomName] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");

  const generateRecipe = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // Préparation des données
      const ingredientsList = ingredients
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const intolerancesList = intolerances
        ? intolerances.split(",").map((item) => item.trim())
        : [];

      if (ingredientsList.length === 0) {
        throw new Error("Veuillez saisir au moins un ingrédient");
      }

      // Appel à l'API
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          generate: true,
          ingredients: ingredientsList,
          servings: parseInt(servings),
          intolerances: intolerancesList,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || "Erreur lors de la génération de la recette"
        );
      }

      const recipe = await response.json();
      setGeneratedRecipe(recipe);

      // Pré-remplir les champs personnalisables
      setCustomName(recipe.name);
      setCustomInstructions(recipe.instructions);
    } catch (error) {
      console.error("Error generating recipe:", error);
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecipe = async () => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      // Validation
      if (!generatedRecipe) {
        throw new Error("Aucune recette à sauvegarder");
      }

      // Création d'un objet recette avec les valeurs personnalisées
      const recipeToSave = {
        ...generatedRecipe,
        name: customName || generatedRecipe.name,
        instructions: customInstructions || generatedRecipe.instructions,
      };

      // Appel à l'API pour sauvegarder
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeToSave),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || "Erreur lors de la sauvegarde de la recette"
        );
      }

      const savedRecipe = await response.json();
      router.push(`/recipes/${savedRecipe.id}`);
    } catch (error) {
      console.error("Error saving recipe:", error);
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setGeneratedRecipe(null);
    setCustomName("");
    setCustomInstructions("");
  };

  // Affichage du formulaire initial de génération
  if (!generatedRecipe) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-amber-800 mb-6">
          Créer une nouvelle recette
        </h2>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={generateRecipe} className="space-y-6">
          <div>
            <label
              htmlFor="ingredients"
              className="block text-gray-700 font-medium mb-2"
            >
              Ingrédients disponibles
            </label>
            <textarea
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              rows="3"
              placeholder="Entrez vos ingrédients séparés par des virgules (ex: poulet, riz, carottes)"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Séparez les ingrédients par des virgules
            </p>
          </div>

          <div>
            <label
              htmlFor="servings"
              className="block text-gray-700 font-medium mb-2"
            >
              Nombre de personnes
            </label>
            <input
              type="number"
              id="servings"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              min="1"
              max="12"
              required
            />
          </div>

          <div>
            <label
              htmlFor="intolerances"
              className="block text-gray-700 font-medium mb-2"
            >
              Intolérances alimentaires (optionnel)
            </label>
            <input
              type="text"
              id="intolerances"
              value={intolerances}
              onChange={(e) => setIntolerances(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="Ex: gluten, lactose, arachides"
            />
            <p className="text-sm text-gray-500 mt-1">
              Séparez les intolérances par des virgules
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Génération en cours..." : "Générer une recette"}
          </button>
        </form>
      </div>
    );
  }

  // Affichage de la recette générée avec options de personnalisation
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold text-amber-800 mb-6">
        Recette générée
      </h2>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {errorMsg}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label
            htmlFor="customName"
            className="block text-gray-700 font-medium mb-2"
          >
            Nom de la recette
          </label>
          <input
            type="text"
            id="customName"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Ingrédients
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {generatedRecipe.ingredients.map((ing, index) => (
              <li key={index} className="text-gray-600">
                {ing.quantity} {ing.unit} de {ing.name}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label
            htmlFor="customInstructions"
            className="block text-gray-700 font-medium mb-2"
          >
            Instructions
          </label>
          <textarea
            id="customInstructions"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
            rows="6"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Informations nutritionnelles
          </h3>
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Calories:</span>
                <span className="ml-2 font-semibold">
                  {generatedRecipe.nutritionalInfo.calories} kcal
                </span>
              </div>
              <div>
                <span className="text-gray-600">Protéines:</span>
                <span className="ml-2 font-semibold">
                  {generatedRecipe.nutritionalInfo.proteins}g
                </span>
              </div>
              <div>
                <span className="text-gray-600">Glucides:</span>
                <span className="ml-2 font-semibold">
                  {generatedRecipe.nutritionalInfo.carbs}g
                </span>
              </div>
              <div>
                <span className="text-gray-600">Lipides:</span>
                <span className="ml-2 font-semibold">
                  {generatedRecipe.nutritionalInfo.fats}g
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={saveRecipe}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Sauvegarde en cours..." : "Sauvegarder la recette"}
          </button>

          <button
            onClick={resetForm}
            className="flex-1 bg-white hover:bg-gray-100 text-amber-700 border border-amber-500 font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
            disabled={isLoading}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
