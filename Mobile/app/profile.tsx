import React, { useState } from 'react';
import { Alert, Pressable } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/build/Feather';
import Ionicons from '@expo/vector-icons/build/Ionicons';

export default function ProfileScreen() {
  const router = useRouter();

  // Şimdilik API olmadığı için sahte (mock) kullanıcı verisi
  const [user, setUser] = useState({
    name: 'Elif Gül Uyar',
    email: 'elif@example.com',
    bio: 'Yeni kitaplar keşfetmeyi seviyorum.',
    following: 42,
    followers: 18,
    posts: [] as { id: number; content: string; date: string }[],
    profileImage: '',
  });

  const [activeTab, setActiveTab] = useState('hakkinda'); // hakkinda, paylasimlar
  const [isEditing, setIsEditing] = useState(false);
  const [isFollowsModalVisible, setIsFollowsModalVisible] = useState(false);
  const [followsModalTab, setFollowsModalTab] = useState('following'); 
  const [editForm, setEditForm] = useState({ ...user });
  const [password, setPassword] = useState('');

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleUpdate = () => {
    setUser({ ...user, ...editForm });
    setIsEditing(false);
    alert('Profil başarıyla güncellendi!');
  };

  const handleLogout = () => {
    // İleride buraya Token silme işlemi gelecek
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Üst Banner (3 Renkli Gradient Geçişi) */}
        <LinearGradient
          colors={['#483431','#8BA888','#263a62']} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerBanner}
        />

        {/* Profil Kartı Ana Gövde */}
        <View style={styles.profileCard}>
          
          {/* Avatar ve Butonlar (Banner'ın üstüne taşan kısım) */}
          <View style={styles.topSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
            </View>
            
            <View style={styles.actionButtons}>
              <Pressable 
                style={({ pressed }) => [
                  styles.editButton, 
                  pressed && { backgroundColor: '#8BA888' }
                ]} 
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>Profili Düzenle</Text>
              </Pressable>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Kullanıcı Bilgileri */}
          <View style={styles.userInfo}>
            <View style={styles.emailRow}>
                <Feather name="mail" size={16} color="#704f4a" />
                <Text style={styles.emailText}>{user.email}</Text>
              </View>
            
            <View style={styles.statsContainer}>
              <TouchableOpacity 
                style={styles.statBox} 
                onPress={() => { setFollowsModalTab('following'); setIsFollowsModalVisible(true); }}
              >
                <Text style={styles.statNumber}>{user.following}</Text>
                <Text style={styles.statLabel}>TAKİP EDİLEN</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.statBox} 
                onPress={() => { setFollowsModalTab('followers'); setIsFollowsModalVisible(true); }}
              >
                <Text style={styles.statNumber}>{user.followers}</Text>
                <Text style={styles.statLabel}>TAKİPÇİ</Text>
              </TouchableOpacity>
            </View>
        </View>

          {/* Sekmeler (Tabs) */}
          <View style={styles.tabsContainer}>
              
              <TouchableOpacity style={[styles.tab, activeTab === 'hakkinda' && styles.activeTab]} onPress={() => setActiveTab('hakkinda')}>
                <Text style={[styles.tabText, activeTab === 'hakkinda' && styles.activeTabText]}>Hakkında</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.tab} onPress={() => router.push('/books' as any)}>
                <Text style={styles.tabText}>Kitaplık</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.tab, activeTab === 'paylasimlar' && styles.activeTab]} onPress={() => setActiveTab('paylasimlar')}>
                <Text style={[styles.tabText, activeTab === 'paylasimlar' && styles.activeTabText]}>Gönderiler</Text>
              </TouchableOpacity>

          </View>

          {/* Sekme İçerikleri */}
          <View style={styles.tabContent}>
            {activeTab === 'hakkinda' && (
              <View style={styles.bioBox}>
                <Text style={styles.bioTitle}>Biyografi</Text>
                <Text style={styles.bioText}>{user.bio}</Text>
              </View>
            )}

            {activeTab === 'paylasimlar' && (
              <View>
                {user.posts && user.posts.length > 0 ? (
                  user.posts.map(post => (
                    <View key={post.id} style={styles.postBox}>
                      <Text style={styles.postContent}>{post.content}</Text>
                      <Text style={styles.postDate}>Paylaşım: {post.date}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyStateIcon}>📄</Text>
                    <Text style={styles.emptyStateTitle}>Henüz hiç paylaşım yapmadınız.</Text>
                    <Text style={styles.emptyStateDesc}>
                      Okuduğunuz kitaplar hakkında ilk düşüncenizi paylaşmak için harika bir zaman!
                    </Text>
                    {/* Gönderi Sayfasına Gidiş */}
                    <TouchableOpacity style={styles.emptyStateButton} onPress={() => router.push('/social' as any)}>
                      <Text style={styles.emptyStateButtonText}>İlk Gönderini Paylaş</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

        {/* Takipçi/Takip Edilen Listesi Modalı */}
      <Modal visible={isFollowsModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { minHeight: 500 }]}>
            
            {/* Modal Üst Sekme Geçişi */}
            <View style={styles.modalTabHeader}>
              <TouchableOpacity 
                style={[styles.modalTabButton, followsModalTab === 'following' && styles.modalTabActive]}
                onPress={() => setFollowsModalTab('following')}
              >
                <Text style={[styles.modalTabText, followsModalTab === 'following' && styles.modalTabActiveText]}>Takip Edilen</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalTabButton, followsModalTab === 'followers' && styles.modalTabActive]}
                onPress={() => setFollowsModalTab('followers')}
              >
                <Text style={[styles.modalTabText, followsModalTab === 'followers' && styles.modalTabActiveText]}>Takipçi</Text>
              </TouchableOpacity>
            </View>

            {/* Liste Alanı (Şimdilik Boş/Mock) */}
            <ScrollView style={{ marginTop: 20 }}>
              <View style={styles.emptyFollowsContainer}>
                <Text style={styles.emptyFollowsText}>
                  {followsModalTab === 'following' 
                    ? "Henüz kimseyi takip etmiyorsunuz." 
                    : "Henüz takipçiniz bulunmuyor."}
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={styles.modalCloseButton} 
              onPress={() => setIsFollowsModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profili Düzenle Modalı */}
      <Modal visible={isEditing} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            
            {/* Modal Başlığı */}
            <View style={styles.modalHeaderBlue}>
              <Text style={styles.modalHeaderText}>Profili Düzenle</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ad Soyad</Text>
                <TextInput 
                  style={styles.input} 
                  value={editForm.name} 
                  onChangeText={(t) => setEditForm({...editForm, name: t})} 
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-posta</Text>
                <TextInput 
                  style={styles.input} 
                  keyboardType="email-address"
                  value={editForm.email} 
                  onChangeText={(t) => setEditForm({...editForm, email: t})} 
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Yeni Şifre <Text style={{fontSize:10, color:'#9CA3AF'}}>(Değiştirmemek için boş bırak)</Text></Text>
                <TextInput 
                  style={styles.input} 
                  secureTextEntry
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Biyografi</Text>
                <TextInput 
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
                  multiline 
                  value={editForm.bio} 
                  onChangeText={(t) => setEditForm({...editForm, bio: t})} 
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Profil Resmi URL</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="https://örnek.com/resim.jpg"
                  value={editForm.profileImage} 
                  onChangeText={(t) => setEditForm({...editForm, profileImage: t})} 
                />
              </View>

              {/* HESABI SİL BUTONU (Senin Backend Gereksinimin) */}
              <TouchableOpacity 
                style={styles.deleteAccountButton}
                onPress={() => {
                  Alert.alert(
                    "Hesabı Sil",
                    "Hesabınızı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
                    [
                      { text: "Vazgeç", style: "cancel" },
                      { text: "SİL", onPress: () => Alert.alert("Backend bağlandığında hesap silinecek."), style: "destructive" }
                    ]
                  );
                }}
              >
                <Text style={styles.deleteAccountText}>Hesabımı Kalıcı Olarak Sil</Text>
              </TouchableOpacity>

            </ScrollView>

            {/* Alt Butonlar */}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.modalCancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <Pressable 
                style={({ pressed }) => [
                  styles.modalSaveButton, 
                  pressed && { backgroundColor: '#354c79' } // Basılı tutarken yeşil olacak
                ]} 
                onPress={handleUpdate}
              >
                <Text style={styles.modalSaveButtonText}>Kaydet</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
       {/* ALT MENÜ  */}
      <View style={styles.bottomNav}>

        {/* Arama */}
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/search')}>
          <Ionicons name="search" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
          <Text style={styles.navText}>Arama</Text>
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
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="person-outline" size={24} color="#704f4a" style={{ marginBottom: 4 }} />
          <Text style={styles.navTextActive}>Profil</Text>
        </TouchableOpacity>
        
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F6F0' },
  headerBanner: { height: 120, backgroundColor: '#354c79' },
  profileCard: { backgroundColor: '#F9F6F0', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, paddingHorizontal: 20, flex: 1, minHeight: 600 },
  topSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: -40, marginBottom: 15 },
  avatarContainer: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#8BA888', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' },
  actionButtons: { flexDirection: 'row', gap: 10, paddingBottom: 10 },
  editButton: { backgroundColor: '#263a62', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10 },
  editButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#cfb6b2bf', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  logoutButtonText: { color: '#704f4a', fontSize: 12, fontWeight: 'bold' },
  userInfo: { marginBottom: 20 },
  nameText: { fontSize: 24, fontWeight: 'bold', color: '#354c79' },
  emailText: { fontSize: 14, color: '#704f4ad5', marginTop: 4 },
  statsContainer: { flexDirection: 'row', gap: 20, marginTop: 15 },
  statBox: { alignItems: 'flex-start' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#354c79' },
  statLabel: { fontSize: 10, color: '#748099', marginTop: 2, letterSpacing: 1 },
  tabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#704f4a', marginBottom: 20 },
  emptyStateContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#704f4a',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
    borderStyle: 'dashed' // Etrafındaki kesik çizgiler için
  },
  tab: { paddingVertical: 10, paddingHorizontal: 15 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#354c79' },
  tabText: { fontSize: 14, color: '#704f4a', fontWeight: '600' },
  activeTabText: { color: '#354c79' },
  tabContent: { paddingBottom: 30 },
  bioBox: { backgroundColor: '#F9FAFB', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#F3F4F6' },
  bioTitle: { fontSize: 16, fontWeight: 'bold', color: '#354c79', marginBottom: 8 },
  bioText: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  postBox: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10 },
  postContent: { fontSize: 14, color: '#354c79', marginBottom: 10 },
  postDate: { fontSize: 12, color: '#9CA3AF' },
  emptyStateIcon: { fontSize: 40, opacity: 0.5, marginBottom: 15 },
  emptyStateTitle: { fontSize: 16, fontWeight: 'bold', color: '#354c79', marginBottom: 10, textAlign: 'center' },
  emptyStateDesc: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 20, lineHeight: 20, paddingHorizontal: 10 },
  emptyStateButton: { backgroundColor: '#8BA888', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25 }, // Resimdeki adaçayı yeşili
  emptyStateButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  modalTabHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  modalTabButton: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  modalTabActive: { borderBottomWidth: 2, borderBottomColor: '#354c79' },
  modalTabText: { fontSize: 16, color: '#6B7280', fontWeight: '600' },
  modalTabActiveText: { color: '#354c79' },
  emptyFollowsContainer: { padding: 40, alignItems: 'center' },
  emptyFollowsText: { color: '#9CA3AF', textAlign: 'center', fontSize: 14 },
  modalCloseButton: { backgroundColor: '#cfb6b2bf', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  modalCloseButtonText: { color: '#704f4a', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#F9F6F0', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, minHeight: 400 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#354c79', marginBottom: 20 },
  modalHeaderBlue: { 
    backgroundColor: '#354c79', 
    padding: 20, 
    borderTopLeftRadius: 25, 
    borderTopRightRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalHeaderText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  inputGroup: { marginBottom: 15 },
  deleteAccountButton: {
    marginTop: 10,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f7bbbb',
    alignItems: 'flex-start'
  },
  deleteAccountText: { 
    color: '#EF4444', 
    fontWeight: 'bold', 
    fontSize: 14,
    textDecorationLine: 'underline'
  },
  modalFooter: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    padding: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#F3F4F6',
    gap: 15
  },
  modalCancelButton: { paddingVertical: 10 },
  modalCancelButtonText: { color: '#6B7280', fontWeight: 'bold' },
  modalSaveButton: { backgroundColor: '#8BA888', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 12 },
  modalSaveButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  label: { fontSize: 12, color: '#4B5563', marginBottom: 5, fontWeight: '600' },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 12, marginBottom: 15, color: '#1F2937' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  cancelButton: { paddingVertical: 10, paddingHorizontal: 20 },
  cancelButtonText: { color: '#4B5563', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#354c79', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  saveButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
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
  navTextActive: { fontSize: 10, color: '#1E3A8A', fontWeight: 'bold' },
  emailRow: { 
    flexDirection: 'row', 
    alignItems: 'center',  
    gap: 6,               
    marginTop: 4          
  },
});