import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const library = [
  { id: "1", title: "One Direction", subtitle: "127 tracks", icon: require("../../assets/images/onedirection.jpg") },
  { id: "2", title: "Golden Hour Mix", subtitle: "47 tracks", icon: require("../../assets/images/goldenhour.jpg") },
  { id: "3", title: "Drive & Flow", subtitle: "23 tracks", icon: require("../../assets/images/mix3.png") },
];

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState();
  const [activePreviewUrl, setActivePreviewUrl] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.log("Error loading user", error);
      }
    };
    loadUser();
  }, []);

  // Function to search Jamendo API for full songs
  const searchMusic = async (text) => {
    setSearchQuery(text);
    if (text.length > 2) {
      setLoading(true);
      try {
        // Using Jamendo API for full free tracks
        // We use a public client_id for testing (demo)
        const response = await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=c9720322&format=jsonpretty&limit=10&search=${text}`);
        const data = await response.json();
        setSearchResults(data.results);
      } catch (error) {
        console.log("Error searching music", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Function to play song
  const playSong = async (audioUrl) => {
    if (sound) {
      await sound.unloadAsync();
    }

    if (activePreviewUrl === audioUrl) {
      // If tapping the same song, stop it
      setActivePreviewUrl(null);
      return;
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      setActivePreviewUrl(audioUrl);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setActivePreviewUrl(null);
        }
      });
    } catch (error) {
      console.log("Error playing sound", error);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/mix3.png")}
          style={styles.profilePic}
        />
        <View>
          <Text style={styles.welcome}>Welcome Back,</Text>
          <Text style={styles.username}>{user?.username || "Guest User"} 🎵</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search songs, artists..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={searchMusic}
        />
        {loading && <ActivityIndicator size="small" color="#00FFE0" />}
      </View>


      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Search Results */}
        {searchResults.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {searchResults.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.resultItem}
                onPress={() => playSong(item.audio)}
              >
                <Image source={{ uri: item.image }} style={styles.thumb} />
                <View style={styles.info}>
                  <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.subtitle}>{item.artist_name}</Text>
                </View>
                <Ionicons
                  name={activePreviewUrl === item.audio ? "pause-circle" : "play-circle"}
                  size={32}
                  color="#00FFE0"
                />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <>
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
          </>
        )}
      </ScrollView>
    </View>
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
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#151821",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#151821",
    marginBottom: 10,
    borderRadius: 12,
    padding: 10,
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
});
