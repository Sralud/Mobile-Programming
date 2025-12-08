import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Registration = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    // FRONTEND VALIDATION  
    if (!username || !email || !password || !confirmPassword) {
      alert("All fields except referral code are required.");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (username.length < 3) {
      alert("Username must be at least 3 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://192.168.1.10:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Account created successfully!");
      router.push("/");

    } catch (error) {
      alert("Server error. Please try again.");
      console.log("Registration error:", error);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.logoWrapper}>
        <Image
          source={require('../assets/images/imageReg1.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.logoRow}>
        <Text style={styles.logo}>Rhevo</Text>
      </View>

      {/* Username */}
      <View style={styles.inputWrapper}>
        <FontAwesome name="user" size={20} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <FontAwesome name="envelope" size={20} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password */}
      <View style={styles.inputWrapper}>
        <FontAwesome name="key" size={20} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome
            name={showPassword ? "eye" : "eye-slash"}
            size={20}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputWrapper}>
        <FontAwesome name="key" size={20} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <FontAwesome
            name={showConfirmPassword ? "eye" : "eye-slash"}
            size={20}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>

      {/* Referral Code */}
      <View style={styles.inputWrapper}>
        <FontAwesome name="gift" size={20} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Referral Code (Optional)"
          placeholderTextColor="#aaa"
          value={referralCode}
          onChangeText={setReferralCode}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Back to Login */}
      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Link href="/" style={styles.loginLink}>Login</Link>
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  logoRow: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  logo: {
    color: '#00ff88',
    fontFamily: "Audiowide_400Regular",
    fontSize: 60,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#00ff88',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
  },
  loginLink: {
    color: '#00ff88',
    fontWeight: 'bold',
  },
});

export default Registration;