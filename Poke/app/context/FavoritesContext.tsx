import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesContext = createContext<any>(null);

export const FavoritesProvider = ({ children }: any) => {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const saved = await AsyncStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  };

  const saveFavorites = async (data: any[]) => {
    setFavorites(data);
    await AsyncStorage.setItem("favorites", JSON.stringify(data));
  };

  const toggleFavorite = (pokemon: any) => {
    const exists = favorites.find((f) => f.name === pokemon.name);
    const updated = exists
      ? favorites.filter((f) => f.name !== pokemon.name)
      : [...favorites, pokemon];
    saveFavorites(updated);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
