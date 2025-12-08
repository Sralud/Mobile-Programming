import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from 'expo-av';
import { useRouter } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';

const DEEZER_API = "https://api.deezer.com";

const Home = () => {
  const router = useRouter();
  const [dailyBeats, setDailyBeats] = useState([]);
  const [freshFinds, setFreshFinds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sound, setSound] = useState();
  const [playingTrackId, setPlayingTrackId] = useState(null);

  const fetchDailyBeats = async () => {
    try {
      const response = await fetch(`${DEEZER_API}/chart/0/tracks?limit=4`);
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setDailyBeats(data.data.map(track => ({
          id: track.id.toString(),
          title: track.title,
          artist: track.artist.name,
          image: track.album.cover_medium,
          audioUrl: track.preview
        })));
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const fetchFreshFinds = async () => {
    try {
      const response = await fetch(`${DEEZER_API}/playlist/1313621735/tracks?limit=3`);
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setFreshFinds(data.data.map(track => ({
          id: track.id.toString(),
          title: track.title,
          artist: track.artist.name,
          image: track.album.cover_medium,
          audioUrl: track.preview
        })));
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const playAudio = async (track) => {
    try {
      if (playingTrackId === track.id) {
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
        setSound(null);
        setPlayingTrackId(null);
        return;
      }
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      setPlayingTrackId(track.id);
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) setPlayingTrackId(null);
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  // Stop audio when leaving this tab
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (sound) {
          sound.unloadAsync();
          setPlayingTrackId(null);
        }
      };
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchDailyBeats(), fetchFreshFinds()]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#00FFE0" />
        <Text style={{ color: "#666", marginTop: 10 }}>Loading tracks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>

      <FlatList
        data={[{ key: "content" }]}
        renderItem={() => (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Daily Beats</Text>
              <TouchableOpacity onPress={() => router.push("/all-tracks?type=daily")}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {dailyBeats.map((item) => (
              <TouchableOpacity key={item.id} style={styles.trackItem} onPress={() => playAudio(item)}>
                <Image source={{ uri: item.image }} style={styles.thumb} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
                </View>
                <View style={styles.playButton}>
                  <Ionicons name={playingTrackId === item.id ? "pause" : "play"} size={15} color="#0B0E14" />
                </View>
              </TouchableOpacity>
            ))}

            <View style={[styles.sectionHeader, { marginTop: 25 }]}>
              <Text style={styles.sectionTitle}>Fresh Finds</Text>
              <TouchableOpacity onPress={() => router.push("/all-tracks?type=fresh")}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={freshFinds}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={() => playAudio(item)}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View style={styles.playIconCorner}>
                      <Ionicons name={playingTrackId === item.id ? "pause" : "play"} size={20} color="#00FFE0" />
                    </View>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.cardArtist} numberOfLines={1}>{item.artist}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
            />
          </>
        )}
        keyExtractor={(item) => item.key}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FFE0" colors={["#00FFE0"]} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E14", padding: 16 },
  header: { marginTop: 40, marginBottom: 10 },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "700" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10, marginTop: 10 },
  sectionTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  seeAllText: { color: "#00FFE0", fontSize: 14, fontWeight: "600" },
  trackItem: { flexDirection: "row", alignItems: "center", marginBottom: 12, backgroundColor: "#151821", borderRadius: 14, padding: 12, shadowColor: "#00FFE0", shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  thumb: { width: 55, height: 55, borderRadius: 10, marginRight: 14, backgroundColor: "#1F2330" },
  title: { color: "#fff", fontWeight: "600", fontSize: 15 },
  artist: { color: "#00FFE0", fontSize: 12 },
  playButton: { backgroundColor: "#00FFE0", width: 25, height: 25, borderRadius: 16, justifyContent: "center", alignItems: "center", shadowColor: "#00FFE0", shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 },
  card: { marginRight: 16, width: 150, backgroundColor: "#151821", borderRadius: 14, overflow: "hidden", shadowColor: "#00FFE0", shadowOpacity: 0.15, shadowRadius: 6, elevation: 3 },
  imageContainer: { position: "relative" },
  image: { width: "100%", height: 130, backgroundColor: "#1F2330" },
  playIconCorner: { position: "absolute", bottom: 8, right: 8, backgroundColor: "rgba(11, 14, 20, 0.8)", padding: 6, borderRadius: 8 },
  cardFooter: { padding: 10 },
  cardTitle: { color: "#fff", fontWeight: "600", fontSize: 14 },
  cardArtist: { color: "#00FFE0", fontSize: 12, marginTop: 2 },
});