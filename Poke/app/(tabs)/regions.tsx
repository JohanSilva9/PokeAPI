import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { getRegions } from "../service/api";
import { useRouter } from "expo-router";

export default function RegionsScreen() {
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getRegions().then((data) => {
      setRegions(data.results);
      setLoading(false);
    });
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#e37e1e" />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>Regiones</Text>
      <FlatList
        data={regions}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 15,
              marginVertical: 5,
              backgroundColor: "#f0c82f",
              borderRadius: 10,
            }}
            onPress={() => router.push(`/pokemons?region=${item.name}`)}
          >
            <Text style={{ color: "#36393c", fontSize: 18, textTransform: "capitalize" }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
