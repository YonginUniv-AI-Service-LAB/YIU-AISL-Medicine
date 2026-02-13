import 'react-native-gesture-handler';
import React from 'react';
import { View, Image, Platform, StatusBar, useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 컴포넌트 임포트
import LoginPage from '../Components/LoginPage/LoginPage';
import SignUpPage from '../Components/SignUpPage/SignUpPage';
import ResetpasswordPage from '../Components/ResetpasswordPage/ResetpasswordPage';
import PwdCompletePage from '../Components/ResetpasswordPage/pwd'; // ✅ 추가됨
import HomeDetail from '../Components/homePage/HomePageDetail';
import MedicinePage from './MedicinePage/MedicinePage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ICONS = {
  beforeHome: require('../assets/images/Navigation/home_off.png'),
  afterHome: require('../assets/images/Navigation/home_on.png'),
  beforeMedicine: require('../assets/images/Navigation/medicine_off.png'),
  afterMedicine: require('../assets/images/Navigation/medicine_on.png'),
  beforeCalendar: require('../assets/images/Navigation/calendar_off.png'),
  afterCalendar: require('../assets/images/Navigation/calendar_on.png'),
  beforeShare: require('../assets/images/Navigation/share_off.png'),
  afterShare: require('../assets/images/Navigation/share_on.png'),
};

function useDeviceCategory(): 'smallPhone' | 'phone' | 'tablet' {
  const { width } = useWindowDimensions();
  if (width < 360) return 'smallPhone';
  if (width >= 768) return 'tablet';
  return 'phone';
}

function MainTabs() {
  const insets = useSafeAreaInsets();
  const sizeCategory = useDeviceCategory();
  const isIOS = Platform.OS === 'ios';

  let baseHeight = isIOS ? (sizeCategory === 'smallPhone' ? 40 : sizeCategory === 'tablet' ? 60 : 50) : 50;
  const extra = sizeCategory === 'tablet' ? 10 : sizeCategory === 'smallPhone' ? -5 : 0;
  const TAB_BAR_HEIGHT = baseHeight + insets.bottom + extra;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: TAB_BAR_HEIGHT,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0.5,
          borderColor: '#D9D9D9',
          paddingBottom: insets.bottom,
        },
        tabBarIcon: ({ focused }) => {
          let src;
          switch (route.name) {
            case 'Home': src = focused ? ICONS.afterHome : ICONS.beforeHome; break;
            case 'Medicine': src = focused ? ICONS.afterMedicine : ICONS.beforeMedicine; break;
            case 'Calendar': src = focused ? ICONS.afterCalendar : ICONS.beforeCalendar; break;
            case 'Share': src = focused ? ICONS.afterShare : ICONS.beforeShare; break;
            default: src = ICONS.beforeHome;
          }
          return <Image source={src} style={{ width: 24, height: 24 }} resizeMode="contain" />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeDetail} />
      <Tab.Screen name="Medicine" component={MedicinePage} />
      <Tab.Screen name="Calendar" component={() => <View style={{ flex: 1, backgroundColor: '#f9f9f9' }} />} />
      <Tab.Screen name="Share" component={() => <View style={{ flex: 1, backgroundColor: '#f9f9f9' }} />} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const isIOS = Platform.OS === 'ios';
  
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle={isIOS ? 'dark-content' : 'default'} backgroundColor="transparent" translucent />
        <Stack.Navigator initialRouteName="LoginPage" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen name="SignUp" component={SignUpPage} />
          <Stack.Screen name="ResetpasswordPage" component={ResetpasswordPage} />
          <Stack.Screen name="pwd" component={PwdCompletePage} /> 
          <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}