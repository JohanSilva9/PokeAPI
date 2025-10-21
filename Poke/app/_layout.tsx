import React from "react";
import { Stack } from "expo-router";
import { FavoritesProvider } from "./context/FavoritesContext";
import OfflineBanner from "./components/OfflineBanner";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false }} />
    </FavoritesProvider>
  );
}
