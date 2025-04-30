import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, X, AlertCircle } from 'lucide-react';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import Select from '@/app/components/ui/Select';
import { useIngredients } from '@/app/hooks/useIngredients';

export default function CreateRecipeForm({ step, onNext, onBack, onSubmit }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      Nom: '',
      Description: '',
      Ingrédients: [],
      TempsDePréparation: 30,
      NombreDePersonnes: 4,
      Instructions: '',
      TypeDePlat: 'Plat principal',
      IntolérancesAlimentaires: []
    }
  });
  
  const { ingredients } = useIngredients();
  const [ingredientInput, setIngredientInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [tempIngredients, setTempIngredients] = useState([]);
  const [allergensOptions, setAllergensOptions] = useState([
    'Gluten', 'Lactose', 'Fruits à coque', 'Crustacés', 'Œufs', 'Arachides', 'Soja', 'Poisson'
  ]);
  
  const dishTypes = [
    { value: 'Entrée', label: 'Entrée' },
    { value: 'Plat principal', label: 'Plat principal' },
    { value: 'Dessert', label: 'Dessert' },
    { value: 'Soupe', label: 'Soupe' },
    { value: 'Salade', label: 'Salade' },
    { value: 'Apéritif', label: 'Apéritif' }
  ];
  
  // Récupérer les ingrédients de la form
  const formIngredients = watch('Ingrédients');
  
  // Mettre à jour les ingrédients temporaires quand formIngredients change
  useEffect(() => {
    if (formIngredients && formIngredients.length > 0) {
      setTempIngredients(formIngredients);
    }
  }, [formIngredients]);
  
  // Gérer les suggestions d'ingrédients
  useEffect(() => {
    if (ingredientInput.trim() === '') {
      setSuggestions([]);
      return;
    }
    
    if (ingredients && ingredients.length > 0) {
      const filtered = ingredients
        .filter(i => i.Nom?.toLowerCase().includes(ingredientInput.toLowerCase()))
        .slice(0, 5);
      
      setSuggestions(filtered);
    }
  }, [ingredientInput, ingredients]);
  
  const addIngredient = () => {
    if (ingredientInput.trim() === '') return;
    
    const newIngredients = [...tempIngredients, ingredientInput];
    setTempIngredients(newIngredients);
    setValue('Ingrédients', newIngredients);
    setIngredientInput('');
  };
  
  const removeIngredient = (index) => {
    const newIngredients = tempIngredients.filter((_, i) => i !== index);
    setTempIngredients(newIngredients);
    setValue('Ingrédients', newIngredients);
  };
  
  const selectIngredient = (ingredient) => {
    const ingredientText = `${ingredient.Nom} (${ingredient.Quantité || '100'}${ingredient.Unité || 'g'})`;
    setIngredientInput(ingredientText);
    setSuggestions([]);
  };
  
  const toggleAllergy = (allergy) => {
    const current = watch('IntolérancesAlimentaires') || [];
    
    if (current.includes(allergy)) {
      setValue(
        'IntolérancesAlimentaires', 
        current.filter(a => a !== allergy)
      );
    } else {
      setValue('IntolérancesAlimentaires', [...current, allergy]);
    }
  };
  
  const handleFormSubmit = (data) => {
    if (step < 3) {
      onNext();
    } else {
      onSubmit(data);
    }
  };
  
  // Étape 1: Informations de base et ingrédients
  if (step === 1) {
    return (
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <Input
            label="Nom de la recette"
            placeholder="Ex: Salade Méditerranéenne"
            {...register('Nom', { required: 'Le nom est requis' })}
            error={errors.Nom?.message}
            required
          />
        </div>
        
        <div>
          <Input
            label="Description"
            placeholder="Une courte description de votre recette"
            {...register('Description')}
            error={errors.Description?.message}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ingrédients <span className="text-red-500">*</span>
          </label>
          
          <div className="space-y-4">
            <div className="relative">
              <Input 
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                placeholder="Rechercher un ingrédient..."
                className="w-full"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white mt-1 border rounded-md shadow-lg max-h-60 overflow-auto">
                  {suggestions.map(ingredient => (
                    <div 
                      key={ingredient.id} 
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectIngredient(ingredient)}
                    >
                      <div className="font-medium">{ingredient.Nom}</div>
                      <div className="text-xs text-gray-500">
                        {ingredient.Calories} kcal / {ingredient.Quantité || 100}{ingredient.Unité || 'g'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center mt-2">
              <Button 
                type="button" 
                onClick={addIngredient} 
                variant="primary" 
                className="flex items-center"
              >
                <Plus size={16} className="mr-1" /> Ajouter
              </Button>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Ingrédients sélectionnés:</h3>
              {tempIngredients.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun ingrédient ajouté</p>
              ) : (
                <ul className="space-y-2">
                  {tempIngredients.map((ingredient, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{ingredient}</span>
                      <button 
                        type="button"
                        onClick={() => removeIngredient(index)} 
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {tempIngredients.length === 0 && errors.Ingrédients && (
                <p className="mt-1 text-sm text-red-500">Au moins un ingrédient est requis</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-8 flex items-start">
          <AlertCircle size={20} className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800">Conseil</p>
            <p className="text-sm text-blue-700 mt-1">
              Plus vous serez précis sur les quantités et les ingrédients, plus l'analyse nutritionnelle sera exacte.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            Suivant
          </Button>
        </div>
      </form>
    );
  }
  
  // Étape 2: Nombre de personnes, intolérances, temps de préparation
  if (step === 2) {
    return (
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de personnes
          </label>
          <div className="flex space-x-3">
            {[1, 2, 3, 4, 6, 8].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => setValue('NombreDePersonnes', num)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  watch('NombreDePersonnes') === num ? 'bg-primary-600 text-white' : 'bg-white border'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temps de préparation
          </label>
          <Input 
            type="number" 
            min="5"
            {...register('TempsDePréparation', { 
              required: 'Le temps de préparation est requis',
              min: { value: 1, message: 'Le temps minimum est de 1 minute' }
            })}
            error={errors.TempsDePréparation?.message}
            endIcon={<span className="text-gray-500">min</span>}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de plat
          </label>
          <Select 
            options={dishTypes}
            {...register('TypeDePlat', { required: 'Le type de plat est requis' })}
            error={errors.TypeDePlat?.message}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Intolérances alimentaires
          </label>
          <div className="grid grid-cols-2 gap-3">
            {allergensOptions.map(allergy => (
              <div 
                key={allergy} 
                className={`
                  flex items-center space-x-2 p-3 rounded-lg border cursor-pointer
                  ${(watch('IntolérancesAlimentaires') || []).includes(allergy) ? 'bg-primary-50 border-primary-300' : 'bg-white'}
                `}
                onClick={() => toggleAllergy(allergy)}
              >
                <input 
                  type="checkbox" 
                  checked={(watch('IntolérancesAlimentaires') || []).includes(allergy)}
                  onChange={() => toggleAllergy(allergy)}
                  className="h-4 w-4 text-primary-600 rounded"
                />
                <label className="text-sm">{allergy}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button type="button" variant="secondary" onClick={onBack}>
            Retour
          </Button>
          <Button type="submit" variant="primary">
            Suivant
          </Button>
        </div>
      </form>
    );
  }
  
  // Étape 3: Instructions et finalisation
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instructions de préparation <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows="8"
          placeholder="Détaillez les étapes de préparation... (Utilisez une ligne par étape)"
          {...register('Instructions', { required: 'Les instructions sont requises' })}
        ></textarea>
        {errors.Instructions && (
          <p className="mt-1 text-sm text-red-500">{errors.Instructions.message}</p>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium">Résumé de la recette</h3>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium">{watch('Nom')}</h4>
          <p className="text-sm text-gray-600 mt-1">{watch('Description')}</p>
          
          <div className="mt-3">
            <div className="text-sm">
              <span className="font-medium">Type de plat:</span> {watch('TypeDePlat')}
            </div>
            <div className="text-sm">
              <span className="font-medium">Temps de préparation:</span> {watch('TempsDePréparation')} min
            </div>
            <div className="text-sm">
              <span className="font-medium">Pour:</span> {watch('NombreDePersonnes')} personnes
            </div>
          </div>
          
          <div className="mt-3">
            <span className="text-sm font-medium">Ingrédients:</span>
            <ul className="mt-1 space-y-1">
              {tempIngredients.map((ingredient, i) => (
                <li key={i} className="text-sm text-gray-600">• {ingredient}</li>
              ))}
            </ul>
          </div>
          
          {watch('IntolérancesAlimentaires')?.length > 0 && (
            <div className="mt-3">
              <span className="text-sm font-medium">Intolérances:</span> {watch('IntolérancesAlimentaires').join(', ')}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Retour
        </Button>
        <Button type="submit" variant="primary">
          Créer la recette
        </Button>
      </div>
    </form>
  );
}