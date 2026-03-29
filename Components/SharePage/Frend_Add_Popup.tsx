import axios from 'axios';//내가

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { styles } from './Frend_Add_Popup.style';

interface Props {
  visible: boolean;
  onClose: () => void;
  // 🔹 확인 버튼 클릭 시 성준님이 입력한 이메일을 부모(SharePage 등)에게 전달
  onConfirm?: (email: string) => void; 
}

export default function FrendAddPopup({ visible, onClose, onConfirm }: Props) {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false); // 전송 완료 상태

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const isButtonEnabled = isValidEmail(email);

  // 팝업 닫기 및 초기화
  const handleClose = () => {
    setIsSent(false);
    setEmail('');
    onClose();
  };
  
const handleSubmit = async () => { //내가
  if (!isButtonEnabled) return;
  try {
    await axios.post('http://192.168.219.104:8080/friends', { email }, { withCredentials: true });
    alert("친구 신청을 보냈습니다!");
    setIsSent(true);
  } catch (error) {
    console.log('친구 신청 오류:', error);
    alert("신청 실패");
  }
};

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%', alignItems: 'center' }}
          >
            <View style={styles.modalContainer}>
              {/* 우측 상단 닫기 X 버튼 */}
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Text style={{ fontSize: 20, color: '#717680' }}>✕</Text>
              </TouchableOpacity>

              {!isSent ? (
                /* --- [상태 1] 입력 화면 (성준님이 이메일 타이핑) --- */
                <View style={{ width: '100%' }}>
                  <View style={styles.iconBox}>
                    <Image
                      source={require('../../assets/images/share/search.png')}
                      style={{ width: 24, height: 24 }}
                      resizeMode="contain"
                    />
                  </View>

                  <Text style={styles.title}>새로운 친구 입력</Text>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>친구 추가</Text>
                    {/* 🔹 ERROR 해결: div를 View로 교체 완료 */}
                    <View style={styles.inputWrapper}>
                      <Image
                        source={require('../../assets/images/share/mail.png')}
                        style={styles.inputIcon}
                        resizeMode="contain"
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="you@untitledui.com"
                        placeholderTextColor="#717680"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      { backgroundColor: isButtonEnabled ? '#0068FF' : '#D9D9D9' }
                    ]}
                    disabled={!isButtonEnabled}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.addButtonText}>전송하기</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                /* --- [상태 2] 전송 완료 화면 --- */
                <View style={styles.successContainer}>
                  <View style={styles.successContent}>
                    <Text style={styles.successMessage}>
                      {`‘${email}’님께\n친구 신청했습니다.`}
                    </Text>
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity 
                      style={styles.confirmButton} 
                      onPress={() => {
                        // 🔹 확인 클릭 시: 입력한 이메일을 인자로 넘겨주며 부모의 콜백 실행
                        if (onConfirm) onConfirm(email); 
                        handleClose();
                      }}
                    >
                      <Text style={styles.confirmButtonText}>확인</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}