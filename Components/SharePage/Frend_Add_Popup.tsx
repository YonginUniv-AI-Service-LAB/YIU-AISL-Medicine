import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';
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
  onConfirm?: (email: string) => void;
}

export default function FrendAddPopup({ visible, onClose, onConfirm }: Props) {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const isButtonEnabled = isValidEmail(email);

  const handleClose = () => {
    setIsSent(false);
    setEmail('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!isButtonEnabled) return;
    try {
      const res = await axios.post(
        `${API_BASE_URL}/friends`,
        { email },
        { withCredentials: true },
      );
      console.log('✅ 친구 신청 성공:', res.data);
      alert('친구 신청을 보냈습니다!');
      setIsSent(true);
    } catch (error: any) {
      // 🔥 정확한 에러 확인용
      console.log('❌ 상태코드:', error.response?.status);
      console.log('❌ 에러 내용:', error.response?.data);
      console.log('❌ 요청 URL:', error.config?.url);
      console.log('❌ 요청 데이터:', error.config?.data);
      alert(`신청 실패 (${error.response?.status}): ${JSON.stringify(error.response?.data)}`);
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
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Text style={{ fontSize: 20, color: '#717680' }}>✕</Text>
              </TouchableOpacity>

              {!isSent ? (
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
                      { backgroundColor: isButtonEnabled ? '#0068FF' : '#D9D9D9' },
                    ]}
                    disabled={!isButtonEnabled}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.addButtonText}>전송하기</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.successContainer}>
                  <View style={styles.successContent}>
                    <Text style={styles.successMessage}>
                      {`'${email}'님께\n친구 신청했습니다.`}
                    </Text>
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={() => {
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