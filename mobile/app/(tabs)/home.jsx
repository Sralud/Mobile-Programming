import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";

// Separate tracks for Daily Beats
const dailyBeats = [
  { id: "1", title: "Binding Lights", artist: "The Weekend", image: require("../../assets/images/TheWeekend.jpg"), genre: "Synthwave" },
  { id: "2", title: "Watermelon Sugar", artist: "Harry Styles", image: require("../../assets/images/harrystyles.jpg"), genre: "Chillhop" },
  { id: "3", title: "Levitating", artist: "Dua Lipa", image: require("../../assets/images/dualipa3.jpg"), genre: "Indie Pop" },
];

// Separate tracks for Fresh Finds
const freshFinds = [
  { id: "4", title: "Thank U, Next", artist: "Ariana Grande", image: require("../../assets/images/arianagrande.jpg"), genre: "Synthpop" },
  { id: "5", title: "Shape of U", artist: "Ed Sheeran", image: require("../../assets/images/edsheeran.jpg"), genre: "Pop Rock" },
  { id: "6", title: "Espresso", artist: "Sabrina Carpenter", image: require("../../assets/images/sabrina.jpg"), genre: "Pop Punk" },
];

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Daily Beats</Text>
      {dailyBeats.map((item) => (
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
        data={freshFinds}
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
    shadowRadius: 4,
    elevation: 5,
    shadowColor: "#00FFE0",
    shadowOpacity: 0.15,
  },
  thumb: { width: 55, height: 55, borderRadius: 10, marginRight: 14 },
  title: { color: "#fff", fontWeight: "600", fontSize: 15 },
  artist: { color: "#00FFE0", fontSize: 12 },
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
    shadowRadius: 6,
    elevation: 5,
    shadowColor: "#00FFE0",
    shadowOpacity: 0.15,
  },
  image: { width: "100%", height: 130 },
  cardFooter: { padding: 10 },
  cardTitle: { color: "#fff", fontWeight: "600", fontSize: 14 },
  cardArtist: { color: "#00FFE0", fontSize: 12, marginTop: 2 },
});