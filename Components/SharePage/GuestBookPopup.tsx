import React, { useState, useEffect } from 'react';
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
import { styles } from './GuestBookPopup.style';

interface Props {
  visible: boolean;
  onClose: () => void;
  userName: string;
  onSubmit: (message: string) => void; // 👈 1. 부모에게 메시지를 전달할 타입 정의 (에러 해결)
}

export default function GuestBookPopup({ visible, onClose, userName, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [content, setContent] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // 🕒 팝업이 열릴 때 현재 시간 설정
  useEffect(() => {
    if (visible) {
      const now = new Date();
      const yy = String(now.getFullYear()).slice(-2);
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      
      setCurrentTime(`${yy}.${mm}.${dd} ${hh}:${min}`);
    }
  }, [visible]);

  // 모든 상태 초기화 후 닫기
  const handleFullClose = () => {
    setStep(1);
    setContent('');
    onClose();
  };

  // 🚀 2. '방명록 등록하기' 버튼 클릭 시 실행될 로직
  const handleRegister = () => {
    if (content.trim().length === 0) {
      alert('메시지를 입력해주세요!');
      return;
    }
    
    // 부모(SharePage)의 handleRegisterGuestBook 함수로 내용 전달
    onSubmit(content); 
    
    // 등록 후 팝업 닫기 및 초기화
    handleFullClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          {step === 1 ? (
            /* --- [단계 1] 안내 팝업 --- */
            <View style={styles.modalStep1}>
              <TouchableOpacity style={styles.closeX} onPress={handleFullClose}>
                <Text style={styles.xText}>✕</Text>
              </TouchableOpacity>
              
              <View style={styles.step1Content}>
                <View style={styles.writeButton}>
                  <Text style={styles.writeText}>방명록을 쓰세요</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={() => setStep(2)}>
                  <Text style={styles.closeText}>작성하러 가기</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* --- [단계 2] 상세 입력 폼 --- */
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              <View style={styles.modalStep2}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity style={styles.closeXAbsolute} onPress={handleFullClose}>
                    <Image 
                      source={require('../../assets/images/x-close.png')} 
                      style={styles.xIcon} 
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.formContainer}>
                  {/* 날짜 섹션 */}
                  <View style={styles.dateRow}>
                    <Text style={styles.dateText}>{currentTime}</Text>
                  </View>

                  {/* 받는 이 섹션 */}
                  <View style={styles.inputField}>
                    <Text style={styles.label}>To</Text>
                    <View style={styles.inputWrapper}>
                      <View style={styles.addOn}>
                        <Text style={styles.addOnText}>받는이</Text>
                      </View>
                      <View style={styles.textInputBox}>
                        <Text style={styles.targetName}>{userName || '친구'}</Text>
                      </View>
                    </View>
                  </View>

                  {/* 메시지 입력 섹션 */}
                  <View style={styles.textareaField}>
                    <Text style={styles.label}>메시지</Text>
                    <View style={styles.textareaInput}>
                      <TextInput
                        style={styles.mainInput}
                        placeholder="따뜻한 한마디를 남겨주세요..."
                        placeholderTextColor="#717680"
                        multiline
                        textAlignVertical="top"
                        value={content}
                        onChangeText={setContent}
                      />
                    </View>
                  </View>

                  {/* 3. onPress에 handleRegister 연결 */}
                  <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
                    <Text style={styles.submitButtonText}>방명록 등록하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}