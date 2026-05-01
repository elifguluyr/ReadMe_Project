import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  FlatList, 
  TouchableOpacity,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socialAPI, decodeJWT } from '../services/api';

const { width, height } = Dimensions.get('window');

// Brown Color Palette
const COLORS = {
  primary: '#704f4a',
  secondary: '#8b6b64',
  lightBrown: '#d9c8c0',
  veryLightBrown: '#F9F6F0',
  background: '#FDFBF7',
  textDark: '#3A2E2B',
  textLight: '#8A7B76',
  white: '#FFFFFF',
  red: '#D9534F'
};

export default function SocialScreen() {
  const router = useRouter();
  
  const [posts, setPosts] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newPostText, setNewPostText] = useState('');
  
  // Comments Modal States
  const [isCommentsVisible, setCommentsVisible] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  useEffect(() => {
    loadUserAndPosts();
  }, []);

  const loadUserAndPosts = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      let userId = null;
      if (token) {
        const decoded = decodeJWT(token);
        userId = decoded?._id || decoded?.id;
        setCurrentUserId(userId);
      }
      await fetchPosts(userId);
    } catch (e) {
      console.error(e);
      Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPosts = async (userId?: string | null) => {
    try {
      const activeUserId = userId || currentUserId;
      const data = await socialAPI.getPosts();
      
      if (data && Array.isArray(data)) {
        const formatted = data.map(p => formatPost(p, activeUserId));
        setPosts(formatted);
      } else if (data && data.veri) {
        setPosts([]);
      }
    } catch (e) {
      console.error('Fetch posts error:', e);
      Alert.alert('Hata', 'Paylaşımlar yüklenemedi.');
    }
  };

  const formatPost = (p: any, userId: string | null) => {
    const isOwner = p.user?._id === userId;
    const isLiked = p.likedBy?.includes(userId);
    
    const formattedComments = (p.comments || []).map((c: any) => ({
      id: c._id,
      user: c.user?.name || 'Bilinmeyen Kullanıcı',
      userId: c.user?._id,
      avatarColor: COLORS.secondary,
      text: c.commentText,
      isOwner: c.user?._id === userId,
      time: new Date(c.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    }));

    return {
      id: p._id,
      user: p.user?.name || 'Bilinmeyen Kullanıcı',
      avatarColor: COLORS.primary,
      content: p.postText,
      likes: p.likedBy?.length || 0,
      comments: formattedComments.length,
      isLiked: !!isLiked,
      isOwner: isOwner,
      time: new Date(p.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      commentsList: formattedComments,
      likedBy: p.likedBy || []
    };
  };

  const handleCreatePost = async () => {
    if (!newPostText.trim()) return;
    try {
      await socialAPI.createPost(newPostText);
      setNewPostText('');
      fetchPosts();
    } catch (e) {
      Alert.alert('Hata', 'Paylaşım yapılamadı.');
    }
  };

  const handleToggleLike = async (postId: string) => {
    try {
      setPosts(posts.map(p => {
        if (p.id === postId) {
          const liked = !p.isLiked;
          return { ...p, isLiked: liked, likes: liked ? p.likes + 1 : p.likes - 1 };
        }
        return p;
      }));
      await socialAPI.toggleLike(postId);
    } catch (e) {
      Alert.alert('Hata', 'Beğeni işlemi başarısız.');
      fetchPosts();
    }
  };

  const handleDeletePost = (postId: string) => {
    Alert.alert(
      "Gönderiyi Sil",
      "Bu gönderiyi silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Sil", 
          style: "destructive",
          onPress: async () => {
            try {
              await socialAPI.deletePost(postId);
              setPosts(posts.filter(post => post.id !== postId));
            } catch(e) {
              Alert.alert('Hata', 'Gönderi silinemedi.');
            }
          }
        }
      ]
    );
  };

  const openComments = (postId: string) => {
    setActivePostId(postId);
    setCommentsVisible(true);
    setEditingCommentId(null);
    setNewCommentText('');
  };

  const closeComments = () => {
    setCommentsVisible(false);
    setActivePostId(null);
  };

  const handleSendComment = async () => {
    if (!newCommentText.trim() || !activePostId) return;

    try {
      if (editingCommentId) {
        await socialAPI.updateComment(activePostId, editingCommentId, newCommentText);
      } else {
        await socialAPI.createComment(activePostId, newCommentText);
      }
      setNewCommentText('');
      setEditingCommentId(null);
      await fetchPosts();
    } catch (e) {
      Alert.alert('Hata', 'Yorum işlemi başarısız.');
    }
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    Alert.alert("Yorumu Sil", "Bu yorumu silmek istiyor musunuz?", [
      { text: "İptal", style: "cancel" },
      { text: "Sil", style: "destructive", onPress: async () => {
        try {
          await socialAPI.deleteComment(postId, commentId);
          await fetchPosts();
        } catch(e) {
          Alert.alert('Hata', 'Yorum silinemedi.');
        }
      }}
    ]);
  };

  const handleEditCommentClick = (commentId: string, text: string) => {
    setEditingCommentId(commentId);
    setNewCommentText(text);
  };

  const renderPost = ({ item }: { item: any }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
            <Text style={styles.avatarText}>{item.user.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.user}</Text>
            <Text style={styles.postTime}>{item.time}</Text>
          </View>
        </View>
        {item.isOwner && (
          <TouchableOpacity onPress={() => handleDeletePost(item.id)} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={20} color={COLORS.red} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleToggleLike(item.id)}>
          <Ionicons name={item.isLiked ? "heart" : "heart-outline"} size={22} color={item.isLiked ? COLORS.red : COLORS.textLight} />
          <Text style={[styles.actionText, item.isLiked && { color: COLORS.red }]}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => openComments(item.id)}>
          <Ionicons name="chatbubble-outline" size={20} color={COLORS.textLight} />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const activePost = posts.find(p => p.id === activePostId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sosyal Akış</Text>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View style={styles.createPostContainer}>
                <View style={styles.createPostInputWrapper}>
                  <View style={[styles.avatar, { backgroundColor: COLORS.secondary, width: 36, height: 36, marginRight: 10 }]}>
                    <Text style={[styles.avatarText, { fontSize: 16 }]}>?</Text>
                  </View>
                  <TextInput
                    style={styles.createPostInput}
                    placeholder="Bugün ne okuyorsun?"
                    placeholderTextColor={COLORS.textLight}
                    multiline
                    value={newPostText}
                    onChangeText={setNewPostText}
                  />
                </View>
                <View style={[styles.createPostActions, { justifyContent: 'flex-end' }]}>
                  <TouchableOpacity 
                    style={[styles.publishButton, !newPostText.trim() && styles.publishButtonDisabled]} 
                    onPress={handleCreatePost}
                    disabled={!newPostText.trim()}
                  >
                    <Text style={styles.publishButtonText}>Paylaş</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', color: COLORS.textLight, marginTop: 20 }}>Henüz paylaşım yok.</Text>
            }
          />
        )}
      </KeyboardAvoidingView>

      <Modal
        visible={isCommentsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeComments}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yorumlar</Text>
              <TouchableOpacity onPress={closeComments}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={activePost?.commentsList || []}
              keyExtractor={item => item.id}
              contentContainerStyle={{ padding: 15 }}
              renderItem={({ item }) => (
                <View style={styles.commentCard}>
                  <View style={[styles.avatar, { width: 32, height: 32, backgroundColor: item.avatarColor }]}>
                    <Text style={[styles.avatarText, { fontSize: 14 }]}>{item.user.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={styles.commentBody}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentUser}>{item.user}</Text>
                      <Text style={styles.commentTime}>{item.time}</Text>
                    </View>
                    <Text style={styles.commentText}>{item.text}</Text>
                    {item.isOwner && (
                      <View style={styles.commentActions}>
                        <TouchableOpacity onPress={() => handleEditCommentClick(item.id, item.text)}>
                          <Text style={styles.commentActionText}>Düzenle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteComment(activePostId!, item.id)}>
                          <Text style={[styles.commentActionText, { color: COLORS.red }]}>Sil</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              )}
            />
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Yorumunu yaz..."
                placeholderTextColor={COLORS.textLight}
                value={newCommentText}
                onChangeText={setNewCommentText}
                multiline
              />
              <TouchableOpacity 
                style={[styles.sendCommentButton, !newCommentText.trim() && { opacity: 0.5 }]}
                onPress={handleSendComment}
                disabled={!newCommentText.trim()}
              >
                <Ionicons name={editingCommentId ? "checkmark" : "send"} size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/search')}>
          <Ionicons name="search-outline" size={24} color={COLORS.textLight} style={{ marginBottom: 4 }} />
          <Text style={styles.navText}>Arama</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="chatbubbles" size={24} color={COLORS.primary} style={{ marginBottom: 4 }} />
          <Text style={styles.navTextActive}>Sosyal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/books')}>
          <Ionicons name="library-outline" size={24} color={COLORS.textLight} style={{ marginBottom: 4 }} />
          <Text style={styles.navText}>Kitaplık</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Ionicons name="person-outline" size={24} color={COLORS.textLight} style={{ marginBottom: 4 }} />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, paddingTop: Platform.OS === 'android' ? 40 : 20, backgroundColor: COLORS.veryLightBrown, borderBottomWidth: 1, borderBottomColor: COLORS.lightBrown, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  listContent: { padding: 15, paddingBottom: 30 },
  createPostContainer: { backgroundColor: COLORS.white, borderRadius: 16, padding: 15, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  createPostInputWrapper: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  createPostInput: { flex: 1, fontSize: 16, color: COLORS.textDark, minHeight: 60, paddingTop: 8 },
  createPostActions: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.veryLightBrown, paddingTop: 10 },
  publishButton: { backgroundColor: COLORS.primary, paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  publishButtonDisabled: { backgroundColor: COLORS.lightBrown },
  publishButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 },
  postCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  userName: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
  postTime: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  deleteButton: { padding: 8 },
  postContent: { fontSize: 15, color: COLORS.textDark, lineHeight: 22, marginBottom: 16 },
  postActions: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.veryLightBrown, paddingTop: 12 },
  actionButton: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  actionText: { marginLeft: 6, fontSize: 14, color: COLORS.textLight, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, height: height * 0.7, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.lightBrown },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark },
  commentCard: { flexDirection: 'row', marginBottom: 15 },
  commentBody: { flex: 1, backgroundColor: COLORS.white, borderRadius: 12, padding: 12, marginLeft: 10, borderWidth: 1, borderColor: COLORS.veryLightBrown },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  commentUser: { fontWeight: 'bold', fontSize: 14, color: COLORS.textDark },
  commentTime: { fontSize: 12, color: COLORS.textLight },
  commentText: { fontSize: 14, color: COLORS.textDark, lineHeight: 20 },
  commentActions: { flexDirection: 'row', marginTop: 8, gap: 15 },
  commentActionText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  commentInputContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.lightBrown },
  commentInput: { flex: 1, backgroundColor: COLORS.veryLightBrown, borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, maxHeight: 100, color: COLORS.textDark, marginRight: 10 },
  sendCommentButton: { backgroundColor: COLORS.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  bottomNav: { flexDirection: 'row', backgroundColor: COLORS.white, paddingVertical: 15, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: COLORS.lightBrown, justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center', flex: 1 },
  navText: { fontSize: 10, color: COLORS.textLight, fontWeight: '500' },
  navTextActive: { fontSize: 10, color: COLORS.primary, fontWeight: 'bold' },
});