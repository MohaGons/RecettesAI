export async function POST(req) {
  console.log("API /api/generate-recipe appelée");
  console.log(
    "OPENAI_API_KEY:",
    process.env.OPENAI_API_KEY ? "OK" : "NON DEFINIE"
  );
  try {
    const { prompt } = await req.json();
    console.log("Prompt reçu pour génération IA:", prompt);
    console.log("Avant appel OpenAI");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // ou 'gpt-4' si tu as accès
        messages: [
          { role: "system", content: "Tu es un chef cuisinier expert." },
          { role: "user", content: prompt },
        ],
        max_tokens: 700,
        temperature: 0.8,
      }),
    });
    console.log("Après appel OpenAI");

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur OpenAI:", errorText);
      return new Response(
        JSON.stringify({
          error: "Erreur lors de l'appel à l'IA",
          details: errorText,
        }),
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("Réponse OpenAI brute:", data);

    const text = data.choices?.[0]?.message?.content || "";
    const lines = text.split("\n").filter(Boolean);
    let Nom = lines[0] || "Recette générée";
    console.log("Nom brut IA:", Nom);
    Nom = Nom.replace(/^#+\s*/, "") // retire les # markdown
      .replace(/^1[.)-]?\s*/i, "")
      .replace(/^(\*+)?\s*Nom( de (la )?recette)?\s*:?( 2A+)?\s*/i, "") // retire tout préfixe avec ou sans étoiles
      .replace(/^de (la )?recette\s*:?( 2A+)?\s*/i, "")
      .replace(/^Nom\s*:?( 2A+)?\s*/i, "")
      .replace(/^:[*\s]*/, "")
      .replace(/^[*\s]+/, "")
      .trim();
    console.log("Nom nettoyé:", Nom);
    const Description =
      lines[1]
        ?.replace(/^2[.)-]?\s*/, "")
        .replace(/^Description\s*:?/i, "")
        .trim() || "";
    const Instructions = lines.slice(2).join("\n");

    return Response.json({
      Nom,
      Description,
      Instructions,
      brut: text, // Pour debug, tu peux retirer cette ligne si tu veux
    });
  } catch (err) {
    console.error("Erreur dans /api/generate-recipe:", err);
    return new Response(
      JSON.stringify({ error: "Erreur serveur", details: err.message }),
      { status: 500 }
    );
  }
}
