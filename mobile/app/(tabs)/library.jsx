import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import React from "react";

const library = [
  { id: "1", title: "One Direction", subtitle: "127 tracks", icon: require("../../assets/images/onedirection.jpg") },
  { id: "2", title: "Golden Hour Mix", subtitle: "47 tracks", icon: require("../../assets/images/goldenhour.jpg") },
  { id: "3", title: "Drive & Flow", subtitle: "23 tracks", icon: require("../../assets/images/mix3.png") },
];

const recentlyPlayed = [
  { id: "1", title: "City Lights", artist: "Luna Vale", cover: require("../../assets/images/mix1.png") },
  { id: "2", title: "Riff Off", artist: "Pitch Perfect", cover: require("../../assets/images/pitchperfect.jpg") },
  { id: "3", title: "Midnight Echo", artist: "Nova Gray", cover: require("../../assets/images/night.jpg") },
  { id: "4", title: "Summer Bloom", artist: "Sky Nova", cover: require("../../assets/images/bloom.jpg") },
];

const Library = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 70 }}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/mix3.png")}
          style={styles.profilePic}
        />
        <View>
          <Text style={styles.welcome}>Welcome Back,</Text>
          <Text style={styles.username}>Rhoii 🎵</Text>
        </View>
      </View>

      {/* Your Sound Archive */}
      <Text style={styles.sectionTitle}>Your Sound Archive</Text>

      {library.map((item) => (
        <TouchableOpacity key={item.id} style={styles.libItem} activeOpacity={0.85}>
          <Image source={item.icon} style={styles.thumb} />
          <View style={styles.info}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
          <View style={styles.tagContainer}>
            <Text style={styles.tag}>Playlist</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Recently Played */}
      <Text style={[styles.sectionTitle, { marginTop: 0.5}]}>Recently Played</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recentScroll}
      >
        {recentlyPlayed.map((song) => (
          <TouchableOpacity key={song.id} style={styles.recentCard} activeOpacity={0.85}>
            <Image source={song.cover} style={styles.recentCover} />
            <Text style={styles.songTitle}>{song.title}</Text>
            <Text style={styles.songArtist}>{song.artist}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

export default Library;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0E14",
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  // Header Section
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  profilePic: {
    width: 55,
    height: 55,
    borderRadius: 50,
    marginRight: 14,
    borderWidth: 2,
    borderColor: "#00FFE0",
  },
  welcome: {
    color: "#9AA4B2",
    fontSize: 13,
  },
  username: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  // Section titles
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },

  // Library items
  libItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#151821",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    shadowColor: "#00FFE0",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 14,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 2,
  },
  subtitle: {
    color: "#00FFE0",
    fontSize: 13,
  },
  tagContainer: {
    backgroundColor: "rgba(0,255,224,0.08)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tag: {
    color: "#00FFE0",
    fontSize: 12,
    fontWeight: "600",
  },

  // Recently Played Section
  recentScroll: {
    paddingLeft: 2,
    paddingRight: 20,
    paddingBottom: 40,
    gap: 18,
  },
  recentCard: {
    width: 130,
    backgroundColor: "#151821",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    shadowColor: "#00FFE0",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recentCover: {
    width: 100,
    height: 100,
    borderRadius: 14,
    marginBottom: 10,
  },
  songTitle: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  songArtist: {
    color: "#00FFE0",
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
});
