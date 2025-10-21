// app/service/api.ts
const BASE_URL = "https://pokeapi.co/api/v2";

export const getRegions = async () => {
  const res = await fetch(`${BASE_URL}/region/`);
  return res.json();
};

export const getPokemonsByRegion = async (region: string) => {
  const res = await fetch(`${BASE_URL}/pokedex/${region.toLowerCase()}/`);
  return res.json();
};

export const getPokemonDetails = async (idOrName: string) => {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  return res.json();
};

export const getEvolutionChain = async (id: string) => {
  const res = await fetch(`${BASE_URL}/evolution-chain/${id}`);
  return res.json();
};
