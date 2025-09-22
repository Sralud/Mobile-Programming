import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'

const Search = () => {
  const [query, setQuery] = useState('')

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search songs, artists..."
        placeholderTextColor="#9AA4B2"
        value={query}
        onChangeText={setQuery}
      />
      <Text style={styles.resultText}>Results for: {query}</Text>
    </View>
  )
}

export default Search

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0F1115', 
    padding: 16 
  },
  input: {
    backgroundColor: '#171923',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#1F2330',
    color: '#E6E8F0',
    marginBottom: 16,
    marginTop: 40
  },
  resultText: { 
    color: '#E6E8F0' 
  }
})
