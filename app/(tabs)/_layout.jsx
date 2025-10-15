import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Pressable, View, Text, TouchableOpacity, StyleSheet, Image, } from "react-native";

export default function TabsLayout() {
  const router = useRouter();

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
            shadowOpacity: 0,
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
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search-outline" size={size} color={color} />
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
          name="vibe"
          options={{
            title: "Vibe",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="hand-peace-o" size={size} color={color} />
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
      </Tabs>

      {/*Floating Mini Music Player*/}
      <TouchableOpacity
        style={styles.miniPlayer}
        activeOpacity={0.9}
        onPress={() => router.push("/now-playing")}
      >
        <View style={styles.info}>
          {/* Small album art*/}
          <Image
            source={require("../../assets/images/imageIndex1.png")}
            style={styles.albumArt}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>18</Text>
            <Text style={styles.artist}>One Direction</Text>
          </View>
        </View>

        <Ionicons name="play" size={28} color="#00FFE0" />
      </TouchableOpacity>
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
    shadowColor: "#00FFE0",
    shadowOpacity: 0.15,
    shadowRadius: 6,
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