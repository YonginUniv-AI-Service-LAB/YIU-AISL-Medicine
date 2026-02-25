// 나(신청자): 친구의 이메일을 입력해 신청을 보냄.

// 상대방(수신자): 내 신청을 확인하고 '수락' 또는 '거절'을 선택함. (상대방 시점 테스트)

// 나(신청자): 상대방이 내린 결정(승인됨/거절됨)에 대한 최종 결과를 팝업으로 다시 확인받음.

// 이 흐름을 구현하기 위해 SelectPopup의 로직을 **"상대방의 선택 결과가 나에게 피드백으로 돌아오는 시뮬레이션"**에 맞춰 최종 보완해 드립니다.
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { styles } from './SelectPopup.style';

interface Props {
  visible: boolean;
  onClose: () => void;
  senderEmail: string; // FrendAddPopup에서 입력한 그 이메일
  // 🔹 추가: 수락 시 부모의 목록에 추가하기 위한 함수
  onAccept: (email: string) => void;
}

type Step = 'DECIDE' | 'OTHER_RESULT' | 'MY_RESULT';

export default function SelectPopup({
  visible,
  onClose,
  senderEmail,
  onAccept,
}: Props) {
  const [step, setStep] = useState<Step>('DECIDE');
  const [processType, setProcessType] = useState<'ACCEPT' | 'REJECT' | null>(
    null,
  );

  const myName = '오성준'; // 나

  const handleClose = () => {
    setStep('DECIDE');
    setProcessType(null);
    onClose();
  };

  // 1단계: 상대방이 수락/거절 선택
  const handleDecision = (type: 'ACCEPT' | 'REJECT') => {
    setProcessType(type);

    // 🔥 [핵심 로직] 상대방이 '수락'을 누른 시점에 부모의 friendList에 추가
    if (type === 'ACCEPT') {
      onAccept(senderEmail);
    }

    setStep('OTHER_RESULT'); // 선택 후 상대방 결과 화면으로 이동
  };

  // 2단계: 상대방 결과 확인 후 내 결과로 이동
  const goToMyResult = () => {
    setStep('MY_RESULT');
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
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeIconText}>✕</Text>
            </TouchableOpacity>

            {/* --- [1단계] 상대방(수신자)의 선택 화면 --- */}
            {step === 'DECIDE' && (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={[styles.successContent, { marginTop: 20 }]}>
                  <Text style={styles.successMessage}>
                    {`[상대방 시점 테스트]\n'${myName}'님이 보낸 신청을\n수락하시겠습니까?`}
                  </Text>
                </View>
                <View style={styles.modalActions}>
                  {/* 수락 버튼 */}
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleDecision('ACCEPT')}
                  >
                    <Text style={styles.acceptButtonText}>수락</Text>
                  </TouchableOpacity>
                  {/* 거절 버튼 */}
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => handleDecision('REJECT')}
                  >
                    <Text style={styles.confirmButtonText}>거절</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* --- [2단계] 상대방 시점의 결과 화면 --- */}
            {step === 'OTHER_RESULT' && (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={[styles.successContent, { marginTop: 20 }]}>
                  <Text style={[styles.successMessage]}>
                    {processType === 'ACCEPT'
                      ? `[상대방 시점 결과]\n'${myName}'님과 친구가 되었습니다.`
                      : `[상대방 시점 결과]\n'${myName}'님의 신청을 거절했습니다.`}
                  </Text>
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={goToMyResult}
                  >
                    <Text style={styles.confirmButtonText}>닫기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* --- [3단계] 최종 내(성준) 시점 피드백 화면 --- */}
            {step === 'MY_RESULT' && (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={[styles.successContent, { marginTop: 20 }]}>
                  <Text
                    style={[styles.successMessage, { flexShrink: 1 }]}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                  >
                    {processType === 'ACCEPT'
                      ? `[내 시점 결과]\n‘${senderEmail}’님과\n친구가 되었습니다!`
                      : `[내 시점 결과]\n‘${senderEmail}’님이\n신청을 거절했습니다.`}
                  </Text>
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleClose}
                  >
                    <Text style={styles.confirmButtonText}>닫기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
// 신청자(나)의 시점: "방금 이 사람에게 신청을 완료했다"라는 피드백을 받는 화면입니다. (가장 일반적인 UX)

// 시스템/다른 사람 시점: "이미 이메일이 발송되어 처리 중"인 상태를 보여주는 시뮬레이션입니다.

// 사용자께서 말씀하신 **"내 계정이 아닌 다른 사람의 시점"**을 보여준다는 의도에 맞춰, **'내 정보'가 아닌 '신청을 받은 상대방의 정보'**가 어떻게 보여질지, 혹은 그 결과가 어떻게 나타날지에 집중하여 전체 코드를 최종 정리해 드립니다.

// 1. SelectPopup.tsx (최종 전체 코드)
// 상대방의 이메일을 입력하면, 상대방에게 신청이 완료되었다는 결과를 보여주는 구조입니다.
