import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // 1. 네비게이션 훅 임포트
import styles from './MedicinePage.style';
import CalendarPopup from './calendarPopup'; 

const MedicinePage: React.FC = () => {
  // 네비게이션 객체 생성
  const navigation = useNavigation<any>();

  // 1. 기준 날짜 상태 (기본값: 오늘)
  const [baseDate, setBaseDate] = useState(new Date());
  // 2. 캘린더 팝업 노출 여부
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // 3. 주간 데이터 계산 (baseDate가 변경될 때마다 갱신)
  const weekData = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(baseDate);
    // 해당 주의 일요일로 설정
    startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());

    const days = ['일', '월', '화', '수', '목', '금', '토'];
    
    return days.map((dayName, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);

      const isToday = 
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      let color = '#1E1E1E'; // 평일
      if (index === 0) color = '#D32F2F'; // 일요일
      if (index === 6) color = '#409CFF'; // 토요일

      return {
        id: index,
        day: dayName,
        date: date.getDate().toString(),
        fullDate: date,
        color: color,
        isToday: isToday,
      };
    });
  }, [baseDate]);

  // 4. 주간 단위 이동 핸들러
  const changeWeek = (offset: number) => {
    const newDate = new Date(baseDate);
    newDate.setDate(baseDate.getDate() + offset);
    setBaseDate(newDate);
  };

  // 5. 팝업에서 날짜를 선택했을 때 실행될 함수
  const handleDateSelect = (selectedDate: Date) => {
    setBaseDate(selectedDate);
    setIsCalendarVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/Logo.png')} style={styles.headerLogo} />
        <View style={styles.headerRight}>
          <Text style={styles.userName}>000님</Text>
          <Text style={styles.dividerText}>|</Text>
          <TouchableOpacity>
            <Image source={require('../../assets/images/Medicine/bell.png')} style={styles.menuIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          {/* 페이지 타이틀 및 캘린더 아이콘 */}
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>약 관리</Text>
            <TouchableOpacity onPress={() => setIsCalendarVisible(true)}>
              <Image source={require('../../assets/images/Medicine/calendar.png')} style={styles.calendarIcon} />
            </TouchableOpacity>
          </View>

          {/* 주간 캘린더 섹션 */}
          <View style={styles.calendarSection}>
            <TouchableOpacity onPress={() => changeWeek(-7)}>
              <Image source={require('../../assets/images/Medicine/left.png')} style={styles.arrowIcon} />
            </TouchableOpacity>

            <View style={styles.calendarContainer}>
              {weekData.map((item) => (
                <View key={item.id} style={styles.dayColumn}>
                  <Text style={[styles.dayLabel, { color: item.color }]}>{item.day}</Text>
                  <View style={[styles.dateCircle, item.isToday && styles.activeCircle]}>
                    <Text style={{ 
                      color: item.isToday ? '#FFF' : item.color,
                      fontWeight: item.isToday ? '600' : '500' 
                    }}>
                      {item.date}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity onPress={() => changeWeek(7)}>
              <Image source={require('../../assets/images/Medicine/right.png')} style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>

          {/* 약 복용 일정 추가 버튼 - 클릭 시 Calendar 탭으로 이동 */}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('Calendar')}
          >
            <Text style={styles.addButtonText}>약 복용 일정 추가</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 별도 파일로 분리된 캘린더 팝업 */}
      <CalendarPopup 
        isVisible={isCalendarVisible} 
        onClose={() => setIsCalendarVisible(false)}
        baseDate={baseDate}
        onDateSelect={handleDateSelect}
      />
    </SafeAreaView>
  );
};

export default MedicinePage;