"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/recipes?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full">
      <input
        type="text"
        placeholder="Rechercher par nom, ingrédient ou type..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow py-3 px-4 rounded-l-lg border-2 border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
      <button
        type="submit"
        className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-r-lg transition-colors"
      >
        Rechercher
      </button>
    </form>
  );
}
