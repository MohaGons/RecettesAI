export default function Footer() {
  return (
    <footer className="bg-amber-800 text-amber-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">RecettesAI</h3>
            <p className="text-sm">
              Système de génération et de gestion de recettes de cuisine
              personnalisées avec analyse nutritionnelle.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-sm hover:text-white transition-colors"
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href="/recipes"
                  className="text-sm hover:text-white transition-colors"
                >
                  Recettes
                </a>
              </li>
              <li>
                <a
                  href="/recipes/new"
                  className="text-sm hover:text-white transition-colors"
                >
                  Créer une recette
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Projet ESGI</h3>
            <p className="text-sm">
              Ce projet a été réalisé dans le cadre d'un cours à l'ESGI.
              Technologies utilisées : Next.js, Airtable, et API OpenAI.
            </p>
          </div>
        </div>

        <div className="border-t border-amber-700 mt-8 pt-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} - RecettesAI - Tous droits
            réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
