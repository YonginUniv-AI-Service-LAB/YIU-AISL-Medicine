import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 반응형 수치 계산 (393x852 기준)
const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * SCREEN_HEIGHT;

export const styles = StyleSheet.create({
  /* 공통 오버레이 */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 13, 18, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* --- [단계 1] 안내 팝업 전용 스타일 --- */
  modalStep1: {
    width: wp(343),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(16),
    padding: wp(20),
    position: 'relative',
    // Shadow/xl
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  closeX: {
    alignSelf: 'flex-end',
  },
  xText: {
    fontSize: wp(18),
    color: '#717680',
  },
  step1Content: {
    marginTop: hp(40),
    alignItems: 'center',
  },
  guideButton: {
    width: wp(303),
    height: hp(44),
    backgroundColor: '#F9FAFB',
    borderRadius: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(12),
  },
  guideText: {
    fontSize: wp(16),
    color: '#475467',
    fontWeight: '500',
  },
  actionButton: {
    width: wp(303),
    height: hp(44),
    backgroundColor: '#0088FF',
    borderRadius: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: wp(16),
    color: '#FFFFFF',
    fontWeight: '600',
  },

  /* --- [단계 2] 시간표 팝업 전용 스타일 --- */
  modalContainer: {
    width: wp(343),
    maxHeight: hp(550),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(16),
    padding: wp(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(16),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    width: wp(20),
    height: wp(20),
    marginRight: wp(8),
    resizeMode: 'contain',
  },
  title: {
    fontSize: wp(16),
    fontWeight: '600',
    color: '#181D27',
  },
  closeButton: {
    padding: wp(4),
  },
  closeText: {
    fontSize: wp(18),
    color: '#717680',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F4F7',
    marginBottom: hp(16),
  },
  gridContainer: {
    borderWidth: 1,
    borderColor: '#F2F4F7',
    borderRadius: wp(8),
    overflow: 'hidden',
  },
  dayRow: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  timeColumnLabel: {
    width: wp(40),
  },
  dayCell: {
    flex: 1,
    height: hp(32),
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#F2F4F7',
  },
  dayText: {
    fontSize: wp(12),
    color: '#475467',
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  timeColumn: {
    width: wp(40),
    height: hp(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  timeText: {
    fontSize: wp(10),
    color: '#98A2B3',
  },
  gridCell: {
    flex: 1,
    height: hp(40),
    borderLeftWidth: 1,
    borderLeftColor: '#F2F4F7',
    padding: 2,
  },
  activeSlot: {
    flex: 1,
    backgroundColor: '#E0F2FE',
    borderRadius: wp(2),
  },
  confirmButton: {
    marginTop: hp(20),
    height: hp(44),
    backgroundColor: '#0088FF',
    borderRadius: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: wp(16),
    fontWeight: '600',
  },
});