import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Modal, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from 'expo-av';
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { playlistAPI } from "../utils/playlistAPI";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import { usePlayer } from "./contexts/PlayerContext";

const PlaylistDetails = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { playTrack } = usePlayer();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddSongsModal, setShowAddSongsModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
    const [confirmDialog, setConfirmDialog] = useState({ visible: false, title: '', message: '', onConfirm: null });

    const loadPlaylist = async () => {
        try {
            setLoading(true);
            const data = await playlistAPI.getPlaylistById(id);
            setPlaylist(data);
            setNewPlaylistName(data.name);
        } catch (error) {
            console.log("Error loading playlist:", error);
            setToast({ visible: true, message: 'Failed to load playlist', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadPlaylist();
        }, [id])
    );

    const playAudio = async (song) => {
        try {
            // Create track object for now-playing screen
            const mapSongToTrack = (s) => ({
                id: s.deezerTrackId || s._id,
                title: s.title,
                artist: s.artist,
                image: s.image,
                audioUrl: s.audioUrl
            });

            const track = mapSongToTrack(song);

            // Map entire playlist to queue
            const queue = (playlist?.songs || []).map(mapSongToTrack);

            // Set current track in global context and play it
            playTrack(track, queue);

            // Navigate to now-playing screen
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

    const removeSong = (songId, songTitle) => {
        setConfirmDialog({
            visible: true,
            title: 'Remove Song',
            message: `Remove "${songTitle}" from playlist?`,
            onConfirm: async () => {
                try {
                    await playlistAPI.removeSongFromPlaylist(id, songId);
                    await loadPlaylist();
                    setConfirmDialog({ visible: false, title: '', message: '', onConfirm: null });
                    setToast({ visible: true, message: 'Song removed', type: 'success' });
                } catch (error) {
                    console.log("Error removing song:", error);
                    setConfirmDialog({ visible: false, title: '', message: '', onConfirm: null });
                    setToast({ visible: true, message: 'Failed to remove song', type: 'error' });
                }
            }
        });
    };

    const searchSongs = async (text) => {
        setSearchQuery(text);
        if (text.length > 2) {
            setSearching(true);
            try {
                const response = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(text)}&limit=20`);
                const data = await response.json();
                if (data.data) {
                    setSearchResults(data.data);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.log("Error searching:", error);
                setSearchResults([]);
            } finally {
                setSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const addSongToPlaylist = async (track) => {
        try {
            const song = {
                deezerTrackId: track.id.toString(),
                title: track.title,
                artist: track.artist.name,
                image: track.album.cover_medium,
                audioUrl: track.preview,
                duration: track.duration
            };

            await playlistAPI.addSongToPlaylist(id, song);
            setToast({ visible: true, message: 'Song added to playlist!', type: 'success' });
            await loadPlaylist();
        } catch (error) {
            console.log("Error adding song:", error);
            if (error.message && error.message.includes("already")) {
                setToast({ visible: true, message: 'Song already in playlist', type: 'info' });
            } else {
                setToast({ visible: true, message: 'Failed to add song', type: 'error' });
            }
        }
    };

    const updatePlaylistName = async () => {
        if (!newPlaylistName.trim()) {
            setToast({ visible: true, message: 'Please enter a playlist name', type: 'error' });
            return;
        }

        try {
            await playlistAPI.updatePlaylist(id, newPlaylistName.trim());
            setShowEditModal(false);
            await loadPlaylist();
            setToast({ visible: true, message: 'Playlist name updated!', type: 'success' });
        } catch (error) {
            console.log("Error updating playlist:", error);
            setToast({ visible: true, message: 'Failed to update playlist', type: 'error' });
        }
    };



    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#00FFE0" />
                <Text style={{ color: "#666", marginTop: 10 }}>Loading playlist...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#00FFE0" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{playlist?.name}</Text>
                <TouchableOpacity onPress={() => setShowEditModal(true)}>
                    <Ionicons name="create-outline" size={24} color="#00FFE0" />
                </TouchableOpacity>
            </View>

            <View style={styles.playlistInfo}>
                <Text style={styles.songCount}>{playlist?.songs?.length || 0} songs</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowAddSongsModal(true)}
                >
                    <Ionicons name="add-circle" size={20} color="#0B0E14" />
                    <Text style={styles.addButtonText}>Add Songs</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={playlist?.songs || []}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.songItem}
                        onPress={() => playAudio(item)}
                        onLongPress={() => removeSong(item._id, item.title)}
                    >
                        <Image source={{ uri: item.image }} style={styles.thumb} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
                        </View>
                        <View style={styles.playButton}>
                            <Ionicons name="play" size={16} color="#0B0E14" />
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={
                    <View style={{ alignItems: "center", marginTop: 60 }}>
                        <Ionicons name="musical-notes-outline" size={64} color="#666" />
                        <Text style={{ color: "#666", marginTop: 16, fontSize: 16 }}>No songs yet</Text>
                        <Text style={{ color: "#666", marginTop: 8, fontSize: 14 }}>Add some songs to get started!</Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            {/* Add Songs Modal */}
            <Modal
                visible={showAddSongsModal}
                animationType="slide"
                onRequestClose={() => setShowAddSongsModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add Songs</Text>
                        <TouchableOpacity onPress={() => {
                            setShowAddSongsModal(false);
                            setSearchQuery("");
                            setSearchResults([]);
                        }}>
                            <Ionicons name="close" size={28} color="#00FFE0" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#666" style={{ marginRight: 10 }} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for songs..."
                            placeholderTextColor="#666"
                            value={searchQuery}
                            onChangeText={searchSongs}
                        />
                        {searching && <ActivityIndicator size="small" color="#00FFE0" />}
                    </View>

                    <FlatList
                        data={searchResults}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.searchResultItem}
                                onPress={() => addSongToPlaylist(item)}
                            >
                                <Image source={{ uri: item.album.cover_small }} style={styles.searchThumb} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                                    <Text style={styles.artist} numberOfLines={1}>{item.artist.name}</Text>
                                </View>
                                <Ionicons name="add-circle" size={28} color="#00FFE0" />
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        ListEmptyComponent={
                            searchQuery.length > 2 ? (
                                <View style={{ alignItems: "center", marginTop: 60 }}>
                                    <Ionicons name="search-outline" size={64} color="#666" />
                                    <Text style={{ color: "#666", marginTop: 16, fontSize: 16 }}>
                                        {searching ? "Searching..." : "No results found"}
                                    </Text>
                                </View>
                            ) : (
                                <View style={{ alignItems: "center", marginTop: 60 }}>
                                    <Ionicons name="search-outline" size={64} color="#666" />
                                    <Text style={{ color: "#666", marginTop: 16, fontSize: 16 }}>Search for songs</Text>
                                    <Text style={{ color: "#666", marginTop: 8, fontSize: 14 }}>Type at least 3 characters</Text>
                                </View>
                            )
                        }
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </Modal>

            {/* Edit Playlist Name Modal */}
            <Modal
                visible={showEditModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowEditModal(false)}
            >
                <View style={styles.editModalOverlay}>
                    <View style={styles.editModalContent}>
                        <Text style={styles.editModalTitle}>Edit Playlist Name</Text>
                        <TextInput
                            style={styles.editModalInput}
                            placeholder="Playlist name"
                            placeholderTextColor="#666"
                            value={newPlaylistName}
                            onChangeText={setNewPlaylistName}
                            autoFocus
                        />
                        <View style={styles.editModalButtons}>
                            <TouchableOpacity
                                style={[styles.editModalButton, styles.cancelButton]}
                                onPress={() => {
                                    setShowEditModal(false);
                                    setNewPlaylistName(playlist?.name);
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.editModalButton, styles.saveButton]}
                                onPress={updatePlaylistName}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={() => setToast({ visible: false, message: '', type: 'success' })}
            />

            <ConfirmDialog
                visible={confirmDialog.visible}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog({ visible: false, title: '', message: '', onConfirm: null })}
                confirmText="Remove"
                type="danger"
            />
        </View>
    );
};

export default PlaylistDetails;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0B0E14", padding: 16 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 40, marginBottom: 20 },
    headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700", flex: 1, textAlign: "center" },
    playlistInfo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    songCount: { color: "#00FFE0", fontSize: 16, fontWeight: "600" },
    addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#00FFE0", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 6 },
    addButtonText: { color: "#0B0E14", fontSize: 14, fontWeight: "700" },
    songItem: { flexDirection: "row", alignItems: "center", marginBottom: 12, backgroundColor: "#151821", borderRadius: 14, padding: 12, shadowColor: "#00FFE0", shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
    thumb: { width: 55, height: 55, borderRadius: 10, marginRight: 14, backgroundColor: "#1F2330" },
    title: { color: "#fff", fontWeight: "600", fontSize: 15 },
    artist: { color: "#00FFE0", fontSize: 12 },
    playButton: { backgroundColor: "#00FFE0", width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", shadowColor: "#00FFE0", shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 },
    modalContainer: { flex: 1, backgroundColor: "#0B0E14", paddingTop: 50, paddingHorizontal: 16 },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    modalTitle: { color: "#fff", fontSize: 24, fontWeight: "700" },
    searchContainer: { flexDirection: "row", backgroundColor: "#151821", borderRadius: 12, padding: 12, alignItems: "center", marginBottom: 20, borderWidth: 1, borderColor: "#333" },
    searchInput: { flex: 1, color: "#fff", fontSize: 16 },
    searchResultItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#151821", marginBottom: 10, borderRadius: 12, padding: 10 },
    searchThumb: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
    editModalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: "center" },
    editModalContent: { backgroundColor: "#151821", borderRadius: 16, padding: 24, width: "85%", borderWidth: 1, borderColor: "#00FFE0" },
    editModalTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 20, textAlign: "center" },
    editModalInput: { backgroundColor: "#0B0E14", borderRadius: 12, padding: 12, color: "#fff", fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: "#333" },
    editModalButtons: { flexDirection: "row", gap: 12 },
    editModalButton: { flex: 1, padding: 14, borderRadius: 12, alignItems: "center" },
    cancelButton: { backgroundColor: "#333" },
    cancelButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    saveButton: { backgroundColor: "#00FFE0" },
    saveButtonText: { color: "#0B0E14", fontSize: 16, fontWeight: "700" },
});
