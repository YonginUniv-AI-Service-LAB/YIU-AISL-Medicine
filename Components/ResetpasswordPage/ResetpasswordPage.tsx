//반응형 유틸리티(wp, hp)**와 **중앙 정렬 레이아웃(contentWrapper)**이 아주 잘 구현
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// 1. 반응형 크기 계산 유틸리티
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * Dimensions.get('window').height;

type Props = NativeStackScreenProps<any, 'ResetpasswordPage'>;

export default function PasswordResetScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [emailSent, setEmailSent] = useState(false); 
  const [isCodeConfirmed, setIsCodeConfirmed] = useState(false); 
  const [timer, setTimer] = useState(-1);
  const [confirmError, setConfirmError] = useState('');

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  // --- 핸들러 ---

  // 1. 이메일 인증번호 발송
  const handleEmailVerification = () => {
    if (!email || !email.includes('@')) {
      Alert.alert('알림', '올바른 이메일 형식을 입력해주세요.');
      return;
    }
    
    Alert.alert('알림', '인증번호가 발송되었습니다.');
    setEmailSent(true); 
    setTimer(600); // 10분
  };

  // 2. 인증번호 체크
  const onChangeCode = (txt: string) => {
    setCode(txt);
    if (txt === '123456') { // 가상 테스트 번호
      Alert.alert('성공', '본인인증이 완료되었습니다.');
      setIsCodeConfirmed(true);
      setTimer(-1);
    }
  };

  // 3. 비밀번호 입력
  const handlePasswordChange = (txt: string) => {
    if (!isCodeConfirmed) {
      Alert.alert('알림', '본인인증을 먼저 완료해주세요.');
      return;
    }
    setPassword(txt);
    if (confirmPassword.length > 0) {
        setConfirmError(txt === confirmPassword ? '' : '새 비밀번호를 재입력해주세요.');
    }
  };

  // 4. 비밀번호 확인 입력
  const handlePasswordCheck = (txt: string) => {
    setConfirmPassword(txt);
    setConfirmError(txt === password ? '' : '새 비밀번호를 재입력해주세요.');
  };

  // 5. 완료 버튼 (pwd 페이지로 이동)
  const handleComplete = () => {
    // Navigation.tsx에 정의된 'pwd' 페이지로 이동
    navigation.navigate('pwd' as any);
  };

  // 타이머 로직
  useEffect(() => {
    let iv: NodeJS.Timeout;
    if (timer > 0) {
      iv = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      Alert.alert('알림', '시간이 만료되었습니다. 다시 인증해주세요.');
      setEmailSent(false);
      setTimer(-1);
    }
    return () => clearInterval(iv);
  }, [timer]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const isFormComplete = isCodeConfirmed && passwordRegex.test(password) && password === confirmPassword;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 고정 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={wp(24)} color="#1E1E1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>비밀번호 재설정</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.contentWrapper} 
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>본인인증하기</Text>
        
        <Text style={styles.inputLabel}>이메일 주소</Text>
        <View style={styles.row}>
          <View style={styles.emailInputContainer}>
            <TextInput
              style={[styles.input, isCodeConfirmed && styles.disabledInput]}
              placeholder="abc@email.com"
              placeholderTextColor="#D9D9D9"
              value={email}
              onChangeText={setEmail}
              editable={!isCodeConfirmed}
            />
            {emailSent && (
              <Ionicons name="checkmark" size={wp(20)} color="#5CC163" style={styles.insideCheckIcon} />
            )}
          </View>
          <TouchableOpacity 
            style={styles.smallBtn} 
            onPress={handleEmailVerification}
            disabled={isCodeConfirmed}
          >
            <Text style={styles.smallBtnText}>{emailSent ? '재인증' : '인증받기'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.inputLabel}>인증번호</Text>
        <View style={styles.codeWrapper}>
          <TextInput
            style={styles.fullInput}
            placeholder="인증번호 6자리"
            placeholderTextColor="#D9D9D9"
            keyboardType="numeric"
            maxLength={6}
            value={code}
            onChangeText={onChangeCode}
            editable={emailSent && !isCodeConfirmed}
          />
          {timer > 0 && !isCodeConfirmed && (
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          )}
        </View>

        {/* 하단 섹션 (인증 완료 시 활성화 느낌 유도) */}
        <View style={{ opacity: isCodeConfirmed ? 1 : 0.4, marginTop: hp(32) }}>
          <Text style={styles.sectionTitle}>비밀번호 재설정</Text>
          
          <Text style={styles.inputLabel}>새 비밀번호</Text>
          <TextInput
            style={styles.fullInput}
            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
            placeholderTextColor="#D9D9D9"
            secureTextEntry
            value={password}
            onChangeText={handlePasswordChange}
            editable={isCodeConfirmed}
          />

          <Text style={[styles.inputLabel, !!confirmError && { color: '#F84545' }]}>
            {confirmError ? confirmError : '새 비밀번호 확인'}
          </Text>
          <TextInput
            style={[styles.fullInput, !!confirmError && styles.errorBorder]}
            placeholder="새 비밀번호 재입력"
            placeholderTextColor="#D9D9D9"
            secureTextEntry
            value={confirmPassword}
            onChangeText={handlePasswordCheck}
            editable={isCodeConfirmed}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: isFormComplete ? '#0068FF' : '#D9D9D9' }]}
          disabled={!isFormComplete}
          onPress={handleComplete}
        >
          <Text style={styles.submitBtnText}>완료</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  
  // 헤더
  header: { 
    height: hp(100), 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerTitle: { 
    position: 'absolute', 
    top: hp(72), 
    fontSize: wp(17), 
    fontWeight: '600', 
    color: '#1E1E1E' 
  },
  backBtn: { 
    position: 'absolute', 
    left: wp(20), 
    top: hp(70),
    zIndex: 10
  },

  // 중앙 정렬 레이아웃 (SignUpPage와 통일)
  contentWrapper: { 
    paddingHorizontal: wp(20), 
    paddingBottom: hp(50) 
  },

  sectionTitle: { 
    marginTop: hp(24), 
    fontSize: wp(17), 
    fontWeight: '600', 
    color: '#1E1E1E' 
  },
  inputLabel: { 
    fontSize: wp(12), 
    fontWeight: '600', 
    color: '#979797', 
    marginTop: hp(20), 
    marginBottom: hp(6) 
  },

  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  emailInputContainer: { 
    width: wp(274), 
    height: hp(47), 
    position: 'relative' 
  },
  input: { 
    width: '100%', 
    height: '100%', 
    borderWidth: 1, 
    borderColor: '#979797', 
    borderRadius: 6, 
    paddingHorizontal: wp(12), 
    fontSize: wp(15), 
    color: '#1E1E1E' 
  },
  disabledInput: { 
    backgroundColor: '#F5F5F5', 
    color: '#979797' 
  },
  insideCheckIcon: { 
    position: 'absolute', 
    right: wp(12), 
    top: hp(13) 
  },

  // 버튼 스타일 통일
  smallBtn: { 
    width: wp(69), 
    height: hp(41), 
    borderWidth: 1, 
    borderColor: '#979797', 
    borderRadius: 23.5, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  smallBtnText: { 
    fontSize: wp(14), 
    fontWeight: '500', 
    color: '#1E1E1E' 
  },

  fullInput: { 
    width: wp(353), 
    height: hp(47), 
    borderWidth: 1, 
    borderColor: '#979797', 
    borderRadius: 6, 
    paddingHorizontal: wp(12), 
    fontSize: wp(15), 
    color: '#1E1E1E' 
  },
  errorBorder: { 
    borderColor: '#F84545' 
  },
  codeWrapper: { 
    justifyContent: 'center' 
  },
  timerText: { 
    position: 'absolute', 
    right: wp(15), 
    fontSize: wp(12), 
    color: '#5CC163', 
    fontWeight: '600' 
  },

  submitBtn: { 
    marginTop: hp(60), 
    width: wp(353), 
    height: hp(50), 
    borderRadius: 50, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  submitBtnText: { 
    color: '#FFFFFF', 
    fontSize: wp(14), 
    fontWeight: '600' 
  },
});