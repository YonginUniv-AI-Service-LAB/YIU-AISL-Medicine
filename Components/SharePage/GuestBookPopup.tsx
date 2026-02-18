import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function GuestBookPopup({ visible, onClose, userName }: any) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeX} onPress={onClose}>
            <Text style={{ fontSize: 24, color: '#999' }}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.content}>
            {/* 상단 텍스트 영역 (이미지 참조) */}
            <TouchableOpacity style={styles.writeButton}>
              <Text style={styles.writeText}>방명록을 쓰세요</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: (343/393)*SCREEN_WIDTH, backgroundColor: '#FFF', borderRadius: 16, padding: 20, position: 'relative' },
  closeX: { position: 'absolute', right: 16, top: 16 },
  content: { marginTop: 40, alignItems: 'center' },
  writeButton: { width: '100%', height: 50, borderWidth: 1, borderColor: '#D9D9D9', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  writeText: { fontSize: 17, fontWeight: '700', color: '#000' },
  closeButton: { width: '100%', height: 50, borderWidth: 1, borderColor: '#D9D9D9', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  closeText: { fontSize: 17, fontWeight: '700', color: '#000' },
});