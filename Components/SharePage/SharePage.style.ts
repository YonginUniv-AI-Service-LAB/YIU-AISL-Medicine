import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * SCREEN_HEIGHT;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    height: hp(64),
    marginTop: hp(10),
  },

  headerLogo: {
    width: wp(100),
    height: hp(36),
    resizeMode: 'contain',
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  userName: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: wp(17),
    color: '#000000',
    marginRight: wp(0),
  },

  /* ✅ ME 박스 */
  meBox: {
    width: wp(72),
    height: hp(30),
    backgroundColor: '#D9D9D9',
    borderRadius: wp(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(6),
  },

  meText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: wp(17),
    color: '#000000',
    marginRight: wp(4),
  },

  meIcon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
  },

  /* 검색창 */
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: wp(20),
    marginTop: hp(20),
    height: hp(40),
    borderRadius: wp(8),
    paddingHorizontal: wp(12),
  },

  searchIcon: {
    width: wp(18),
    height: wp(18),
    resizeMode: 'contain',
    marginRight: wp(8),
  },

  searchPlaceholder: {
    fontSize: wp(15),
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#C0ADAD',
  },

  /* ✅ 방명록 섹션 레이아웃 */
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(20),
    marginTop: hp(30),
  },

  guestText: {
    fontSize: wp(17),
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#D9D9D9',
    marginRight: wp(4), // 👈 12에서 4로 줄여서 아이콘이 더 가까이 붙게 함
  },

  editIconWrapper: {
    padding: wp(4),
    marginLeft: wp(-2), // 👈 살짝 음수 마진을 주어 왼쪽으로 더 당김 (필요시 조절)
  },

  editIcon: {
    width: wp(22),
    height: wp(22),
    resizeMode: 'contain',
  },

  /* ✅ 캘린더 아이콘 위치 조정 */
  calendarIconWrapper: {
    padding: wp(4),
    // 👈 아이콘을 왼쪽으로 당겼으므로, 캘린더와의 사이 간격을 확보하기 위해 marginLeft 조정
    // 기존 wp(200)에서 디자인에 맞춰 약 160~180 정도로 유동적으로 조절하세요.
    marginLeft: wp(210), 
    justifyContent: 'center',
    alignItems: 'center',
  },

  calendarIcon: {
    width: wp(18),
    height: wp(20),
    resizeMode: 'contain',
  },

  friendListIconWrapper: {
    marginLeft: 'auto', 
    padding: wp(4),
  },

  friendListIcon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
  },

  divider: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: wp(17),
    lineHeight: hp(22),
    color: '#000000',
    marginHorizontal: wp(4),
  },
});