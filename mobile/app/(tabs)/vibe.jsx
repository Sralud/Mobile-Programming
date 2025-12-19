import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { usePlayer } from '../contexts/PlayerContext';

const moods = [
  {
    id: 1,
    emoji: "😭",
    label: "Relapse",
    description: "Sad girl/boy hours",
    color: "#FF4444",
    tracks: [
      { id: 'r1', title: "Kathang Isip", artist: "Ben&Ben", duration: "5:18", image: "https://e-cdns-images.dzcdn.net/images/cover/d1b73791d0bf52e05c5de6a8e0e36c5f/250x250-000000-80-0-0.jpg", audioUrl: "https://cdns-preview-2.dzcdn.net/stream/c-2e7f0f0b0f0f0f0f0f0f0f0f0f0f0f0f-8.mp3" },
      { id: 'r2', title: "Kung 'Di Rin Lang Ikaw", artist: "December Avenue", duration: "4:28", image: "https://e-cdns-images.dzcdn.net/images/cover/d1b73791d0bf52e05c5de6a8e0e36c5f/250x250-000000-80-0-0.jpg", audioUrl: "https://cdns-preview-2.dzcdn.net/stream/c-2e7f0f0b0f0f0f0f0f0f0f0f0f0f0f0f-8.mp3" },
      { id: 'r3', title: "Malaya", artist: "Moira Dela Torre", duration: "4:15", image: "https://e-cdns-images.dzcdn.net/images/cover/d1b73791d0bf52e05c5de6a8e0e36c5f/250x250-000000-80-0-0.jpg", audioUrl: "https://cdns-preview-2.dzcdn.net/stream/c-2e7f0f0b0f0f0f0f0f0f0f0f0f0f0f0f-8.mp3" },
      { id: 'r4', title: "Tadhana", artist: "Up Dharma Down", duration: "3:56", image: "https://e-cdns-images.dzcdn.net/images/cover/d1b73791d0bf52e05c5de6a8e0e36c5f/250x250-000000-80-0-0.jpg", audioUrl: "https://cdns-preview-2.dzcdn.net/stream/c-2e7f0f0b0f0f0f0f0f0f0f0f0f0f0f0f-8.mp3" },
    ]
  },
  {
    id: 2,
    emoji: "🕺",
    label: "Slay Mode",
    description: "Main character energy, let's go!",
    color: "#FF00FF",
    tracks: [
      { id: 'h1', title: "Tala", artist: "Sarah Geronimo", duration: "3:45", image: "https://e-cdns-images.dzcdn.net/images/cover/d1b73791d0bf52e05c5de6a8e0e36c5f/250x250-000000-80-0-0.jpg", audioUrl: "https://cdns-preview-2.dzcdn.net/stream/c-2e7f0f0b0f0f0f0f0f0f0f0f0f0f0f0f-8.mp3" },
      { id: 'h2', title: "Gento", artist: "SB19", duration: "3:30", image: "https://e-cdns-images.dzcdn.net/images/cover/d1b73791d0bf52e05c5de6a8e0e36c5f/250x250-000000-80-0-0.jpg", audioUrl: "https://cdns-preview-2.dzcdn.net/stream/c-2e7f0f0b0f0f0f0f0f0f0f0f0f0f0f0f-8.mp3" },
      { id: 'h3', title: "Pantropiko", artist: "BINI", duration: "3:20", image: "https://e-cdns-images.dzcdn.net/images/cover/d1b73791d0bf52e05c5de6a8e0e36c5f/250x250-000000-80-0-0.jpg", audioUrl: "https://cdns-preview-2.dzcdn.net/stream/c-2e7f0f0b0f0f0f0f0f0f0f0f0f0f0f0f-8.mp3" },
      { id: 'h4', title: "Salamin Salamin", artist: "BINI", duration: "3:15", image: "https://e-cdns-images.dzcdn.net/images/cover/d1b73791d0bf52e05c5de6a8e0e36c5f/250x250-000000-80-0-0.jpg", audioUrl: "https://cdns-preview-2.dzcdn.net/stream/c-2e7f0f0b0f0f0f0f0f0f0f0f0f0f0f0f-8.mp3" },
    ]
  },
  {
    id: 3,
    emoji: "☁️",
    label: "Chill",
    description: "Walang stress, good vibes only",
    color: "#00FFE0",
    tracks: [
      { id: 's1', title: "Binibini", artist: "Zack Tabudlo", duration: "3:40", image: "https://e-cdns-images.dzcdn.net/images/cover/d1b73791d0bf52e05c5de6a8e0e36c5f/250x250-000000-80-0-0.jpg", audioUrl: "https://cdns-preview-2.dzcdn.net/stream/c-2e7f0f0b0f0f0f0f0f0f0f0f0f0f0f0f-8.mp3" },
      { id: 's2', title: "Higa", artist: "Arthur Nery", duration: "4:05", image: "https://e-cdns-images.dzcdn.net/images/cover/d1b73791d0bf52e05c5de6a8e0e36c5f/250x250-000000-80-0-0.jpg", audioUrl: "https://cdns-preview-2.dzcdn.net/stream/c-2e7f0f0b0f0f0f0f0f0f0f0f0f0f0f0f-8.mp3" },
      { id: 's3', title: "Sining", artist: "Dionela", duration: "3:55", image: "https://e-cdns-images.dzcdn.net/images/cover/d1b73791d0bf52e05c5de6a8e0e36c5f/250x250-000000-80-0-0.jpg", audioUrl: "https://cdns-preview-2.dzcdn.net/stream/c-2e7f0f0b0f0f0f0f0f0f0f0f0f0f0f0f-8.mp3" },
      { id: 's4', title: "Mundo", artist: "IV of Spades", duration: "4:20", image: "https://e-cdns-images.dzcdn.net/images/cover/d1b73791d0bf52e05c5de6a8e0e36c5f/250x250-000000-80-0-0.jpg", audioUrl: "https://cdns-preview-2.dzcdn.net/stream/c-2e7f0f0b0f0f0f0f0f0f0f0f0f0f0f0f-8.mp3" },
    ]
  },
  {
    id: 4,
    emoji: "🔥",
    label: "Hype Beast",
    description: "Energy 100%, no cap fr fr",
    color: "#FFFF00",
    tracks: [
      { id: 'g1', title: "Harana", artist: "Parokya ni Edgar", duration: "4:30", image: "https://e-cdns-images.dzcdn.net/images/cover/d1b73791d0bf52e05c5de6a8e0e36c5f/250x250-000000-80-0-0.jpg", audioUrl: "https://cdns-preview-2.dzcdn.net/stream/c-2e7f0f0b0f0f0f0f0f0f0f0f0f0f0f0f-8.mp3" },
      { id: 'g2', title: "Narda", artist: "Kamikazee", duration: "3:50", image: "https://e-cdns-images.dzcdn.net/images/cover/d1b73791d0bf52e05c5de6a8e0e36c5f/250x250-000000-80-0-0.jpg", audioUrl: "https://cdns-preview-2.dzcdn.net/stream/c-2e7f0f0b0f0f0f0f0f0f0f0f0f0f0f0f-8.mp3" },
      { id: 'g3', title: "Huling Sayaw", artist: "Kamikazee", duration: "4:45", image: "https://e-cdns-images.dzcdn.net/images/cover/d1b73791d0bf52e05c5de6a8e0e36c5f/250x250-000000-80-0-0.jpg", audioUrl: "https://cdns-preview-2.dzcdn.net/stream/c-2e7f0f0b0f0f0f0f0f0f0f0f0f0f0f0f-8.mp3" },
      { id: 'g4', title: "Elesi", artist: "Rivermaya", duration: "4:15", image: "https://e-cdns-images.dzcdn.net/images/cover/d1b73791d0bf52e05c5de6a8e0e36c5f/250x250-000000-80-0-0.jpg", audioUrl: "https://cdns-preview-2.dzcdn.net/stream/c-2e7f0f0b0f0f0f0f0f0f0f0f0f0f0f0f-8.mp3" },
    ]
  },
];

const playlistImagePlaceholder = require("../../assets/images/mix1.png");

export default function VibePicker() {
  const router = useRouter();
  const { playTrack } = usePlayer();
  const [selectedMood, setSelectedMood] = useState(null);

  const handlePlayTrack = (track) => {
    // Pass the entire mood's track list as the queue context
    playTrack(track, selectedMood.tracks);

    router.push({
      pathname: "/now-playing",
      params: {
        id: track.id,
        title: track.title,
        artist: track.artist,
        image: track.image,
        audioUrl: track.audioUrl
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VibeCheck</Text>
      <Text style={styles.subtitle}>Anong trip mo? Pick your vibe to match your soundtrack.</Text>

      <ScrollView contentContainerStyle={styles.moodGrid} showsVerticalScrollIndicator={false}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.moodTile,
              selectedMood?.id === mood.id && styles.selectedMoodTile,
            ]}
            onPress={() => setSelectedMood(mood)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={styles.moodLabel}>{mood.label}</Text>
          </TouchableOpacity>
        ))}

        {/* Dynamic Result Card with Track List */}
        {selectedMood && (
          <View style={styles.resultCard}>
            <View style={styles.cardHeader}>
              <Image
                source={playlistImagePlaceholder}
                style={styles.playlistArt}
              />
              <View style={styles.resultInfo}>
                <Text style={styles.cardTitle}>{selectedMood.label} Mix</Text>
                <Text style={styles.cardSubtitle}>
                  {selectedMood.description}
                </Text>
                <Text style={styles.trackCount}>{selectedMood.tracks.length} tracks</Text>
              </View>
            </View>

            {/* Track List */}
            <View style={styles.trackList}>
              {selectedMood.tracks.map((track, index) => (
                <TouchableOpacity
                  key={track.id}
                  style={styles.trackItem}
                  onPress={() => handlePlayTrack(track)}
                  activeOpacity={0.7}
                >
                  <View style={styles.trackNumber}>
                    <Text style={styles.trackNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.trackInfo}>
                    <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                    <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
                  </View>
                  <Text style={styles.trackDuration}>{track.duration}</Text>
                  <Ionicons name="play-circle" size={28} color={selectedMood.color} />
                </TouchableOpacity>
              ))}
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
    elevation: 5,
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
  resultCard: {
    width: "100%",
    backgroundColor: "#151821",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 20,
  },
  playlistArt: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 15,
  },
  resultInfo: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: "#A0A0A0",
    fontSize: 13,
    marginBottom: 4,
  },
  trackCount: {
    color: "#00FFE0",
    fontSize: 12,
    fontWeight: "600",
  },
  trackList: {
    marginTop: 10,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  trackNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  trackNumberText: {
    color: "#00FFE0",
    fontSize: 12,
    fontWeight: "600",
  },
  trackInfo: {
    flex: 1,
    marginRight: 10,
  },
  trackTitle: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  trackArtist: {
    color: "#A0A0A0",
    fontSize: 13,
  },
  trackDuration: {
    color: "#A0A0A0",
    fontSize: 12,
    marginRight: 10,
  },
});