"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash } from "lucide-react";
import { useIngredients } from "@/app/hooks/useIngredients";

export default function IngredientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const { ingredients, isLoading, mutate } = useIngredients({
    nom: searchTerm,
    categorie: activeCategory,
  });

  // Liste des catégories uniques à partir des ingrédients
  const categories = ["Toutes"];
  if (ingredients) {
    ingredients.forEach((ingredient) => {
      if (ingredient.Catégorie && !categories.includes(ingredient.Catégorie)) {
        categories.push(ingredient.Catégorie);
      }
    });
  }

  const handleSearch = (e) => {
    e.preventDefault();
    // La recherche est déjà gérée par le hook useIngredients
  };

  const deleteIngredient = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet ingrédient ?")) {
      return;
    }

    try {
      await fetch(`/api/ingredients/${id}`, {
        method: "DELETE",
      });

      // Mettre à jour la liste des ingrédients
      mutate();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Une erreur est survenue lors de la suppression de l'ingrédient.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Ingrédients</h1>

        <div>
          <Link
            href="/ingredients/create"
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <Plus size={18} className="mr-2" />
            Nouvel ingrédient
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un ingrédient..."
              className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>

          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Toutes les catégories</option>
            {categories.slice(1).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Rechercher
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des ingrédients...</p>
        </div>
      ) : ingredients.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Protéines
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Glucides
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lipides
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ingredients.map((ingredient) => (
                <tr key={ingredient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {ingredient.Nom}
                    </div>
                    <div className="text-sm text-gray-500">
                      {ingredient.Quantité || 100}
                      {ingredient.Unité || "g"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {ingredient.Catégorie || "Non classé"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ingredient.Calories !== undefined
                      ? `${ingredient.Calories} kcal`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ingredient.Protéines !== undefined
                      ? `${ingredient.Protéines}g`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ingredient.Glucides !== undefined
                      ? `${ingredient.Glucides}g`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ingredient.Lipides !== undefined
                      ? `${ingredient.Lipides}g`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-3">Aucun ingrédient trouvé.</p>
          <Link
            href="/ingredients/create"
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <Plus size={18} className="mr-2" />
            Ajouter un ingrédient
          </Link>
        </div>
      )}
    </div>
  );
}
