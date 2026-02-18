import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
// ⚠️ 주의: 파일명이 CalenderPopup.style.ts 인지 CalendarPopup.style.ts 인지 반드시 확인!
import { styles } from './CalenderPopup.style'; 

interface Props {
  visible: boolean;
  onClose: () => void;
  userName: string; 
}

export default function CalendarPopup({ visible, onClose, userName }: Props) {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* 스타일 파일에 정의된 modalContainer 사용 */}
        <View style={styles.modalContainer}>
          
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Image 
                source={require('../../assets/images/share/calender.png')} 
                style={styles.calendarIcon}
              />
              {/* userName이 없을 경우를 대비한 방어 코드 */}
              <Text style={styles.title}>
                {userName ? `${userName.split('@')[0]}님의 시간표` : "친구의 시간표"}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.gridContainer}>
              {/* 요일 헤더 */}
              <View style={styles.dayRow}>
                {/* 🔹 이 부분 스타일이 styles.timeColumnLabel로 정확히 있는지 확인 */}
                <View style={styles.timeColumnLabel} />
                {days.map((day, i) => (
                  <View key={i} style={styles.dayCell}>
                    <Text style={styles.dayText}>{day}</Text>
                  </View>
                ))}
              </View>

              {/* 시간대별 그리드 */}
              {times.map((time, index) => (
                <View key={index} style={styles.timeRow}>
                  <View style={styles.timeColumn}>
                    <Text style={styles.timeText}>{time.split(':')[0]}</Text>
                  </View>
                  {days.map((_, i) => (
                    <View key={i} style={styles.gridCell}>
                      {/* 예시 데이터 표시용 */}
                      {index === 1 && i === 2 && <View style={styles.activeSlot} />}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
            <Text style={styles.confirmButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}