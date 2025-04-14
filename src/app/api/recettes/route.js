import { tableRecettes } from '@/app/lib/airtable';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
  
    const nom = searchParams.get('nom');
    const type = searchParams.get('type');
    const ingredient = searchParams.get('ingredient');
  
    try {
      const records = await tableRecettes.select().all();
  
      let recipes = records.map(record => ({
        id: record.id,
        ...record.fields,
      }));
  
      // 🔍 Appliquer les filtres
      if (nom) {
        recipes = recipes.filter(r =>
          r.Nom?.toLowerCase().includes(nom.toLowerCase())
        );
      }
  
      if (type) {
        recipes = recipes.filter(r =>
          r.TypeDePlat?.toLowerCase() === type.toLowerCase()
        );
      }
  
      if (ingredient) {
        recipes = recipes.filter(r =>
          r.Ingrédients?.includes(ingredient)
        );
      }
  
      return new Response(JSON.stringify(recipes), { status: 200 });
    } catch (error) {
      return new Response(
        JSON.stringify({ message: 'Erreur lors de la récupération des recettes', error }),
        { status: 500 }
      );
    }
  }
  

export async function POST(req) {
  const {
    Nom,
    Description,
    Ingrédients,
    TempsDePréparation,
    NombreDePersonnes,
    Instructions,
    CaloriesTotales,
    ProtéinesTotales,
    GlucidesTotaux,
    LipidesTotaux,
    TypeDePlat,
    IntolérancesAlimentaires,
    Photo
  } = await req.json();

  try {
    const createdRecord = await tableRecettes.create({
      Nom,
      Description,
      Ingrédients,
      TempsDePréparation,
      NombreDePersonnes,
      Instructions,
      CaloriesTotales,
      ProtéinesTotales,
      GlucidesTotaux,
      LipidesTotaux,
      TypeDePlat,
      IntolérancesAlimentaires,
      Photo
    });

    return new Response(JSON.stringify({ id: createdRecord.id, ...createdRecord.fields }), {
      status: 201,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Erreur lors de la création de la recette", error }),
      { status: 500 }
    );
  }
}
