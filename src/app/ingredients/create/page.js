// app/ingredients/create/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateIngredientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    Nom: '',
    Catégorie: '',
    Unité: 'g',
    Quantité: 100,
    Calories: 0,
    Protéines: 0,
    Glucides: 0,
    Lipides: 0
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.Nom) {
      alert('Le nom de l\'ingrédient est requis');
      return;
    }
    
    try {
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'ingrédient');
      }
      
      // Redirection vers la liste des ingrédients
      router.push('/ingredients');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la création de l\'ingrédient.');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/ingredients" className="mr-4">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold">Ajouter un ingrédient</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l&apos;ingrédient <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="Nom"
                value={formData.Nom}
                onChange={handleInputChange}
                placeholder="Ex: Quinoa"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <input
                type="text"
                name="Catégorie"
                value={formData.Catégorie}
                onChange={handleInputChange}
                placeholder="Ex: Céréales"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantité
                </label>
                <input
                  type="number"
                  name="Quantité"
                  value={formData.Quantité}
                  onChange={handleNumberChange}
                  step="0.1"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unité
                </label>
                <select
                  name="Unité"
                  value={formData.Unité}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="g">Grammes (g)</option>
                  <option value="ml">Millilitres (ml)</option>
                  <option value="tasse">Tasse</option>
                  <option value="c. à soupe">Cuillère à soupe</option>
                  <option value="c. à café">Cuillère à café</option>
                  <option value="unité">Unité</option>
                </select>
              </div>
            </div>
            
            <hr className="my-6" />
            
            <h2 className="text-lg font-medium mb-4">Informations nutritionnelles</h2>
            <p className="text-sm text-gray-500 mb-4">Pour {formData.Quantité} {formData.Unité} de l&apos;ingrédient</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calories (kcal)
                </label>
                <input
                  type="number"
                  name="Calories"
                  value={formData.Calories}
                  onChange={handleNumberChange}
                  step="0.1"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protéines (g)
                </label>
                <input
                  type="number"
                  name="Protéines"
                  value={formData.Protéines}
                  onChange={handleNumberChange}
                  step="0.1"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Glucides (g)
                </label>
                <input
                  type="number"
                  name="Glucides"
                  value={formData.Glucides}
                  onChange={handleNumberChange}
                  step="0.1"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lipides (g)
                </label>
                <input
                  type="number"
                  name="Lipides"
                  value={formData.Lipides}
                  onChange={handleNumberChange}
                  step="0.1"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Link 
                href="/ingredients" 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg mr-3"
              >
                Annuler
              </Link>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}