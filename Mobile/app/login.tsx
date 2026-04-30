import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, decodeJWT } from '../services/api';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (!email || !password) {
        setError('Lütfen e-posta ve şifre giriniz.');
        setIsLoading(false);
        return;
      }

      const data = await authAPI.login(email, password);
      
      const token = data.token;
      await AsyncStorage.setItem('userToken', token);
      
      const decoded = decodeJWT(token);
      if (decoded && decoded._id) {
        await AsyncStorage.setItem('userId', decoded._id);
        await AsyncStorage.setItem('userData', JSON.stringify(decoded));
        setIsLoading(false);
        router.replace('/search');
      } else {
        throw new Error('Geçersiz token alındı.');
      }

    } catch (err: any) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.status || err.message || 'Giriş başarısız.';
      setError(errorMessage);
      Alert.alert('Hata', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Üst Başlık Alanı */}
      <View style={styles.headerContainer}>
        <Image 
            source={require('../assets/images/icon.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
          <Text style={styles.title}>Hoş Geldiniz</Text>
          <Text style={styles.subtitle}>ReadMe dünyasına giriş yapın</Text>
      </View>

      {/* Form Alanı */}
      <View style={styles.formContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-posta Adresi</Text>
          <TextInput
            style={styles.input}
            placeholder="ornek@mail.com"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Şifre</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
            secureTextEntry // Şifreyi gizler
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Ek Seçenekler (Beni Hatırla & Şifremi Unuttum) */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.checkboxContainer}>
            <View style={styles.checkbox} />
            <Text style={styles.checkboxLabel}>Beni Hatırla</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Şifremi Unuttum</Text>
          </TouchableOpacity>
        </View>

        {/* Giriş Butonu */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Giriş Yap</Text>
          )}
        </TouchableOpacity>

        {/* Alt Yönlendirme */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Hesabınız yok mu? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.signupText}>Hemen Kaydol</Text>
          </TouchableOpacity>

        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6F0', 
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 180, 
    height: 180,
    marginBottom: 15,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#354c79', 
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f9b7c', 
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5, 
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 0.2)',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB', 
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '500',
    color: '#354c79',
  },
  button: {
    backgroundColor: '#704f4acb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#090909',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#7f9b7c',
  },
  signupText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#354c79',
  },
});