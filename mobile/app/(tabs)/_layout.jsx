import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Pressable, View, Text, TouchableOpacity, StyleSheet, Image, } from "react-native";
import { usePlayer } from "../contexts/PlayerContext";

export default function TabsLayout() {
  const router = useRouter();
  const { currentTrack, isPlaying, togglePlayPause } = usePlayer();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "grey",
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: "black",
            height: 90,
            paddingBottom: 30,
            paddingTop: 10,
            backgroundColor: "#0B0E14",
            elevation: 0,
            boxShadow: "none",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            color: "#fff",
          },
          tabBarButton: (props) => (
            <Pressable
              {...props}
              android_ripple={null}
              style={({ pressed }) => [
                { flex: 1, alignItems: "center", justifyContent: "center" },
                pressed && { opacity: 0.8 },
              ]}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: "Library",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="library-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="sparkles-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="vibe"
          options={{
            title: "Vibe",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="hand-peace-o" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user-o" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      {/*Floating Mini Music Player - Only show when there's a current track*/}
      {currentTrack && (
        <TouchableOpacity
          style={styles.miniPlayer}
          activeOpacity={0.9}
          onPress={() => router.push({
            pathname: "/now-playing",
            params: {
              id: currentTrack.id,
              title: currentTrack.title,
              artist: currentTrack.artist,
              image: currentTrack.image,
              audioUrl: currentTrack.audioUrl
            }
          })}
        >
          <View style={styles.info}>
            {/* Small album art*/}
            {currentTrack.image ? (
              <Image
                source={{ uri: currentTrack.image }}
                style={styles.albumArt}
              />
            ) : (
              <View style={[styles.albumArt, { backgroundColor: "#1F2330", justifyContent: "center", alignItems: "center" }]}>
                <Ionicons name="musical-notes" size={20} color="#00FFE0" />
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
              <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={28}
              color="#00FFE0"
            />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  miniPlayer: {
    position: "absolute",
    bottom: 95,
    left: 20,
    right: 20,
    backgroundColor: "#151821",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0px 0px 6px rgba(0, 255, 224, 0.15)",
    elevation: 6,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  albumArt: {
    width: 45,
    height: 45,
    borderRadius: 10,
    marginRight: 12,
  },
  title: { color: "#fff", fontWeight: "700", fontSize: 14 },
  artist: { color: "#00FFE0", fontSize: 12, marginTop: 2 },
});