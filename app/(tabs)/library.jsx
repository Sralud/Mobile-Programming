import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";

const library = [
  { id: "1", title: "Liked Songs", subtitle: "127 songs", icon: require("../../assets/images/mix1.png") },
  { id: "2", title: "My Favorites", subtitle: "47 songs", icon: require("../../assets/images/mix2.png") },
  { id: "3", title: "Road Trip", subtitle: "23 songs", icon: require("../../assets/images/mix3.png") },
];

const Library = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Library</Text>

      {library.map((item) => (
        <TouchableOpacity key={item.id} style={styles.libItem}>
          <Image source={item.icon} style={styles.thumb} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Library;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1115", padding: 16 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 10, marginTop: 40 },
  libItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#171923",
    borderRadius: 12,
    padding: 10,
  },
  thumb: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  title: { color: "#fff", fontWeight: "600" },
  subtitle: { color: "#9AA4B2", fontSize: 12 },
});