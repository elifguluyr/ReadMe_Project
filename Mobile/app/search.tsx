import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  FlatList, 
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sahte veri: Arama yapılmadığında veya sonuç olarak gösterilecek kitaplar
  interface Book {
  id: string;
  title: string;
  author: string;
  color: string;
}
  const mockBooks = [
    { id: '1', title: 'Suç ve Ceza', author: 'Dostoyevski', color: '#1E3A8A' },
    { id: '2', title: 'Dune', author: 'Frank Herbert', color: '#8FBC8F' },
    { id: '3', title: '1984', author: 'George Orwell', color: '#8B5A2B' },
    { id: '4', title: 'Simyacı', author: 'Paulo Coelho', color: '#4A5D82' },
    { id: '5', title: 'Körlük', author: 'Jose Saramago', color: '#0F766E' },
    { id: '6', title: 'Fahrenheit 451', author: 'Ray Bradbury', color: '#1E3A8A' },
  ];

  const renderBook = ({ item }: { item: Book }) => (
    <TouchableOpacity style={styles.bookCard}>
      <View style={[styles.bookCover, { backgroundColor: item.color }]}>
        <Text style={styles.bookCoverText}>{item.title[0]}</Text>
      </View>
      <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
    </TouchableOpacity>
  );

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
            placeholder="Kitap, yazar veya tür ara..."
            placeholderTextColor="#263a62"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* KÜTÜPHANE / SONUÇLAR IZGARASI (GRID) */}
      <View style={styles.listSection}>
        <Text style={styles.listTitle}>
          {searchQuery.length > 0 ? `"${searchQuery}" sonuçları` : 'Popüler Kitaplar'}
        </Text>
        
        <FlatList
          data={mockBooks}
          renderItem={renderBook}
          keyExtractor={item => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 20 }} // Alt menüye yapışmasın diye boşluk
        />
      </View>

      {/* ALT MENÜ  */}
      <View style={styles.bottomNav}>

        {/* Arama */}
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="search" size={24} color="#704f4a" style={{ marginBottom: 4 }} />
          <Text style={styles.navTextActive}>Arama</Text>
        </TouchableOpacity>

        {/* Sosyal */}
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/social')}>
          <Ionicons name="chatbubbles-outline" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
          <Text style={styles.navText}>Sosyal</Text>
        </TouchableOpacity>

        {/* Kitaplık */}
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/books')}>
          <Ionicons name="library-outline" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
          <Text style={styles.navText}>Kitaplık</Text>
        </TouchableOpacity>

        {/* Profil */}
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Ionicons name="person-outline" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBF7' },
  searchHeader: { 
    padding: 20, 
    backgroundColor: '#F9F6F0', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB' 
  },
  searchBarContainer: { 
    marginTop: -30,
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6,
    backgroundColor: '#bbc7debc',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    
  },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#1F2937' },

  listSection: { flex: 1, paddingHorizontal: 10, paddingTop: 20 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 15, marginLeft: 10 },
  
  row: { justifyContent: 'space-between', paddingHorizontal: 10 },
  bookCard: { 
    width: (width / 2) - 30, 
    marginBottom: 20,
    alignItems: 'center'
  },
  bookCover: { 
    width: '100%', 
    height: 180, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3
  },
  bookCoverText: { color: '#FFFFFF', fontSize: 40, fontWeight: 'bold', opacity: 0.8 },
  bookTitle: { fontSize: 14, fontWeight: 'bold', color: '#1F2937', marginTop: 10, textAlign: 'center' },
  bookAuthor: { fontSize: 12, color: '#6B7280', marginTop: 2, textAlign: 'center' },

  // Alt Menü Stilleri
  bottomNav: { 
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF', 
    paddingVertical: 15, 
    paddingHorizontal: 10,
    borderTopWidth: 1, 
    borderTopColor: '#E5E7EB',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  navItem: { alignItems: 'center', flex: 1 },
  navIcon: { fontSize: 20, opacity: 0.5, marginBottom: 4 },
  navIconActive: { fontSize: 20, opacity: 1, marginBottom: 4 },
  navText: { fontSize: 10, color: '#6B7280', fontWeight: '500' },
  navTextActive: { fontSize: 10, color: '#704f4a', fontWeight: 'bold' },
  searchLogo: {
    width: 120,
    height: 120,
  },
  headerLogo: {
    width: 100,  
    height: 100, 
    marginTop: -30,    
    marginBottom: -30,
  },
});