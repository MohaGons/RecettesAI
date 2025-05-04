"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Info } from "lucide-react";
import { useIngredients } from "@/app/hooks/useIngredients";
import { useIntoleranceOptions } from "@/app/hooks/useOptions";
import Link from "next/link";

export default function CreateRecipePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    Nom: "",
    Description: "",
    Ingrédients: [],
    TempsDePréparation: 30,
    NombreDePersonnes: 4,
    Instructions: "",
    TypeDePlat: "Plat principal",
    IntolérancesAlimentaires: [],
  });
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  // Recherche d'ingrédients dans Airtable
  const { ingredients } = useIngredients();

  // Récupération dynamique des options d'intolérances/allergies alimentaires
  const {
    options: apiOptions,
    isLoading: optionsLoading,
    isError: optionsError,
  } = useIntoleranceOptions();

  // Options de secours au cas où l'API échoue
  const fallbackOptions = [
    "Sans gluten",
    "Sans lactose",
    "Sans sucre ajouté",
    "Végétalien",
  ];

  // Utilise les options de l'API ou les options de secours si l'API échoue ou renvoie un tableau vide
  const allergyOptions =
    Array.isArray(apiOptions) && apiOptions.length > 0
      ? apiOptions
      : fallbackOptions;

  // Types de plats disponibles
  const dishTypes = [
    "Entrée",
    "Plat principal",
    "Dessert",
    "Salade",
    "Soupe",
    "Apéritif",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value) || 0,
    });
  };

  const addIngredient = () => {
    if (!selectedIngredientId) return;
    const selectedIngredient = ingredients.find(
      (i) => i.id === selectedIngredientId
    );
    if (!selectedIngredient) return;
    setFormData({
      ...formData,
      Ingrédients: [...formData.Ingrédients, selectedIngredientId],
    });
    setSelectedIngredientId("");
  };

  const removeIngredient = (index) => {
    const updatedIngredients = [...formData.Ingrédients];
    updatedIngredients.splice(index, 1);
    setFormData({
      ...formData,
      Ingrédients: updatedIngredients,
    });
  };

  const toggleAllergy = (allergy) => {
    const current = [...formData.IntolérancesAlimentaires];

    if (current.includes(allergy)) {
      setFormData({
        ...formData,
        IntolérancesAlimentaires: current.filter((a) => a !== allergy),
      });
    } else {
      setFormData({
        ...formData,
        IntolérancesAlimentaires: [...current, allergy],
      });
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleGenerateRecipe = async () => {
    setIsGenerating(true);
    setGenerationError("");
    try {
      // Préparer le prompt pour l'IA
      const selectedIngredients = formData.Ingrédients.map((id) => {
        const ing = ingredients.find((i) => i.id === id);
        return ing ? ing.Nom : id;
      });
      const prompt = `Génère une recette originale en français avec les contraintes suivantes :\n\n- Type de plat : ${
        formData.TypeDePlat
      }\n- Temps de préparation : ${
        formData.TempsDePréparation
      } minutes\n- Nombre de personnes : ${
        formData.NombreDePersonnes
      }\n- Ingrédients imposés : ${selectedIngredients.join(
        ", "
      )}\n- Intolérances ou régimes à respecter : ${
        formData.IntolérancesAlimentaires.join(", ") || "Aucune"
      }\n\nDonne-moi :\n1. Un nom de recette\n2. Une courte description\n3. Les instructions détaillées étape par étape (une par ligne)\n4. (Optionnel) Des conseils ou variantes.`;

      // Appel à l'API IA (à adapter selon ton backend)
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error("Erreur lors de la génération");
      const data = await response.json();

      // Nettoyer le nom de la recette
      const cleanName = data.Nom.replace(/^#+\s*/, "")
        .replace(/^1[.)-]?\s*/i, "")
        .replace(/^Nom( de (la )?recette)?\s*:?[*\s]*/i, "")
        .replace(/^de (la )?recette\s*:?[*\s]*/i, "")
        .replace(/^Nom\s*:?[*\s]*/i, "")
        .replace(/^:[*\s]*/, "")
        .replace(/^[*\s]+/, "")
        .trim();

      // Nettoyer la description en enlevant le préfixe et les asterisques
      const cleanDescription = data.Description.replace(/^#+\s*/, "")
        .replace(/^\**2\.?\s*Description\s*:?\**\s*/i, "")
        .replace(/^Description\s*:?\s*/i, "")
        .replace(/\*\*/g, "")
        .trim();

      // Nettoyer les instructions en enlevant le préfixe et les asterisques
      const cleanInstructions = data.Instructions.replace(/^#+\s*/, "")
        .replace(/^\**3\.?\s*Instructions\s*:?\**\s*/i, "")
        .replace(/^Instructions\s*:?\s*/i, "")
        .replace(/\*\*/g, "")
        .trim();

      console.log("Description brute IA:", data.Description);
      console.log("Description nettoyée:", cleanDescription);
      console.log("Instructions brutes IA:", data.Instructions);
      console.log("Instructions nettoyées:", cleanInstructions);

      setFormData({
        ...formData,
        Nom: cleanName,
        Description: cleanDescription,
        Instructions: cleanInstructions,
      });
      setCurrentStep(3);
    } catch (e) {
      console.error("Erreur de génération:", e);
      setGenerationError("Erreur lors de la génération de la recette.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    // Validation basique
    if (
      !formData.Nom ||
      formData.Ingrédients.length === 0 ||
      !formData.Instructions
    ) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Calcul des valeurs nutritionnelles à partir des ingrédients
    const nutrition = formData.Ingrédients.reduce(
      (acc, ingredientId) => {
        const ing = ingredients.find((i) => i.id === ingredientId);
        if (ing) {
          acc.calories += Number(ing.Calories || 0);
          acc.protein += Number(ing.Protéines || 0);
          acc.carbs += Number(ing.Glucides || 0);
          acc.fat += Number(ing.Lipides || 0);
        }
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Définir une image selon le nom/type de plat
    // Priorité aux images d'Unsplash pour compatibilité avec Airtable
    let photoUrl;

    try {
      console.log(
        "Génération de l'URL de l'image pour:",
        formData.Nom,
        "Type:",
        formData.TypeDePlat
      );

      // Préférer des URLs d'Unsplash plutôt que placehold.co
      if (formData.Nom.toLowerCase().includes("salade")) {
        photoUrl =
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop";
        console.log("URL choisie pour salade:", photoUrl);
      } else if (formData.TypeDePlat === "Dessert") {
        photoUrl =
          "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop";
        console.log("URL choisie pour dessert:", photoUrl);
      } else if (
        formData.Nom.toLowerCase().includes("poulet") ||
        formData.Ingrédients.some((id) => {
          const ing = ingredients.find((i) => i.id === id);
          return ing && ing.Nom.toLowerCase().includes("poulet");
        })
      ) {
        photoUrl =
          "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&auto=format&fit=crop";
        console.log("URL choisie pour poulet:", photoUrl);
      } else if (formData.TypeDePlat === "Soupe") {
        photoUrl =
          "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop";
        console.log("URL choisie pour soupe:", photoUrl);
      } else if (formData.TypeDePlat === "Entrée") {
        photoUrl =
          "https://images.unsplash.com/photo-1546241072-48010ad2862c?w=800&auto=format&fit=crop";
        console.log("URL choisie pour entrée:", photoUrl);
      } else if (formData.TypeDePlat === "Plat principal") {
        photoUrl =
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop";
        console.log("URL choisie pour plat principal:", photoUrl);
      } else if (formData.TypeDePlat === "Apéritif") {
        photoUrl =
          "https://images.unsplash.com/photo-1626200496000-ccb05f5b6b32?w=800&auto=format&fit=crop";
        console.log("URL choisie pour apéritif:", photoUrl);
      } else {
        // Image par défaut générique
        photoUrl =
          "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop";
        console.log("URL d'image par défaut utilisée:", photoUrl);
      }

      console.log("URL d'image finale choisie:", photoUrl);
    } catch (error) {
      console.error("Erreur lors de la génération de l'URL de l'image:", error);
      // Fallback en cas d'erreur - utiliser une URL d'Unsplash sûre
      photoUrl =
        "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop";
      console.log("URL d'image de fallback utilisée:", photoUrl);
    }

    // Ajoute les valeurs nutritionnelles et la photo au formData
    const formDataToSend = {
      ...formData,
      CaloriesTotales: nutrition.calories,
      ProtéinesTotales: nutrition.protein,
      GlucidesTotaux: nutrition.carbs,
      LipidesTotaux: nutrition.fat,
      Photo: photoUrl,
      // S'assurer que IntolérancesAlimentaires est toujours un tableau de strings
      IntolérancesAlimentaires: Array.isArray(formData.IntolérancesAlimentaires)
        ? formData.IntolérancesAlimentaires.map(String)
        : [],
    };

    console.log("Données à envoyer:", formDataToSend);

    try {
      const response = await fetch("/api/recettes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur API:", errorText);
        throw new Error("Erreur lors de la création de la recette");
      }

      const data = await response.json();
      console.log("Recette créée avec succès, ID:", data.id);

      // Redirection vers la page de détail
      router.push(`/recipes/${data.id}`);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la création de la recette.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/recipes" className="mr-4">
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold">Créer une nouvelle recette</h1>
          </div>
          <div className="text-sm text-gray-500">Étape {currentStep} sur 3</div>
        </div>

        {/* Progression */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
          <div
            className="h-full bg-green-600 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">
                Informations de base
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de plat
                  </label>
                  <select
                    name="TypeDePlat"
                    value={formData.TypeDePlat}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {dishTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temps de préparation (minutes)
                    </label>
                    <input
                      type="number"
                      name="TempsDePréparation"
                      value={formData.TempsDePréparation}
                      onChange={handleNumberChange}
                      min="1"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de personnes
                    </label>
                    <input
                      type="number"
                      name="NombreDePersonnes"
                      value={formData.NombreDePersonnes}
                      onChange={handleNumberChange}
                      min="1"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ajouter des ingrédients{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedIngredientId}
                      onChange={(e) => setSelectedIngredientId(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Sélectionner un ingrédient...</option>
                      {ingredients.map((ingredient) => (
                        <option key={ingredient.id} value={ingredient.id}>
                          {ingredient.Nom} ({ingredient.Calories || 0} kcal)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus size={16} className="mr-2" />
                      Ajouter
                    </button>
                  </div>
                  <ul className="space-y-2 mt-2">
                    {formData.Ingrédients.map((ingredientId, index) => {
                      const ingredient = ingredients.find(
                        (i) => i.id === ingredientId
                      );
                      return (
                        <li
                          key={index}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <span>
                            {ingredient ? ingredient.Nom : ingredientId}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeIngredient(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={18} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Intolérances ou régimes alimentaires
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {optionsLoading ? (
                      <div className="col-span-3 text-center p-3">
                        Chargement des options...
                      </div>
                    ) : (
                      allergyOptions.map((allergy) => (
                        <div
                          key={allergy}
                          className={`p-3 rounded-lg border cursor-pointer ${
                            formData.IntolérancesAlimentaires.includes(allergy)
                              ? "bg-green-50 border-green-300 text-green-800"
                              : "bg-white border-gray-300 text-gray-700"
                          }`}
                          onClick={() => toggleAllergy(allergy)}
                        >
                          <input
                            type="checkbox"
                            checked={formData.IntolérancesAlimentaires.includes(
                              allergy
                            )}
                            onChange={() => toggleAllergy(allergy)}
                            className="mr-2"
                          />
                          {allergy}
                        </div>
                      ))
                    )}
                  </div>
                  {optionsError && (
                    <p className="text-sm text-red-500 mt-2">
                      Impossible de charger les options depuis la base de
                      données. Options de secours affichées.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">
                Résumé de vos choix
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Type de plat :</span>{" "}
                  {formData.TypeDePlat}
                </div>
                <div>
                  <span className="font-medium">Temps de préparation :</span>{" "}
                  {formData.TempsDePréparation} min
                </div>
                <div>
                  <span className="font-medium">Nombre de personnes :</span>{" "}
                  {formData.NombreDePersonnes}
                </div>
                <div>
                  <span className="font-medium">Ingrédients :</span>
                  <ul className="list-disc ml-6">
                    {formData.Ingrédients.map((ingredientId, idx) => {
                      const ingredient = ingredients.find(
                        (i) => i.id === ingredientId
                      );
                      return (
                        <li key={idx}>
                          {ingredient ? ingredient.Nom : ingredientId}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <span className="font-medium">Intolérances/régimes :</span>{" "}
                  {formData.IntolérancesAlimentaires.length > 0
                    ? formData.IntolérancesAlimentaires.join(", ")
                    : "Aucune"}
                </div>
              </div>
              {generationError && (
                <div className="text-red-500 mt-4">{generationError}</div>
              )}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGenerateRecipe}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  disabled={isGenerating}
                >
                  {isGenerating
                    ? "Génération en cours..."
                    : "Générer la recette"}
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Recette générée</h2>
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Nom :</span> {formData.Nom}
                </div>
                <div>
                  <span className="font-medium">Description :</span>{" "}
                  {formData.Description}
                </div>
                <div>
                  <span className="font-medium">Instructions :</span>
                  <pre className="bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                    {formData.Instructions}
                  </pre>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  Enregistrer la recette
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
            >
              Précédent
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Suivant
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
