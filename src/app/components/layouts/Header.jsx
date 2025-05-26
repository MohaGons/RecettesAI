"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlusCircle,
  Search,
  Menu,
  X,
  Home,
  BookOpen,
  ChevronDown,
  Filter,
  User,
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <header className="bg-green-600 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3">
        {/* Main header bar */}
        <div className="flex justify-between items-center relative">
          {/* Logo and desktop navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0 relative">
              <div className="relative h-10 w-36">
                <Image
                  src="/Logo.png"
                  alt="FoodGenius"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            <nav className="hidden lg:flex space-x-6">
              <Link
                href="/"
                className="hover:text-green-200 transition-colors py-2 flex items-center"
              >
                <Home size={16} className="mr-1" />
                Accueil
              </Link>

              <div className="relative group">
                <button className="flex items-center hover:text-green-200 transition-colors py-2">
                  <BookOpen size={16} className="mr-1" />
                  Recettes
                  <ChevronDown
                    size={14}
                    className="ml-1 group-hover:rotate-180 transition-transform"
                  />
                </button>
                <div className="absolute top-full left-0 bg-white text-gray-800 rounded-md shadow-lg py-2 min-w-48 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all transform -translate-y-2 group-hover:translate-y-0">
                  <Link
                    href="/recipes"
                    className="block px-4 py-2 hover:bg-green-50 hover:text-green-600"
                  >
                    Toutes les recettes
                  </Link>
                  <Link
                    href="/recipes/search?type=Entrée"
                    className="block px-4 py-2 hover:bg-green-50 hover:text-green-600"
                  >
                    Entrées
                  </Link>
                  <Link
                    href="/recipes/search?type=Plat principal"
                    className="block px-4 py-2 hover:bg-green-50 hover:text-green-600"
                  >
                    Plats principaux
                  </Link>
                  <Link
                    href="/recipes/search?type=Dessert"
                    className="block px-4 py-2 hover:bg-green-50 hover:text-green-600"
                  >
                    Desserts
                  </Link>
                </div>
              </div>

              <Link
                href="/recipes/search"
                className="hover:text-green-200 transition-colors py-2 flex items-center"
              >
                <Filter size={16} className="mr-1" />
                Recherche avancée
              </Link>

              <Link
                href="/ingredients"
                className="hover:text-green-200 transition-colors py-2"
              >
                Ingrédients
              </Link>
            </nav>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/recipes/create"
              className="flex items-center space-x-1 bg-yellow-500 text-green-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
            >
              <PlusCircle size={18} />
              <span>Créer une recette</span>
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={toggleSearch}
              className="p-2 bg-green-700 rounded-full"
            >
              <Search size={20} />
            </button>

            <Link
              href="/recipes/create"
              className="p-2 bg-yellow-500 text-green-900 rounded-full"
            >
              <PlusCircle size={20} />
            </Link>

            <button
              onClick={toggleMenu}
              className="p-2 bg-green-700 rounded-full"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {isSearchOpen && (
          <div className="mt-3 pb-3 md:hidden">
            <form className="flex bg-green-700 rounded-lg px-3 py-2">
              <input
                type="text"
                placeholder="Rechercher une recette..."
                className="bg-transparent border-none outline-none text-white placeholder-green-300 w-full"
                autoFocus
              />
              <button type="submit">
                <Search size={20} className="text-green-300" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-green-700">
          <nav className="container mx-auto px-4 py-4 flex flex-col">
            <Link
              href="/"
              className="flex items-center py-3 border-b border-green-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={18} className="mr-3" />
              Accueil
            </Link>

            <Link
              href="/recipes"
              className="flex items-center py-3 border-b border-green-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen size={18} className="mr-3" />
              Toutes les recettes
            </Link>

            <Link
              href="/recipes/search"
              className="flex items-center py-3 border-b border-green-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <Filter size={18} className="mr-3" />
              Recherche avancée
            </Link>

            <Link
              href="/ingredients"
              className="flex items-center py-3"
              onClick={() => setIsMenuOpen(false)}
            >
              Ingrédients
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
