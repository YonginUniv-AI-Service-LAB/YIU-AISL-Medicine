import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { styles } from './FrendPopup.style';

interface Props {
  visible: boolean;
  onClose: () => void;
  friendList: string[];
  // 🔹 삭제 기능을 위해 부모로부터 함수를 하나 더 받습니다.
  onDelete: (email: string) => void; 
}

export default function FrendPopup({ visible, onClose, friendList, onDelete }: Props) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>

          {/* 닫기 버튼 */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ fontSize: 18 }}>✕</Text>
          </TouchableOpacity>

          {/* 상단 아이콘 */}
          <View style={styles.iconBox}>
            <Image
              source={require('../../assets/images/share/frend_off.png')}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>

          {/* 제목 */}
          <Text style={styles.title}>기존 친구들 목록</Text>

          {/* 🔥 친구 목록 리스트 */}
          {friendList && friendList.length > 0 && (
            <ScrollView style={{ width: '100%', maxHeight: 160, marginBottom: 15 }}>
              {friendList.map((email, index) => (
                <View key={index} style={styles.friendRow}>
                  <View style={styles.avatarLabelGroup}>
                    <View style={styles.textGroup}>
                      <Text style={styles.friendName}>Candice Wu</Text>
                      <Text style={styles.friendEmail}>{email}</Text>
                    </View>
                  </View>

                  <View style={styles.actionIcons}>
                    <Image 
                      source={require('../../assets/images/share/write_off.png')} 
                      style={{ width: 18, height: 18, marginRight: 8 }} 
                    />
                    <Image 
                      source={require('../../assets/images/share/calender.png')} 
                      style={{ width: 18, height: 20, marginRight: 8 }} 
                    />
                    {/* 🔥 삭제 버튼 클릭 시 onDelete 실행 */}
                    <TouchableOpacity onPress={() => onDelete(email)}>
                      <Text style={styles.deleteText}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {/* 입력 영역 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>친구를 선택하세요</Text>
            <View style={styles.inputWrapper}>
              <Image
                source={require('../../assets/images/share/frend_in.png')}
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.input}
                placeholder="you@untitledui.com"
                placeholderTextColor="#717680"
              />
            </View>
          </View>

          {/* 하단 버튼 */}
          <TouchableOpacity style={styles.addButton} onPress={onClose}>
            <Text style={styles.addButtonText}>
              공유할 대상을 선택하세요
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}