import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Create() {
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!prompt) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 2000); // simulate API call
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.header}>🎵 Create Your Music</Text>
      <Text style={styles.sub}>
        Enter your lyrics, vibe, or theme — and let AI generate a custom sound.
      </Text>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Describe your song idea:</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="e.g., Chill lo-fi beat about rainy nights"
          placeholderTextColor="#888"
          value={prompt}
          onChangeText={setPrompt}
        />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Preferred Genre (optional):</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Lo-Fi, Pop, Indie"
          placeholderTextColor="#888"
          value={genre}
          onChangeText={setGenre}
        />
      </View>

      <TouchableOpacity
        style={[styles.generateBtn, loading && { opacity: 0.6 }]}
        onPress={handleGenerate}
        disabled={loading}
      >
        <Ionicons name="sparkles" size={20} color="#0B0E14" />
        <Text style={styles.generateText}>
          {loading ? "Generating..." : "Generate Music"}
        </Text>
      </TouchableOpacity>

      {generated && (
        <View style={styles.resultBox}>
          <Ionicons name="musical-notes" size={28} color="#00FFE0" />
          <Text style={styles.resultTitle}>Your AI Music is Ready! 🎧</Text>
          <Text style={styles.resultDesc}>
            (In future updates, this will play your generated song from Suno AI.)
          </Text>
          <TouchableOpacity style={styles.previewBtn}>
            <Ionicons name="play" size={20} color="#0B0E14" />
            <Text style={styles.previewText}>Preview Track</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E14" },
  scroll: { padding: 20, paddingBottom: 80 },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#00FFE0",
    marginTop: 30,
  },
  sub: {
    color: "#9AA4B2",
    fontSize: 14,
    marginTop: 6,
    marginBottom: 25,
  },
  inputBox: { marginBottom: 20 },
  label: { color: "#fff", marginBottom: 8, fontWeight: "600" },
  input: {
    backgroundColor: "#151821",
    color: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
  },
  generateBtn: {
    flexDirection: "row",
    backgroundColor: "#00FFE0",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  generateText: {
    color: "#0B0E14",
    fontWeight: "700",
    marginLeft: 8,
  },
  resultBox: {
    backgroundColor: "#151821",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#00FFE0",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  resultTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
  resultDesc: {
    color: "#9AA4B2",
    fontSize: 13,
    textAlign: "center",
    marginVertical: 10,
  },
  previewBtn: {
    flexDirection: "row",
    backgroundColor: "#00FFE0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: "center",
    marginTop: 6,
  },
  previewText: {
    color: "#0B0E14",
    fontWeight: "700",
    marginLeft: 6,
  },
});