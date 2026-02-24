import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { styles } from './CalendarGrid.style';
import { DAYS, HOURS } from '../CalendarPage/calendarData';
import { useSchedule } from '../../contexts/ScheduleContext';

interface Props {
  isEditable: boolean;
}

export default function CalendarGrid({ isEditable }: Props) {
  const { schedules } = useSchedule();

  const handleCellPress = (hourIndex: number, dayIndex: number) => {
    if (!isEditable) return;
    console.log('수정:', hourIndex, dayIndex);
  };

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

      {/* 🔥 시간표 (CalendarScreen과 완전히 동일 구조) */}
      {HOURS.map((hour, hourIndex) => (
        <View key={`row-${hourIndex}`} style={styles.row}>
          {/* 시간 */}
          <Text style={styles.timeText}>{String(hour)}</Text>

          {/* 칸 */}
          {DAYS.map((day: string, dayIndex: number) => {
            const isScheduled = schedules.some(
              (s) => s.dayIndex === dayIndex && s.hourIndex === hourIndex,
            );

            return (
              <TouchableOpacity
                key={`cell-${hourIndex}-${dayIndex}`}
                style={[
                  styles.cell,
                  (dayIndex === 0 || dayIndex === 6) && styles.weekendCell,
                  isScheduled && styles.activeCell,
                ]}
                onPress={() => handleCellPress(hourIndex, dayIndex)}
                activeOpacity={isEditable ? 0.7 : 1}
              >
                {isScheduled && (
                  <Image
                    source={require('../../assets/images/calendar/medicine_on.png')}
                    style={styles.cellIcon}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}
