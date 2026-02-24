import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { styles } from './CalenderPopup.style';
import CalendarGrid from './CalendarGrid';

interface Props {
  visible: boolean;
  onClose: () => void;
  userName: string;
  isEditable: boolean;
}

export default function CalendarPopup({
  visible,
  onClose,
  userName,
  isEditable,
}: Props) {
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
                {userName
                  ? `${userName.split('@')[0]}님의 시간표`
                  : '친구의 시간표'}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <ScrollView showsVerticalScrollIndicator={false}>
            <CalendarGrid isEditable={isEditable} />
          </ScrollView>

          <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
            <Text style={styles.confirmButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
