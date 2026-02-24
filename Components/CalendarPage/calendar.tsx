import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import styles from './calendar.style';
import { DAYS, HOURS } from './calendarData';
import { useSchedule } from '../../contexts/ScheduleContext';
import { useMedicine } from '../../contexts/MedicineContext';

/** ⭐ 네비게이션 타입 */
type RootStackParamList = {
  AddSchedule: undefined;
  MedicineDetail: { medicine: any };
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AddSchedule'
>;

const CalendarScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  /** ⭐ 저장된 스케줄 가져오기 */
  const { schedules } = useSchedule();
  const { medicines } = useMedicine();

  /** + 버튼 눌렀을 때 */
  const handleAddPress = () => {
    navigation.navigate('AddSchedule');
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/Logo.png')}
          style={styles.logo}
        />

        <TouchableOpacity style={styles.addBtn} onPress={handleAddPress}>
          <Image
            source={require('../../assets/images/calendar/plus.png')}
            style={styles.plusIcon}
          />
        </TouchableOpacity>
      </View>

      {/* 요일 헤더 */}
      <View style={styles.dayRow}>
        <View style={styles.dayCorner} />
        {DAYS.map((day: string) => (
          <Text key={day} style={styles.dayText}>
            {day}
          </Text>
        ))}
      </View>

      {/* 시간표 */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {HOURS.map((hour, hourIndex) => (
          <View key={`row-${hourIndex}`} style={styles.row}>
            {/* 시간 */}
            <Text style={styles.timeText}>{String(hour)}</Text>

            {/* 칸 */}
            {DAYS.map((day: string, dayIndex: number) => {
              /** ⭐ 이 칸에 일정이 있는지 검사 */
              const isScheduled = schedules.some(
                (s) => s.dayIndex === dayIndex && s.hourIndex === hourIndex,
              );

              return (
                <View
                  key={`cell-${hourIndex}-${dayIndex}`}
                  style={[
                    styles.cell,
                    (dayIndex === 0 || dayIndex === 6) && styles.weekendCell,
                    isScheduled && styles.activeCell,
                  ]}
                >
                  {isScheduled && (
                    <TouchableOpacity
                      onPress={() => {
                        const scheduleItem = schedules.find(
                          (s) =>
                            s.dayIndex === dayIndex &&
                            s.hourIndex === hourIndex,
                        );

                        const medicine = medicines.find(
                          (m) =>
                            String(m.id) === String(scheduleItem?.medicineId),
                        );

                        if (!medicine) {
                          alert('약 데이터 없음');
                          return;
                        }

                        navigation.navigate('MedicineDetail', { medicine });
                      }}
                    >
                      <Image
                        source={require('../../assets/images/calendar/medicine_on.png')}
                        style={styles.cellIcon}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default CalendarScreen;
