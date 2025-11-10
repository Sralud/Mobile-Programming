import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";

const categories = [
  "Indie Dream",
  "Lo-Fi Drift",
  "Synth Nights",
  "Acoustic Vibes",
  "Chillhop Lounge",
  "Future Beats",
];

const Search = () => {
  const [query, setQuery] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type to discover new sounds..."
        placeholderTextColor="#9AA4B2"
        value={query}
        onChangeText={setQuery}
      />

      <Text style={styles.sectionTitle}>Explore Genres</Text>
      <View style={styles.grid}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat} style={styles.catCard} activeOpacity={0.8}>
            <Text style={styles.catText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E14", padding: 16 },
  input: {
    backgroundColor: "rgba(30,35,45,0.8)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#1F2330",
    color: "#E6E8F0",
    marginBottom: 20,
    marginTop: 40,
  },
  sectionTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginVertical: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  catCard: {
    width: "48%",
    height: 110,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    backgroundColor: "#151821",
    elevation: 5,
    shadowColor: "#00FFE0",
    shadowOpacity: 0.15,
  },
  catText: {
    color: "#00FFE0",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
