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

  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(20),
    marginTop: hp(30),
  },

  guestText: {
    fontSize: wp(17),
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#D9D9D9',
  },

  guestIcon: {
    width: wp(20),
    height: wp(18),
    resizeMode: 'contain',
  },
  divider: {
  fontFamily: 'Inter',
  fontWeight: '600',
  fontSize: wp(17),
  lineHeight: hp(22),
  color: '#000000',
  marginHorizontal: wp(4), // 양쪽 간격
},

});
