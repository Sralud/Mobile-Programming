import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";

const categories = ["Pop", "Rock", "Hip-Hop", "Jazz", "R&B", "Electronic"];

const Search = () => {
  const [query, setQuery] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search songs, artists, albums..."
        placeholderTextColor="#9AA4B2"
        value={query}
        onChangeText={setQuery}
      />

      <Text style={styles.sectionTitle}>Browse All</Text>
      <View style={styles.grid}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat} style={styles.catCard}>
            <Text style={styles.catText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1115", padding: 16 },
  input: {
    backgroundColor: "#171923",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#1F2330",
    color: "#E6E8F0",
    marginBottom: 16,
    marginTop: 40
  },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginVertical: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  catCard: {
    backgroundColor: "#1A202C",
    width: "48%",
    height: 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  catText: { color: "#fff", fontWeight: "600" },
});