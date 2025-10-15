import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/home"); // for the home loading
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/imageIndex1.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.appName}>
        <Text style={{ color: "#00ff88" }}>R</Text>
        <Text style={{ color: "#fff" }}>&</Text>
        <Text style={{ color: "#00ff88" }}>G</Text>
      </Text>
      <Text style={styles.loadingText}>Setting the mood...</Text>
      <ActivityIndicator size="large" color="#00ff88" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  appName: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
  },
});