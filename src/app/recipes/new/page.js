import Header from "../../components/layouts/Header";
import Footer from "../../components/layouts/Footer";
import RecipeForm from "../../components/forms/RecipeForm";

export default function NewRecipePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-amber-800 mb-6">
          Créer une nouvelle recette
        </h1>

        <div className="max-w-2xl mx-auto">
          <RecipeForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
