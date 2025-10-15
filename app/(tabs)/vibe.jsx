import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";

// Filipino-Themed Moods
const moods = [
  // Relate: The feeling of deep understanding, often used for emotional songs.
  { emoji: "😭", label: "Relate", playlist: "Hugot Ballads" }, 
  // Hataw: To go full-out; an energetic, all-out effort, often used for dancing.
  { emoji: "🕺", label: "Hataw", playlist: "Party All Night (OPM Pop)" },
  // Senti: Short for sentimental; a melancholic, nostalgic, or calm feeling.
  { emoji: "☁️", label: "Senti", playlist: "Acoustic Tadhana" },
  // Gigil: An overwhelming urge to squeeze something cute; often used playfully for high energy.
  { emoji: "🤪", label: "Gigil", playlist: "K-Pop/P-Pop Hype" }, 
];

// Placeholder for the image source (replace with your actual asset path)
// You might want to use a more culturally relevant image here!
const playlistImagePlaceholder = require("../../assets/images/mix1.png");

export default function VibePicker() {
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VibeCheck</Text>
      <Text style={styles.subtitle}>Anong trip mo? Pick your vibe to match your soundtrack.</Text>

      <ScrollView contentContainerStyle={styles.moodGrid} showsVerticalScrollIndicator={false}>
        {moods.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.moodTile,
              selectedMood?.label === mood.label && styles.selectedMoodTile,
            ]}
            onPress={() => setSelectedMood(mood)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={styles.moodLabel}>{mood.label}</Text>
          </TouchableOpacity>
        ))}

        {/* Dynamic Result Card */}
        {selectedMood && (
          <View style={styles.resultCard}>
            <Image
              source={playlistImagePlaceholder}
              style={styles.playlistArt}
            />
            <View style={styles.resultInfo}>
              <Text style={styles.cardTitle}>{selectedMood.playlist}</Text>
              <Text style={styles.cardSubtitle}>
                Perfect for your **{selectedMood.label}** mood, idol!
              </Text>
              <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
                <Text style={styles.playText}>Let's Listen!</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0E14", 
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#E0E0E0",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15,
    color: "#A0A0A0",
    marginBottom: 20,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  // --- Mood Tiles ---
  moodTile: {
    backgroundColor: "#151821", 
    width: "47.5%", 
    aspectRatio: 1, 
    borderRadius: 15,
    marginBottom: 15,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
    shadowColor: "#00FFE0",
    shadowOpacity: 0.15,
  },
  selectedMoodTile: {
    borderColor: "#00FFE0", 
    backgroundColor: "#252B3B", 
  },
  emoji: {
    fontSize: 40, 
    marginBottom: 8,
  },
  moodLabel: {
    color: "#E0E0E0",
    fontSize: 16,
    fontWeight: "600",
  },
  // --- Result Card ---
  resultCard: {
    width: "100%",
    backgroundColor: "#151821",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  playlistArt: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 15,
  },
  resultInfo: {
    flex: 1,
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: "#A0A0A0",
    fontSize: 13,
    marginBottom: 10,
  },
  playButton: {
    backgroundColor: "#1f2331",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: "flex-start",
  },
  playText: {
    color: "#00FFE0",
    fontWeight: "600",
    fontSize: 14,
  },
});