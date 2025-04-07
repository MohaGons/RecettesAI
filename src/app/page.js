import Link from "next/link";
import SearchBar from "./components/ui/SearchBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-800 mb-6">
            Cuisine Personnalisée
          </h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Générez des recettes personnalisées selon vos ingrédients,
            préférences et besoins nutritionnels
          </p>

          {/* Barre de recherche */}
          <div className="mt-10 max-w-xl mx-auto">
            <SearchBar />
          </div>

          {/* Boutons d'action */}
          <div className="mt-12 flex flex-col md:flex-row gap-6 justify-center">
            <Link
              href="/recipes/new"
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors"
            >
              Créer une recette
            </Link>
            <Link
              href="/recipes"
              className="bg-white hover:bg-gray-100 text-amber-700 border border-amber-500 font-semibold py-3 px-8 rounded-lg shadow-md transition-colors"
            >
              Voir toutes les recettes
            </Link>
          </div>
        </div>

        {/* Sections d'information */}
        <div className="grid md:grid-cols-3 gap-10 mt-20">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-amber-700 mb-4">
              Recettes personnalisées
            </h2>
            <p className="text-gray-600">
              Créez des recettes adaptées à vos ingrédients disponibles et à vos
              préférences alimentaires.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-amber-700 mb-4">
              Analyse nutritionnelle
            </h2>
            <p className="text-gray-600">
              Obtenez une analyse détaillée des valeurs nutritionnelles de
              chaque recette: calories, protéines, glucides, lipides, vitamines
              et minéraux.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-amber-700 mb-4">
              Intolérances alimentaires
            </h2>
            <p className="text-gray-600">
              Spécifiez vos intolérances alimentaires pour obtenir des recettes
              adaptées à vos besoins spécifiques.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
