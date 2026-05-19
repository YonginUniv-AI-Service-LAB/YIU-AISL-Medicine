import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { getLocalMedicines } from './localMedicineStore';

import styles from './calendar.style';
import { DAYS, HOURS } from './calendarData';
import { API_BASE_URL } from '../../constants/api';

type RootStackParamList = {
  AddSchedule: undefined;
  MedicineDetail: { medicine: any };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddSchedule'>;

type LocalSchedule = { medicineId: string; dayIndex: number; hourIndex: number };

const CalendarScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // ScheduleContext 대신 로컬 state — MedicinePage가 덮어쓰는 문제 방지
  const [schedules, setSchedules] = useState<LocalSchedule[]>([]);
  const [medicineMap, setMedicineMap] = useState<Record<string, any>>({});

  useFocusEffect(
    useCallback(() => {
      const syncFromServer = async () => {
        try {
          // 1. 이번 주 날짜 목록을 로컬에서 먼저 계산 (fallback)
          const today = new Date();
          const todaySunday = new Date(today);
          todaySunday.setDate(today.getDate() - today.getDay()); // 이번 주 일요일
          const localWeekEntries: { date: Date; jsDay: number }[] = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(todaySunday);
            d.setDate(todaySunday.getDate() + i);
            return { date: d, jsDay: d.getDay() };
          });
          const weekStart = localWeekEntries[0].date;
          const weekEnd = localWeekEntries[6].date;

          // 2. GET /medicines — 성공하면 그 목록이 authoritative source
          let medicinesList: any[] = [];
          let medicinesLoaded = false; // 요청 성공 여부 (빈 배열도 성공)
          try {
            const medicinesRes = await axios.get(`${API_BASE_URL}/medicines`, { withCredentials: true });
            console.log('[캘린더] GET /medicines 원시 응답:', JSON.stringify(medicinesRes.data));
            const rawMeds = medicinesRes.data?.data ?? medicinesRes.data;
            medicinesList = Array.isArray(rawMeds) ? rawMeds : [];
            medicinesLoaded = true;
            console.log('[캘린더] 파싱된 medicines:', medicinesList.length, '개');
          } catch (e) {
            console.log('GET /medicines 실패 — weekly API 결과 그대로 사용', e);
          }
          const activeMedicineIds = new Set(medicinesList.map((m: any) => String(m.id ?? m.medicineId)));

          // 3. weekly API — 실패해도 무시하고 extras 단계로 계속 진행
          const newSchedules: LocalSchedule[] = [];
          const map: Record<string, any> = {};
          let weeklyCalendar: any[] = [];

          try {
            const meRes = await axios.get(`${API_BASE_URL}/users/me`, { withCredentials: true });
            const userId = meRes.data?.data?.id ?? meRes.data?.id;
            const dateStr =
              today.getFullYear() + '-' +
              String(today.getMonth() + 1).padStart(2, '0') + '-' +
              String(today.getDate()).padStart(2, '0');
            const res = await axios.get(
              `${API_BASE_URL}/users/${userId}/calendar/weekly?date=${dateStr}`,
              { withCredentials: true },
            );
            const weekData = res.data?.data ?? res.data;
            weeklyCalendar = weekData?.calendar ?? (Array.isArray(weekData) ? weekData : []);
            console.log('[캘린더] weekly API 원시 응답:', JSON.stringify(res.data));

            weeklyCalendar.forEach((dayEntry: any) => {
              const [y, m, d] = dayEntry.date.split('-').map(Number);
              const dayIndex = new Date(y, m - 1, d).getDay();
              (dayEntry.medicines ?? []).forEach((medicine: any) => {
                const midStr = String(medicine.medicineId);
                // GET /medicines 성공했으면 그 목록 기준으로 필터, 실패했으면 모두 허용
                if (medicinesLoaded && !activeMedicineIds.has(midStr)) return;
                map[midStr] = medicine;
                (medicine.intakeTimes ?? []).forEach((time: string) => {
                  const hour = parseInt(time.split(':')[0], 10);
                  const hourIndex = (hour - 7 + 24) % 24;
                  newSchedules.push({ medicineId: midStr, dayIndex, hourIndex });
                });
              });
            });
          } catch (e) {
            console.log('weekly API 실패 — extras로 보충', e);
          }

          // 4. extras: GET /medicines에서 weekly API에 없는 (약+요일) 보충
          const coveredPairs = new Set(newSchedules.map((s) => `${s.medicineId}:${s.dayIndex}`));

          // weekly API가 반환한 날짜 목록이 있으면 사용, 없으면 로컬 계산 사용
          const weekEntries: { jsDay: number; serverDay: number }[] =
            weeklyCalendar.length > 0
              ? weeklyCalendar.map((dayEntry: any) => {
                  const [ey, em, ed] = dayEntry.date.split('-').map(Number);
                  const jsDay2 = new Date(ey, em - 1, ed).getDay();
                  return { jsDay: jsDay2, serverDay: jsDay2 === 0 ? 7 : jsDay2 };
                })
              : localWeekEntries.map((e) => ({ jsDay: e.jsDay, serverDay: e.jsDay === 0 ? 7 : e.jsDay }));

          medicinesList.forEach((m: any) => {
            const midStr = String(m.id ?? m.medicineId);
            const start = m.startDate ? new Date(m.startDate + 'T00:00:00') : null;
            const end = m.endDate ? new Date(m.endDate + 'T23:59:59') : null;
            if (start && start > weekEnd) return;
            if (end && end < weekStart) return;

            const medSchedules: any[] = m.schedules ?? [];
            const pairs: { dayOfWeek: number; intakeTime: string }[] =
              medSchedules.length > 0
                ? medSchedules.map((s: any) => ({ dayOfWeek: s.dayOfWeek, intakeTime: s.intakeTime ?? '08:00' }))
                : (m.daysOfWeek ?? []).flatMap((dow: number) =>
                    (m.intakeTimes ?? ['08:00']).map((t: string) => ({ dayOfWeek: dow, intakeTime: t }))
                  );

            if (pairs.length === 0) return; // 스케줄 정보 없으면 표시 안 함

            weekEntries.forEach(({ jsDay, serverDay }) => {
              const pairKey = `${midStr}:${jsDay}`;
              if (coveredPairs.has(pairKey)) return;

              pairs.filter((p) => p.dayOfWeek === serverDay).forEach((p) => {
                const hour = parseInt(p.intakeTime.split(':')[0], 10);
                const hourIndex = (hour - 7 + 24) % 24;
                if (!map[midStr]) map[midStr] = { ...m, medicineId: m.id ?? m.medicineId, medicineName: m.name };
                newSchedules.push({ medicineId: midStr, dayIndex: jsDay, hourIndex });
                coveredPairs.add(pairKey);
              });
            });
          });

          // 서버 GET 버그 우회: 로컬 인메모리 캐시에서 보충
          getLocalMedicines().forEach((m) => {
            const midStr = String(m.id);
            const start = m.startDate ? new Date(m.startDate + 'T00:00:00') : null;
            const end = m.endDate ? new Date(m.endDate + 'T23:59:59') : null;
            if (start && start > weekEnd) return;
            if (end && end < weekStart) return;

            weekEntries.forEach(({ jsDay, serverDay }) => {
              const pairKey = `${midStr}:${jsDay}`;
              if (coveredPairs.has(pairKey)) return;
              const daySchedules = (m.schedules ?? []).filter((s) => s.dayOfWeek === serverDay);
              if (daySchedules.length === 0 && (m.schedules ?? []).length > 0) return;
              const entries = daySchedules.length > 0 ? daySchedules : [{ intakeTime: '08:00:00' }];
              entries.forEach((s) => {
                const hour = parseInt(s.intakeTime.split(':')[0], 10);
                const hourIndex = (hour - 7 + 24) % 24;
                if (!map[midStr]) map[midStr] = { ...m, medicineId: m.id, medicineName: m.name };
                newSchedules.push({ medicineId: midStr, dayIndex: jsDay, hourIndex });
                coveredPairs.add(pairKey);
              });
            });
          });

          console.log('[캘린더] 최종 schedules:', newSchedules);
          setSchedules(newSchedules);
          setMedicineMap(map);
        } catch (e) {
          console.log('캘린더 동기화 실패', e);
          // 상태를 지우지 않음 — 기존 캘린더 유지
        }
      };
      syncFromServer();
    }, []),
  );

  const handleAddPress = () => {
    navigation.navigate('AddSchedule');
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.dayRow}>
        <View style={styles.dayCorner} />
        {DAYS.map((day: string) => (
          <Text key={day} style={styles.dayText}>{day}</Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {HOURS.map((hour, hourIndex) => (
          <View key={`row-${hourIndex}`} style={styles.row}>
            <Text style={styles.timeText}>{String(hour)}</Text>
            {DAYS.map((_day: string, dayIndex: number) => {
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
                          (s) => s.dayIndex === dayIndex && s.hourIndex === hourIndex,
                        );
                        const medicine = scheduleItem
                          ? medicineMap[scheduleItem.medicineId]
                          : undefined;
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
