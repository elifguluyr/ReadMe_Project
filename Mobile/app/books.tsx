import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, 
  Dimensions, Image, Alert, ActivityIndicator, Modal, TextInput, ScrollView, Keyboard 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userAPI, bookAPI, shelfAPI, ratingAPI } from '../services/api';

const { width } = Dimensions.get('window');

export default function BooksScreen() {
  const router = useRouter();
  const [shelves, setShelves] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [userRatings, setUserRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAddShelfModalVisible, setAddShelfModalVisible] = useState(false);
  const [newShelfName, setNewShelfName] = useState('');

  // Book Action (Rating) Modal States
  const [isBookModalVisible, setIsBookModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [currentRating, setCurrentRating] = useState(0);

  // Add Book To Shelf Modal States
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [selectedShelfForAdd, setSelectedShelfForAdd] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const loggedInUserId = await AsyncStorage.getItem('userId');
      if (!loggedInUserId) {
         router.replace('/login');
         return;
      }
      
      const [profileData, booksData, ratingsData] = await Promise.all([
        userAPI.getProfile(loggedInUserId),
        bookAPI.getAllBooks(),
        ratingAPI.getUserRatings()
      ]);

      setAllBooks(booksData);
      setShelves(profileData.shelf || []);
      setUserRatings(ratingsData || []);
    } catch (error) {
      console.error('Veri çekilirken hata:', error);
      Alert.alert('Hata', 'Kitaplık bilgileri alınamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateShelf = async () => {
    if (!newShelfName.trim()) return;
    try {
      await shelfAPI.createShelf(newShelfName);
      setAddShelfModalVisible(false);
      setNewShelfName('');
      fetchData(); // re-fetch to get updated shelves
    } catch (error) {
      Alert.alert('Hata', 'Raf oluşturulamadı.');
    }
  };

  const handleRemoveBookFromShelf = async (shelfId: string, bookId: string) => {
    try {
      await shelfAPI.removeBookFromShelf(shelfId, bookId);
      fetchData(); // re-fetch to update UI
    } catch (error) {
      Alert.alert('Hata', 'Kitap raftan silinemedi.');
    }
  };

  const openBookModal = (book: any) => {
    setSelectedBook(book);
    const bId = book._id || book.id || book.googleId;
    const existingRating = userRatings.find((r: any) => r.bookId === bId);
    setCurrentRating(existingRating ? existingRating.rating : 0);
    setIsBookModalVisible(true);
  };

  const handleRateBook = async (rating: number) => {
    if (!selectedBook) return;
    const bId = selectedBook._id || selectedBook.id || selectedBook.googleId;
    const existingRating = userRatings.find((r: any) => r.bookId === bId);

    try {
      if (existingRating) {
        if (rating === existingRating.rating) {
           await ratingAPI.deleteRating(existingRating._id);
           setUserRatings(userRatings.filter((r: any) => r._id !== existingRating._id));
           setCurrentRating(0);
           Alert.alert('Silindi', 'Puanınız kaldırıldı.');
        } else {
           const updated = await ratingAPI.updateRating(existingRating._id, rating);
           setUserRatings(userRatings.map((r: any) => r._id === updated._id ? updated : r));
           setCurrentRating(rating);
           Alert.alert('Güncellendi', 'Puanınız güncellendi.');
        }
      } else {
        const newRating = await ratingAPI.addRating(bId, rating);
        setUserRatings([...userRatings, newRating]);
        setCurrentRating(rating);
        Alert.alert('Başarılı', 'Puanınız eklendi.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Puanlama işlemi başarısız oldu.');
    }
  };

  // ----- SEARCH & ADD TO SHELF LOGIC -----
  const openSearchModalForShelf = (shelfId: string) => {
    setSelectedShelfForAdd(shelfId);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchModalVisible(true);
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;
    Keyboard.dismiss();
    setIsSearching(true);
    try {
      const results = await bookAPI.search(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Arama hatası:', error);
      Alert.alert('Hata', 'Kitaplar aranırken bir sorun oluştu.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddSearchedBookToShelf = async (book: any) => {
    if (!selectedShelfForAdd) return;
    try {
      const bookData = {
        googleId: book.googleId || book.id || book._id,
        title: book.title,
        author: book.authors ? book.authors.join(', ') : book.author || 'Bilinmiyor',
        imageLinks: book.imageLinks || null
      };
      await shelfAPI.addBookToShelf(selectedShelfForAdd, bookData);
      Alert.alert('Başarılı', 'Kitap rafa eklendi!');
      setIsSearchModalVisible(false);
      fetchData(); // re-fetch to show the new book in the shelf
    } catch (error: any) {
      const errMsg = error.response?.data?.message || '';
      const errDetail = error.response?.data?.error || error.message;
      Alert.alert('Hata', `Kitap rafa eklenemedi: ${errMsg} - ${errDetail}`);
    }
  };

  const getBackgroundColor = (index: number) => {
    const colors = ['#1E3A8A', '#8FBC8F', '#8B5A2B', '#4A5D82', '#0F766E', '#704f4a'];
    return colors[index % colors.length];
  };

  const renderBook = (bookId: string, shelfId: string, index: number) => {
    const book = allBooks.find((b: any) => b._id === bookId || b.id === bookId);
    if (!book) return null;

    return (
      <TouchableOpacity key={book._id || book.id || index} style={styles.bookCard} onPress={() => openBookModal(book)}>
        <View style={[styles.bookCover, { backgroundColor: getBackgroundColor(index), overflow: 'hidden' }]}>
          {book.imageLinks?.thumbnail ? (
            <Image source={{ uri: book.imageLinks.thumbnail }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Text style={styles.bookCoverText}>{book.title ? book.title[0].toUpperCase() : '?'}</Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemoveBookFromShelf(shelfId, bookId)}
          >
            <Ionicons name="trash" size={14} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.bookTitle} numberOfLines={1}>{book.title || 'İsimsiz'}</Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>{book.author || 'Bilinmiyor'}</Text>
      </TouchableOpacity>
    );
  };

  const renderSearchedBook = ({ item, index }: { item: any, index: number }) => {
    const author = item.authors ? item.authors[0] : item.author;
    return (
      <TouchableOpacity style={styles.searchResultCard} onPress={() => handleAddSearchedBookToShelf(item)}>
        <View style={[styles.searchResultCover, { backgroundColor: getBackgroundColor(index) }]}>
          {item.imageLinks?.thumbnail ? (
            <Image source={{ uri: item.imageLinks.thumbnail }} style={styles.coverImage} />
          ) : (
            <Text style={styles.bookCoverText}>{item.title ? item.title[0].toUpperCase() : '?'}</Text>
          )}
        </View>
        <View style={styles.searchResultInfo}>
          <Text style={styles.searchResultTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.searchResultAuthor} numberOfLines={1}>{author || 'Bilinmiyor'}</Text>
          <View style={styles.addToListButton}>
             <Ionicons name="add-circle" size={16} color="#FFFFFF" />
             <Text style={styles.addToListButtonText}>Rafa Ekle</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStars = () => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <View style={styles.starsContainer}>
        {stars.map((star) => (
          <TouchableOpacity key={star} onPress={() => handleRateBook(star)}>
            <Ionicons 
              name={star <= currentRating ? "star" : "star-outline"} 
              size={32} 
              color={star <= currentRating ? "#F59E0B" : "#D1D5DB"} 
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderShelf = ({ item }: { item: any }) => {
    return (
      <View style={styles.shelfContainer}>
        <View style={styles.shelfHeader}>
            <View>
              <Text style={styles.shelfName}>{item.name}</Text>
              <Text style={styles.shelfBookCount}>{item.books?.length || 0} Kitap</Text>
            </View>
            <TouchableOpacity 
              style={styles.addBookToShelfBtn} 
              onPress={() => openSearchModalForShelf(item._id)}
            >
              <Ionicons name="add" size={16} color="#704f4a" />
              <Text style={styles.addBookToShelfText}>Kitap Ekle</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.shelfDivider} />
        
        {item.books && item.books.length > 0 ? (
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelfBooksContainer}>
             {item.books.map((bookId: any, index: number) => renderBook(bookId.toString(), item._id, index))}
           </ScrollView>
        ) : (
           <Text style={styles.emptyShelfText}>Bu rafta henüz kitap yok.</Text>
        )}
      </View>
    );
  };

  return (
     <SafeAreaView style={styles.container}>
       <View style={styles.header}>
         <Text style={styles.headerTitle}>Kitaplığım</Text>
         <TouchableOpacity style={styles.addShelfButton} onPress={() => setAddShelfModalVisible(true)}>
           <Ionicons name="add" size={20} color="#FFFFFF" />
           <Text style={styles.addShelfButtonText}>Yeni Raf</Text>
         </TouchableOpacity>
       </View>

       {isLoading ? (
          <ActivityIndicator size="large" color="#704f4a" style={{ marginTop: 50 }} />
       ) : (
          <FlatList
             data={shelves}
             renderItem={renderShelf}
             keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
             contentContainerStyle={{ paddingBottom: 20 }}
             ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 40, color: '#6B7280', fontSize: 16}}>Hiç rafınız yok. Yeni bir raf ekleyerek başlayın!</Text>}
          />
       )}

       {/* Yeni Raf Ekleme Modalı */}
       <Modal visible={isAddShelfModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Yeni Raf Ekle</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Örn: Okuyacaklarım"
                placeholderTextColor="#9CA3AF"
                value={newShelfName}
                onChangeText={setNewShelfName}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => { setAddShelfModalVisible(false); setNewShelfName(''); }}>
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleCreateShelf}>
                  <Text style={styles.saveButtonText}>Ekle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
       </Modal>

       {/* Kitap İşlem (Puanlama) Modalı */}
       <Modal visible={isBookModalVisible} transparent animationType="slide">
        <View style={styles.modalSlideOverlay}>
          <View style={styles.modalSlideContent}>
            {selectedBook && (
              <>
                <TouchableOpacity style={styles.modalCloseIcon} onPress={() => setIsBookModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>

                <View style={styles.modalBookInfo}>
                  <View style={[styles.modalBookCover, { backgroundColor: '#1E3A8A' }]}>
                    {selectedBook.imageLinks?.thumbnail ? (
                      <Image source={{ uri: selectedBook.imageLinks.thumbnail }} style={styles.coverImage} />
                    ) : (
                      <Text style={styles.bookCoverText}>{selectedBook.title ? selectedBook.title[0].toUpperCase() : '?'}</Text>
                    )}
                  </View>
                  <Text style={styles.modalBookTitle} numberOfLines={2}>{selectedBook.title}</Text>
                  <Text style={styles.modalBookAuthor} numberOfLines={1}>
                    {selectedBook.authors ? selectedBook.authors.join(', ') : selectedBook.author || 'Bilinmiyor'}
                  </Text>
                </View>

                {/* Puanlama Bölümü */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Puan Ver</Text>
                  {renderStars()}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Rafa Kitap Ekleme (Google Books Arama) Modalı */}
      <Modal visible={isSearchModalVisible} transparent animationType="slide">
        <View style={styles.fullScreenModal}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.searchModalHeader}>
              <TouchableOpacity onPress={() => setIsSearchModalVisible(false)} style={styles.closeSearchBtn}>
                <Ionicons name="arrow-back" size={24} color="#1F2937" />
              </TouchableOpacity>
              <View style={styles.searchModalInputContainer}>
                <FontAwesome name="search" size={18} color="#9CA3AF" />
                <TextInput 
                  style={styles.searchModalInput}
                  placeholder="Rafa eklemek için kitap ara..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearchSubmit}
                  returnKeyType="search"
                  autoFocus
                />
              </View>
            </View>

            {isSearching ? (
              <ActivityIndicator size="large" color="#704f4a" style={{ marginTop: 50 }} />
            ) : (
              <FlatList
                data={searchResults}
                renderItem={renderSearchedBook}
                keyExtractor={(item, idx) => item._id || item.googleId || item.id || idx.toString()}
                contentContainerStyle={{ padding: 15 }}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                ListEmptyComponent={
                  searchQuery.length > 0 ? (
                    <Text style={{textAlign: 'center', color: '#6B7280', marginTop: 20}}>Sonuç bulunamadı.</Text>
                  ) : (
                    <Text style={{textAlign: 'center', color: '#9CA3AF', marginTop: 50}}>
                      Tüm dünyadan kitap arayıp rafınıza ekleyebilirsiniz.
                    </Text>
                  )
                }
              />
            )}
          </SafeAreaView>
        </View>
      </Modal>

       {/* ALT MENÜ */}
       <View style={styles.bottomNav}>
         <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/search')}>
           <Ionicons name="search" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
           <Text style={styles.navText}>Arama</Text>
         </TouchableOpacity>

         <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/social')}>
           <Ionicons name="chatbubbles-outline" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
           <Text style={styles.navText}>Sosyal</Text>
         </TouchableOpacity>

         <TouchableOpacity style={styles.navItem} onPress={() => {}}>
           <Ionicons name="library" size={24} color="#704f4a" style={{ marginBottom: 4 }} />
           <Text style={styles.navTextActive}>Kitaplık</Text>
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
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#F9F6F0', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB' 
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E3A8A' },
  addShelfButton: { 
    flexDirection: 'row', 
    backgroundColor: '#8BA888', 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 20, 
    alignItems: 'center',
    gap: 4
  },
  addShelfButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  
  shelfContainer: { 
    backgroundColor: '#FFFFFF', 
    marginHorizontal: 15, 
    marginTop: 20, 
    borderRadius: 15, 
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  shelfHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 },
  shelfName: { fontSize: 18, fontWeight: 'bold', color: '#354c79' },
  shelfBookCount: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  addBookToShelfBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 4},
  addBookToShelfText: { fontSize: 12, color: '#704f4a', fontWeight: 'bold' },
  shelfDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 10, marginHorizontal: 15 },
  shelfBooksContainer: { paddingHorizontal: 15, gap: 15 },
  emptyShelfText: { color: '#9CA3AF', fontSize: 13, fontStyle: 'italic', paddingHorizontal: 15, paddingVertical: 10 },
  
  bookCard: { width: 100, marginBottom: 10, marginRight: 15 },
  bookCover: { 
    width: 100, 
    height: 140, 
    borderRadius: 8, 
    backgroundColor: '#1E3A8A', 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'relative'
  },
  coverImage: { width: '100%', height: '100%' },
  coverPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  bookCoverText: { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold', opacity: 0.8 },
  bookTitle: { fontSize: 12, fontWeight: 'bold', color: '#1F2937', marginTop: 8 },
  bookAuthor: { fontSize: 10, color: '#6B7280', marginTop: 2 },
  
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', padding: 25, borderRadius: 20, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#354c79', marginBottom: 15 },
  modalInput: { 
    backgroundColor: '#F9FAFB', 
    borderWidth: 1, 
    borderColor: '#D1D5DB', 
    borderRadius: 10, 
    padding: 12, 
    fontSize: 16, 
    color: '#1F2937', 
    marginBottom: 20 
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelButton: { paddingVertical: 10, paddingHorizontal: 20 },
  cancelButtonText: { color: '#6B7280', fontWeight: 'bold', fontSize: 15 },
  saveButton: { backgroundColor: '#8BA888', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  saveButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },

  modalSlideOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSlideContent: { backgroundColor: '#F9F6F0', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 50 },
  modalCloseIcon: { position: 'absolute', top: 20, right: 20, zIndex: 10 },
  modalBookInfo: { alignItems: 'center', marginBottom: 20 },
  modalBookCover: { width: 100, height: 150, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  modalBookTitle: { fontSize: 18, fontWeight: 'bold', color: '#354c79', textAlign: 'center', marginBottom: 5 },
  modalBookAuthor: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  modalSection: { paddingVertical: 10 },
  modalSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 10 },
  starsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10, paddingVertical: 10 },

  // Arama Modalı (Tam Ekran)
  fullScreenModal: { flex: 1, backgroundColor: '#FDFBF7' },
  searchModalHeader: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  closeSearchBtn: { padding: 5, marginRight: 10 },
  searchModalInputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 10, paddingHorizontal: 12, height: 40, gap: 8 },
  searchModalInput: { flex: 1, fontSize: 15, color: '#1F2937' },
  
  searchResultCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 10, borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  searchResultCover: { width: 60, height: 90, borderRadius: 6, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  searchResultInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  searchResultTitle: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  searchResultAuthor: { fontSize: 13, color: '#6B7280', marginBottom: 10 },
  addToListButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: '#8BA888', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, gap: 4 },
  addToListButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },

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
  navText: { fontSize: 10, color: '#6B7280', fontWeight: '500' },
  navTextActive: { fontSize: 10, color: '#704f4a', fontWeight: 'bold' }
});