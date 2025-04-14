import { tableRecettes } from '@/app/lib/airtable';

export async function GET(request, context) {
  const { id } = await context.params;

  try {
    const record = await tableRecettes.find(id);
    return new Response(JSON.stringify({ id: record.id, ...record.fields }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Erreur GET recette', error: error.toString() }), { status: 500 });
  }
}

export async function PUT(request, context) {
  const { id } = await context.params;
  const data = await request.json();

  try {
    const updated = await tableRecettes.update(id, data);
    return new Response(JSON.stringify({ id: updated.id, ...updated.fields }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Erreur update recette', error: error.toString() }), { status: 500 });
  }
}

export async function DELETE(request, context) {
  const { id } = await context.params;

  try {
    await tableRecettes.destroy(id);
    return new Response(JSON.stringify({ message: 'Recette supprimée' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Erreur delete recette', error: error.toString() }), { status: 500 });
  }
}