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
import { useFriend, FriendRequest } from '../../contexts/FriendContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  friendList: string[];
  onDelete: (email: string) => void;
  onWriteGuestBook: (email: string) => void;
  onViewCalendar: (email: string) => void;
  isFriendView: boolean;
  onResetToMe: () => void;
}

export default function FrendPopup({
  visible,
  onClose,
  friendList,
  onDelete,
  onWriteGuestBook,
  onViewCalendar,
  isFriendView,
  onResetToMe,
}: Props) {

  const { friendRequests, fetchFriendRequests, acceptRequest } = useFriend();

  const handleBottomButtonClick = () => {
    if (isFriendView) {
      onResetToMe();
      onClose();
    } else {
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

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ fontSize: 18, color: '#717680' }}>✕</Text>
          </TouchableOpacity>

          <View style={styles.iconBox}>
            <Image
              source={require('../../assets/images/share/frend_off.png')}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>기존 친구들 목록</Text>

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
                  <View style={styles.actionIcons}>
                    <TouchableOpacity onPress={() => onWriteGuestBook(email)}>
                      <Image
                        source={require('../../assets/images/share/write_off.png')}
                        style={{ width: 18, height: 18, marginRight: 12 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onViewCalendar(email)}>
                      <Image
                        source={require('../../assets/images/share/calender.png')}
                        style={{ width: 18, height: 20, marginRight: 12 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(email)}>
                      <Text style={styles.deleteText}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {/* 받은 친구 요청 목록 */}
          {friendRequests && friendRequests.length > 0 && (
            <View style={{ width: '100%', marginBottom: 15 }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>받은 친구 요청</Text>
              <ScrollView style={{ maxHeight: 120 }}>
                {friendRequests.map((req, index) => (
                  <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text>{req.fromNickname}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity onPress={() => acceptRequest(req.relationId, 'ACCEPTED')}>
                        <Text style={{ color: '#0068FF', marginRight: 10 }}>수락</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => acceptRequest(req.relationId, 'REJECTED')}>
                        <Text style={{ color: 'red' }}>거절</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

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