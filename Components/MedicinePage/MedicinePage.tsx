import React, { useState, useMemo, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styles from './MedicinePage.style';
import CalendarPopup from './calendarPopup';

import { useMedicine } from '../../contexts/MedicineContext';
import { MedicineSchedule } from '../../contexts/MedicineContext';
import { useSchedule } from '../../contexts/ScheduleContext';

import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';
import {
  DailyMedicineResponse,
  MappedMedicineItem,
  FrontendMedicineStatus
} from '../../contexts/types/MedicineDailyItem';

const MedicinePage: React.FC = () => {
  const navigation = useNavigation<any>();
  const { removeSchedulesByMedicineId } = useSchedule();
  const { medicines, removeMedicine, updateStatus } = useMedicine();
  const { schedules } = useSchedule();
  const handleDeleteMedicine = (medicineId: number) => {
    deleteMedicineApi(medicineId);
  };

  // ─── 로컬 상태 저장 (scheduleId 키로 저장) ───
  const saveStatusLocal = async (
    scheduleId: number,
    status: string,
  ) => {
    try {
      const stored = await AsyncStorage.getItem('medicineStatus');
      const data = stored ? JSON.parse(stored) : {};
      data[scheduleId] = { status };
      await AsyncStorage.setItem('medicineStatus', JSON.stringify(data));
    } catch (e) {
      console.log('상태 저장 실패', e);
    }
  };

  const [apiMedicines, setApiMedicines] = useState<MappedMedicineItem[]>([]);
  const [userName, setUserName] = useState('사용자');

  const [baseDate, setBaseDate] = useState(new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [menuVisibleId, setMenuVisibleId] = useState<string | null>(null);
  const [selectedMedicineId, setSelectedMedicineId] = useState<number | null>(
    null,
  );
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmType, setConfirmType] = useState<'edit' | 'delete' | null>(
    null,
  );
  const [selectedStatus, setSelectedStatus] = useState<
    'done' | 'before' | 'missed'
  >('before');
  const getStatusColor = (status: string) => {
    if (status === 'done') return '#16A34A';
    if (status === 'missed') return '#EF4444';
    return '#2563EB';
  };

  // ─── 로컬 상태 업데이트 (scheduleId 기준) ───
  const updateLocalStatus = (
    scheduleId: number,
    status: 'done' | 'before' | 'missed',
  ) => {
    setApiMedicines((prev) =>
      prev.map((m) =>
        m.scheduleId === scheduleId ? { ...m, status } : m,
      ),
    );
  };

  // ─── 복용 상태 변경 API (PATCH /intakes/{id}) ───
  const updateStatusApi = async (
    id: number,
    status: 'done' | 'before' | 'missed',
  ) => {
    const statusMap: { [key: string]: string } = {
      done: 'TAKEN',
      before: 'BEFORE',
      missed: 'MISSED', // NOT_TAKEN 대신 MISSED 사용 (백엔드 스펙 준수)
    };

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/intakes/${id}`,
        { status: statusMap[status] },
        { withCredentials: true },
      );
      if (response.status === 200) {
        console.log('상태 변경 성공', id, statusMap[status]);
      }
    } catch (error) {
      console.log('복용 상태 변경 실패', error);
    }
  };

  // ─── 약 삭제 API ───
  const deleteMedicineApi = async (medicineId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/medicines/${medicineId}`, {
        withCredentials: true,
      });
      console.log('약 삭제 성공');
      // 해당 medicineId를 가진 모든 스케줄 카드 제거
      setApiMedicines((prev) =>
        prev.filter((m) => m.medicine?.id !== medicineId),
      );
    } catch (error) {
      console.log('약 삭제 실패', error);
    }
  };

  const selectedDateString =
    baseDate.getFullYear() +
    '-' +
    String(baseDate.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(baseDate.getDate()).padStart(2, '0');

  const todayMedicines = apiMedicines;

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

  // ─── GET /medicines/daily?date= 조회 함수 ───
  const fetchDailyMedicines = useCallback(async (dateStr: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/medicines/daily`, {
        params: { date: dateStr },
        withCredentials: true,
      });

      console.log('일별 약 목록 조회 성공', res.data);

      const raw: DailyMedicineResponse[] = res.data?.data ?? res.data ?? [];

      const mapped: MappedMedicineItem[] = raw.map((item) => {
        let status: FrontendMedicineStatus = 'before';
        if (item.status === 'TAKEN') status = 'done';
        else if (item.status === 'NOT_TAKEN') status = 'missed';

        return {
          scheduleId: item.scheduleId,
          intakeId: item.intakeId,
          scheduledTime: item.scheduledTime || '00:00',
          status,
          takenAt: item.takenAt || null,
          medicine: item.medicine,
        };
      });

      const sorted = mapped.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
      setApiMedicines(sorted);
    } catch (error) {
      console.log('일별 약 목록 조회 실패', error);
    }
  }, []);

  // ─── 화면 포커스 시 자동 조회 ───
  useFocusEffect(
    useCallback(() => {
      fetchUser();
      fetchDailyMedicines(selectedDateString);
    }, [selectedDateString]),
  );

  // ─── 날짜 변경 시 재조회 ───
  useEffect(() => {
    fetchDailyMedicines(selectedDateString);
  }, [selectedDateString]);

  const weekData = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());

    const days = ['일', '월', '화', '수', '목', '금', '토'];

    return days.map((dayName, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);

      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      let color = '#1E1E1E';
      if (index === 0) color = '#D32F2F';
      if (index === 6) color = '#409CFF';

      return {
        id: index,
        day: dayName,
        date: date.getDate().toString(),
        fullDate: date,
        color,
        isToday,
      };
    });
  }, [baseDate]);

  const changeWeek = (offset: number) => {
    const newDate = new Date(baseDate);
    newDate.setDate(baseDate.getDate() + offset);
    setBaseDate(newDate);
  };

  const handleDateSelect = (selectedDate: Date) => {
    setBaseDate(selectedDate);
    setIsCalendarVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]} edges={['top']}>
      <View style={[styles.contentWrapper, { flex: 1 }]}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/Logo.png')}
            style={styles.headerLogo}
          />
          <View style={styles.headerRight}>
            <Text style={styles.userName}>{userName}님</Text>
            <Text style={styles.dividerText}>|</Text>
            <TouchableOpacity>
              <Image
                source={require('../../assets/images/Medicine/bell.png')}
                style={styles.menuIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>약 관리</Text>
          <TouchableOpacity onPress={() => setIsCalendarVisible(true)}>
            <Image
              source={require('../../assets/images/Medicine/calendar.png')}
              style={styles.calendarIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarSection}>
          <TouchableOpacity onPress={() => changeWeek(-7)}>
            <Image
              source={require('../../assets/images/Medicine/left.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>

          <View style={styles.calendarContainer}>
            {weekData.map((item) => (
              <View key={item.id} style={styles.dayColumn}>
                <Text style={[styles.dayLabel, { color: item.color }]}>
                  {item.day}
                </Text>
                <View
                  style={[
                    styles.dateCircle,
                    item.isToday && styles.activeCircle,
                  ]}
                >
                  <Text
                    style={{
                      color: item.isToday ? '#FFF' : item.color,
                      fontWeight: item.isToday ? '600' : '500',
                    }}
                  >
                    {item.date}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={() => changeWeek(7)}>
            <Image
              source={require('../../assets/images/Medicine/right.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>복용 예정</Text>
          <Text style={styles.pillCount}>{String(todayMedicines.length)}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {todayMedicines?.map((item: any, index: number) => {
              const timeStr = item?.scheduledTime ?? '00:00';
              const hour = parseInt(timeStr.split(':')[0], 10);
              const ampm = hour < 12 ? '오전' : '오후';
              const med = item.medicine ?? {};

              const dayMap: any = {
                1: '월', 2: '화', 3: '수', 4: '목',
                5: '금', 6: '토', 7: '일',
              };
              const daysLabel = Array.isArray(med.daysOfWeek) && med.daysOfWeek.length
                ? med.daysOfWeek.map((d: number) => dayMap[d] ?? d).join(', ')
                : '-';

              const cardKey = `${item.scheduleId}-${index}`;
              const menuKey = String(item.scheduleId);

              return (
                <View key={cardKey} style={styles.scheduleCard}>
                  <View style={styles.scheduleHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.scheduleTime}>{timeStr}</Text>
                      <Text style={styles.scheduleAmPm}>{ampm}</Text>
                      <Text
                        style={[
                          styles.scheduleState,
                          { color: getStatusColor(item.status ?? 'before') },
                        ]}
                      >
                        {item.status === 'done'
                          ? '복용완료'
                          : item.status === 'missed'
                            ? '미복용'
                            : '복용 전'}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        setSelectedMedicineId(item.scheduleId);
                        setSelectedStatus(item.status ?? 'before');
                        setStatusModalVisible(true);
                      }}
                    >
                      <Text style={styles.takeBtn}>복용</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.scheduleBody}>
                    {menuVisibleId === menuKey && (
                      <View style={styles.cardMenu}>
                        <TouchableOpacity
                          style={styles.cardMenuItem}
                          onPress={() => {
                            setSelectedMedicineId(med.id);
                            setConfirmType('edit');
                            setConfirmModalVisible(true);
                            setMenuVisibleId(null);
                          }}
                        >
                          <Image
                            source={require('../../assets/images/Medicine/edit_off.png')}
                            style={styles.cardMenuIcon}
                          />
                          <Text style={styles.cardMenuText}>수정</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.cardMenuItem}
                          onPress={() => {
                            setSelectedMedicineId(med.id);
                            setConfirmType('delete');
                            setConfirmModalVisible(true);
                            setMenuVisibleId(null);
                          }}
                        >
                          <Image
                            source={require('../../assets/images/Medicine/delete_off.png')}
                            style={styles.cardMenuIcon}
                          />
                          <Text style={[styles.cardMenuText, { color: '#FF4D4F' }]}>
                            삭제
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    <View style={styles.medicineTitleRow}>
                      <Text style={styles.medicineTitle}>
                        {String(med.name ?? '-')}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          setMenuVisibleId(
                            menuVisibleId === menuKey ? null : menuKey,
                          )
                        }
                      >
                        <Image
                          source={require('../../assets/images/menu.png')}
                          style={styles.menuIconSmall}
                        />
                      </TouchableOpacity>
                    </View>

                    {med.category ? (
                      <Text style={styles.scheduleText}>
                        • 카테고리 : {med.category}
                      </Text>
                    ) : null}

                    <Text style={styles.scheduleText}>
                      • 복용 횟수 : 하루 {med.dailyDoseCount ?? '-'}번
                    </Text>

                    <Text style={styles.scheduleText}>
                      • 복용 시간 : {timeStr}
                    </Text>

                    <Text style={styles.scheduleText}>
                       • 복용 요일 : {daysLabel}
                    </Text>

                    <Text style={styles.scheduleText}>
                      • 복용 기간 : {med.startDate ?? '-'} ~ {med.endDate ?? '-'}
                    </Text>

                    <Text style={styles.scheduleText}>
                      • 주의사항 : {med.caution ?? '-'}
                    </Text>
                  </View>
                </View>
              );
            })}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddSchedule')}
            >
              <Text style={styles.addButtonText}>약 복용 일정 추가</Text>
            </TouchableOpacity>
          </ScrollView>

          <Modal visible={statusModalVisible} transparent animationType="fade">
            <View style={styles.statusOverlay}>
              <View style={styles.statusModal}>
                <View style={styles.statusHeader}>
                  <Image
                    source={require('../../assets/images/calendar/medicine_on.png')}
                    style={styles.statusIcon}
                  />
                  <TouchableOpacity
                    onPress={() => setStatusModalVisible(false)}
                  >
                    <Image
                      source={require('../../assets/images/x-close.png')}
                      style={styles.statusClose}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.statusTitle}>복용유무를 선택하세요</Text>

                <View style={styles.statusRow}>
                  <TouchableOpacity
                    style={[
                      styles.statusBtn,
                      selectedStatus === 'done' && styles.statusBtnActiveBlue,
                    ]}
                    onPress={() => setSelectedStatus('done')}
                  >
                    <Text style={styles.statusText}>복용완료</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusBtn,
                      selectedStatus === 'before' && styles.statusBtnActiveGray,
                    ]}
                    onPress={() => setSelectedStatus('before')}
                  >
                    <Text style={styles.statusText}>복용 전</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusBtn,
                      selectedStatus === 'missed' && styles.statusBtnActivePink,
                    ]}
                    onPress={() => setSelectedStatus('missed')}
                  >
                    <Text style={styles.statusText}>미복용</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={() => {
                    if (selectedMedicineId !== null) {
                      const found = apiMedicines.find(m => m.scheduleId === selectedMedicineId);
                      
                      if (found) {
                        const finalId = Number(found.intakeId ?? found.scheduleId);
                        updateLocalStatus(found.scheduleId, selectedStatus);
                        saveStatusLocal(finalId, selectedStatus);
                        updateStatusApi(finalId, selectedStatus);
                      }
                    }
                    setStatusModalVisible(false);
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>
                    복용선택하기
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal visible={confirmModalVisible} transparent animationType="fade">
            <View style={styles.confirmOverlay}>
              <View style={styles.confirmBox}>
                <View style={styles.confirmHeader}>
                  <Image
                    source={
                      confirmType === 'edit'
                        ? require('../../assets/images/Medicine/edit_on.png')
                        : require('../../assets/images/Medicine/delete_on.png')
                    }
                    style={styles.confirmIcon}
                  />
                  <TouchableOpacity
                    onPress={() => setConfirmModalVisible(false)}
                  >
                    <Image
                      source={require('../../assets/images/x-close.png')}
                      style={styles.confirmClose}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.confirmTitle}>
                  {confirmType === 'edit'
                    ? '약 일정을 수정하시겠습니까?'
                    : '약 일정을 삭제하시겠습니까?'}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.confirmMainBtn,
                    confirmType === 'delete' && { backgroundColor: '#E53935' },
                  ]}
                  onPress={() => {
                    if (confirmType === 'edit') {
                      const found = apiMedicines.find(
                        (m) => m.medicine?.id === selectedMedicineId,
                      );
                      navigation.navigate('AddSchedule', {
                        editData: found?.medicine,
                      });
                    } else if (confirmType === 'delete' && selectedMedicineId) {
                      handleDeleteMedicine(Number(selectedMedicineId));
                    }
                    setConfirmModalVisible(false);
                  }}
                >
                  <Text style={styles.confirmMainText}>
                    {confirmType === 'edit' ? '수정하기' : '삭제하기'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmCancelBtn}
                  onPress={() => setConfirmModalVisible(false)}
                >
                  <Text style={styles.confirmCancelText}>취소하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>

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
