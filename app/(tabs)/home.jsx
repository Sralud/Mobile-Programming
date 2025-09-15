import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome!</Text>
      <Text style={styles.subtext}>sample dashboard.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  subtext: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
  },
});

export default Home;