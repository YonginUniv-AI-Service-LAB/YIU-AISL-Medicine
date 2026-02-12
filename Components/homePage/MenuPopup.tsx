////반응형 유틸리티(wp, hp)**와 **중앙 정렬 레이아웃(contentWrapper)**이 아주 잘 구현
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ImageSourcePropType, Dimensions } from 'react-native';

// 1. 반응형 유틸리티 정의
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

const MenuItem = ({ icon, label, onPress }: { icon: ImageSourcePropType, label: string, onPress: () => void }) => (
  <Pressable style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.5 }]} onPress={onPress}>
    <Image source={icon} style={styles.icon} resizeMode="contain" />
    <Text style={styles.menuText}>{label}</Text>
  </Pressable>
);

export default function MenuPopup({ visible, onClose, onSelect }: MenuPopupProps) {
  if (!visible) return null;

  return (
    <>
      {/* 팝업 외부 클릭 시 닫기 위한 배경 */}
      <Pressable style={styles.modalBackground} onPress={onClose} />
      
      {/* 반응형 수치가 적용된 메뉴 팝업 */}
      <View style={styles.menuPopup}>
        <MenuItem icon={ICON_LOGOUT} label="로그아웃" onPress={() => onSelect('logout')} />
        <MenuItem icon={ICON_RESET} label="비밀번호 재설정" onPress={() => onSelect('reset')} />
        <MenuItem icon={ICON_WITHDRAW} label="회원 탈퇴" onPress={() => onSelect('withdraw')} />
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
    zIndex: 1000 
  },
  menuPopup: {
    position: 'absolute',
    // 피그마 디자인 가이드(393x852) 기반 반응형 적용
    width: wp(163),
    height: hp(77), 
    left: wp(211), // 화면 우측 상단 메뉴 버튼 아래 위치
    top: hp(113),
    backgroundColor: '#D9D9D9',
    
    borderRadius: wp(8), 
    paddingVertical: hp(5),
    zIndex: 1001,
    justifyContent: 'center',
    
    /* 그림자 효과 */
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
    marginRight: wp(8) 
  },
  menuText: { 
    fontSize: wp(12), 
    color: '#4B4B4B', 
    fontWeight: '500' 
  },
});