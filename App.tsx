import React, { useEffect, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import RootNavigator from './Components/Navigation';
import { ScheduleProvider } from './contexts/ScheduleContext';
import { MedicineProvider } from './contexts/MedicineContext';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';

axios.defaults.withCredentials = true;

// 자동 숨김 방지 (앱 시작 시 1회)
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  /** 폰트 로딩 완료되면 스플래시 제거 */
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <MedicineProvider>
      <ScheduleProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <RootNavigator />
        </View>
      </ScheduleProvider>
    </MedicineProvider>
  );
}
