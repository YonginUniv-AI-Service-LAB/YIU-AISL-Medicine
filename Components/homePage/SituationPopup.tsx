import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Dimensions,
  Alert,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';
import { useNavigation } from '@react-navigation/native';



// axios 기본 설정
axios.defaults.withCredentials = true;

// 반응형
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * Dimensions.get('window').height;

const ICONS: { [key: string]: ImageSourcePropType } = {
  logout: require('../../assets/images/situationPopup/logout_on.png'),
  reset: require('../../assets/images/situationPopup/Reset_password_on.png'),
  withdraw: require('../../assets/images/situationPopup/Withdraw_membership_on.png'),
};

interface SituationPopupProps {
  visible: boolean;
  type: 'logout' | 'reset' | 'withdraw';
  onClose: () => void;
}

export default function SituationPopup({
  visible,
  type,
  onClose,
}: SituationPopupProps) {
  const navigation = useNavigation<any>();

  if (!visible) return null;

  const config = {
    logout: { title: "'로그아웃' 하시겠습니까?", btn: '로그 아웃하기' },
    reset: {
      title: "'비밀번호 재설정'하시겠습니까?",
      btn: '비밀번호 재설정하기',
    },
    withdraw: { title: "'회원탈퇴'하시겠습니까?", btn: '회원 탈퇴하기' },
  }[type];

  const handleConfirm = async () => {
    try {
      // 로그아웃
      if (type === 'logout') {
        await axios.post(
          `${API_BASE_URL}/auth/logout`,
          {},
          { withCredentials: true },
        );

        onClose();

        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      }

      // 비밀번호 재설정 이동
      if (type === 'reset') {
        onClose();

        navigation.navigate('Auth', {
          screen: 'ResetpasswordPage',
        });
      }

      // 회원탈퇴
      if (type === 'withdraw') {
        await axios.delete(`${API_BASE_URL}/auth/user`, {
          withCredentials: true,
        });

        onClose();

        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      }
    } catch (error) {
      console.log('처리 실패:', error);
    }
  };

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      {/* 배경 */}
      <View style={styles.dim} pointerEvents="none" />

      {/* 모달 */}
      <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
        {/* X 버튼 */}
        <TouchableOpacity style={styles.xBtn} onPress={onClose}>
          <Image
            source={require('../../assets/images/x-close.png')}
            style={{ width: wp(24), height: wp(24) }}
          />
        </TouchableOpacity>

        {/* 아이콘 */}
        <View style={styles.iconCircle}>
          <Image
            source={ICONS[type]}
            style={{ width: wp(24), height: wp(24) }}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>{config.title}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.redBtn} onPress={handleConfirm}>
            <Text style={styles.whiteText}>{config.btn}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.whiteBtn} onPress={onClose}>
            <Text style={styles.grayText}>취소하기</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },

  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,13,18,0.4)',
  },

  modal: {
    width: wp(343),
    backgroundColor: 'white',
    borderRadius: wp(16),
    padding: wp(16),
    paddingTop: hp(32),
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: hp(8) },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  xBtn: {
    position: 'absolute',
    right: wp(16),
    top: hp(16),
  },

  iconCircle: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(24),
    backgroundColor: '#FEE4E2',
    borderWidth: wp(8),
    borderColor: '#FEF3F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(16),
    alignSelf: 'flex-start',
    marginLeft: wp(8),
  },

  title: {
    fontSize: wp(18),
    fontWeight: '600',
    color: '#181D27',
    marginBottom: hp(32),
    textAlign: 'center',
  },

  buttonContainer: {
    width: '100%',
    gap: hp(12),
  },

  redBtn: {
    width: '100%',
    height: hp(44),
    backgroundColor: '#D92D20',
    borderRadius: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },

  whiteBtn: {
    width: '100%',
    height: hp(44),
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D5D7DA',
    borderRadius: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },

  whiteText: {
    color: 'white',
    fontWeight: '600',
    fontSize: wp(16),
  },

  grayText: {
    color: '#414651',
    fontWeight: '600',
    fontSize: wp(16),
  },
});