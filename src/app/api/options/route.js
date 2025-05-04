import { tableRecettes } from "@/app/lib/airtable";

export async function GET(req) {
  try {
    // Récupère les métadonnées du champ IntolérancesAlimentaires pour avoir ses options
    const metadata = await tableRecettes.metadata();
    console.log("Metadata reçue :", metadata);

    const fields = metadata.fields || [];
    console.log(
      "Champs trouvés :",
      fields.map((f) => f.name)
    );

    // Recherche le champ IntolérancesAlimentaires
    const intolerancesField = fields.find(
      (field) => field.name === "IntolérancesAlimentaires"
    );
    console.log(
      "Champ IntolérancesAlimentaires trouvé :",
      intolerancesField ? "Oui" : "Non"
    );

    if (intolerancesField) {
      console.log("Type du champ:", intolerancesField.type);
      console.log("Options:", intolerancesField.options);
    }

    // Récupère les options ou retourne un tableau vide
    let options = [];
    if (
      intolerancesField &&
      intolerancesField.options &&
      intolerancesField.options.choices
    ) {
      options = intolerancesField.options.choices.map((choice) => choice.name);
    }
    console.log("Options finales:", options);

    // Assurer que c'est toujours un tableau
    if (!Array.isArray(options)) {
      console.warn(
        "Les options ne sont pas un tableau, renvoi d'un tableau vide"
      );
      options = [];
    }

    return new Response(JSON.stringify(options), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des options:", error);
    return new Response(
      JSON.stringify({
        message: "Erreur lors de la récupération des options",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
