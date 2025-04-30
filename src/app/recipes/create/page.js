'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, Info } from 'lucide-react';
import { useIngredients } from '@/app/hooks/useIngredients';
import Link from 'next/link';

export default function CreateRecipePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    Nom: '',
    Description: '',
    Ingrédients: [],
    TempsDePréparation: 30,
    NombreDePersonnes: 4,
    Instructions: '',
    TypeDePlat: 'Plat principal',
    IntolérancesAlimentaires: []
  });
  const [searchIngredient, setSearchIngredient] = useState('');
  
  // Recherche d'ingrédients dans Airtable
  const { ingredients } = useIngredients({ 
    nom: searchIngredient.length > 2 ? searchIngredient : '' 
  });
  
  const filteredIngredients = searchIngredient.length > 2 
    ? ingredients.slice(0, 5) 
    : [];
  
  // Types de plats disponibles
  const dishTypes = [
    'Entrée', 'Plat principal', 'Dessert', 'Salade', 'Soupe', 'Apéritif'
  ];
  
  // Options d'intolérances/allergies alimentaires
  const allergyOptions = [
    'Gluten', 'Lactose', 'Fruits à coque', 'Arachides', 
    'Œufs', 'Soja', 'Poisson', 'Crustacés', 'Végétarien', 'Végétalien'
  ];
  
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
      [name]: parseInt(value) || 0
    });
  };
  
  const addIngredient = () => {
    if (searchIngredient.trim() === '') return;
    
    setFormData({
      ...formData,
      Ingrédients: [...formData.Ingrédients, searchIngredient]
    });
    setSearchIngredient('');
  };
  
  const removeIngredient = (index) => {
    const updatedIngredients = [...formData.Ingrédients];
    updatedIngredients.splice(index, 1);
    setFormData({
      ...formData,
      Ingrédients: updatedIngredients
    });
  };
  
  const toggleAllergy = (allergy) => {
    const current = [...formData.IntolérancesAlimentaires];
    
    if (current.includes(allergy)) {
      setFormData({
        ...formData,
        IntolérancesAlimentaires: current.filter(a => a !== allergy)
      });
    } else {
      setFormData({
        ...formData,
        IntolérancesAlimentaires: [...current, allergy]
      });
    }
  };
  
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleSubmit = async () => {
    // Validation basique
    if (!formData.Nom || formData.Ingrédients.length === 0 || !formData.Instructions) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      const response = await fetch('/api/recettes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la recette');
      }
      
      const data = await response.json();
      
      // Redirection vers la page de détail
      router.push(`/recipes/${data.id}`);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la création de la recette.');
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
          <div className="text-sm text-gray-500">
            Étape {currentStep} sur 3
          </div>
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
              <h2 className="text-xl font-semibold mb-6">Informations générales</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la recette <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="Nom"
                    value={formData.Nom}
                    onChange={handleInputChange}
                    placeholder="Ex: Salade Méditerranéenne au Quinoa"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="Description"
                    value={formData.Description}
                    onChange={handleInputChange}
                    placeholder="Une brève description de votre recette..."
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                  ></textarea>
                </div>
                
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
                    {dishTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
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
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Ingrédients et allergènes</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ajouter des ingrédients <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchIngredient}
                      onChange={(e) => setSearchIngredient(e.target.value)}
                      placeholder="Rechercher ou saisir un ingrédient..."
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {filteredIngredients.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredIngredients.map(ingredient => (
                          <div
                            key={ingredient.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSearchIngredient(`${ingredient.Nom} (${ingredient.Quantité || '100'}${ingredient.Unité || 'g'})`);
                            }}
                          >
                            <div className="font-medium">{ingredient.Nom}</div>
                            <div className="text-xs text-gray-500">
                              {ingredient.Calories || 0} kcal / {ingredient.Quantité || 100}{ingredient.Unité || 'g'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Ingrédients sélectionnés
                  </h3>
                  
                  {formData.Ingrédients.length === 0 ? (
                    <p className="text-gray-500 bg-gray-50 p-4 rounded-lg text-center">
                      Aucun ingrédient ajouté
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {formData.Ingrédients.map((ingredient, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <span>{ingredient}</span>
                          <button
                            type="button"
                            onClick={() => removeIngredient(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={18} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Intolérances ou régimes alimentaires
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allergyOptions.map(allergy => (
                      <div
                        key={allergy}
                        className={`
                          p-3 rounded-lg border cursor-pointer
                          ${formData.IntolérancesAlimentaires.includes(allergy) 
                            ? 'bg-green-50 border-green-300 text-green-800' 
                            : 'bg-white border-gray-300 text-gray-700'}
                        `}
                        onClick={() => toggleAllergy(allergy)}
                      >
                        <input
                          type="checkbox"
                          checked={formData.IntolérancesAlimentaires.includes(allergy)}
                          onChange={() => toggleAllergy(allergy)}
                          className="mr-2"
                        />
                        {allergy}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Instructions et finalisation</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions de préparation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="Instructions"
                    value={formData.Instructions}
                    onChange={handleInputChange}
                    placeholder="Décrivez les étapes de préparation, une par ligne..."
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="8"
                    required
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">
                    Écrivez chaque étape sur une nouvelle ligne.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex">
                    <Info size={20} className="text-green-600 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-800">Création automatique</p>
                      <p className="text-green-700 mt-1">
                        L&apos;analyse nutritionnelle sera automatiquement calculée à partir des ingrédients.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-3">Résumé de la recette</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><span className="font-medium">Nom:</span> {formData.Nom}</li>
                    <li><span className="font-medium">Type:</span> {formData.TypeDePlat}</li>
                    <li><span className="font-medium">Préparation:</span> {formData.TempsDePréparation} min</li>
                    <li><span className="font-medium">Pour:</span> {formData.NombreDePersonnes} personnes</li>
                    <li><span className="font-medium">Ingrédients:</span> {formData.Ingrédients.length}</li>
                    {formData.IntolérancesAlimentaires.length > 0 && (
                      <li>
                        <span className="font-medium">Régimes/intolérances:</span> {formData.IntolérancesAlimentaires.join(', ')}
                      </li>
                    )}
                  </ul>
                </div>
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
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Créer la recette
            </button>
          )}
        </div>
      </div>
    </div>
  );
}