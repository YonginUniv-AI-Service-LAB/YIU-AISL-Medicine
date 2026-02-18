import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;

const wp = (size: number) => (size / DESIGN_WIDTH) * SCREEN_WIDTH;
const hp = (size: number) => (size / DESIGN_HEIGHT) * SCREEN_HEIGHT;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  statusBarSpace: {
    height: Platform.OS === 'ios' ? hp(44) : 0,
  },

  // 2. 로고 박스 (중앙 정렬로 수정)
  logoBox: {
    position: 'absolute',
    width: wp(244),
    height: hp(87),
    alignSelf: 'center', // 👈 left 대신 alignSelf 사용으로 완벽한 중앙 정렬
    top: hp(237),
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },

  // 3. 이메일 입력창 (중앙 정렬로 수정)
  inputEmail: {
    position: 'absolute',
    width: wp(320),
    height: hp(48),
    alignSelf: 'center', // 👈 중앙 정렬
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

  // 4. 비밀번호 입력창 (중앙 정렬로 수정)
  inputPassword: {
    position: 'absolute',
    width: wp(320),
    height: hp(48),
    alignSelf: 'center', // 👈 중앙 정렬
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

  // 5. 로그인 버튼 (중앙 정렬로 수정)
  loginButton: {
    position: 'absolute',
    width: wp(320),
    height: hp(48),
    alignSelf: 'center', // 👈 중앙 정렬
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

  // 6. 하단 메뉴 컨테이너
  bottomMenuContainer: {
    position: 'absolute',
    width: wp(320),
    height: hp(22),
    alignSelf: 'center', // 👈 일관성 있게 alignSelf로 변경
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