import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator, Modal } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { playlistAPI } from "../../utils/playlistAPI";
import Toast from "../../components/Toast";
import ConfirmDialog from "../../components/ConfirmDialog";
import { usePlayer } from "../contexts/PlayerContext";

const Library = () => {
  const router = useRouter();
  const { playTrack } = usePlayer();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePreviewUrl, setActivePreviewUrl] = useState(null);
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ visible: false, title: '', message: '', onConfirm: null });

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

  useFocusEffect(
    React.useCallback(() => {
      loadPlaylists();
    }, [])
  );

  const loadPlaylists = async () => {
    try {
      const data = await playlistAPI.getPlaylists();
      console.log("Loaded playlists:", data);
      setPlaylists(data);
    } catch (error) {
      console.log("Error loading playlists:", error);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      setToast({ visible: true, message: 'Please enter a playlist name', type: 'error' });
      return;
    }

    try {
      setCreatingPlaylist(true);
      console.log("Creating playlist with name:", newPlaylistName.trim());
      const result = await playlistAPI.createPlaylist(newPlaylistName.trim());
      console.log("Create playlist result:", result);

      if (result.message && result.message.includes("successfully")) {
        setNewPlaylistName("");
        setShowCreateModal(false);
        await loadPlaylists();
        setToast({ visible: true, message: 'Playlist created!', type: 'success' });
      } else {
        console.log("Error response:", result);
        setToast({ visible: true, message: result.message || 'Failed to create playlist', type: 'error' });
      }
    } catch (error) {
      console.log("Error creating playlist:", error);
      setToast({ visible: true, message: `Failed to create playlist: ${error.message}`, type: 'error' });
    } finally {
      setCreatingPlaylist(false);
    }
  };

  const deletePlaylist = (playlistId, playlistName) => {
    setConfirmDialog({
      visible: true,
      title: 'Delete Playlist',
      message: `Are you sure you want to delete "${playlistName}"?`,
      onConfirm: async () => {
        try {
          await playlistAPI.deletePlaylist(playlistId);
          await loadPlaylists();
          setConfirmDialog({ visible: false, title: '', message: '', onConfirm: null });
          setToast({ visible: true, message: 'Playlist deleted', type: 'success' });
        } catch (error) {
          console.log("Error deleting playlist:", error);
          setConfirmDialog({ visible: false, title: '', message: '', onConfirm: null });
          setToast({ visible: true, message: 'Failed to delete playlist', type: 'error' });
        }
      }
    });
  };

  const searchMusic = async (text) => {
    setSearchQuery(text);
    if (text.length > 2) {
      setLoading(true);
      try {
        const response = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(text)}&limit=15`);
        const data = await response.json();

        if (data.data) {
          const transformedResults = data.data.map(track => ({
            id: track.id,
            name: track.title,
            artist_name: track.artist.name,
            image: track.album.cover_medium,
            audio: track.preview,
            duration: track.duration,
            album_name: track.album.title
          }));
          setSearchResults(transformedResults);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.log("Error searching music", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const playAudio = async (item) => {
    try {
      const mapToTrack = (t) => ({
        id: t.id,
        title: t.name,
        artist: t.artist_name,
        image: t.image,
        audioUrl: t.audio
      });

      const track = mapToTrack(item);
      const queue = searchResults.map(mapToTrack);

      playTrack(track, queue);

      router.push({
        pathname: "/now-playing",
        params: track
      });
    } catch (error) {
      console.log("Error playing sound", error);
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: user?.profileImage || "https://api.dicebear.com/9.x/adventurer-neutral/png?seed=Felix" }}
          style={styles.profilePic}
        />
        <View>
          <Text style={styles.welcome}>Welcome Back,</Text>
          <Text style={styles.username}>{user?.username || "Guest User"} 🎵</Text>
        </View>
      </View>

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
        {searchQuery.length > 0 && searchResults.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {searchResults.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.resultItem}
                onPress={() => playAudio(item)}
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
        ) : searchQuery.length > 2 && searchResults.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Ionicons name="search-outline" size={64} color="#666" />
            <Text style={{ color: "#666", marginTop: 16, fontSize: 16 }}>No results found</Text>
            <Text style={{ color: "#666", marginTop: 8, fontSize: 14 }}>Try searching for another artist or song</Text>
          </View>
        ) : (
          <>
            <View style={styles.playlistHeader}>
              <Text style={styles.sectionTitle}>Your Playlists</Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => setShowCreateModal(true)}
              >
                <Ionicons name="add-circle" size={28} color="#00FFE0" />
              </TouchableOpacity>
            </View>

            {playlists.length === 0 ? (
              <View style={{ alignItems: "center", marginTop: 40 }}>
                <Ionicons name="musical-notes-outline" size={64} color="#666" />
                <Text style={{ color: "#666", marginTop: 16, fontSize: 16 }}>No playlists yet</Text>
                <Text style={{ color: "#666", marginTop: 8, fontSize: 14 }}>Create your first playlist!</Text>
              </View>
            ) : (
              playlists.map((item) => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.libItem}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/playlist-details?id=${item._id}`)}
                  onLongPress={() => deletePlaylist(item._id, item.name)}
                >
                  <Image
                    source={item.coverImage ? { uri: item.coverImage } : require("../../assets/images/mix3.png")}
                    style={styles.thumb}
                  />
                  <View style={styles.info}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.subtitle}>{item.songs?.length || 0} tracks</Text>
                  </View>
                  <View style={styles.tagContainer}>
                    <Text style={styles.tag}>Playlist</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Playlist</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Playlist name"
              placeholderTextColor="#666"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowCreateModal(false);
                  setNewPlaylistName("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButtonModal]}
                onPress={createPlaylist}
                disabled={creatingPlaylist}
              >
                {creatingPlaylist ? (
                  <ActivityIndicator size="small" color="#0B0E14" />
                ) : (
                  <Text style={styles.createButtonText}>Create</Text>
                )}
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
        confirmText="Delete"
        type="danger"
      />
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
  playlistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  createButton: {
    padding: 4,
  },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#151821",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    borderWidth: 1,
    borderColor: "#00FFE0",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#0B0E14",
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#333",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  createButtonModal: {
    backgroundColor: "#00FFE0",
  },
  createButtonText: {
    color: "#0B0E14",
    fontSize: 16,
    fontWeight: "700",
  },
});
