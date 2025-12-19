import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from 'expo-av';
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { usePlayer } from './contexts/PlayerContext';

const DEEZER_API = "https://api.deezer.com";

const AllTracks = () => {
    const router = useRouter();
    const { type } = useLocalSearchParams();
    const { playTrack } = usePlayer();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTracks = async () => {
        try {
            setLoading(true);
            let url;
            if (type === "daily") {
                url = `${DEEZER_API}/chart/0/tracks?limit=20`;
            } else {
                url = `${DEEZER_API}/playlist/1313621735/tracks?limit=20`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                setTracks(data.data.map(track => ({
                    id: track.id.toString(),
                    title: track.title,
                    artist: track.artist.name,
                    image: track.album.cover_medium,
                    audioUrl: track.preview
                })));
            }
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const playAudio = async (track) => {
        try {
            playTrack(track, tracks);

            router.push({
                pathname: "/now-playing",
                params: track
            });
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        fetchTracks();
    }, [type]);

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
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#00FFE0" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {type === "daily" ? "Daily Beats" : "Fresh Finds"}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={tracks}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.trackItem} onPress={() => playAudio(item)}>
                        <Image source={{ uri: item.image }} style={styles.thumb} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
                        </View>
                        <View style={styles.playButton}>
                            <Ionicons name={playingTrackId === item.id ? "pause" : "play"} size={16} color="#0B0E14" />
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

export default AllTracks;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0B0E14", padding: 16 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 40, marginBottom: 20 },
    headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
    trackItem: { flexDirection: "row", alignItems: "center", marginBottom: 12, backgroundColor: "#151821", borderRadius: 14, padding: 12, shadowColor: "#00FFE0", shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
    thumb: { width: 55, height: 55, borderRadius: 10, marginRight: 14, backgroundColor: "#1F2330" },
    title: { color: "#fff", fontWeight: "600", fontSize: 15 },
    artist: { color: "#00FFE0", fontSize: 12 },
    playButton: { backgroundColor: "#00FFE0", width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", shadowColor: "#00FFE0", shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 },
});
