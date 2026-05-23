import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

import { styles } from './CalendarGrid.style';
import { DAYS, HOURS } from '../CalendarPage/calendarData';
import { API_BASE_URL } from '../../constants/api';

const MEDICINE_ICON = require('../../assets/images/calendar/medicine_on.png');

type LocalSchedule = { medicineId: string; dayIndex: number; hourIndex: number };

interface Props {
  onClose?: () => void;
  friendUserId?: number;
}

function CalendarGrid({ friendUserId }: Props) {
  const [schedules, setSchedules] = useState<LocalSchedule[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!friendUserId) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const dateStr =
          today.getFullYear() + '-' +
          String(today.getMonth() + 1).padStart(2, '0') + '-' +
          String(today.getDate()).padStart(2, '0');
        const res = await axios.get(
          `${API_BASE_URL}/users/${friendUserId}/calendar/weekly?date=${dateStr}`,
          { withCredentials: true },
        );
        const weekData = res.data?.data ?? res.data;
        const calendar: any[] = weekData?.calendar ?? (Array.isArray(weekData) ? weekData : []);

        const parsed: LocalSchedule[] = [];
        calendar.forEach((dayEntry: any) => {
          const [y, m, d] = dayEntry.date.split('-').map(Number);
          const dayIndex = new Date(y, m - 1, d).getDay();
          (dayEntry.medicines ?? []).forEach((medicine: any) => {
            const midStr = String(medicine.medicineId);
            (medicine.intakeTimes ?? []).forEach((time: string) => {
              const hour = parseInt(time.split(':')[0], 10);
              const hourIndex = (hour - 7 + 24) % 24;
              parsed.push({ medicineId: midStr, dayIndex, hourIndex });
            });
          });
        });
        setSchedules(parsed);
      } catch (e: any) {
        console.error('[친구캘린더] 실패:', e?.response?.status, JSON.stringify(e?.response?.data));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [friendUserId]);

  const scheduleMap = useMemo(() => {
    const map = new Map();
    schedules.forEach((s) => {
      map.set(`${s.dayIndex}-${s.hourIndex}`, s);
    });
    return map;
  }, [schedules]);

  if (loading) {
    return <ActivityIndicator style={{ marginVertical: 40 }} color="#0068FF" />;
  }

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

          {DAYS.map((_day: string, dayIndex: number) => {
            const key = `${dayIndex}-${hourIndex}`;
            const isScheduled = scheduleMap.has(key);

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
                  <Image source={MEDICINE_ICON} style={styles.cellIcon} />
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export default React.memo(CalendarGrid);
