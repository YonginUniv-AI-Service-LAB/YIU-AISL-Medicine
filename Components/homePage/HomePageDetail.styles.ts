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
    justifyContent: 'flex-end',
    width: wp(150),
  },
  userName: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: wp(17),
    color: '#000000',
    textAlign: 'right',
  },
  dividerText: {
    fontSize: wp(17),
    color: '#000000',
    width: wp(24),
    textAlign: 'center',
  },
  menuIcon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
  },
  scrollContent: {
    paddingBottom: hp(50),
  },
  contentWrapper: {
    paddingHorizontal: wp(20),
    paddingTop: hp(20),
  },
  titleSection: {
    marginBottom: hp(30),
  },
  mainTitle: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: wp(30),
    lineHeight: hp(38),
    color: '#000000',
    marginBottom: hp(8),
  },
  subTitle: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: wp(15),
    color: '#1E1E1E',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(24),
    paddingVertical: hp(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  chartLabel: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: wp(13),
    color: '#1E1E1E',
    marginBottom: hp(20),
    paddingHorizontal: wp(20),
  },
  chartCenterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(240),
    position: 'relative',
  },
  chartTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
    marginTop: hp(10), // 이 부분을 추가하여 텍스트를 아래로 내렸습니다.
  },
  chartPercentText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: wp(15),
    // lineHeight를 텍스트 크기보다 크게 잡으면
    // 텍스트 줄 사이의 간격이 벌어지면서 % 숫자가 아래로 내려갑니다.
    lineHeight: hp(26),
    textAlign: 'center',
    color: '#1E1E1E',
  },
  legendContainer: {
    paddingHorizontal: wp(20),
    marginTop: hp(20),
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp(44),
  },
  dot: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    marginRight: wp(10),
  },
  legendLabel: {
    fontFamily: 'Inter',
    fontSize: wp(13),
    color: '#1E1E1E',
    marginRight: wp(8),
  },
  legendValue: {
    fontFamily: 'Inter',
    fontSize: wp(13),
    color: '#979797',
  },
  legendDetail: {
    fontFamily: 'Inter',
    fontSize: wp(13),
    color: '#1E1E1E',
  },
  bottomSpacer: {
    height: hp(100),
  },
});
