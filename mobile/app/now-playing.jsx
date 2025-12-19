import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePlayer } from './contexts/PlayerContext';
import API from '../config/api';

// Inside component
useEffect(() => {
  // Check if current track is liked
  const checkLikeStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (userData && track) {
        const parsedUser = JSON.parse(userData);
        if (token) {
          const response = await fetch(`${API.BASE_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const remoteUser = await response.json();
            setUser(remoteUser);
            const liked = remoteUser.likedSongs?.some(s => s.id === track.id.toString());
            setIsLiked(!!liked);
          }
        }
      }
    } catch (e) {
      console.log("Error checking like status", e);
    }
  };

  checkLikeStatus();
}, [currentTrack]);

const toggleLike = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    const response = await fetch(`${API.BASE_URL}/api/users/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id: track.id,
        title: track.title,
        artist: track.artist,
        image: track.image,
        audioUrl: track.audioUrl
      })
    });

    if (response.ok) {
      setIsLiked(!isLiked);
    }
  } catch (e) {
    console.log("Error toggling like", e);
  }
};

// Pause playback when leaving the now-playing screen
useEffect(() => {
  return () => {
    // Cleanup: pause when component unmounts (user navigates back)
    if (soundRef.current && isPlayingRef.current) {
      soundRef.current.pauseAsync().catch(() => { });
    }
  };
}, []); // Empty dependency array - only runs on mount/unmount



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
      onPress={() => router.back()}
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
        <TouchableOpacity onPress={toggleShuffle}>
          <Ionicons
            name={isShuffling ? "shuffle" : "shuffle-outline"}
            size={28}
            color={isShuffling ? "#00FFE0" : "#666"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleRepeat}>
          <Ionicons
            name={repeatMode === 'one' ? "repeat" : "repeat-outline"}
            size={28}
            color={repeatMode !== 'off' ? "#00FFE0" : "#666"}
          />
          {repeatMode === 'one' && (
            <View style={styles.repeatBadge}>
              <Text style={styles.repeatOneText}>1</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleLike}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={28}
            color={isLiked ? "#00FFE0" : "#00FFE0"}
          />
        </TouchableOpacity>
      </View>
    </View>

    {/* Controls */}
    <View style={styles.controls}>
      <TouchableOpacity onPress={playPrevious}>
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

      <TouchableOpacity onPress={playNext}>
        <Ionicons name="play-skip-forward" size={40} color="#00FFE0" />
      </TouchableOpacity>
    </View>
  </View>
);

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
  repeatBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#00FFE0",
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  repeatOneText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#0B0E14",
  },
});