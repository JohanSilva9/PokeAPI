// app/(tabs)/pokemons.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, TextInput, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getPokedexByRegion, getPokemon, getPokemonTypes } from "../service/api";

export default function PokemonsScreen() {
  const { region } = useLocalSearchParams();
  const router = useRouter();

  const [pokemons, setPokemons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const regionSlug = (region as string) || "kanto";
    setLoading(true);

    (async () => {
      try {
        const pokedex = await getPokedexByRegion(regionSlug);
        const entries = pokedex.pokemon_entries.slice(0, 100); // limitar para rendimiento

        const resolved = await Promise.all(
          entries.map(async (entry: any) => {
            try {
              const detail = await getPokemon(entry.pokemon_species.name);
              return {
                id: detail.id,
                name: detail.name,
                image: detail.sprites.other["official-artwork"].front_default,
                types: detail.types.map((t: any) => t.type.name),
              };
            } catch {
              return null;
            }
          })
        );

        if (mounted) {
          setPokemons(resolved.filter(Boolean));
        }
      } catch (err) {
        console.error("Error cargando pokemons:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [region]);

  useEffect(() => {
    getPokemonTypes().then((r) => {
      setTypes((r.results || []).map((t: any) => t.name));
    });
  }, []);

  const filtered = pokemons
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (typeFilter ? p.types.includes(typeFilter) : true));

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#e37e1e" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokémons - {region ? (region as string).toUpperCase() : "KANTO"}</Text>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar por nombre..."
        placeholderTextColor="#999"
        style={styles.searchInput}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/pokemon/${item.name}`)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>{item.types.join(", ")}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#36393c" },
  title: { color: "#fff", fontSize: 20, textAlign: "center", marginBottom: 8 },
  searchInput: { backgroundColor: "#fff", borderRadius: 8, padding: 8, marginBottom: 10 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#e37e1e", padding: 10, borderRadius: 10, marginBottom: 8 },
  image: { width: 60, height: 60, marginRight: 12 },
  name: { color: "#fff", fontSize: 16, textTransform: "capitalize" },
  sub: { color: "#fff", opacity: 0.8 },
});
