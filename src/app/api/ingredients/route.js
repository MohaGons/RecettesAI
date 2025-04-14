import { tableIngredients } from '@/app/lib/airtable';

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const nom = searchParams.get('nom');
  const categorie = searchParams.get('categorie');
  const unite = searchParams.get('unite');

  try {
    const records = await tableIngredients.select().all();

    let ingredients = records.map(record => ({
      ...record.fields,
      id: record.id,
    }));

    if (nom) {
      ingredients = ingredients.filter(i =>
        i.Nom?.toLowerCase().includes(nom.toLowerCase())
      );
    }

    if (categorie) {
      ingredients = ingredients.filter(i =>
        i.Catégorie?.toLowerCase() === categorie.toLowerCase()
      );
    }

    if (unite) {
      ingredients = ingredients.filter(i =>
        i.Unité?.toLowerCase() === unite.toLowerCase()
      );
    }

    return new Response(JSON.stringify(ingredients), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Erreur lors de la récupération des ingrédients',
        error,
      }),
      { status: 500 }
    );
  }
}


export async function POST(req) {
  // Récupérer les données du body de la requête
  const {
    Nom,
    Catégorie,
    Unité,
    Quantité,
    Calories,
    Protéines,
    Glucides,
    Lipides,
  } = await req.json();

  try {
    const createdRecord = await tableIngredients.create({
      Nom,
      Catégorie,
      Unité,
      Quantité,
      Calories,
      Protéines,
      Glucides,
      Lipides,
    });

    return new Response(
      JSON.stringify({ id: createdRecord.id, ...createdRecord.fields }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Erreur lors de la création de l\'ingrédient', error }),
      { status: 500 }
    );
  }
}
