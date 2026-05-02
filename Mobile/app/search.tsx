import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, 
  TouchableOpacity, Dimensions, Image, ActivityIndicator, Keyboard 
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { bookAPI } from '../services/api';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]); // Local DB books
  const [searchResults, setSearchResults] = useState([]); // Google Books API results
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInitialBooks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchInitialBooks = async () => {
    setIsLoading(true);
    try {
      const allBooks = await bookAPI.getAllBooks();
      setBooks(allBooks);
    } catch (error) {
      console.error('Başlangıç verileri yüklenemedi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      const results = await bookAPI.search(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Arama hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBackgroundColor = (index: number) => {
    const colors = ['#1E3A8A', '#8FBC8F', '#8B5A2B', '#4A5D82', '#0F766E', '#704f4a'];
    return colors[index % colors.length];
  };

  const renderBook = ({ item, index }: { item: any, index: number }) => {
    const author = item.authors ? item.authors[0] : item.author;
    
    return (
      <View style={styles.bookCard}>
        <View style={[styles.bookCover, { backgroundColor: getBackgroundColor(index), overflow: 'hidden' }]}>
          {item.imageLinks?.thumbnail ? (
            <Image source={{ uri: item.imageLinks.thumbnail }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Text style={styles.bookCoverText}>{item.title ? item.title[0].toUpperCase() : '?'}</Text>
            </View>
          )}
        </View>
        <Text style={styles.bookTitle} numberOfLines={1}>{item.title || 'İsimsiz'}</Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>{author || 'Bilinmiyor'}</Text>
      </View>
    );
  };

  const displayData = searchQuery.trim().length > 0 ? searchResults : books;

  return (
    <SafeAreaView style={styles.container}>
      {/* ARAMA BAŞLIĞI VE ÇUBUĞU */}
      <View style={styles.searchHeader}>
        <Image 
            source={require('../assets/images/icon.png')} 
            style={styles.searchLogo} 
            resizeMode="contain" 
          />
        <View style={styles.searchBarContainer}>
          <FontAwesome name="search" size={24} color="#704f4a" style={{ marginBottom: 4 }} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Kitap veya yazar ara (Tüm Dünya)..."
            placeholderTextColor="#263a62"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* SONUÇLAR IZGARASI */}
      <View style={styles.listSection}>
        <Text style={styles.listTitle}>
          {searchQuery.trim().length > 0 ? `Arama Sonuçları` : 'Tüm Kitaplar'}
        </Text>
        
        {isLoading ? (
          <ActivityIndicator size="large" color="#704f4a" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={displayData}
            renderItem={renderBook}
            keyExtractor={(item, idx) => item._id || item.googleId || item.id || idx.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.row}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            ListEmptyComponent={<Text style={{textAlign: 'center', color: '#6B7280'}}>Kitap bulunamadı.</Text>}
          />
        )}
      </View>

      {/* ALT MENÜ */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="search" size={24} color="#704f4a" style={{ marginBottom: 4 }} />
          <Text style={styles.navTextActive}>Arama</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/social')}>
          <Ionicons name="chatbubbles-outline" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
          <Text style={styles.navText}>Sosyal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/books')}>
          <Ionicons name="library-outline" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
          <Text style={styles.navText}>Kitaplık</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/profile')}>
          <Ionicons name="person-outline" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBF7' },
  searchHeader: { padding: 20, backgroundColor: '#F9F6F0', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  searchBarContainer: { marginTop: -30, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#c0e2dcbc', borderRadius: 15, paddingHorizontal: 15, height: 50 },
  searchInput: { flex: 1, fontSize: 15, color: '#1F2937' },
  listSection: { flex: 1, paddingHorizontal: 10, paddingTop: 20 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 15, marginLeft: 10 },
  row: { justifyContent: 'space-between', paddingHorizontal: 10 },
  bookCard: { width: (width / 2) - 30, marginBottom: 20, alignItems: 'center' },
  bookCover: { width: '100%', height: 180, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 },
  coverImage: { width: '100%', height: '100%', borderRadius: 12 },
  coverPlaceholder: { width: '100%', height: '100%', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  bookCoverText: { color: '#FFFFFF', fontSize: 40, fontWeight: 'bold', opacity: 0.8 },
  bookTitle: { fontSize: 13, fontWeight: 'bold', color: '#1F2937', marginTop: 10, textAlign: 'center' },
  bookAuthor: { fontSize: 11, color: '#6B7280', marginTop: 2, textAlign: 'center' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingVertical: 15, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: '#E5E7EB', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center', flex: 1 },
  navText: { fontSize: 10, color: '#6B7280', fontWeight: '500' },
  navTextActive: { fontSize: 10, color: '#704f4a', fontWeight: 'bold' },
  searchLogo: { width: 120, height: 120 },
});