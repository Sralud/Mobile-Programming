import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

export default function NowPlaying() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState();
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract track data from params
  const track = {
    id: params.id,
    title: params.title || "Unknown Track",
    artist: params.artist || "Unknown Artist",
    image: params.image,
    audioUrl: params.audioUrl
  };

  // Debug: Log the received params
  console.log("Now Playing - Received params:", params);
  console.log("Now Playing - Track object:", track);

  // Load and play audio when component mounts
  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Stop audio when leaving this screen
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (sound) {
          sound.stopAsync().catch(() => { });
          sound.unloadAsync().catch(() => { });
        }
      };
    }, [sound])
  );

  const loadAudio = async () => {
    try {
      // Check if audioUrl exists before attempting to load
      if (!track.audioUrl) {
        console.log("No audio URL provided");
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.log("Error loading audio:", error);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.log("Error toggling playback:", error);
    }
  };

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      {/*Collapse Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          if (sound) sound.unloadAsync().catch(() => { });
          router.back();
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-down" size={28} color="#00FFE0" />
      </TouchableOpacity>

      {/* 🎵 Album Art */}
      <View style={styles.artContainer}>
        {track.image ? (
          <Image
            source={{ uri: track.image }}
            style={styles.albumArt}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderArt}>
            <Ionicons name="musical-notes" size={80} color="#00FFE0" />
          </View>
        )}
      </View>

      {/* Song Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{track.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{track.artist}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.time}>{formatTime(position)}</Text>
          <Text style={styles.time}>{formatTime(duration)}</Text>
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
          onPress={togglePlayPause}
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
    boxShadow: "0px 0px 10px rgba(0, 255, 224, 0.3)",
    elevation: 8,
  },
  albumArt: {
    width: "100%",
    height: "90%",
  },
  placeholderArt: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1F2330",
    justifyContent: "center",
    alignItems: "center",
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
    boxShadow: "0px 0px 10px rgba(0, 255, 224, 0.4)",
    elevation: 10,
  },
});