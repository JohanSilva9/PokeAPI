// app/(tabs)/regions.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { getRegions } from "../service/api";
import { useRouter } from "expo-router";

export default function RegionsScreen() {
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    getRegions()
      .then((res) => {
        if (!mounted) return;
        setRegions(res.results || []);
      })
      .catch((e) => {
        console.error("Error regiones", e);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#e37e1e" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Regiones</Text>
      <FlatList
        data={regions}
        keyExtractor={(r) => r.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              // redirige a la pestaña pokemons pasando ?region=<slug>
              router.push(`/(tabs)/pokemons?region=${item.name}`);
            }}
          >
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#36393c", padding: 12 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  card: { backgroundColor: "#e37e1e", padding: 14, borderRadius: 10, marginBottom: 8 },
  cardText: { color: "#fff", textTransform: "capitalize", fontSize: 16 },
});
