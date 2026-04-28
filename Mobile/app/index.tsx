import { Redirect } from 'expo-router';

export default function Index() {
  // Uygulama açılır açılmaz doğrudan login sayfasına yönlendir!
  return <Redirect href="/login" />;
}