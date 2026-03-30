import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ImageSourcePropType,
  Dimensions,
  Alert,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';



// 반응형
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * Dimensions.get('window').height;

const ICON_LOGOUT = require('../../assets/images/Menu_popup/logout_off.png');
const ICON_RESET = require('../../assets/images/Menu_popup/Reset_password_off.png');
const ICON_WITHDRAW = require('../../assets/images/Menu_popup/Withdraw_membership_off.png');

interface MenuPopupProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: 'logout' | 'reset' | 'withdraw') => void;
}

const MenuItem = ({
  icon,
  label,
  onPress,
}: {
  icon: ImageSourcePropType;
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.5 }]}
    onPress={onPress}
  >
    <Image source={icon} style={styles.icon} resizeMode="contain" />
    <Text style={styles.menuText}>{label}</Text>
  </Pressable>
);

export default function MenuPopup({
  visible,
  onClose,
  onSelect,
}: MenuPopupProps) {
  if (!visible) return null;

  // ⭐ 로그아웃 API
  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
      onSelect('logout');
    } catch (error) {
      console.log(error);
      Alert.alert('로그아웃 실패');
    }
  };

  // ⭐ 회원탈퇴 API
  const handleWithdraw = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/auth/user`);
      onSelect('withdraw');
    } catch (error) {
      console.log(error);
      Alert.alert('회원 탈퇴 실패');
    }
  };

  return (
    <>
      {/* 배경 클릭 시 닫기 */}
      <Pressable style={styles.modalBackground} onPress={onClose} />

      <View style={styles.menuPopup}>
        <MenuItem icon={ICON_LOGOUT} label="로그아웃" onPress={handleLogout} />

        <MenuItem
          icon={ICON_RESET}
          label="비밀번호 재설정"
          onPress={() => onSelect('reset')}
        />

        <MenuItem
          icon={ICON_WITHDRAW}
          label="회원 탈퇴"
          onPress={handleWithdraw}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },

  menuPopup: {
    position: 'absolute',
    width: wp(163),
    height: hp(77),
    left: wp(211),
    top: hp(113),
    backgroundColor: '#D9D9D9',

    borderRadius: wp(8),
    paddingVertical: hp(5),
    zIndex: 1001,
    justifyContent: 'center',

    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(12),
    height: hp(22),
  },

  icon: {
    width: wp(16),
    height: wp(16),
    marginRight: wp(8),
  },

  menuText: {
    fontSize: wp(12),
    color: '#4B4B4B',
    fontWeight: '500',
  },
});
