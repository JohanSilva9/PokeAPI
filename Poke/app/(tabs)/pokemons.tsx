import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getPokemonsByRegion } from "../service/api";


export default function PokemonListScreen() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { region } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const regionName = region || "kanto";
    getPokemonsByRegion(regionName.toString()).then((data) => {
      const list = data.pokemon_entries.map((p: any) => ({
        name: p.pokemon_species.name,
        id: p.entry_number,
      }));
      setPokemons(list);
      setLoading(false);
    });
  }, [region]);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#e37e1e" />;

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Pokémons de {region || "Kanto"}
      </Text>
      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#f0c82f",
              marginVertical: 5,
              borderRadius: 10,
              padding: 10,
            }}
            onPress={() => router.push(`/pokemon/${item.name}`)}
          >
            <Image
              source={{
                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`,
              }}
              style={{ width: 60, height: 60, marginRight: 15 }}
            />
            <Text style={{ fontSize: 18, color: "#36393c", textTransform: "capitalize" }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
