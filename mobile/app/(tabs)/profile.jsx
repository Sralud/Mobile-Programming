import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const Profile = () => {
    const router = useRouter();
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

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    await AsyncStorage.removeItem("token");
                    await AsyncStorage.removeItem("user");
                    router.replace("/");
                }
            }
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: user?.profileImage || "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Felix" }}
                    style={styles.profileImage}
                />
                <Text style={styles.name}>{user?.username || "Guest User"}</Text>
                <Text style={styles.email}>{user?.email || "guest@rhevo.music"}</Text>

                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem}>
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
});
