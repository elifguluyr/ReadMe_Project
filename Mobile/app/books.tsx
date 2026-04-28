import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function BooksScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Kitaplık</Text>
        <Text style={styles.subtitle}>Bu sayfa henüz yapım aşamasında.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBF7' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' }
});