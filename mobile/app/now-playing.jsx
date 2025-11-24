import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function NowPlaying() {
  const [isPlaying, setIsPlaying] = useState(true);
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/*Collapse Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-down" size={28} color="#00FFE0" />
      </TouchableOpacity>

      {/* 🎵 Album Art */}
      <View style={styles.artContainer}>
        <Image
          source={require("../assets/images/onedirection.jpg")}
          style={styles.albumArt}
          resizeMode="cover" // ensures it fills perfectly without overlap
        />
      </View>

      {/* Song Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>18</Text>
        <Text style={styles.artist}>One Direction</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: "45%" }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.time}>1:25</Text>
          <Text style={styles.time}>3:20</Text>
        </View>

        {/* Bottom Options */}
        <View style={styles.bottomRow}>
          <TouchableOpacity>
            <Ionicons name="shuffle" size={28} color="#00FFE0" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="repeat" size={28} color="#00FFE0" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={28} color="#00FFE0" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity>
          <Ionicons name="play-skip-back" size={40} color="#00FFE0" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={45}
            color="#0B0E14"
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="play-skip-forward" size={40} color="#00FFE0" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0E14",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  closeButton: {
    position: "absolute",
    top: 45,
    left: 25,
    zIndex: 10,
    backgroundColor: "rgba(21, 24, 33, 0.8)",
    borderRadius: 20,
    padding: 5,
  },
  artContainer: {
    width: 280,
    height: 280,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    marginBottom: 25,
    shadowColor: "#00FFE0",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  albumArt: {
    width: "100%",
    height: "90%",
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  artist: {
    fontSize: 16,
    color: "#00FFE0",
  },
  progressContainer: {
    width: "100%",
    marginTop: 20,
  },
  progressBarBackground: {
    height: 5,
    backgroundColor: "#1F2330",
    borderRadius: 5,
  },
  progressBarFill: {
    height: 5,
    backgroundColor: "#00FFE0",
    borderRadius: 5,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 10,
  },
  time: {
    color: "#9AA4B2",
    fontSize: 12,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginTop: 12,
    marginBottom: 25,
    alignSelf: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    alignItems: "center",
    marginTop: 10,
  },
  playButton: {
    backgroundColor: "#00FFE0",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00FFE0",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
});