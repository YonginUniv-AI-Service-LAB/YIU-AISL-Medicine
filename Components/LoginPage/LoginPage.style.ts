//반응형 유틸리티(wp, hp)**와 **중앙 정렬 레이아웃(contentWrapper)**이 아주 잘 구현
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 📱 피그마 디자인 기준 사이즈 (iPhone 14/15)
const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;

/**
 * 📏 반응형 비율 계산 함수
 * 너비(wp)와 높이(hp)를 각각 계산하여 기기별 최적의 위치를 잡습니다.
 */
const wp = (size: number) => (size / DESIGN_WIDTH) * SCREEN_WIDTH;
const hp = (size: number) => (size / DESIGN_HEIGHT) * SCREEN_HEIGHT;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // 1. 상태바 영역 (iOS 노치 대응)
  statusBarSpace: {
    height: Platform.OS === 'ios' ? hp(44) : 0,
  },

  // 2. 로고 박스 (image 1)
  logoBox: {
    position: 'absolute',
    width: wp(244),
    height: hp(87),
    left: wp(75),
    top: hp(237),
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },

  // 3. 이메일 입력창 (Rectangle 444)
  inputEmail: {
    position: 'absolute',
    width: wp(320),
    height: hp(48),
    left: wp(27),
    top: hp(377),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#979797',
    borderRadius: 50,
    paddingHorizontal: wp(20),
    fontSize: wp(12),
    fontFamily: 'Inter',
    color: '#000',
  },

  // 4. 비밀번호 입력창 (Rectangle 443)
  inputPassword: {
    position: 'absolute',
    width: wp(320),
    height: hp(48),
    left: wp(27),
    top: hp(435),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#979797',
    borderRadius: 50,
    paddingHorizontal: wp(20),
    fontSize: wp(12),
    fontFamily: 'Inter',
    color: '#000',
  },

  // 5. 로그인 버튼 (Rectangle 442)
  loginButton: {
    position: 'absolute',
    width: wp(320),
    height: hp(48),
    left: wp(27),
    top: hp(506),
    backgroundColor: '#0068FF',
    borderWidth: 1,
    borderColor: '#979797',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: wp(13),
    fontWeight: '600',
    fontFamily: 'Inter',
  },

  // 6. 하단 메뉴 컨테이너 (Group 344)
  bottomMenuContainer: {
    position: 'absolute',
    width: wp(320), // 중앙 정렬을 위해 너비 확보
    height: hp(22),
    left: wp(36.5), // (393 - 320) / 2
    top: hp(664),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: wp(12),
    color: '#979797',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  verticalSeparator: {
    width: 1,
    height: hp(10),
    backgroundColor: '#979797',
    marginHorizontal: wp(15),
  },
});