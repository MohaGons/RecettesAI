'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, Info } from 'lucide-react';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  
  const isActive = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <nav className="flex justify-around py-3 bg-white border-t">
      <button 
        className={`flex flex-col items-center ${isActive('/') ? 'text-primary-600' : 'text-gray-500'}`}
        onClick={() => router.push('/')}
      >
        <Home size={20} />
        <span className="text-xs mt-1">Accueil</span>
      </button>
      <button 
        className={`flex flex-col items-center ${isActive('/recipes/search') ? 'text-primary-600' : 'text-gray-500'}`}
        onClick={() => router.push('/recipes/search')}
      >
        <Search size={20} />
        <span className="text-xs mt-1">Recherche</span>
      </button>
      <button 
        className={`flex flex-col items-center ${isActive('/recipes/create') ? 'text-primary-600' : 'text-gray-500'}`}
        onClick={() => router.push('/recipes/create')}
      >
        <PlusCircle size={20} />
        <span className="text-xs mt-1">Créer</span>
      </button>
      <button 
        className={`flex flex-col items-center ${isActive('/profile') ? 'text-primary-600' : 'text-gray-500'}`}
        onClick={() => router.push('/profile')}
      >
        <Info size={20} />
        <span className="text-xs mt-1">Profil</span>
      </button>
    </nav>
  );
}