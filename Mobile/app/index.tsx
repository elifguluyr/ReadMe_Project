import React, { useEffect } from 'react';
import { Redirect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        router.replace('/search');
      }
    } catch (e) {
      console.error('Session check failed', e);
    }
  };

  return <Redirect href="/login" />;
}