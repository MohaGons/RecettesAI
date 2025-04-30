// components/layouts/Footer.jsx
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-700 to-green-600 text-white pt-16 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <Link href="/" className="block mb-4">
              <div className="relative h-12 w-40">
                <Image src="/Logo.png" alt="logo" fill className="object-contain brightness-200 contrast-200" />
              </div>
            </Link>
            <p className="text-green-100 mb-6">
              Découvrez des recettes personnalisées avec une analyse nutritionnelle précise pour une alimentation équilibrée et savoureuse.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="bg-green-800 hover:bg-green-900 p-2 rounded-full transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="bg-green-800 hover:bg-green-900 p-2 rounded-full transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="bg-green-800 hover:bg-green-900 p-2 rounded-full transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://github.com" className="bg-green-800 hover:bg-green-900 p-2 rounded-full transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold mb-4 border-b border-green-500 pb-2">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-green-100 hover:text-white transition-colors hover:translate-x-1 inline-block">Accueil</Link></li>
              <li><Link href="/recipes" className="text-green-100 hover:text-white transition-colors hover:translate-x-1 inline-block">Recettes</Link></li>
              <li><Link href="/recipes/search" className="text-green-100 hover:text-white transition-colors hover:translate-x-1 inline-block">Recherche</Link></li>
              <li><Link href="/recipes/create" className="text-green-100 hover:text-white transition-colors hover:translate-x-1 inline-block">Nouvelle recette</Link></li>
              <li><Link href="/ingredients" className="text-green-100 hover:text-white transition-colors hover:translate-x-1 inline-block">Ingrédients</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold mb-4 border-b border-green-500 pb-2">Catégories</h3>
            <ul className="space-y-2">
              <li><Link href="/recipes/search?type=Entrée" className="text-green-100 hover:text-white transition-colors hover:translate-x-1 inline-block">Entrées</Link></li>
              <li><Link href="/recipes/search?type=Plat principal" className="text-green-100 hover:text-white transition-colors hover:translate-x-1 inline-block">Plats principaux</Link></li>
              <li><Link href="/recipes/search?type=Dessert" className="text-green-100 hover:text-white transition-colors hover:translate-x-1 inline-block">Desserts</Link></li>
              <li><Link href="/recipes/search?type=Salade" className="text-green-100 hover:text-white transition-colors hover:translate-x-1 inline-block">Salades</Link></li>
              <li><Link href="/recipes/search?type=Soupe" className="text-green-100 hover:text-white transition-colors hover:translate-x-1 inline-block">Soupes</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-4">
            <h3 className="text-lg font-bold mb-4 border-b border-green-500 pb-2">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 flex-shrink-0 mt-1 text-green-300" />
                <span className="text-green-100">123 Avenue de la Gastronomie<br />75000 Paris, France</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-green-300" />
                <span className="text-green-100">+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-green-300" />
                <a href="mailto:contact@foodgenius.com" className="text-green-100 hover:text-white transition-colors">contact@foodgenius.com</a>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="font-medium mb-2">Inscrivez-vous à notre newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Votre email" 
                  className="p-2 rounded-l-lg text-gray-800 flex-1 border border-white focus:outline-none"
                />
                <button className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-medium px-4 py-2 rounded-r-lg transition-colors">
                  S'abonner
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-green-500 mt-10 pt-6 text-center text-sm text-green-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} FoodGenius. Tous droits réservés.</p>
            <div className="mt-4 md:mt-0">
              <Link href="/terms" className="mr-4 hover:text-white transition-colors">Conditions d'utilisation</Link>
              <Link href="/privacy" className="mr-4 hover:text-white transition-colors">Politique de confidentialité</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}