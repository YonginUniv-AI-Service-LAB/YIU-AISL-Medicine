////반응형 유틸리티(wp, hp)**와 **중앙 정렬 레이아웃(contentWrapper)**이 아주 잘 구현
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { styles } from './HomePageDetail.styles';
import MenuPopup from './MenuPopup'; 
import SituationPopup from './SituationPopup';

// 1. 반응형 유틸리티 정의
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * Dimensions.get('window').height;

// 차트 기준 상수 (반응형 적용)
const RADIUS = wp(80);
const CENTER = wp(90);

const ChartSegment = ({ startAngle, endAngle, color, isSelected, onPress }: any) => {
  const getPathData = (s: number, e: number, r: number) => {
    // 90도(CENTER)를 기준으로 경로 계산
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
      {/* 터치 영역 확장을 위한 투명 Path */}
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
  const [popupType, setPopupType] = useState<'logout' | 'reset' | 'withdraw'>('logout');

  const segments = [
    { label: '복용 완료', count: 24, color: '#189CEF', detail: '아르기닌' },
    { label: '미복용', count: 53, color: '#0DC9BA', detail: '물약' },
    { label: '복용 전', count: 83, color: '#D9D9D9', detail: '가루약 외 5등' },
  ];

  const total = segments.reduce((sum, s) => sum + s.count, 0);
  const maxSegment = segments.reduce((prev, current) => (prev.count > current.count ? prev : current));

  let currentAngle = -90;
  const chartSegments = segments.map((s) => {
    const sweep = (s.count / total) * 360;
    const data = { startAngle: currentAngle, endAngle: currentAngle + sweep, color: s.color };
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
      {/* 헤더 영역: 로고와 메뉴 버튼 */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/Logo.png')} style={styles.headerLogo} />
        <View style={styles.headerRight}>
          <Text style={styles.userName}>000님</Text>
          <Text style={styles.dividerText}>|</Text>
          <TouchableOpacity onPress={() => setIsMenuPopupVisible(prev => !prev)}>
            <Image source={require('../../assets/images/menu.png')} style={styles.menuIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 모든 페이지와 일치시킨 여백 컨테이너 */}
        <View style={styles.contentWrapper}>
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>오늘 먹을 약</Text>
            <Text style={styles.subTitle}>오늘은 ‘{maxSegment.label}’가 가장 많았어요.</Text>
          </View>

          {/* 차트 카드 영역 */}
          <View style={styles.chartCard}>
            <Text style={styles.chartLabel}>오늘 복약 달성률 기록</Text>

            <View style={styles.chartCenterContainer}>
              {/* SVG 크기도 wp를 적용하여 기기 대응 */}
              <Svg width={wp(260)} height={wp(260)} viewBox={`0 0 ${wp(180)} ${wp(180)}`}>
                <G>
                  {chartSegments.map((seg, idx) => (
                    <ChartSegment
                      key={idx}
                      {...seg}
                      isSelected={selectedIndex === idx}
                      onPress={() => setSelectedIndex(idx)}
                    />
                  ))}
                  {/* 중앙을 가리는 흰색 원 (도넛 차트 효과) */}
                  <Circle cx={CENTER} cy={CENTER} r={wp(46)} fill="white" />
                </G>
              </Svg>

              {/* 차트 중앙 텍스트 */}
              <View style={styles.chartTextOverlay} pointerEvents="none">
                <Text style={styles.chartPercentText}>
                  <Text style={{ fontSize: wp(13), color: '#616161' }}>{segments[selectedIndex].label}</Text>
                  {"\n"}
                  <Text style={{ fontSize: wp(24), fontWeight: '700', color: '#1E1E1E' }}>
                    {((segments[selectedIndex].count / total) * 100).toFixed(0)}%
                  </Text>
                </Text>
              </View>
            </View>

            {/* 범례 리스트 */}
            <View style={styles.legendContainer}>
              {segments.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedIndex(index)}
                  style={styles.legendItem}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.dot, { backgroundColor: item.color }]} />
                    <Text style={[styles.legendLabel, { fontWeight: selectedIndex === index ? '700' : '600' }]}>
                      {item.label}
                    </Text>
                    <Text style={styles.legendValue}>{((item.count / total) * 100).toFixed(0)}%</Text>
                  </View>
                  <Text style={styles.legendDetail}>{item.detail}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* 팝업 컴포넌트들 */}
      <MenuPopup
        visible={isMenuPopupVisible}
        onClose={() => setIsMenuPopupVisible(false)}
        onSelect={handleMenuSelect}
      />

      <SituationPopup
        visible={isSituationVisible}
        type={popupType}
        onClose={() => setIsSituationVisible(false)}
        onConfirm={() => {
          console.log(`${popupType} 처리됨`);
          setIsSituationVisible(false);
        }}
      />
    </SafeAreaView>
  );
}