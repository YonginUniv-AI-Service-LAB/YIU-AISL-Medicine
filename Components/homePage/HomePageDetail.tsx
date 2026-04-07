import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
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
import { API_BASE_URL } from '../../constants/api';
import { styles } from './HomePageDetail.styles';
import MenuPopup from './MenuPopup';
import SituationPopup from './SituationPopup';
import { IntakeSummaryResponse } from '../../contexts/types/IntakeTypes';
import { FrontendMedicineStatus } from '../../contexts/types/MedicineDailyItem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const wp = (size: number) => (size / 393) * SCREEN_WIDTH;

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
    </G>
  );
};

export default function HomeDetailPage() {
  const route = useRoute<any>();

  const [userName, setUserName] = useState('사용자');

  const [segments, setSegments] = useState([
    { label: '복용 완료', count: 0, color: '#189CEF', detail: '' },
    { label: '미복용', count: 0, color: '#0DC9BA', detail: '' },
    { label: '복용 전', count: 0, color: '#D9D9D9', detail: '' },
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [isMenuPopupVisible, setIsMenuPopupVisible] = useState(false);
  const [isSituationVisible, setIsSituationVisible] = useState(false);

  const [popupType, setPopupType] = useState<'logout' | 'reset' | 'withdraw'>(
    'logout',
  );

  const today = new Date().toISOString().split('T')[0];

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/me`, {
        withCredentials: true,
      });

      const user = res.data?.data;

      if (user?.name) {
        setUserName(user.name);
      }
    } catch (error) {
      console.log('사용자 조회 실패', error);
    }
  };

  const fetchMedicationData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/intakes`, {
        params: { date: today },
        withCredentials: true,
      });

      const body: IntakeSummaryResponse = res.data?.data ?? res.data;

      const intakes = body?.intakes ?? [];

      let takenCount = body?.takenCount ?? 0;
      let missedCount = body?.missedCount ?? 0;
      let beforeCount = body?.beforeCount ?? 0;

      if (intakes.length > 0) {
        try {
          const stored = await AsyncStorage.getItem('medicineStatus');
          const savedStatus = stored ? JSON.parse(stored) : {};

          let localTaken = 0, localMissed = 0, localBefore = 0;

          intakes.forEach((item) => {
            const key = item.intakeId?.toString() || item.medicineId?.toString();
            const localStatus: FrontendMedicineStatus | undefined = savedStatus[key]?.status;

            const status: FrontendMedicineStatus = localStatus
              ? localStatus
              : item.status === 'TAKEN'
                ? 'done'
                : item.status === 'NOT_TAKEN'
                  ? 'missed'
                  : 'before';

            if (status === 'done') localTaken++;
            else if (status === 'missed') localMissed++;
            else localBefore++;
          });

          takenCount = localTaken;
          missedCount = localMissed;
          beforeCount = localBefore;
        } catch (e) {
          console.log('로컬 상태 병합 실패, 서버 데이터 사용', e);
        }
      }

      setSegments([
        {
          label: '복용 완료',
          count: takenCount,
          color: '#16A34A',
          detail: '오늘 복용 완료한 약',
        },
        {
          label: '미복용',
          count: missedCount,
          color: '#EF4444',
          detail: '시간이 지나 미복용한 약',
        },
        {
          label: '복용 전',
          count: beforeCount,
          color: '#2563EB',
          detail: '아직 복용 시간이 남은 약',
        },
      ]);
    } catch (error) {
      console.log('복약 데이터 조회 실패', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMedicationData();
    }, []),
  );

  useEffect(() => {
    const user = route?.params?.user;

    if (user?.name) {
      setUserName(user.name);
    } else {
      fetchUser();
    }

    fetchMedicationData();
  }, [route?.params]);

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

  const navigation = useNavigation<any>();

  const handleMenuSelect = (type: 'logout' | 'reset' | 'withdraw') => {
    setPopupType(type);
    setIsSituationVisible(true);

    setTimeout(() => {
      setIsMenuPopupVisible(false);
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
