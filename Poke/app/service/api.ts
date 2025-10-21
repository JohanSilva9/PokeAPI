// app/service/api.ts

const BASE_URL = "https://pokeapi.co/api/v2";

export async function getRegions() {
  const res = await fetch(`${BASE_URL}/region`);
  return res.json();
}

export async function getPokedexByRegion(region: string) {
  // Mapeo manual de nombres de regiones a pokedex correctas
  const regionMap: Record<string, string> = {
    kanto: "kanto",
    johto: "original-johto",
    hoenn: "hoenn",
    sinnoh: "original-sinnoh",
    unova: "original-unova",
    kalos: "kalos-central",
    alola: "original-alola",
    galar: "galar",
    paldea: "paldea",
  };

  const pokedexName = regionMap[region.toLowerCase()] || "kanto";
  const res = await fetch(`${BASE_URL}/pokedex/${pokedexName}`);
  return res.json();
}

export async function getPokemon(nameOrId: string | number) {
  const res = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  return res.json();
}

export async function getPokemonTypes() {
  const res = await fetch(`${BASE_URL}/type`);
  return res.json();
}

export async function getEvolutionChain(id: number) {
  const res = await fetch(`${BASE_URL}/evolution-chain/${id}`);
  return res.json();
}
