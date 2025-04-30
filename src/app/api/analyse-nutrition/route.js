import { tableIngredients } from '@/app/lib/airtable';

export async function POST(req) {
  const { ingredients, personnes } = await req.json();
  
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return new Response(
      JSON.stringify({ message: 'Veuillez fournir une liste d\'ingrédients' }),
      { status: 400 }
    );
  }
  
  try {
    const allIngredients = await tableIngredients.select().all();
    const ingredientsData = allIngredients.map(record => ({
      id: record.id,
      ...record.fields
    }));
    
    let totalCalories = 0;
    let totalProteines = 0;
    let totalGlucides = 0;
    let totalLipides = 0;
    
    for (const ingredientStr of ingredients) {
 
      const match = ingredientStr.match(/^(.*?)\s*\((\d+)(\w+)\)?$/);
      
      if (match) {
        const [_, nom, quantite, unite] = match;
        const ingredientDB = ingredientsData.find(i => 
          i.Nom?.toLowerCase() === nom.toLowerCase().trim()
        );
        
        if (ingredientDB) {
          let facteur = 1;
          if (ingredientDB.Unité === unite) {
            facteur = parseFloat(quantite) / parseFloat(ingredientDB.Quantité || 100);
          }
          
          totalCalories += (ingredientDB.Calories || 0) * facteur;
          totalProteines += (ingredientDB.Protéines || 0) * facteur;
          totalGlucides += (ingredientDB.Glucides || 0) * facteur;
          totalLipides += (ingredientDB.Lipides || 0) * facteur;
        }
      }
    }
    
    if (personnes && personnes > 1) {
      totalCalories = Math.round(totalCalories / personnes);
      totalProteines = Math.round(totalProteines / personnes * 10) / 10;
      totalGlucides = Math.round(totalGlucides / personnes * 10) / 10;
      totalLipides = Math.round(totalLipides / personnes * 10) / 10;
    }
    
    return new Response(
      JSON.stringify({
        CaloriesTotales: totalCalories,
        ProtéinesTotales: totalProteines,
        GlucidesTotaux: totalGlucides,
        LipidesTotaux: totalLipides
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Erreur lors de l\'analyse nutritionnelle', error: error.toString() }),
      { status: 500 }
    );
  }
}