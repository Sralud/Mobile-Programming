import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      const res = await fetch("http://192.168.18.2:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // Success
      router.push("/splash");

    } catch (error) {
      alert("Server Error");
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.logoSection}>
        <Image
          source={require('../assets/images/imageIndex1.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.logo}>Rhevo</Text>
      </View>

      <View style={styles.inputWrapper}>
        <FontAwesome name="envelope" color="#aaa" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputWrapper}>
        <FontAwesome name="key" color="#aaa" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        Don't have an account? <Link href="/registration" style={styles.signupLink}>Sign up</Link>
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  logoSection: { alignItems: "center", marginBottom: 50 },
  logoImage: { width: 150, height: 150 },
  logo: {
    fontSize: 60,
    color: "#00ff88",
    fontFamily: "Audiowide_400Regular"
  },
  inputWrapper: {
    backgroundColor: "#222",
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: "#fff" },
  button: {
    backgroundColor: "#00ff88",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 20
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold"
  },
  signupText: {
    color: "#fff",
    marginTop: 10
  },
  signupLink: { color: "#00ff88", fontWeight: "bold" }
});

export default Login;