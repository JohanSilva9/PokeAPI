// app/(tabs)/favorites.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useFavorites } from "../context/FavoritesContext";
import { useRouter } from "expo-router";

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();
  const router = useRouter();

  const handleRemove = (item: any) => {
    Alert.alert("Eliminar favorito", `¿Quitar a ${item.name} de favoritos?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Quitar", style: "destructive", onPress: () => toggleFavorite(item) },
    ]);
  };

  if (!favorites || favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>No tienes pokémon favoritos todavía.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id ?? item.name)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/pokemon/${item.name}`)}
            onLongPress={() => handleRemove(item)}
          >
            <Image
              source={{ uri: item.sprites?.other?.["official-artwork"]?.front_default || item.sprites?.front_default }}
              style={styles.image}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>{(item.types || []).join(", ")}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(item)}>
              <Text style={{ color: "#f0c82f", fontWeight: "bold" }}>Quitar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#36393c", padding: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#36393c" },
  card: { flexDirection: "row", backgroundColor: "#e37e1e", padding: 10, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  image: { width: 70, height: 70, marginRight: 10 },
  name: { color: "#fff", fontSize: 18, textTransform: "capitalize" },
  sub: { color: "#fff", opacity: 0.9 },
});
