import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Dimensions
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from 'expo-av';
import { useRouter } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { usePlayer } from '../contexts/PlayerContext';

const DEEZER_API = "https://api.deezer.com";
const { width } = Dimensions.get('window');

const Home = () => {
  const router = useRouter();
  const { setCurrentTrack } = usePlayer();
  const [dailyBeats, setDailyBeats] = useState([]);
  const [freshFinds, setFreshFinds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sound, setSound] = useState();
  const [playingTrackId, setPlayingTrackId] = useState(null);

  // Animation values
  const headerAnimation = useRef(new Animated.Value(0)).current;

  // Header entrance animation
  useEffect(() => {
    Animated.spring(headerAnimation, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchDailyBeats = async () => {
    try {
      const response = await fetch(`${DEEZER_API}/chart/0/tracks?limit=3`);
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
      const response = await fetch(`${DEEZER_API}/playlist/1313621735/tracks?limit=10`);
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
      // Set the current track in global context
      setCurrentTrack(track);

      // Navigate to now-playing screen with track data
      router.push({
        pathname: "/now-playing",
        params: {
          id: track.id,
          title: track.title,
          artist: track.artist,
          image: track.image,
          audioUrl: track.audioUrl
        }
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
      <View style={[styles.container, styles.loadingContainer]}>
        <View style={styles.loadingContent}>
          <View>
            <LinearGradient
              colors={['#00FFE0', '#00D4FF', '#0099FF']}
              style={styles.loadingGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="musical-notes" size={40} color="#0B0E14" />
            </LinearGradient>
          </View>
          <Text style={styles.loadingText}>Discovering amazing tracks...</Text>
          <ActivityIndicator size="small" color="#00FFE0" style={{ marginTop: 12 }} />
        </View>
      </View>
    );
  }

  const TrackItem = ({ item, index }) => {
    const isPlaying = playingTrackId === item.id;

    return (
      <View>
        <TouchableOpacity
          style={styles.trackItem}
          onPress={() => playAudio(item)}
          activeOpacity={0.8}
        >
          <View style={styles.trackImageContainer}>
            <Image source={{ uri: item.image }} style={styles.thumb} />
            <LinearGradient
              colors={['transparent', 'rgba(0, 255, 224, 0.2)']}
              style={styles.imageGradient}
            />
          </View>

          <View style={styles.trackInfo}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <View style={styles.artistContainer}>
              <Ionicons name="person-outline" size={12} color="#00FFE0" />
              <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
            </View>
          </View>

          <View style={styles.playButton}>
            <LinearGradient
              colors={isPlaying ? ['#00FFE0', '#00D4FF'] : ['#00FFE0', '#00FFE0']}
              style={styles.playButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={18}
                color="#0B0E14"
                style={{ marginLeft: isPlaying ? 0 : 2 }}
              />
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const FreshFindCard = ({ item, index }) => {
    const isPlaying = playingTrackId === item.id;

    return (
      <View>
        <TouchableOpacity
          style={styles.card}
          onPress={() => playAudio(item)}
          activeOpacity={0.9}
        >
          <View style={styles.cardImageContainer}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <LinearGradient
              colors={['transparent', 'rgba(11, 14, 20, 0.95)']}
              style={styles.cardGradientOverlay}
            />

            <View style={styles.cardPlayIcon}>
              <LinearGradient
                colors={['rgba(0, 255, 224, 0.3)', 'rgba(0, 212, 255, 0.3)']}
                style={styles.cardPlayIconBg}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={24}
                  color="#00FFE0"
                  style={{ marginLeft: isPlaying ? 0 : 3 }}
                />
              </LinearGradient>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <View style={styles.cardBottomRow}>
              <Text style={styles.cardArtist} numberOfLines={1}>{item.artist}</Text>
              {isPlaying && (
                <View style={styles.nowPlayingBadge}>
                  <View style={styles.soundWave}>
                    <View style={[styles.bar, styles.bar1]} />
                    <View style={[styles.bar, styles.bar2]} />
                    <View style={[styles.bar, styles.bar3]} />
                  </View>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Animated Header with Gradient */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnimation,
            transform: [{
              translateY: headerAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
              })
            }]
          }
        ]}
      >
        <LinearGradient
          colors={['rgba(0, 255, 224, 0.1)', 'transparent']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerGreeting}>Welcome back</Text>
              <Text style={styles.headerTitle}>Discover Music</Text>
            </View>
            <View style={styles.headerIconContainer}>
              <LinearGradient
                colors={['#00FFE0', '#00D4FF']}
                style={styles.headerIcon}
              >
                <Ionicons name="musical-notes" size={24} color="#0B0E14" />
              </LinearGradient>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <FlatList
        data={[{ key: "content" }]}
        renderItem={() => (
          <>
            {/* Daily Beats Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Your Daily Beats</Text>
                  <Text style={styles.sectionSubtitle}>Trending tracks just for you</Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push("/all-tracks?type=daily")}
                  style={styles.seeAllButton}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                  <Ionicons name="arrow-forward" size={14} color="#00FFE0" />
                </TouchableOpacity>
              </View>

              {dailyBeats.map((item, index) => (
                <TrackItem key={item.id} item={item} index={index} />
              ))}
            </View>

            {/* Fresh Finds Section */}
            <View style={[styles.section, styles.freshFindsSection]}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Fresh Finds</Text>
                  <Text style={styles.sectionSubtitle}>New releases to explore</Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push("/all-tracks?type=fresh")}
                  style={styles.seeAllButton}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                  <Ionicons name="arrow-forward" size={14} color="#00FFE0" />
                </TouchableOpacity>
              </View>

              <FlatList
                horizontal
                data={freshFinds}
                renderItem={({ item, index }) => (
                  <FreshFindCard item={item} index={index} />
                )}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.freshFindsList}
              />
            </View>
          </>
        )}
        keyExtractor={(item) => item.key}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00FFE0"
            colors={["#00FFE0"]}
            progressBackgroundColor="#151821"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0E14",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
  },
  loadingGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  scrollContent: {
    paddingBottom: 30,
  },

  // Header Styles
  header: {
    marginTop: 50,
    marginBottom: 20,
  },
  headerGradient: {
    borderRadius: 20,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerGreeting: {
    color: "#00FFE0",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerIconContainer: {
    shadowColor: "#00FFE0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  // Section Styles
  section: {
    marginBottom: 30,
  },
  freshFindsSection: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    color: "#666",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 255, 224, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  seeAllText: {
    color: "#00FFE0",
    fontSize: 13,
    fontWeight: "700",
  },

  // Track Item Styles
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal: 16,
    backgroundColor: "#151821",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 224, 0.1)",
    shadowColor: "#00FFE0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  trackImageContainer: {
    position: "relative",
    marginRight: 14,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#1F2330",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  trackInfo: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  artistContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  artist: {
    color: "#00FFE0",
    fontSize: 13,
    fontWeight: "500",
  },
  playButton: {
    shadowColor: "#00FFE0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  playButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  // Fresh Finds Card Styles
  freshFindsList: {
    paddingHorizontal: 16,
  },
  card: {
    marginRight: 16,
    width: width * 0.45,
    backgroundColor: "#151821",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 224, 0.15)",
    shadowColor: "#00FFE0",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  cardImageContainer: {
    position: "relative",
    width: "100%",
    height: width * 0.45,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1F2330",
  },
  cardGradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
  },
  cardPlayIcon: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  cardPlayIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(11, 14, 20, 0.6)",
    borderWidth: 2,
    borderColor: "rgba(0, 255, 224, 0.3)",
  },
  cardContent: {
    padding: 14,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  cardArtist: {
    color: "#00FFE0",
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  nowPlayingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 255, 224, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  soundWave: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  bar: {
    width: 2,
    backgroundColor: "#00FFE0",
    borderRadius: 1,
  },
  bar1: {
    height: 8,
  },
  bar2: {
    height: 12,
  },
  bar3: {
    height: 6,
  },
  nowPlayingText: {
    color: "#00FFE0",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});