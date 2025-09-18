import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Library = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Library</Text>
      <Text style={styles.sub}>Saved songs, playlists, and albums</Text>
    </View>
  )
}

export default Library

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0F1115', 
    justifyContent: 'center', 
    alignItems: 'center' },
  text: { 
    color: '#E6E8F0', 
    fontSize: 20, 
    fontWeight: '700' 
  },
  sub: { 
    color: '#9AA4B2', 
    marginTop: 8 }
})
