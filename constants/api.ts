import Constants from 'expo-constants';
import { Platform } from 'react-native';

// 터널 URL 사용 시 여기에 입력 (localtunnel/ngrok), 아니면 null
const TUNNEL_URL: string | null = 'https://mediroutine.serveousercontent.com';

const getApiBaseUrl = (): string => {
  if (TUNNEL_URL) return TUNNEL_URL;

  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants.manifest2 as any)?.extra?.expoGo?.debuggerHost ??
    (Constants as any).manifest?.debuggerHost;

  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:8080`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }

  return 'http://localhost:8080';
};

export const API_BASE_URL = getApiBaseUrl();
console.log('[API_BASE_URL]', API_BASE_URL);
