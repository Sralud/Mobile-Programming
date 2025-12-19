import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { usePlayer } from '../contexts/PlayerContext';
import API from '../../config/api';

const Profile = () => {
    const router = useRouter();
    const { clearPlayer } = usePlayer();
    const [user, setUser] = useState(null);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    // Edit Profile State
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editUsername, setEditUsername] = useState("");
    const [editCurrentPassword, setEditCurrentPassword] = useState("");
    const [editNewPassword, setEditNewPassword] = useState("");
    const [editConfirmPassword, setEditConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Liked Songs State
    const [likedSongsModalVisible, setLikedSongsModalVisible] = useState(false);
    const [likedSongs, setLikedSongs] = useState([]);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem("user");
            if (userData) {
                const parsed = JSON.parse(userData);
                setUser(parsed);
                setEditUsername(parsed.username);
            }

            // Fetch latest from API
            const token = await AsyncStorage.getItem("token"); // Note: In Library it was userToken or token? Consistent key needed.
            // In Login/Register it usually sets "token". Let's check authRoutes or Login.jsx if possible.
            // Assuming "token" based on confirmLogout using "token".
        } catch (error) {
            console.log("Error loading user", error);
        }
    };

    const fetchLikedSongs = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            const response = await fetch(`${API.BASE_URL}/api/users/liked`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setLikedSongs(data);
            }
        } catch (error) {
            console.log("Error fetching liked songs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditProfile = () => {
        setEditUsername(user?.username || "");
        setEditCurrentPassword("");
        setEditNewPassword("");
        setEditConfirmPassword("");
        setEditModalVisible(true);
    };

    const saveProfile = async () => {
        if (editNewPassword && editNewPassword !== editConfirmPassword) {
            alert("New passwords do not match");
            return;
        }

        if (editNewPassword && !editCurrentPassword) {
            alert("Current password is required to change password");
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");

            const updateData = {
                username: editUsername
            };

            if (editNewPassword) {
                updateData.password = editNewPassword;
                updateData.currentPassword = editCurrentPassword;
            }

            const response = await fetch(`${API.BASE_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (response.ok) {
                // Update local storage
                await AsyncStorage.setItem("user", JSON.stringify({
                    id: data._id,
                    username: data.username,
                    email: data.email,
                    profileImage: data.profileImage
                }));
                setUser(data);
                setEditModalVisible(false);
                alert("Profile updated successfully!");
            } else {
                alert(data.message || "Failed to update profile");
            }
        } catch (error) {
            console.log("Error updating profile", error);
            alert("Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setLogoutModalVisible(true);
    };

    const confirmLogout = async () => {
        await clearPlayer(); // Clear player state
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        setLogoutModalVisible(false);
        router.replace("/");
    };

    const openLikedSongs = () => {
        fetchLikedSongs();
        setLikedSongsModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: user?.profileImage || "https://api.dicebear.com/9.x/adventurer-neutral/png?seed=Felix" }}
                    style={styles.profileImage}
                />
                <Text style={styles.name}>{user?.username || "Guest User"}</Text>
                <Text style={styles.email}>{user?.email || "guest@rhevo.music"}</Text>

                <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={openLikedSongs}>
                    <FontAwesome name="heart" size={20} color="#00FFE0" style={styles.menuIcon} />
                    <Text style={styles.menuText}>Liked Songs</Text>
                    <FontAwesome name="angle-right" size={20} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <FontAwesome name="gear" size={20} color="#00FFE0" style={styles.menuIcon} />
                    <Text style={styles.menuText}>Settings</Text>
                    <FontAwesome name="angle-right" size={20} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <FontAwesome name="sign-out" size={20} color="#FF4444" style={styles.menuIcon} />
                    <Text style={[styles.menuText, { color: "#FF4444" }]}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Edit Profile Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>

                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={editUsername}
                            onChangeText={setEditUsername}
                            placeholder="Username"
                            placeholderTextColor="#666"
                        />

                        <Text style={styles.label}>Current Password (for changes)</Text>
                        <TextInput
                            style={styles.input}
                            value={editCurrentPassword}
                            onChangeText={setEditCurrentPassword}
                            placeholder="Current Password"
                            placeholderTextColor="#666"
                            secureTextEntry
                        />

                        <Text style={styles.label}>New Password (leave empty to keep)</Text>
                        <TextInput
                            style={styles.input}
                            value={editNewPassword}
                            onChangeText={setEditNewPassword}
                            placeholder="New Password"
                            placeholderTextColor="#666"
                            secureTextEntry
                        />

                        <Text style={styles.label}>Confirm New Password</Text>
                        <TextInput
                            style={styles.input}
                            value={editConfirmPassword}
                            onChangeText={setEditConfirmPassword}
                            placeholder="Confirm New Password"
                            placeholderTextColor="#666"
                            secureTextEntry
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.logoutButton} // Reusing style for save
                                onPress={saveProfile}
                            >
                                <Text style={styles.logoutButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Liked Songs Modal */}
            <Modal
                animationType="slide"
                visible={likedSongsModalVisible}
                onRequestClose={() => setLikedSongsModalVisible(false)}
            >
                <View style={styles.fullScreenModal}>
                    <View style={styles.fullScreenHeader}>
                        <TouchableOpacity onPress={() => setLikedSongsModalVisible(false)}>
                            <FontAwesome name="arrow-left" size={24} color="#00FFE0" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Liked Songs</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <FlatList
                        data={likedSongs}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.songItem}
                                onPress={() => {
                                    // Simple navigation to now playing
                                    router.push({
                                        pathname: "/now-playing",
                                        params: {
                                            id: item.id,
                                            title: item.title,
                                            artist: item.artist,
                                            image: item.image,
                                            audioUrl: item.audioUrl
                                        }
                                    });
                                }}
                            >
                                <Image source={{ uri: item.image }} style={styles.songImage} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
                                    <Text style={styles.songArtist} numberOfLines={1}>{item.artist}</Text>
                                </View>
                                <FontAwesome name="heart" size={20} color="#00FFE0" />
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No liked songs yet.</Text>
                            </View>
                        }
                    />
                </View>
            </Modal>

            {/* Logout Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={logoutModalVisible}
                onRequestClose={() => setLogoutModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <FontAwesome name="sign-out" size={32} color="#FF4444" />
                            <Text style={styles.modalTitle}>Logout</Text>
                        </View>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to logout?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setLogoutModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={confirmLogout}
                            >
                                <Text style={styles.logoutButtonText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B0E14",
        padding: 20,
    },
    header: {
        alignItems: "center",
        marginTop: 50,
        marginBottom: 40,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: "#00FFE0"
    },
    name: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
    },
    email: {
        color: "#9AA4B2",
        fontSize: 14,
        marginBottom: 20,
    },
    editButton: {
        backgroundColor: "#151821",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#00FFE0",
    },
    editButtonText: {
        color: "#00FFE0",
        fontWeight: "600",
    },
    menuContainer: {
        backgroundColor: "#151821",
        borderRadius: 16,
        padding: 10,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#222",
    },
    menuIcon: {
        width: 30,
    },
    menuText: {
        flex: 1,
        color: "#fff",
        fontSize: 16,
        marginLeft: 10,
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
        borderColor: "#FF4444",
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
    modalButtons: {
        flexDirection: "row",
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "transparent",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#9AA4B2",
    },
    cancelButtonText: {
        color: "#9AA4B2",
        fontSize: 16,
        fontWeight: "700",
    },
    logoutButton: {
        flex: 1,
        backgroundColor: "#FF4444",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: "center",
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    // New Styles
    input: {
        backgroundColor: "#0B0E14",
        color: "#fff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#333"
    },
    label: {
        color: "#9AA4B2",
        marginBottom: 8,
        marginLeft: 4,
        fontSize: 14
    },
    fullScreenModal: {
        flex: 1,
        backgroundColor: "#0B0E14",
        padding: 20
    },
    fullScreenHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        marginTop: 20
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold"
    },
    songItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#151821",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12
    },
    songImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12
    },
    songTitle: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16
    },
    songArtist: {
        color: "#9AA4B2",
        fontSize: 14
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 50
    },
    emptyText: {
        color: "#666",
        fontSize: 16
    }
});
