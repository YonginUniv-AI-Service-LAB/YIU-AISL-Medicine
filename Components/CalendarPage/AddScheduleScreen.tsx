import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Modal,
  Keyboard,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';

import styles from './AddSchedule.style';
import { DAYS, HOURS } from './calendarData';
import { useSchedule } from '../../contexts/ScheduleContext';
import { useMedicine } from '../../contexts/MedicineContext';



const numbers = Array.from({ length: 12 }, (_, i) => i + 1);
const doseCountNumbers = [1, 2, 3];
const hours24 = Array.from({ length: 24 }, (_, i) => i + 1);

const weekDays = [
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
  '일요일',
  '전체 선택',
];

/* 24시간 → 캘린더 index 변환 (7AM 시작 기준) */
const getCalendarIndex = (hour24: number) => {
  const startHour = 7;
  return (hour24 - startHour + 24) % 24;
};

const Radio = ({ active }: { active: boolean }) => (
  <Image
    source={
      active
        ? require('../../assets/images/calendar/off.png')
        : require('../../assets/images/calendar/on.png')
    }
    style={{
      width: 10,
      height: 10,
      marginRight: 6,
      resizeMode: 'contain',
    }}
  />
);

const OptionBox = ({ title, children }: any) => (
  <View
    style={{
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 12,
      padding: 14,
      marginBottom: 14,
    }}
  >
    <Text style={{ fontWeight: '600', marginBottom: 10 }}>{title}</Text>

    {children}
  </View>
);

const AddScheduleScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const editData = route.params?.editData;
  const isEdit = !!editData;

  useEffect(() => {
    if (editData) {
      setMedicineName(editData.name ?? '');
      setCategory(editData.category ?? '');
      setMemo(editData.caution ?? '');

      setDoseCount(editData.dailyDoseCount ?? null);
      setDosePeriod(editData.durationDays ?? null);
      setRemainCount(editData.totalQuantity ?? null);

      if (editData.schedules) {
        const hours = editData.schedules.map((s: any) =>
          parseInt(s.intakeTime.split(':')[0], 10),
        );

        const days = editData.schedules.map((s: any) => s.dayOfWeek);

        setDoseHours(hours);
        setDoseDays(days);
      }
    }
  }, [editData]);

  const { addSchedules, removeSchedulesByMedicineId } = useSchedule();

  /* 미리보기용 */
  const [medicineName, setMedicineName] = useState(editData?.name || '');
  const [memo, setMemo] = useState(editData?.memo || '');

  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  useEffect(() => {
    if (editData) {
      const cells: string[] = [];

      editData.days?.forEach((day: string) => {
        const dayIndex = DAYS.findIndex((d) => d === day);

        editData.times.forEach((time: string) => {
          const hour = parseInt(time.split(':')[0], 10);
          const hourIndex = getCalendarIndex(hour);

          cells.push(`${dayIndex}-${hourIndex}`);
        });
      });

      setSelectedCells(cells);
    }
  }, [editData]);

  const [modalVisible, setModalVisible] = useState(false);
  const [doseCount, setDoseCount] = useState<number | null>(
    editData?.count || null,
  );
  const [doseHours, setDoseHours] = useState<number[]>(
    editData?.times
      ? editData.times.map((t: string) => parseInt(t.split(':')[0], 10))
      : [],
  );
  const [doseDays, setDoseDays] = useState<string[]>(
    editData?.days
      ? editData.days.map((d: string) => {
        const map: any = {
          월: '월요일',
          화: '화요일',
          수: '수요일',
          목: '목요일',
          금: '금요일',
          토: '토요일',
          일: '일요일',
        };
        return map[d];
      })
      : [],
  );
  const [dosePeriod, setDosePeriod] = useState<number | null>(
    editData?.period || null,
  );
  const [remainCount, setRemainCount] = useState<number | null>(null);

  const [doseCountInput, setDoseCountInput] = useState(
    !doseCountNumbers.includes(editData?.count)
      ? String(editData?.count ?? '')
      : '',
  );
  const [dosePeriodInput, setDosePeriodInput] = useState('');
  const [remainInput, setRemainInput] = useState('');
  const [category, setCategory] = useState(editData?.category || '');
  useEffect(() => {
    if (editData) {
      // 복용 기간
      if (editData.period) {
        setDosePeriod(editData.period);
        setDosePeriodInput(String(editData.period));
      }

      // 남은 횟수
      if (editData.remain) {
        setRemainCount(editData.remain);
        setRemainInput(String(editData.remain));
      }
    }
  }, [editData]);

  const period =
    dosePeriod ??
    (dosePeriodInput !== '' ? Number(dosePeriodInput) : undefined);

  const remain =
    remainCount ?? (remainInput !== '' ? Number(remainInput) : undefined);

  const { addMedicine, updateMedicine } = useMedicine();

  const toggleDay = (day: string) => {
    if (day === '전체 선택') {
      setDoseDays(doseDays.length === 7 ? [] : weekDays.slice(0, 7));
      return;
    }
    if (doseDays.includes(day)) setDoseDays(doseDays.filter((d) => d !== day));
    else setDoseDays([...doseDays, day]);
  };

  const toggleHour = (hour: number) => {
    if (doseHours.includes(hour))
      setDoseHours(doseHours.filter((h) => h !== hour));
    else setDoseHours([...doseHours, hour]);
  };

  const applySchedule = () => {
    if (doseHours.length === 0 || doseDays.length === 0) {
      setModalVisible(false);
      return;
    }

    const newCells: string[] = [];

    doseDays.forEach((day) => {
      const dayIndex = DAYS.findIndex((d) => day.startsWith(d[0]));
      if (dayIndex === -1) return;

      doseHours.forEach((hour) => {
        const hourIndex = getCalendarIndex(hour);
        newCells.push(`${dayIndex}-${hourIndex}`);
      });
    });

    setSelectedCells([...new Set(newCells)]);
    setModalVisible(false);
  };
  const saveSchedule = async () => {
    const medicineId = isEdit ? editData.id : Date.now().toString();

    const today =
      new Date().getFullYear() +
      '-' +
      String(new Date().getMonth() + 1).padStart(2, '0') +
      '-' +
      String(new Date().getDate()).padStart(2, '0');

    const times = doseHours.map((h) => `${String(h).padStart(2, '0')}:00`);
    const days = doseDays?.map((d) => d[0]) ?? [];

    const count =
      doseCount ??
      (doseCountInput ? Number(doseCountInput) : undefined) ??
      times.length;

    const period =
      dosePeriod ?? (dosePeriodInput ? Number(dosePeriodInput) : undefined);

    const remain =
      remainCount ?? (remainInput ? Number(remainInput) : undefined);

    /* ⭐ schedules 생성 (백엔드 DTO용) */
    const dayMap: any = {
      월: 1,
      화: 2,
      수: 3,
      목: 4,
      금: 5,
      토: 6,
      일: 7,
    };

    const schedules: any[] = [];

    days.forEach((day) => {
      times.forEach((time) => {
        schedules.push({
          dayOfWeek: dayMap[day],
          intakeTime: time,
        });
      });
    });

    const apiData = {
      name: medicineName,
      category: category || '',
      dailyDoseCount: count || 1,
      durationDays: period || 1,
      totalQuantity: remain || 1,
      caution: memo || '',
      schedules: schedules,
    };

    const localData = {
      id: medicineId,
      name: medicineName,
      category,
      count,
      times,
      days,
      period,
      remain,
      memo,
      date: today,
      status: 'before' as const,
    };
    try {
      if (isEdit) {
        await axios.put(`${API_BASE_URL}/medicines/${editData.id}`, apiData);

        console.log('약 수정 성공');
      } else {
        const res = await axios.post(`${API_BASE_URL}/medicines`, apiData);

        console.log('약 등록 성공', res.data);
      }

      navigation.goBack();
    } catch (error: any) {
      console.log('약 저장 실패', error);
      console.log(error.response?.data);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.left}
        >
          <Image
            source={require('../../assets/images/x-close.png')}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.center}>
          <Text style={styles.title}>약 복용 일정 추가</Text>
        </View>

        <View style={styles.right}>
          <TouchableOpacity style={styles.doneBtn} onPress={saveSchedule}>
            <Text style={styles.doneText}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 시간표 */}
      <View style={styles.tableArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.dayRow}>
            <View style={styles.corner} />
            {DAYS.map((d) => (
              <Text key={d} style={styles.dayText}>
                {d}
              </Text>
            ))}
          </View>

          {HOURS.map((hour, hourIndex) => (
            <View key={`row-${hourIndex}`} style={styles.row}>
              <Text style={styles.time}>{hour}</Text>

              {DAYS.map((day, dayIndex) => {
                const key = `${dayIndex}-${hourIndex}`;
                const isSelected = selectedCells.includes(key);

                return (
                  <View
                    key={key}
                    style={[styles.cell, isSelected && styles.activeCell]}
                  >
                    {isSelected && (
                      <Image
                        source={require('../../assets/images/calendar/medicine_on.png')}
                        style={styles.cellIcon}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 입력폼 */}
      <View style={styles.form}>
        <Text style={styles.label}>약 이름:</Text>
        <TextInput
          style={styles.input}
          value={medicineName}
          onChangeText={setMedicineName}
        />

        <Text style={styles.label}>카테고리:</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
        />

        <TouchableOpacity
          style={styles.labelRow}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.label}>복용</Text>
          <Image
            source={require('../../assets/images/calendar/under.png')}
            style={styles.dropdownIcon}
          />
        </TouchableOpacity>

        <Text style={styles.label}>주의 사항:</Text>
        <TextInput
          style={styles.input}
          multiline
          value={memo}
          onChangeText={setMemo}
        />
      </View>

      {/* 모달 */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }}
          onPress={() => Keyboard.dismiss()}
        >
          <Pressable
            style={{
              marginTop: 'auto',
              backgroundColor: '#fff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
            }}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              {/* 복용 횟수 */}
              <OptionBox title="하루 복용 횟수">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {doseCountNumbers.map((n) => (
                    <TouchableOpacity
                      key={n}
                      style={{
                        width: '16.66%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                      onPress={() => {
                        setDoseCount(n);
                        setDoseCountInput('');
                      }}
                    >
                      <Radio active={doseCount === n} />
                      <Text>{n}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 8,
                  }}
                >
                  <Text style={{ marginRight: 8 }}>직접입력:</Text>
                  <TextInput
                    value={doseCountInput}
                    onChangeText={(t) => {
                      setDoseCount(null);
                      setDoseCountInput(t);
                    }}
                    keyboardType="numeric"
                    style={{
                      borderBottomWidth: 1,
                      borderColor: '#ccc',
                      width: 80,
                    }}
                  />
                </View>
              </OptionBox>

              {/* ⭐ 복용 시간 (다중 선택) */}
              <OptionBox title="복용 시간">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {hours24.map((n) => (
                    <TouchableOpacity
                      key={n}
                      style={{
                        width: '12.5%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                      onPress={() => toggleHour(n)}
                    >
                      <Radio active={doseHours.includes(n)} />
                      <Text>{n}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </OptionBox>

              {/* 복용 간격 */}
              <OptionBox title="복용 간격">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {weekDays.map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={{
                        width: '25%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                      onPress={() => toggleDay(d)}
                    >
                      <Radio
                        active={
                          d === '전체 선택'
                            ? doseDays.length === 7
                            : doseDays.includes(d)
                        }
                      />
                      <Text>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </OptionBox>

              {/* 복용 기간 */}
              <OptionBox title="복용 기간">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {numbers.map((n) => (
                    <TouchableOpacity
                      key={n}
                      style={{
                        width: '16.66%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                      onPress={() => {
                        setDosePeriod(n);
                        setDosePeriodInput('');
                      }}
                    >
                      <Radio active={dosePeriod === n} />
                      <Text>{n}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 8,
                  }}
                >
                  <Text style={{ marginRight: 8 }}>직접입력:</Text>
                  <TextInput
                    value={dosePeriodInput}
                    onChangeText={(t) => {
                      setDosePeriod(null);
                      setDosePeriodInput(t);
                    }}
                    keyboardType="numeric"
                    style={{
                      borderBottomWidth: 1,
                      borderColor: '#ccc',
                      width: 80,
                    }}
                  />
                </View>
              </OptionBox>

              {/* 남은 복용 횟수 */}
              <OptionBox title="남은 복용 횟수">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {numbers.map((n) => (
                    <TouchableOpacity
                      key={n}
                      style={{
                        width: '16.66%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                      onPress={() => {
                        setRemainCount(n);
                        setRemainInput('');
                      }}
                    >
                      <Radio active={remainCount === n} />
                      <Text>{n}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 8,
                  }}
                >
                  <Text style={{ marginRight: 8 }}>직접입력:</Text>
                  <TextInput
                    value={remainInput}
                    onChangeText={(t) => {
                      setRemainCount(null);
                      setRemainInput(t);
                    }}
                    keyboardType="numeric"
                    style={{
                      borderBottomWidth: 1,
                      borderColor: '#ccc',
                      width: 80,
                    }}
                  />
                </View>
              </OptionBox>

              <TouchableOpacity
                onPress={() => applySchedule()}
                style={{
                  backgroundColor: '#2F80FF',
                  padding: 14,
                  borderRadius: 30,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>
                  변경하기
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default AddScheduleScreen;