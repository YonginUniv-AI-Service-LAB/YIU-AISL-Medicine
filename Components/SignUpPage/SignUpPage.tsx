//반응형 유틸리티(wp, hp)**와 **중앙 정렬 레이아웃(contentWrapper)**이 아주 잘 구현
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 반응형 크기 계산 유틸리티
const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * Dimensions.get('window').height;

// 아이콘 경로
const CHECK_GREEN_ICON = require('../../assets/images/CheckGreen-icon.png');

type AgreeKey = 'all' | 'age' | 'tos' | 'privacy' | 'mkt' | 'sms';
const agreeList: {
  key: AgreeKey;
  label: string;
  required: boolean;
  detail: boolean;
}[] = [
    {
      key: 'age',
      label: '[필수] 만14세 이상입니다',
      required: true,
      detail: false,
    },
    { key: 'tos', label: '[필수] 서비스 이용약관', required: true, detail: true },
    {
      key: 'privacy',
      label: '[필수] 개인정보 수집 및 이용 동의',
      required: true,
      detail: true,
    },
    {
      key: 'mkt',
      label: '[선택] 마케팅 목적의 개인정보 수집 및 이용',
      required: false,
      detail: true,
    },
    {
      key: 'sms',
      label: '[선택] 마케팅 정보 수신 동의(SMS)',
      required: false,
      detail: true,
    },
  ];

export default function SignUpScreen() {
  // Navigation.tsx의 Stack.Screen name="LoginPage"와 일치시켜야 함
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // --- 상태 관리 ---
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [timerSec, setTimerSec] = useState(0);
  const [certNum, setCertNum] = useState('');
  const [certNumValid, setCertNumValid] = useState(false);

  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [idChecked, setIdChecked] = useState(false);
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');

  const [agrees, setAgrees] = useState<Record<AgreeKey, boolean>>({
    all: false,
    age: false,
    tos: false,
    privacy: false,
    mkt: false,
    sms: false,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setEmail('');
    setEmailSent(false);
    setCertNum('');
    setCertNumValid(false);
    setTimerSec(0);
    setUserId('');
    setIdChecked(false);
    setPw('');
    setPwCheck('');
  }, []);

  // --- 핸들러 ---

  // 1. 이메일 인증번호 발송
  const handleEmailVerify = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('알림', '올바른 이메일을 입력해주세요.');
      return;
    }

    try {
      console.log('이메일 인증 요청:', email);

      await axios.post(`${API_BASE_URL}/emails/verification-code/send`, {
        email: email,
        purpose: 'SIGNUP',
      });

      Alert.alert('인증번호 발송');

      setEmailSent(true);
      setCertNum('');
      setCertNumValid(false);
      setTimerSec(600);
    } catch (error) {
      console.log('이메일 전송 오류', error);
      Alert.alert('이메일 전송 실패');
    }
  };

  // 2. 인증번호 체크
  const onChangeCertNum = async (v: string) => {
    setCertNum(v);

    if (!email) {
      Alert.alert('알림', '먼저 이메일 인증을 요청해주세요.');
      return;
    }

    if (v.length === 6) {
      try {
        await axios.post(`${API_BASE_URL}/emails/verification-code/verify`, {
          email: email,
          code: v,
          purpose: 'SIGNUP',
        });

        Alert.alert('성공', '본인인증이 완료되었습니다.');

        setCertNumValid(true);
        setTimerSec(0);

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      } catch {
        Alert.alert('오류', '인증번호가 틀렸습니다.');
      }
    }
  };

  // 3. 아이디 중복확인
  const handleIdCheck = () => {
    if (!userId || !userId.includes('@')) {
      return Alert.alert(
        '알림',
        '아이디로 사용할 올바른 이메일을 입력해주세요.',
      );
    }
    if (userId === 'test@test.com') {
      Alert.alert('알림', '이미 가입된 이메일입니다.');
      setIdChecked(false);
    } else {
      Alert.alert('알림', '가입 가능한 이메일입니다.');
      setIdChecked(true);
    }
  };

  // 4. 약관 동의
  const toggleAll = () => {
    const next = !agrees.all;
    setAgrees({
      all: next,
      age: next,
      tos: next,
      privacy: next,
      mkt: next,
      sms: next,
    });
  };

  const toggleOne = (key: AgreeKey) => {
    const next = { ...agrees, [key]: !agrees[key] };
    const allChecked = agreeList.every((a) => next[a.key]);
    setAgrees({ ...next, all: allChecked });
  };

  // 5. 최종 회원가입 완료 및 이동
  const handleSignUpComplete = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/signup`, {
        email: userId, // 아이디로 사용할 이메일
        name: name, // 이름
        password: pw, // 비밀번호
        code: certNum, // 이메일 인증번호
      });

      Alert.alert('성공', '회원가입이 완료되었습니다.', [
        {
          text: '확인',
          onPress: () => navigation.navigate('LoginPage'),
        },
      ]);
    } catch (error: any) {
      console.log(error.response?.data); // 서버 에러 메시지 확인
      Alert.alert('회원가입 실패');
    }
  };

  // 타이머 이펙트
  useEffect(() => {
    if (timerSec > 0) {
      timerRef.current = setInterval(() => setTimerSec((t) => t - 1), 1000);
    } else if (timerSec === 0 && emailSent) {
      Alert.alert('알림', '인증시간이 만료되었습니다. 다시 인증해주세요.');
      setEmailSent(false);
      setCertNum('');
      setCertNumValid(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerSec]);

  const isFormValid =
    certNumValid &&
    idChecked &&
    name.length > 0 &&
    pw.length >= 8 &&
    pw === pwCheck &&
    agrees.age &&
    agrees.tos &&
    agrees.privacy;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inlineHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={wp(24)} color="#1E1E1E" />
          </TouchableOpacity>
          <Text style={styles.mainTitle}>회원가입</Text>
        </View>

        <View style={styles.contentWrapper}>
          <Text style={styles.sectionTitle}>본인인증하기</Text>

          <Text style={styles.inputLabel}>이메일 주소</Text>
          <View style={styles.row}>
            <View style={styles.emailInputContainer}>
              <TextInput
                style={[styles.input, certNumValid && styles.disabledInput]}
                placeholder="abc@email.com"
                placeholderTextColor="#D9D9D9"
                value={email}
                onChangeText={setEmail}
                editable={!certNumValid}
              />
              {emailSent && (
                <Image
                  source={CHECK_GREEN_ICON}
                  style={styles.insideCheckIcon}
                  resizeMode="contain"
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.smallBtn}
              onPress={handleEmailVerify}
              disabled={certNumValid}
            >
              <Text style={styles.smallBtnText}>
                {emailSent ? '재인증' : '인증받기'}
              </Text>
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
              value={certNum}
              onChangeText={onChangeCertNum}
            />
            {timerSec > 0 && !certNumValid && (
              <Text style={styles.timerText}>
                {Math.floor(timerSec / 60)
                  .toString()
                  .padStart(2, '0')}
                :{(timerSec % 60).toString().padStart(2, '0')}
              </Text>
            )}
          </View>

          <View style={styles.divider} />

          <Text style={[styles.sectionTitle, { marginTop: hp(30) }]}>
            필수정보입력
          </Text>

          <Text style={styles.inputLabel}>이름</Text>
          <TextInput
            style={styles.fullInput}
            placeholder="홍길동"
            placeholderTextColor="#D9D9D9"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputLabel}>이메일 (아이디)</Text>
          <View style={styles.row}>
            <View style={styles.emailInputContainer}>
              <TextInput
                style={[styles.input, idChecked && styles.disabledInput]}
                placeholder="이메일을 입력하세요"
                placeholderTextColor="#D9D9D9"
                value={userId}
                onChangeText={(v) => {
                  setUserId(v);
                  setIdChecked(false);
                }}
                editable={!idChecked}
              />
              {idChecked && (
                <Image
                  source={CHECK_GREEN_ICON}
                  style={styles.insideCheckIcon}
                  resizeMode="contain"
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.smallBtn}
              onPress={handleIdCheck}
              disabled={idChecked}
            >
              <Text style={styles.smallBtnText}>중복확인</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>비밀번호</Text>
          <TextInput
            style={styles.fullInput}
            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
            placeholderTextColor="#D9D9D9"
            secureTextEntry
            value={pw}
            onChangeText={setPw}
          />

          <Text
            style={[
              styles.inputLabel,
              pwCheck.length > 0 && pw !== pwCheck && { color: '#F84545' },
            ]}
          >
            {pwCheck.length > 0 && pw !== pwCheck
              ? '비밀번호가 일치하지 않습니다'
              : '비밀번호 확인'}
          </Text>
          <TextInput
            style={[
              styles.fullInput,
              pwCheck.length > 0 &&
              pw !== pwCheck && { borderColor: '#F84545' },
            ]}
            placeholder="비밀번호 재입력"
            placeholderTextColor="#D9D9D9"
            secureTextEntry
            value={pwCheck}
            onChangeText={setPwCheck}
          />

          <View style={styles.agreeSection}>
            <TouchableOpacity style={styles.agreeRow} onPress={toggleAll}>
              <Ionicons
                name={agrees.all ? 'checkbox' : 'square-outline'}
                size={wp(24)}
                color={agrees.all ? '#0068FF' : '#979797'}
              />
              <Text style={styles.agreeAllText}>모두 동의 합니다.</Text>
            </TouchableOpacity>
            {agreeList.map((item) => (
              <View key={item.key} style={styles.agreeRowItem}>
                <TouchableOpacity
                  style={styles.agreeRowLeft}
                  onPress={() => toggleOne(item.key)}
                >
                  <Ionicons
                    name={agrees[item.key] ? 'checkbox' : 'square-outline'}
                    size={wp(22)}
                    color={agrees[item.key] ? '#0068FF' : '#979797'}
                  />
                  <Text style={styles.agreeText}>{item.label}</Text>
                </TouchableOpacity>
                {item.detail && (
                  <Ionicons
                    name="chevron-forward"
                    size={wp(16)}
                    color="#979797"
                  />
                )}
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.submitBtn,
              { backgroundColor: isFormValid ? '#0068FF' : '#D9D9D9' },
            ]}
            onPress={handleSignUpComplete}
            disabled={!isFormValid}
          >
            <Text style={styles.submitBtnText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1 },
  scrollContent: { paddingBottom: hp(50) },
  inlineHeader: {
    width: '100%',
    height: hp(100),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(20),
  },
  backBtn: { position: 'absolute', left: wp(20), top: hp(50), zIndex: 10 },
  mainTitle: {
    marginTop: hp(30),
    fontWeight: '600',
    fontSize: wp(17),
    color: '#1E1E1E',
  },
  contentWrapper: { paddingHorizontal: wp(20) },
  sectionTitle: {
    fontSize: wp(17),
    fontWeight: '600',
    color: '#1E1E1E',
    marginTop: hp(20),
  },
  inputLabel: {
    fontSize: wp(12),
    fontWeight: '600',
    color: '#979797',
    marginTop: hp(15),
    marginBottom: hp(6),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emailInputContainer: { width: wp(249), height: hp(47), position: 'relative' },
  input: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#979797',
    borderRadius: 6,
    paddingHorizontal: wp(12),
    fontSize: wp(15),
    color: '#1E1E1E',
  },
  disabledInput: { backgroundColor: '#F5F5F5', color: '#979797' },
  insideCheckIcon: {
    position: 'absolute',
    right: wp(12),
    top: hp(13.5),
    width: wp(20),
    height: wp(20),
  },
  smallBtn: {
    width: wp(94),
    height: hp(47),
    borderWidth: 1,
    borderColor: '#979797',
    borderRadius: 23.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallBtnText: { fontSize: wp(15), fontWeight: '500', color: '#1E1E1E' },
  fullInput: {
    width: wp(353),
    height: hp(47),
    borderWidth: 1,
    borderColor: '#979797',
    borderRadius: 6,
    paddingHorizontal: wp(12),
    fontSize: wp(15),
    color: '#1E1E1E',
  },
  codeWrapper: { justifyContent: 'center' },
  timerText: {
    position: 'absolute',
    right: wp(15),
    fontSize: wp(12),
    color: '#5CC163',
    fontWeight: '600',
  },
  divider: {
    height: hp(5),
    backgroundColor: '#F4F4F4',
    marginHorizontal: wp(-20),
    marginTop: hp(40),
  },
  agreeSection: { marginTop: hp(30) },
  agreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(20),
  },
  agreeAllText: {
    fontSize: wp(15),
    fontWeight: '600',
    marginLeft: wp(10),
    color: '#1E1E1E',
  },
  agreeRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(15),
  },
  agreeRowLeft: { flexDirection: 'row', alignItems: 'center' },
  agreeText: { fontSize: wp(13), color: '#979797', marginLeft: wp(10) },
  submitBtn: {
    width: wp(353),
    height: hp(50),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(40),
  },
  submitBtnText: { color: '#FFF', fontSize: wp(14), fontWeight: '600' },
});
