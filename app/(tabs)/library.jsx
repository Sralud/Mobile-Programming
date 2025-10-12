import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";

const library = [
  { id: "1", title: "Echo Memories", subtitle: "127 tracks", icon: require("../../assets/images/mix1.png") },
  { id: "2", title: "Golden Hour Mix", subtitle: "47 tracks", icon: require("../../assets/images/mix2.png") },
  { id: "3", title: "Drive & Flow", subtitle: "23 tracks", icon: require("../../assets/images/mix3.png") },
];

const Library = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Sound Archive</Text>

      {library.map((item) => (
        <TouchableOpacity key={item.id} style={styles.libItem} activeOpacity={0.8}>
          <Image source={item.icon} style={styles.thumb} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
          <Text style={styles.tag}>Playlist</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Library;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E14", padding: 16 },
  sectionTitle: { 
    color: "#fff", 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 16, 
    marginTop: 40 
  },
  libItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    backgroundColor: "#151821",
    borderRadius: 14,
    padding: 12,
    shadowColor: "#00FFE0",
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  thumb: { width: 55, height: 55, borderRadius: 10, marginRight: 14 },
  title: { color: "#fff", fontWeight: "600", fontSize: 15 },
  subtitle: { color: "#9AA4B2", fontSize: 12, marginTop: 2 },
  tag: {
    color: "#00FFE0",
    fontSize: 11,
    fontWeight: "600",
    backgroundColor: "rgba(0,255,224,0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
