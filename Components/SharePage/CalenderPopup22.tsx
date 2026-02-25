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

export default function CalendarPopup({ visible, onClose, userName }: Props) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Image
                source={require('../../assets/images/share/calender.png')}
                style={styles.calendarIcon}
              />
              <Text style={styles.title}>
                {userName
                  ? `${userName.split('@')[0]}님의 시간표`
                  : '친구의 시간표'}
              </Text>
            </View>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 🔥 여기 중요 */}
            <CalendarGrid onClose={onClose} />
          </ScrollView>

          <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
            <Text style={styles.confirmButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
