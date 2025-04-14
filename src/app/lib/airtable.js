import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export const tableRecettes = base('Recettes');  // Table des recettes
export const tableIngredients = base('Ingrédients');  // Table des ingrédients
