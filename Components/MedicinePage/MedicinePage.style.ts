import { StyleSheet, Dimensions, Platform } from 'react-native';
// ✅ 기존 가이드대로 React 18 환경 및 상위 폴더 스타일 참조
import { styles as commonStyles } from '../homePage/HomePageDetail.styles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 가로 비율(Width Percentage) 및 세로 비율(Height Percentage) 계산 함수
const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * SCREEN_HEIGHT;

export default StyleSheet.create({
  ...commonStyles, // 공통 스타일 상속

  titleRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: hp(30) 
  },

  pageTitle: { 
    fontSize: wp(30), 
    fontWeight: '500', 
    color: '#000' 
  },

  calendarIcon: { 
    width: wp(24), 
    height: wp(24), 
    resizeMode: 'contain' 
  },

  /* --- 캘린더 섹션 --- */
  calendarSection: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    justifyContent: 'space-between', 
    marginBottom: hp(30) 
  },

  calendarContainer: { 
    flexDirection: 'row', 
    flex: 1, 
    justifyContent: 'space-between', 
    paddingHorizontal: wp(5) 
  },

  dayColumn: { 
    alignItems: 'center', 
    width: wp(40) 
  },

  dayLabel: { 
    fontSize: wp(14), 
    marginBottom: hp(12),
    color: '#767676' 
  },

  dateCircle: { 
    width: wp(36), 
    height: wp(36), 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  activeCircle: { 
    backgroundColor: '#97C1FF', 
    borderRadius: wp(18) 
  },

  dateText: { 
    fontSize: wp(14), 
    fontWeight: '500' 
  },

  arrowIcon: { 
    width: wp(24), 
    height: wp(24), 
    resizeMode: 'contain',
    marginTop: hp(42), 
  },

  /* --- 추가 버튼 및 리스트 --- */
  addButton: { 
    width: '100%', 
    height: hp(42), 
    backgroundColor: '#0068FF', 
    borderRadius: wp(93), 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: hp(40) 
  },

  addButtonText: { 
    color: '#FFF', 
    fontSize: wp(13), 
    fontWeight: '600' 
  },

  sectionTitleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: hp(16) 
  },

  sectionTitle: { 
    fontSize: wp(18), 
    fontWeight: '700', 
    color: '#1E1E1E', 
    marginRight: wp(8) 
  },

  pillCount: { 
    fontSize: wp(14), 
    color: '#409CFF', 
    fontWeight: '600' 
  },

  pillCard: { 
    width: '100%', 
    height: hp(88), 
    backgroundColor: '#F8F9FA', 
    borderRadius: wp(16), 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: wp(20), 
    marginBottom: hp(12) 
  },

  pillInfo: { 
    gap: hp(4) 
  },

  pillTime: { 
    fontSize: wp(12), 
    color: '#767676' 
  },

  pillName: { 
    fontSize: wp(16), 
    fontWeight: '600', 
    color: '#1E1E1E' 
  },

  checkIcon: { 
    width: wp(32), 
    height: wp(32), 
    resizeMode: 'contain' 
  },

  /* --- 캘린더 팝업 (Figma 전용 스타일 추가) --- */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  calendarPopup: {
    width: wp(306),
    height: hp(310),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(8),
    padding: wp(24),
    // Dropdown Shadow (피그마 2px 16px 19px rgba(0,0,0,0.09))
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 16 },
        shadowOpacity: 0.09,
        shadowRadius: 19,
      },
      android: {
        elevation: 10,
      },
    }),
  },

  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: hp(22),
  },

  popupMonthText: {
    fontSize: wp(14),
    fontWeight: '600',
    color: '#4A5660',
    textAlign: 'center',
  },

  popupArrow: {
    width: wp(16),
    height: wp(16),
    tintColor: '#B5BEC6',
  },

  popupDayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: hp(8),
  },

  popupDayLabel: {
    width: wp(30),
    textAlign: 'center',
    fontSize: wp(10),
    fontWeight: '600',
    color: '#B5BEC6',
    letterSpacing: 1.5,
  },

  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(8),
  },

  popupDateItem: {
    width: wp(30),
    height: wp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },

  popupDateActive: {
    backgroundColor: '#0088FF',
    borderRadius: wp(29),
  },

  popupDateText: {
    fontSize: wp(16),
    fontWeight: '600',
    color: '#4A5660',
  },

  popupDateTextActive: {
    color: '#FFFFFF',
  },
});