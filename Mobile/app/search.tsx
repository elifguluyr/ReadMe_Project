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
  Image,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { bookAPI } from '../services/api';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const mockBooks = [
    { id: '1', title: 'Suç ve Ceza', author: 'Dostoyevski', color: '#1E3A8A' },
    { id: '2', title: 'Dune', author: 'Frank Herbert', color: '#8FBC8F' },
    { id: '3', title: '1984', author: 'George Orwell', color: '#8B5A2B' },
    { id: '4', title: 'Simyacı', author: 'Paulo Coelho', color: '#4A5D82' },
    { id: '5', title: 'Körlük', author: 'Jose Saramago', color: '#0F766E' },
    { id: '6', title: 'Fahrenheit 451', author: 'Ray Bradbury', color: '#1E3A8A' },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const results = await bookAPI.search(searchQuery);
      
      // Arkadaşın listelemeyi yapana kadar sadece çalıştığını Alert ile gösteriyoruz
      console.log('Arama Sonuçları:', results);
      Alert.alert(
        'Arama Bağlantısı Başarılı! ✅', 
        `Backend'den ${results.length} adet kitap sonucu döndü.\n(Kitap detayları terminal konsoluna yazdırıldı, listeleme işini arkadaşınız devralabilir.)`
      );
    } catch (error) {
      console.error('Arama hatası:', error);
      Alert.alert('Hata ❌', 'Arama yapılırken bir sorun oluştu. Lütfen tekrar deneyin.');
    }
  };

  const renderBook = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.bookCard}>
      <View style={[styles.bookCover, { backgroundColor: item.color || '#354c79' }]}>
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
            onSubmitEditing={handleSearch}
            returnKeyType="search"
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
          contentContainerStyle={{ paddingBottom: 20 }}
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
    backgroundColor: '#c0e2dcbc',
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: '#fff'
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
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