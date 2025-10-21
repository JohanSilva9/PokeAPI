import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  if (!offline) return null;

  return (
    <View style={{ backgroundColor: "#e37e1e", padding: 10 }}>
      <Text style={{ color: "white", textAlign: "center" }}>
        Sin conexión a internet. Solo puedes ver tus favoritos.
      </Text>
    </View>
  );
}
