import React, { useState, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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

const API_BASE_URL = 'http://192.168.0.118:8080';

const MedicinePage: React.FC = () => {
  const navigation = useNavigation<any>();
  const { removeSchedulesByMedicineId } = useSchedule();
  const { medicines, removeMedicine, updateStatus } = useMedicine();
  const { schedules } = useSchedule();
  const handleDeleteMedicine = (medicineId: number) => {
    deleteMedicineApi(medicineId);
  };

  const [apiMedicines, setApiMedicines] = useState<any[]>([]);

  const [baseDate, setBaseDate] = useState(new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [menuVisibleId, setMenuVisibleId] = useState<string | null>(null);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(
    null,
  );
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmType, setConfirmType] = useState<'edit' | 'delete' | null>(
    null,
  );
  const [selectedStatus, setSelectedStatus] = useState<
    'done' | 'before' | 'missed'
  >('before');
  const getStatusColor = (status: 'done' | 'before' | 'missed') => {
    if (status === 'done') return '#16A34A'; // 초록
    if (status === 'missed') return '#EF4444'; // 빨강
    return '#2563EB'; // 파랑
  };

  const updateLocalStatus = (
    id: number,
    status: 'done' | 'before' | 'missed',
  ) => {
    setApiMedicines((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: status,
            }
          : m,
      ),
    );
  };

  const deleteMedicineApi = async (medicineId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/medicines/${medicineId}`);
      console.log('약 삭제 성공');

      // 화면에서도 삭제
      setApiMedicines((prev) => prev.filter((m) => m.id !== medicineId));
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

  const todayMedicines = apiMedicines.filter((m) => {
    const start = new Date(m.startDate);
    const end = new Date(m.endDate);
    const current = new Date(selectedDateString);

    return current >= start && current <= end;
  });

  useFocusEffect(
    useCallback(() => {
      const fetchMedicines = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/medicines`);

          console.log('약 목록', res.data);

          setApiMedicines(res.data);
        } catch (error) {
          console.log('약 목록 불러오기 실패', error);
        }
      };

      fetchMedicines();
    }, []),
  );

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
        {/* ===== 고정 영역 ===== */}

        {/* 헤더 */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/Logo.png')}
            style={styles.headerLogo}
          />
          <View style={styles.headerRight}>
            <Text style={styles.userName}>000님</Text>
            <Text style={styles.dividerText}>|</Text>
            <TouchableOpacity>
              <Image
                source={require('../../assets/images/Medicine/bell.png')}
                style={styles.menuIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 제목 */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>약 관리</Text>
          <TouchableOpacity onPress={() => setIsCalendarVisible(true)}>
            <Image
              source={require('../../assets/images/Medicine/calendar.png')}
              style={styles.calendarIcon}
            />
          </TouchableOpacity>
        </View>

        {/* 캘린더 */}
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

        {/* 복용 예정 제목 */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>복용 예정</Text>
          <Text style={styles.pillCount}>{String(todayMedicines.length)}</Text>
        </View>

        {/* ===== 여기부터만 스크롤 ===== */}
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {todayMedicines.map((item: any) => {
              const firstTime = item.schedules?.[0]?.intakeTime ?? '00:00';
              const hour = parseInt(firstTime.split(':')[0], 10);
              const ampm = hour < 12 ? '오전' : '오후';

              const dayMap: any = {
                1: '월',
                2: '화',
                3: '수',
                4: '목',
                5: '금',
                6: '토',
                7: '일',
              };

              return (
                <View key={item.id} style={styles.scheduleCard}>
                  {/* 상단 */}
                  <View style={styles.scheduleHeader}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Text style={styles.scheduleTime}>
                        {String(firstTime)}
                      </Text>
                      <Text style={styles.scheduleAmPm}>{String(ampm)}</Text>
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
                        setSelectedMedicineId(item.id);
                        setStatusModalVisible(true);
                      }}
                    >
                      <Text style={styles.takeBtn}>복용</Text>
                    </TouchableOpacity>
                  </View>

                  {/* 본문 */}
                  <View style={styles.scheduleBody}>
                    {menuVisibleId === item.id && (
                      <View style={styles.cardMenu}>
                        <TouchableOpacity
                          style={styles.cardMenuItem}
                          onPress={() => {
                            setSelectedMedicineId(item.id);
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
                            setSelectedMedicineId(item.id);
                            setConfirmType('delete');
                            setConfirmModalVisible(true);
                            setMenuVisibleId(null);
                          }}
                        >
                          <Image
                            source={require('../../assets/images/Medicine/delete_off.png')}
                            style={styles.cardMenuIcon}
                          />
                          <Text
                            style={[styles.cardMenuText, { color: '#FF4D4F' }]}
                          >
                            삭제
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    <View style={styles.medicineTitleRow}>
                      <Text style={styles.medicineTitle}>
                        {String(item.name)}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          setMenuVisibleId(
                            menuVisibleId === item.id ? null : item.id,
                          )
                        }
                      >
                        <Image
                          source={require('../../assets/images/menu.png')}
                          style={styles.menuIconSmall}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* ⭐ 카테고리 */}
                    {item.category && (
                      <Text style={styles.scheduleText}>
                        • 카테고리 : {item.category}
                      </Text>
                    )}

                    {/* ⭐ 복용횟수 */}
                    <Text style={styles.scheduleText}>
                      • 복용 횟수 : 하루 {item.dailyDoseCount ?? '-'}번
                    </Text>

                    <Text style={styles.scheduleText}>
                      • 복용 시간 :{' '}
                      {item.schedules?.length
                        ? item.schedules
                            .map((s: any) => s.intakeTime)
                            .join(', ')
                        : '-'}
                    </Text>

                    <Text style={styles.scheduleText}>
                      • 복용 간격 :
                      {item.schedules?.length
                        ? [
                            ...new Set(
                              item.schedules.map(
                                (s: any) => dayMap[s.dayOfWeek],
                              ),
                            ),
                          ].join(', ')
                        : '-'}
                    </Text>

                    <Text style={styles.scheduleText}>
                      • 복용 기간 :{' '}
                      {item.durationDays ? `${item.durationDays}일` : '-'}
                    </Text>

                    <Text style={styles.scheduleText}>
                      • 남은 복용 횟수: {item.totalQuantity ?? '-'}회
                    </Text>

                    <Text style={styles.scheduleText}>
                      • 주의사항 : {item.caution ?? '-'}
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
          {/* ===== 복용 상태 선택 모달 ===== */}
          <Modal visible={statusModalVisible} transparent animationType="fade">
            <View style={styles.statusOverlay}>
              <View style={styles.statusModal}>
                {/* 🔥 상단 아이콘 + 닫기 버튼 */}
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
                    if (selectedMedicineId) {
                      updateLocalStatus(
                        Number(selectedMedicineId),
                        selectedStatus,
                      );
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
          {/* ===== 수정/삭제 확인 모달 ===== */}
          <Modal visible={confirmModalVisible} transparent animationType="fade">
            <View style={styles.confirmOverlay}>
              <View style={styles.confirmBox}>
                {/* 🔥 상단 아이콘 + 닫기 */}
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

                {/* 메인 버튼 */}
                <TouchableOpacity
                  style={[
                    styles.confirmMainBtn,
                    confirmType === 'delete' && { backgroundColor: '#E53935' },
                  ]}
                  onPress={() => {
                    if (confirmType === 'edit') {
                      navigation.navigate('AddSchedule', {
                        editData: apiMedicines.find(
                          (m) => m.id === selectedMedicineId,
                        ),
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

                {/* 취소 */}
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
