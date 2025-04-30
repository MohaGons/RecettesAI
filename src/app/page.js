// app/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ChevronLeft, ArrowRight, Star, Clock, Users, Heart } from 'lucide-react';
import { useRecipes } from '@/app/hooks/useRecipes';
import RecipeCard from '@/app/components/recipes/RecipeCard';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const { recipes, isLoading } = useRecipes();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  const categories = ["Tous", "Entrée", "Plat principal", "Dessert", "Salade", "Soupe"];
  
  // Filtrer les recettes par catégorie
  const filteredRecipes = activeCategory === 'Tous' 
    ? recipes 
    : recipes.filter(recipe => recipe.TypeDePlat === activeCategory);
  
  // Sélectionner les 3 premières recettes pour le carousel
  const carouselRecipes = recipes && recipes.length > 0 
    ? recipes.slice(0, 3) 
    : [];
  
  // Pour le carousel - passer à la slide suivante automatiquement
  useEffect(() => {
    if (!autoplay || carouselRecipes.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === carouselRecipes.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000);
    
    return () => clearInterval(timer);
  }, [autoplay, carouselRecipes.length]);
  
  // Arrêter l'autoplay quand la souris est sur le carousel
  const pauseAutoplay = () => setAutoplay(false);
  const resumeAutoplay = () => setAutoplay(true);
  
  // Navigation du carousel
  const nextSlide = () => {
    if (carouselRecipes.length === 0) return;
    setCurrentSlide((prevSlide) => 
      prevSlide === carouselRecipes.length - 1 ? 0 : prevSlide + 1
    );
  };
  
  const prevSlide = () => {
    if (carouselRecipes.length === 0) return;
    setCurrentSlide((prevSlide) => 
      prevSlide === 0 ? carouselRecipes.length - 1 : prevSlide - 1
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
    
      {/* Featured Recipes Carousel - Utilisant les recettes de l'API */}
      {!isLoading && carouselRecipes.length > 0 && (
        <div className="mb-16">
         
          
          <div 
            className="relative h-96 rounded-xl overflow-hidden shadow-lg"
            onMouseEnter={pauseAutoplay}
            onMouseLeave={resumeAutoplay}
          >
            {carouselRecipes.map((recipe, index) => (
              <div 
                key={recipe.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
                <div className="relative h-full w-full">
                  {recipe.Photo && recipe.Photo[0] ? (
                    <Image 
                      src={recipe.Photo} 
                      alt={recipe.Nom}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">Pas d&apos;image disponible</span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
                  <h3 className="text-3xl font-bold mb-2">{recipe.Nom}</h3>
                  <p className="mb-4 text-lg max-w-xl">{recipe.Description || `Une délicieuse recette de ${recipe.TypeDePlat?.toLowerCase() || 'cuisine'}`}</p>
                  
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center">
                      <Clock size={18} className="mr-2" />
                      <span>{recipe.TempsDePréparation} min</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={18} className="mr-2" />
                      <span>{recipe.NombreDePersonnes} pers.</span>
                    </div>
                    {recipe.TypeDePlat && (
                      <div className="px-3 py-1 bg-green-600 rounded-full text-sm">
                        {recipe.TypeDePlat}
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    href={`/recipes/${recipe.id}`}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-flex items-center transition-colors"
                  >
                    Voir la recette <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
            
            {/* Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-30">
              {carouselRecipes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Aller à la slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Catégories et recettes */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Explorer par catégorie</h2>
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg ${
                activeCategory === category 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des recettes...</p>
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.slice(0, 8).map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Aucune recette trouvée pour cette catégorie.</p>
          </div>
        )}
        
        <div className="text-center mt-8">
          <Link 
            href="/recipes" 
            className="inline-flex items-center text-green-600 hover:text-green-700"
          >
            Voir toutes les recettes <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
      
      
      {/* Sections d'information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Analyse nutritionnelle</h2>
          <p className="text-gray-700 mb-4">
            Obtenez une analyse détaillée de la valeur nutritionnelle de vos recettes. Calories, protéines, glucides, lipides et plus encore.
          </p>
          <Link 
            href="/about#nutrition" 
            className="text-green-600 hover:text-green-700 inline-flex items-center"
          >
            En savoir plus <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Gestion des ingrédients</h2>
          <p className="text-gray-700 mb-4">
            Parcourez notre base de données d&apos;ingrédients ou ajoutez vos propres ingrédients personnalisés pour des recettes plus précises.
          </p>
          <Link 
            href="/ingredients" 
            className="text-green-600 hover:text-green-700 inline-flex items-center"
          >
            Voir les ingrédients <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
      
      {/* Section "Pourquoi nous choisir" */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Pourquoi choisir FoodGenius</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Analyse précise</h3>
            <p className="text-gray-600">
              Une analyse nutritionnelle détaillée basée sur une base de données d&apos;ingrédients complète.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Personnalisation</h3>
            <p className="text-gray-600">
              Adaptez les recettes selon vos préférences et intolérances alimentaires.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Communauté</h3>
            <p className="text-gray-600">
              Partagez vos recettes et découvrez les créations d&apos;autres passionnés de cuisine.
            </p>
          </div>
        </div>
      </div>
      
      {/* Section témoignages */}
      <div className="mb-16 bg-gray-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-8 text-center">Ce que disent nos utilisateurs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#fbbf24" />
              ))}
            </div>
            <p className="text-gray-700 mb-4">
              J&apos;utilise FoodGenius quotidiennement pour planifier mes repas. L&apos;analyse nutritionnelle m&apos;aide à suivre mon régime alimentaire tout en découvrant de nouvelles recettes.
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3">
                <Image src="/p1.jpg" alt="User" width={40} height={40} className="rounded-full" />
              </div>
              <div>
                <p className="font-medium">jon Martin</p>
                <p className="text-sm text-gray-500">Utilisatrice depuis 2023</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#fbbf24" />
              ))}
            </div>
            <p className="text-gray-700 mb-4">
              En tant que nutritionniste, je recommande cette application à mes clients. Les informations nutritionnelles sont précises et la personnalisation des recettes est un vrai plus.
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3">
                <Image src="/food.jpg" alt="Nutritionist" width={40} height={40} className="rounded-full" />
              </div>
              <div>
                <p className="font-medium">Thomas Dubois</p>
                <p className="text-sm text-gray-500">Nutritionniste</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#fbbf24" />
              ))}
            </div>
            <p className="text-gray-700 mb-4">
              J&apos;adore pouvoir ajouter mes propres ingrédients et créer des recettes personnalisées. L&apos;interface est intuitive et les recettes proposées sont délicieuses.
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3">
                <Image src="/p2.jpg" alt="User" width={40} height={40} className="rounded-full" />
              </div>
              <div>
                <p className="font-medium">Marie Lefevre</p>
                <p className="text-sm text-gray-500">Chef amateur</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA final */}
      <div className="bg-green-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à créer vos propres recettes ?</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Rejoignez des milliers d&apos;utilisateurs qui découvrent et partagent de délicieuses recettes personnalisées.
        </p>
        <Link 
          href="/recipes/create" 
          className="bg-yellow-500 text-green-900 hover:bg-yellow-400 px-8 py-3 rounded-lg font-medium inline-block transition-colors"
        >
          Commencer maintenant
        </Link>
      </div>
    </div>
  );
}