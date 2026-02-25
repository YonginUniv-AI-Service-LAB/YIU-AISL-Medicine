import React, { useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { styles } from './CalendarGrid.style';
import { DAYS, HOURS } from '../CalendarPage/calendarData';
import { useSchedule } from '../../contexts/ScheduleContext';
import { useMedicine } from '../../contexts/MedicineContext'; // ✅ 추가

const MEDICINE_ICON = require('../../assets/images/calendar/medicine_on.png');

interface Props {
  onClose?: () => void;
}

function CalendarGrid({ onClose }: Props) {
  const { schedules } = useSchedule();
  const { medicines } = useMedicine(); // ✅ 추가
  const navigation = useNavigation<any>();

  // schedule 빠르게 찾기
  const scheduleMap = useMemo(() => {
    const map = new Map();
    schedules.forEach((s) => {
      map.set(`${s.dayIndex}-${s.hourIndex}`, s);
    });
    return map;
  }, [schedules]);

  const handleCellPress = useCallback(
    (hourIndex: number, dayIndex: number) => {
      const key = `${dayIndex}-${hourIndex}`;
      const schedule = scheduleMap.get(key);

      if (!schedule) return;

      // ✅ 🔥 핵심: medicine 찾기
      const medicine = medicines.find(
        (m) => String(m.id) === String(schedule.medicineId),
      );

      if (!medicine) {
        console.log('약 데이터 없음', schedule);
        return;
      }

      // ✅ Modal 닫기
      onClose?.();

      setTimeout(() => {
        navigation.navigate('MedicineDetail', {
          medicine,
        });
      }, 100);
    },
    [scheduleMap, medicines, navigation, onClose],
  );

  return (
    <View style={styles.container}>
      <View style={styles.dayRow}>
        <View style={styles.dayCorner} />
        {DAYS.map((day: string) => (
          <Text key={day} style={styles.dayText}>
            {day}
          </Text>
        ))}
      </View>

      {HOURS.map((hour, hourIndex) => (
        <View key={`row-${hourIndex}`} style={styles.row}>
          <Text style={styles.timeText}>{String(hour)}</Text>

          {DAYS.map((day: string, dayIndex: number) => {
            const key = `${dayIndex}-${hourIndex}`;
            const schedule = scheduleMap.get(key);
            const isScheduled = !!schedule;

            return (
              <TouchableOpacity
                key={`cell-${hourIndex}-${dayIndex}`}
                style={[
                  styles.cell,
                  (dayIndex === 0 || dayIndex === 6) && styles.weekendCell,
                  isScheduled && styles.activeCell,
                ]}
                onPress={() =>
                  isScheduled && handleCellPress(hourIndex, dayIndex)
                }
                activeOpacity={isScheduled ? 0.7 : 1}
              >
                {isScheduled && (
                  <Image source={MEDICINE_ICON} style={styles.cellIcon} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export default React.memo(CalendarGrid);
