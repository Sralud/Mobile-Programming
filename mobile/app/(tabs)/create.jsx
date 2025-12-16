import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
  Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from 'expo-av';
import { generateMusic, pollTaskCompletion } from "../../services/sunoApi";

export default function Create() {
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedSongs, setGeneratedSongs] = useState([]);
  const [error, setError] = useState(null);
  const [sound, setSound] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Cleanup sound on unmount
  React.useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  // Show custom modal instead of Alert
  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showModal("Missing Input", "Please describe your song idea");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedSongs([]);

    try {
      // Step 1: Generate music
      const generateResponse = await generateMusic(prompt, genre);

      if (generateResponse.code !== 200 || !generateResponse.data || !generateResponse.data.taskId) {
        throw new Error("Failed to initiate music generation");
      }

      const taskId = generateResponse.data.taskId;

      // Step 2: Poll for completion
      const completedTask = await pollTaskCompletion(taskId);

      if (completedTask.code === 200 && completedTask.data && completedTask.data.response) {
        const songs = completedTask.data.response.sunoData || [];
        setGeneratedSongs(songs);
      } else {
        throw new Error("Failed to retrieve generated songs");
      }

    } catch (err) {
      console.error("Music generation error:", err);
      setError(err.message || "Failed to generate music. Please try again.");
      showModal("Generation Failed", err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handlePlayPause = async (song, index) => {
    try {
      // If clicking the same song that's currently playing or paused
      if (playingIndex === index && sound) {
        const status = await sound.getStatusAsync();

        if (status.isLoaded && status.isPlaying) {
          // Pause the sound
          await sound.pauseAsync();
          setIsPaused(true);
          return;
        } else if (status.isLoaded && !status.isPlaying) {
          // Resume if paused
          await sound.playAsync();
          setIsPaused(false);
          return;
        }
      }

      // Stop and unload current sound if playing a different song
      if (sound) {
        try {
          await sound.stopAsync();
          await sound.unloadAsync();
        } catch (e) {
          console.log("Error stopping sound:", e);
        }
        setSound(null);
        setPlayingIndex(null);
        setIsPaused(false);
      }

      // Load and play new sound - use streamAudioUrl for faster playback, fallback to audioUrl
      const audioUrl = song.streamAudioUrl || song.audioUrl;
      if (!audioUrl) {
        showModal("Playback Error", "Audio URL not available yet");
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      setPlayingIndex(index);
      setIsPaused(false);

      // Handle playback status
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingIndex(null);
          setIsPaused(false);
        }
      });

    } catch (err) {
      console.error("Playback error:", err);
      showModal("Playback Error", "Failed to play the track");
    }
  };

  const handleDownload = (song) => {
    const downloadUrl = song.audioUrl || song.streamAudioUrl;
    if (downloadUrl) {
      Linking.openURL(downloadUrl);
    } else {
      showModal("Download Error", "Download URL not available");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.header}>🎵 Create Your Music</Text>
      <Text style={styles.sub}>
        Enter your lyrics, vibe, or theme — and let AI generate a custom sound.
      </Text>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Describe your song idea:</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="e.g., Chill lo-fi beat about rainy nights"
          placeholderTextColor="#888"
          value={prompt}
          onChangeText={setPrompt}
        />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Preferred Genre (optional):</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Lo-Fi, Pop, Indie"
          placeholderTextColor="#888"
          value={genre}
          onChangeText={setGenre}
        />
      </View>

      <TouchableOpacity
        style={[styles.generateBtn, loading && { opacity: 0.6 }]}
        onPress={handleGenerate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#0B0E14" size="small" />
        ) : (
          <Ionicons name="sparkles" size={20} color="#0B0E14" />
        )}
        <Text style={styles.generateText}>
          {loading ? "Generating..." : "Generate Music"}
        </Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#00FFE0" />
          <Text style={styles.loadingText}>
            Creating your masterpiece... This may take up to 90 seconds
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={24} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {generatedSongs.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsHeader}>Your AI Music is Ready!</Text>
          <Text style={styles.resultsSubtext}>
            We generated 2 variations for you - listen and pick your favorite!
          </Text>
          {generatedSongs.map((song, index) => (
            <View key={song.id} style={styles.resultBox}>
              <View style={styles.songHeader}>
                <Ionicons name="musical-notes" size={24} color="#00FFE0" />
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>{song.title || `Track ${index + 1}`}</Text>
                  {song.tags && (
                    <Text style={styles.songTags}>{song.tags}</Text>
                  )}
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.previewBtn}
                  onPress={() => handlePlayPause(song, index)}
                >
                  <Ionicons
                    name={playingIndex === index && !isPaused ? "pause" : "play"}
                    size={20}
                    color="#0B0E14"
                  />
                  <Text style={styles.previewText}>
                    {playingIndex === index && !isPaused ? "Pause" : "Play"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => handleDownload(song)}
                >
                  <Ionicons name="download-outline" size={20} color="#00FFE0" />
                  <Text style={styles.downloadText}>Download</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Custom Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="alert-circle" size={32} color="#00FFE0" />
              <Text style={styles.modalTitle}>{modalTitle}</Text>
            </View>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0E14" },
  scroll: { padding: 20, paddingBottom: 80 },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#E0E0E0",
    marginTop: 30,
  },
  sub: {
    color: "#9AA4B2",
    fontSize: 14,
    marginTop: 6,
    marginBottom: 25,
  },
  inputBox: { marginBottom: 20 },
  label: { color: "#fff", marginBottom: 8, fontWeight: "600" },
  input: {
    backgroundColor: "#151821",
    color: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
  },
  generateBtn: {
    flexDirection: "row",
    backgroundColor: "#00FFE0",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  generateText: {
    color: "#0B0E14",
    fontWeight: "700",
    marginLeft: 8,
  },
  loadingBox: {
    backgroundColor: "#151821",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    marginVertical: 10,
  },
  loadingText: {
    color: "#9AA4B2",
    fontSize: 14,
    marginTop: 15,
    textAlign: "center",
  },
  errorBox: {
    backgroundColor: "#2A1515",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  resultsContainer: {
    marginTop: 10,
  },
  resultsHeader: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  resultsSubtext: {
    color: "#9AA4B2",
    fontSize: 13,
    marginBottom: 15,
    textAlign: "center",
  },
  resultBox: {
    backgroundColor: "#151821",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#00FFE0",
    elevation: 5,
  },
  songHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },
  songTags: {
    color: "#9AA4B2",
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  previewBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#00FFE0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  previewText: {
    color: "#0B0E14",
    fontWeight: "700",
    marginLeft: 6,
  },
  downloadBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#00FFE0",
  },
  downloadText: {
    color: "#00FFE0",
    fontWeight: "700",
    marginLeft: 6,
  },
  imageNote: {
    color: "#9AA4B2",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#151821",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    borderWidth: 2,
    borderColor: "#00FFE0",
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
    flex: 1,
  },
  modalMessage: {
    color: "#9AA4B2",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: "#00FFE0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#0B0E14",
    fontSize: 16,
    fontWeight: "700",
  },
});
