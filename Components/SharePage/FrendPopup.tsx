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
  onDelete: (email: string) => void;
  onWriteGuestBook: (email: string) => void;
  // 🔹 추가: 친구의 캘린더를 보기 위한 함수
  onViewCalendar: (email: string) => void; 
  isFriendView: boolean;    // 현재 친구 페이지를 보고 있는지 여부
  onResetToMe: () => void;  // 내 페이지로 돌아가는 함수
}

export default function FrendPopup({
  visible,
  onClose,
  friendList,
  onDelete,
  onWriteGuestBook,
  onViewCalendar, // 👈 추가된 프롭 받아오기
  isFriendView,
  onResetToMe,
}: Props) {

  // 하단 메인 버튼 클릭 핸들러
  const handleBottomButtonClick = () => {
    if (isFriendView) {
      // 친구 페이지라면 내 페이지로 돌아가기 실행 후 팝업 닫기
      onResetToMe();
      onClose();
    } else {
      // 일반 상태라면 팝업 닫기
      onClose();
    }
  };

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
            <Text style={{ fontSize: 18, color: '#717680' }}>✕</Text>
          </TouchableOpacity>

          {/* 상단 아이콘 (친구 오프 아이콘) */}
          <View style={styles.iconBox}>
            <Image
              source={require('../../assets/images/share/frend_off.png')}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>

          {/* 제목 */}
          <Text style={styles.title}>기존 친구들 목록</Text>

          {/* 친구 목록 리스트 */}
          {friendList && friendList.length > 0 && (
            <ScrollView 
              style={{ width: '100%', maxHeight: 160, marginBottom: 15 }}
              showsVerticalScrollIndicator={false}
            >
              {friendList.map((email, index) => (
                <View key={index} style={styles.friendRow}>
                  <View style={styles.avatarLabelGroup}>
                    <View style={styles.textGroup}>
                      <Text style={styles.friendEmail}>{email}</Text>
                    </View>
                  </View>

                  {/* 액션 아이콘 그룹 */}
                  <View style={styles.actionIcons}>
                    {/* 1. 방명록 작성 아이콘 */}
                    <TouchableOpacity onPress={() => onWriteGuestBook(email)}>
                      <Image
                        source={require('../../assets/images/share/write_off.png')}
                        style={{ width: 18, height: 18, marginRight: 12 }}
                      />
                    </TouchableOpacity>

                    {/* 2. 캘린더 보기 아이콘 (수정된 부분) */}
                    <TouchableOpacity onPress={() => onViewCalendar(email)}>
                      <Image
                        source={require('../../assets/images/share/calender.png')}
                        style={{ width: 18, height: 20, marginRight: 12 }}
                      />
                    </TouchableOpacity>

                    {/* 3. 삭제 버튼 */}
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

          {/* 하단 메인 버튼 */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleBottomButtonClick}
          >
            <Text style={styles.addButtonText}>
              {isFriendView ? "내 페이지로 돌아가기" : "공유할 대상을 선택하세요"}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}