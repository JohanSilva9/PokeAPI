import { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getPokemonDetails } from "../service/api";

export default function PokemonDetails() {
  const { id } = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getPokemonDetails(id.toString()).then(setPokemon);
    }
  }, [id]);

  if (!pokemon) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#e37e1e" />;

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Image
        source={{
          uri: pokemon.sprites.other["official-artwork"].front_default,
        }}
        style={{ width: 200, height: 200, alignSelf: "center" }}
      />
      <Text style={{ fontSize: 28, fontWeight: "bold", textAlign: "center", textTransform: "capitalize" }}>
        {pokemon.name}
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18, fontWeight: "bold" }}>Tipo:</Text>
      {pokemon.types.map((t: any) => (
        <Text key={t.type.name} style={{ fontSize: 16, textTransform: "capitalize" }}>
          - {t.type.name}
        </Text>
      ))}

      <Text style={{ marginTop: 15, fontSize: 18, fontWeight: "bold" }}>Altura:</Text>
      <Text>{pokemon.height / 10} m</Text>

      <Text style={{ marginTop: 15, fontSize: 18, fontWeight: "bold" }}>Peso:</Text>
      <Text>{pokemon.weight / 10} kg</Text>
    </ScrollView>
  );
}

