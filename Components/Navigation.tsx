import 'react-native-gesture-handler';
import React from 'react';
import {
  View,
  Image,
  Platform,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  useSafeAreaInsets,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

// 페이지
import LoginPage from '../Components/LoginPage/LoginPage';
import SignUpPage from '../Components/SignUpPage/SignUpPage';
import ResetpasswordPage from '../Components/ResetpasswordPage/ResetpasswordPage';
import PwdCompletePage from '../Components/ResetpasswordPage/pwd';
import HomeDetail from '../Components/homePage/HomePageDetail';
import MedicinePage from './MedicinePage/MedicinePage';
import CalendarScreen from '../Components/CalendarPage/calendar';

// ⭐ 일정 추가 모달
import AddScheduleScreen from '../Components/CalendarPage/AddScheduleScreen';

// ⭐ 추가 (전역 약 데이터 저장소)
import { MedicineProvider } from '../contexts/MedicineContext';

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

  let baseHeight = isIOS
    ? sizeCategory === 'smallPhone'
      ? 40
      : sizeCategory === 'tablet'
        ? 60
        : 50
    : 50;

  const extra =
    sizeCategory === 'tablet' ? 10 : sizeCategory === 'smallPhone' ? -5 : 0;

  const TAB_BAR_HEIGHT = baseHeight + insets.bottom + extra;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: TAB_BAR_HEIGHT,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0.5,
          borderColor: '#D9D9D9',
          paddingBottom: insets.bottom,
        },
        tabBarIcon: ({ focused }) => {
          let src;
          switch (route.name) {
            case 'Home':
              src = focused ? ICONS.afterHome : ICONS.beforeHome;
              break;
            case 'Medicine':
              src = focused ? ICONS.afterMedicine : ICONS.beforeMedicine;
              break;
            case 'Calendar':
              src = focused ? ICONS.afterCalendar : ICONS.beforeCalendar;
              break;
            case 'Share':
              src = focused ? ICONS.afterShare : ICONS.beforeShare;
              break;
            default:
              src = ICONS.beforeHome;
          }
          return (
            <Image
              source={src}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeDetail} />
      <Tab.Screen name="Medicine" component={MedicinePage} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen
        name="Share"
        component={() => (
          <View style={{ flex: 1, backgroundColor: '#f9f9f9' }} />
        )}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const isIOS = Platform.OS === 'ios';

  return (
    <SafeAreaProvider>
      {/* ⭐ 여기만 추가됨 */}
      <MedicineProvider>
        <NavigationContainer>
          <View style={{ flex: 1 }}>
            <StatusBar
              barStyle={isIOS ? 'dark-content' : 'default'}
              backgroundColor="transparent"
              translucent
            />

            {/* 메인 스택 */}
            <Stack.Navigator
              initialRouteName="Main"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="LoginPage" component={LoginPage} />
              <Stack.Screen name="SignUp" component={SignUpPage} />
              <Stack.Screen
                name="ResetpasswordPage"
                component={ResetpasswordPage}
              />
              <Stack.Screen name="pwd" component={PwdCompletePage} />

              {/* 탭 */}
              <Stack.Screen name="Main" component={MainTabs} />

              {/* ⭐ 모달 화면 */}
              <Stack.Screen
                name="AddSchedule"
                component={AddScheduleScreen}
                options={{
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }}
              />
            </Stack.Navigator>
          </View>
        </NavigationContainer>
      </MedicineProvider>
    </SafeAreaProvider>
  );
}
