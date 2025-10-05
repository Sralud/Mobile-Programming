import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";

const recentlyPlayed = [
  { id: "1", title: "Blinding Lights", artist: "The Weeknd", image: require("../../assets/images/mix1.png") },
  { id: "2", title: "Watermelon Sugar", artist: "Harry Styles", image: require("../../assets/images/mix2.png") },
  { id: "3", title: "Levitating", artist: "Dua Lipa", image: require("../../assets/images/mix3.png") },
];

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recently Played</Text>
      {recentlyPlayed.map((item) => (
        <TouchableOpacity key={item.id} style={styles.songItem}>
          <Image source={item.image} style={styles.thumb} />
          <View style={{ flex: 1 }}>
            <Text style={styles.song}>{item.title}</Text>
            <Text style={styles.artist}>{item.artist}</Text>
          </View>
          <Text style={styles.duration}>3:20</Text>
        </TouchableOpacity>
      ))}

      <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Made for You</Text>
      <FlatList
        horizontal
        data={recentlyPlayed}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1115", padding: 16 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 10, marginTop: 40 },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#171923",
    borderRadius: 12,
    padding: 10,
  },
  thumb: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  song: { color: "#fff", fontWeight: "600" },
  artist: { color: "#9AA4B2", fontSize: 12 },
  duration: { color: "#9AA4B2", fontSize: 12 },
  card: {
    marginRight: 16,
    width: 140,
    backgroundColor: "#171923",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: { width: "100%", height: 120 },
  cardText: { color: "#fff", padding: 8, fontWeight: "600" },
});