import { tableIngredients } from '@/app/lib/airtable';


export async function GET(request, context) {
    const { params } = context;
    console.log("Params:", params);
    
    if (!params || !params.id) {
      return new Response(
        JSON.stringify({ message: 'ID non trouvé dans les paramètres de la requête' }),
        { status: 400 }
      );
    }
    const { id } = params;
  
    try {
      const record = await tableIngredients.find(id);
      return new Response(JSON.stringify({ id: record.id, ...record.fields }), { status: 200 });
    } catch (error) {
      return new Response(
        JSON.stringify({ message: 'Ingrédient non trouvé', error: error.toString() }),
        { status: 404 }
      );
    }
  }
  
  export async function PUT(request, context) {
    const { params } = context;
    const { id } = params;
    const data = await request.json();
    
    try {
      const updated = await tableIngredients.update(id, data);
      return new Response(JSON.stringify({ id: updated.id, ...updated.fields }), { status: 200 });
    } catch (error) {
      return new Response(
        JSON.stringify({ message: 'Erreur lors de la mise à jour de l\'ingrédient', error: error.toString() }),
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(request, context) {
    const { params } = context;
    const { id } = params;
    
    try {
      await tableIngredients.destroy(id);
      return new Response(null, { status: 204 });
    } catch (error) {
      return new Response(
        JSON.stringify({ message: 'Erreur lors de la suppression de l\'ingrédient', error: error.toString() }),
        { status: 500 }
      );
    }
  }