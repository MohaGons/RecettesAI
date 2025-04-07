"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-amber-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            RecettesAI
          </Link>

          {/* Menu pour mobile */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  mobileMenuOpen
                    ? "M6 18L18 6M6 6L18 18"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>

          {/* Menu principal */}
          <nav
            className={`md:flex ${
              mobileMenuOpen
                ? "block absolute top-16 left-0 right-0 bg-amber-600 shadow-lg z-50 p-4"
                : "hidden"
            }`}
          >
            <ul className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <li>
                <Link
                  href="/"
                  className="block py-2 hover:text-amber-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/recipes"
                  className="block py-2 hover:text-amber-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Recettes
                </Link>
              </li>
              <li>
                <Link
                  href="/recipes/new"
                  className="block py-2 hover:text-amber-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Créer une recette
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
