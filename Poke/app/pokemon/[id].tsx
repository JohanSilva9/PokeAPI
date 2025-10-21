// app/pokemon/[id].tsx
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import NetInfo from "@react-native-community/netinfo";
import { getPokemon, getPokemon as fetchPokemon, getEvolutionChain, getPokemon as getPokemonAPI } from "../service/api";
import { useFavorites } from "../context/FavoritesContext";

type Pokemon = any;

export default function PokemonDetails() {
  const { id } = useLocalSearchParams(); // id puede ser nombre o id numérico
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<any | null>(null);
  const [evolutions, setEvolutions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState<boolean>(true);

  useEffect(() => {
    const unsub = NetInfo.addEventListener(s => setOnline(Boolean(s.isConnected)));
    return () => unsub();
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        if (!online) {
          // Si no hay conexión, buscar en favoritos snapshot
          const fav = favorites.find((f: any) => f.name === id || String(f.id) === String(id));
          if (fav) {
            if (mounted) {
              setPokemon(fav);
              // No mostramos evoluciones offline (requerimiento)
              setEvolutions([]);
            }
          } else {
            if (mounted) setPokemon(null);
          }
          return;
        }

        // Online: fetch completo
        const p = await getPokemon(id as string);
        // species para descripción y evolución
        const speciesResRaw = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${p.id}`).then(r => r.json());
        const evoChainUrl = speciesResRaw?.evolution_chain?.url;
        let evoNames: string[] = [];
        if (evoChainUrl) {
          const parts = evoChainUrl.split("/").filter(Boolean);
          const evoId = parts[parts.length - 1];
          const evoChain = await getEvolutionChain(Number(evoId));
          evoNames = parseEvolutionChain(evoChain.chain);
        }

        if (mounted) {
          setPokemon(p);
          setSpecies(speciesResRaw);
          setEvolutions(evoNames);
        }
      } catch (err) {
        console.error("Error cargando Pokémon:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id, online]);

  const parseEvolutionChain = (chainNode: any) => {
    const out: string[] = [];
    function walk(node: any) {
      if (!node) return;
      out.push(node.species.name);
      if (node.evolves_to && node.evolves_to.length) {
        node.evolves_to.forEach((n: any) => walk(n));
      }
    }
    walk(chainNode);
    return out;
  };

  const isFav = pokemon && favorites.some((f: any) => f.name === pokemon.name);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e37e1e" />
        <Text style={{ color: "#fff", marginTop: 8 }}>Cargando...</Text>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>No se encontró el Pokémon (sin conexión y no está en favoritos).</Text>
      </View>
    );
  }

  const sprite =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default ||
    null;

  const description =
    species?.flavor_text_entries?.find((e: any) => e.language.name === "es")?.flavor_text ||
    species?.flavor_text_entries?.find((e: any) => e.language.name === "en")?.flavor_text ||
    "";

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{pokemon.name.toUpperCase()}</Text>

      {sprite ? (
        <Image source={{ uri: sprite }} style={styles.image} />
      ) : (
        <View style={{ height: 200, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#fff" }}>Sin imagen</Text>
        </View>
      )}
      <TouchableOpacity
          style={{
          backgroundColor: "#e37e1e",
          padding: 10,
          borderRadius: 10,
          alignItems: "center",
          marginVertical: 20,
        }}
        onPress={() => router.back()}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>⬅ Volver</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.favoriteButton, isFav ? styles.favoriteActive : null]}
        onPress={() => {
          // guardar snapshot útil para offline
          const snapshot = {
            id: pokemon.id,
            name: pokemon.name,
            sprites: pokemon.sprites,
            types: pokemon.types?.map((t: any) => t.type.name) || [],
            moves: (pokemon.moves || []).slice(0, 6).map((m: any) => m.move.name),
            height: pokemon.height,
            weight: pokemon.weight,
            species: {
              flavor_text: description,
            },
          };
          toggleFavorite(snapshot);
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          {isFav ? "Quitar de Favoritos" : "Agregar a Favoritos"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Tipo(s)</Text>
      <View style={styles.row}>
        {pokemon.types.map((t: any) => (
          <Text key={t.type.name} style={styles.typeTag}>
            {t.type.name}
          </Text>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.text}>{description.replace(/\n|\f/g, " ")}</Text>

      <Text style={styles.sectionTitle}>Estadísticas</Text>
      {pokemon.stats.map((s: any) => (
        <Text key={s.stat.name} style={styles.text}>
          {s.stat.name}: {s.base_stat}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Ataques (muestra)</Text>
      {(pokemon.moves || []).slice(0, 8).map((m: any) => (
        <Text key={m.move.name} style={styles.text}>
          - {m.move.name}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Evoluciones</Text>
      {evolutions.length === 0 ? (
        <Text style={styles.text}>No hay evoluciones o no disponibles offline.</Text>
      ) : (
        evolutions.map((name) => (
          <TouchableOpacity
            key={name}
            style={styles.evoRow}
            onPress={() => {
              // navegar a detalle de la evolución
              router.push(`/pokemon/${name}`);
            }}
          >
            <Text style={[styles.text, { color: "#f0c82f" }]}>{name}</Text>
          </TouchableOpacity>
        ))
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#36393c", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#36393c" },
  title: { color: "#fff", fontSize: 26, textAlign: "center", textTransform: "capitalize" },
  image: { width: 200, height: 200, alignSelf: "center", marginVertical: 10 },
  favoriteButton: {
    backgroundColor: "#e37e1e",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  favoriteActive: { backgroundColor: "#f0c82f" },
  sectionTitle: { color: "#f0c82f", marginTop: 12, fontWeight: "bold" },
  row: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 6 },
  typeTag: { backgroundColor: "#e37e1e", color: "#fff", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 6, textTransform: "capitalize" },
  text: { color: "#fff", marginTop: 6, textTransform: "capitalize" },
  evoRow: { paddingVertical: 6 },
});

