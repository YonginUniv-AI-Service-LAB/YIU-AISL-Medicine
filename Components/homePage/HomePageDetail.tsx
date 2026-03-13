import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, G } from 'react-native-svg';
import axios from 'axios';
import { styles } from './HomePageDetail.styles';
import MenuPopup from './MenuPopup';
import SituationPopup from './SituationPopup';

const API_BASE_URL = 'http://192.168.0.118:8080';

// 반응형
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const wp = (size: number) => (size / 393) * SCREEN_WIDTH;

// 차트 상수
const RADIUS = wp(80);
const CENTER = wp(90);

const ChartSegment = ({
  startAngle,
  endAngle,
  color,
  isSelected,
  onPress,
}: any) => {
  const getPathData = (s: number, e: number, r: number) => {
    const x1 = CENTER + r * Math.cos((Math.PI * (s - 0.1)) / 180);
    const y1 = CENTER + r * Math.sin((Math.PI * (s - 0.1)) / 180);
    const x2 = CENTER + r * Math.cos((Math.PI * (e + 0.1)) / 180);
    const y2 = CENTER + r * Math.sin((Math.PI * (e + 0.1)) / 180);
    const largeArcFlag = e - s <= 180 ? '0' : '1';

    return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const feedbackRadius = isSelected ? RADIUS + wp(4) : RADIUS;

  return (
    <G onPressIn={onPress}>
      <Path
        d={getPathData(startAngle, endAngle, feedbackRadius)}
        fill={color}
        opacity={isSelected ? 1 : 0.6}
        stroke={color}
        strokeWidth="0.5"
      />
      <Path
        d={getPathData(startAngle, endAngle, feedbackRadius)}
        fill="transparent"
        onPressIn={onPress}
      />
    </G>
  );
};

export default function HomeDetailPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMenuPopupVisible, setIsMenuPopupVisible] = useState(false);
  const [isSituationVisible, setIsSituationVisible] = useState(false);
  const [popupType, setPopupType] = useState<'logout' | 'reset' | 'withdraw'>(
    'logout',
  );

  const [userName, setUserName] = useState('사용자');
  const route = useRoute<any>();

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true,
      });

      const user = res.data?.data?.user;

      if (user && user.name) {
        setUserName(user.name);
      }
    } catch (error: any) {
      console.log('사용자 조회 실패');
      console.log(error?.response?.status);
      console.log(error?.response?.data);
    }
  };

  useEffect(() => {
    const user = route?.params?.user;

    // 로그인 화면에서 user를 넘겨준 경우
    if (user?.name) {
      setUserName(user.name);
      return;
    }

    // user 정보가 없으면 서버에서 조회
    fetchUser();
  }, [route?.params]);

  const [segments, setSegments] = useState([
    { label: '복용 완료', count: 0, color: '#189CEF', detail: '' },
    { label: '미복용', count: 0, color: '#0DC9BA', detail: '' },
    { label: '복용 전', count: 0, color: '#D9D9D9', detail: '' },
  ]);

  const today = new Date().toISOString().split('T')[0];

  // API 호출
  const fetchMedicationData = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/medicines/daily?date=${today}`,
        { withCredentials: true },
      );
      const data = res.data.data;

      const user = res.data?.data?.user;

      if (user) {
        setUserName(user.name);
      }

      const medicines = res.data.data || [];

      const taken = medicines.filter((m: any) => m.taken).length;
      const notTaken = medicines.filter((m: any) => !m.taken).length;

      setSegments([
        {
          label: '복용 완료',
          count: taken,
          color: '#189CEF',
          detail: '복용 완료 약',
        },
        {
          label: '미복용',
          count: notTaken,
          color: '#0DC9BA',
          detail: '미복용 약',
        },
        {
          label: '복용 전',
          count: data.before,
          color: '#D9D9D9',
          detail: '복용 예정 약',
        },
      ]);
    } catch (error) {}
  };

  // ⭐ 화면 진입 시 API 호출
  useEffect(() => {
    fetchMedicationData();
  }, []);

  const total = segments.reduce((sum, s) => sum + s.count, 0);

  const maxSegment = segments.reduce((prev, current) =>
    prev.count > current.count ? prev : current,
  );

  let currentAngle = -90;

  const chartSegments = segments.map((s) => {
    const sweep = total === 0 ? 0 : (s.count / total) * 360;

    const data = {
      startAngle: currentAngle,
      endAngle: currentAngle + sweep,
      color: s.color,
    };

    currentAngle += sweep;

    return data;
  });

  const handleMenuSelect = (type: 'logout' | 'reset' | 'withdraw') => {
    setPopupType(type);
    setIsMenuPopupVisible(false);

    setTimeout(() => {
      setIsSituationVisible(true);
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/Logo.png')}
            style={styles.headerLogo}
          />

          <View style={styles.headerRight}>
            <Text style={styles.userName}>{userName}님</Text>
            <Text style={styles.dividerText}>|</Text>

            <TouchableOpacity
              onPress={() => setIsMenuPopupVisible((prev) => !prev)}
            >
              <Image
                source={require('../../assets/images/menu.png')}
                style={styles.menuIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 컨텐츠 */}
        <View style={styles.contentWrapper}>
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>오늘 먹을 약</Text>

            <Text style={styles.subTitle}>
              오늘은 ‘{maxSegment.label}’가 가장 많았어요.
            </Text>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartLabel}>오늘 복약 달성률 기록</Text>

            <View style={styles.chartCenterContainer}>
              <Svg
                width={wp(260)}
                height={wp(260)}
                viewBox={`0 0 ${wp(180)} ${wp(180)}`}
              >
                <G>
                  {chartSegments.map((seg, idx) => (
                    <ChartSegment
                      key={idx}
                      {...seg}
                      isSelected={selectedIndex === idx}
                      onPress={() => setSelectedIndex(idx)}
                    />
                  ))}

                  <Circle cx={CENTER} cy={CENTER} r={wp(46)} fill="white" />
                </G>
              </Svg>

              <View style={styles.chartTextOverlay} pointerEvents="none">
                <Text style={styles.chartPercentText}>
                  <Text style={{ fontSize: wp(13), color: '#616161' }}>
                    {segments[selectedIndex].label}
                  </Text>

                  {'\n'}

                  <Text
                    style={{
                      fontSize: wp(24),
                      fontWeight: '700',
                      color: '#1E1E1E',
                    }}
                  >
                    {total === 0
                      ? 0
                      : ((segments[selectedIndex].count / total) * 100).toFixed(
                          0,
                        )}
                    %
                  </Text>
                </Text>
              </View>
            </View>

            {/* 범례 */}

            <View style={styles.legendContainer}>
              {segments.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedIndex(index)}
                  style={styles.legendItem}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={[styles.dot, { backgroundColor: item.color }]}
                    />

                    <Text
                      style={[
                        styles.legendLabel,
                        { fontWeight: selectedIndex === index ? '700' : '600' },
                      ]}
                    >
                      {item.label}
                    </Text>

                    <Text style={styles.legendValue}>
                      {total === 0
                        ? 0
                        : ((item.count / total) * 100).toFixed(0)}
                      %
                    </Text>
                  </View>

                  <Text style={styles.legendDetail}>{item.detail}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <MenuPopup
        visible={isMenuPopupVisible}
        onClose={() => setIsMenuPopupVisible(false)}
        onSelect={handleMenuSelect}
      />

      <SituationPopup
        visible={isSituationVisible}
        type={popupType}
        onClose={() => setIsSituationVisible(false)}
      />
    </SafeAreaView>
  );
}
