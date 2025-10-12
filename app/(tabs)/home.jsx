import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";

const tracks = [
  { id: "1", title: "Neon Skies", artist: "Nova Gray", image: require("../../assets/images/mix1.png"), genre: "Synthwave" },
  { id: "2", title: "K-Pop", artist: "Demon Hunter", image: require("../../assets/images/mix2.png"), genre: "Chillhop" },
  { id: "3", title: "Eclipse", artist: "Luna Vale", image: require("../../assets/images/mix3.png"), genre: "Indie Pop" },
];

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Daily Beats</Text>
      {tracks.map((item) => (
        <TouchableOpacity key={item.id} style={styles.trackItem}>
          <Image source={item.image} style={styles.thumb} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.artist}>{item.artist}</Text>
          </View>
          <Text style={styles.genreTag}>{item.genre}</Text>
        </TouchableOpacity>
      ))}

      <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Fresh Finds</Text>
      <FlatList
        horizontal
        data={tracks}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.cardFooter}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardArtist}>{item.artist}</Text>
            </View>
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
  container: { flex: 1, backgroundColor: "#0B0E14", padding: 16 },
  sectionTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 10, marginTop: 40 },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#151821",
    borderRadius: 14,
    padding: 12,
    shadowColor: "#00FFE0",
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  thumb: { width: 55, height: 55, borderRadius: 10, marginRight: 14 },
  title: { color: "#fff", fontWeight: "600", fontSize: 15 },
  artist: { color: "#9AA4B2", fontSize: 12 },
  genreTag: {
    color: "#00FFE0",
    fontSize: 11,
    fontWeight: "500",
    backgroundColor: "rgba(0,255,224,0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  card: {
    marginRight: 16,
    width: 150,
    backgroundColor: "#151821",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#00FFE0",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  image: { width: "100%", height: 130 },
  cardFooter: { padding: 10 },
  cardTitle: { color: "#fff", fontWeight: "600", fontSize: 14 },
  cardArtist: { color: "#9AA4B2", fontSize: 12, marginTop: 2 },
});
