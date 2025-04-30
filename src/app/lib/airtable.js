import Airtable from 'airtable';
Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

export const tableRecettes = base('Recettes');
export const tableIngredients = base('Ingredients');

export function formatRecords(records) {
  return records.map(record => ({
    id: record.id,
    ...record.fields,
  }));
}