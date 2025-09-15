import React, { use, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

const Index = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleLogin = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>

      <View style={styles.logoSection}>
        <Image 
          source={require('../assets/images/imageIndex.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.logo}>
          <Text style={styles.logoMint}>FREE</Text>
          <Text style={styles.logoLy}>LY</Text>
        </Text>
      </View>

      <View style={styles.inputWrapper}>
        <FontAwesome name="envelope" size={20} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputWrapper}>
        <FontAwesome name="key" size={20} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome
            name={showPassword ? 'eye' : 'eye-slash'}
            size={20}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        Don’t have an account?{" "}
        <Link href="/registration" style={styles.signupLink}>
          Sign up
        </Link>
      </Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 50,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  logo: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  logoMint: {
    color: '#00ff88',
  },
  logoLy: {
    color: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 8,
    paddingHorizontal: 10,
    padding: 6,
    marginBottom: 12,
    width: '100%',
  },
  forgot: {
    color: '#fff',
    fontSize: 12,
  },
  forgotLink: {
    color: '#00ff88',
    fontWeight: 'bold',
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
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupText: {
    color: '#fff',
  },
  signupLink: {
    color: '#00ff88',
    fontWeight: 'bold',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  socialButton: {
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 50,
    marginHorizontal: 8,
  },
});

export default Index;