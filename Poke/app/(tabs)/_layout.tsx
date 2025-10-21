import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#36393c" },
        headerTintColor: "#fff",
        tabBarStyle: { backgroundColor: "#36393c" },
        tabBarActiveTintColor: "#e37e1e",
        tabBarInactiveTintColor: "#aaa",
      }}
    >
      <Tabs.Screen
        name="pokemons"
        options={{
          title: "Pokémons",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="regions"
        options={{
          title: "Regiones",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}


