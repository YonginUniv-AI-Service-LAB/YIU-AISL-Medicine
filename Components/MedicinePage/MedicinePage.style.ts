import { StyleSheet, Dimensions, Platform } from 'react-native';
import { styles as commonStyles } from '../homePage/HomePageDetail.styles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * SCREEN_HEIGHT;

export default StyleSheet.create({
  /* ===================================================
     공통 스타일 상속
  =================================================== */
  ...commonStyles,

  /* ===================================================
     ⭐ MedicinePage 전용 헤더 (홈과 완전 분리)
     여기 값만 조절하면 약관리 페이지만 움직임
  =================================================== */

  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingTop: hp(4), // 🔥 헤더 위아래 위치 조절
    paddingBottom: hp(6),
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },

  menuIcon: {
    width: wp(25),
    height: wp(25),
    resizeMode: 'contain',

    marginLeft: wp(-5),
    marginTop: hp(-1),
  },
  /* ===================================================
     제목 영역
  =================================================== */

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(10),
    marginBottom: hp(20),
  },

  pageTitle: {
    fontSize: wp(28),
    fontWeight: '500',
    color: '#000',
    transform: [{ translateY: hp(1) }], // "약 관리" 글씨 위치 조절
  },

  calendarIcon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
  },

  /* ===================================================
     주간 캘린더
  =================================================== */

  calendarSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: hp(30),
  },

  calendarContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
  },

  dayColumn: {
    alignItems: 'center',
    width: wp(40),
  },

  dayLabel: {
    fontSize: wp(14),
    marginBottom: hp(12),
    color: '#767676',
  },

  dateCircle: {
    width: wp(36),
    height: wp(36),
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeCircle: {
    backgroundColor: '#97C1FF',
    borderRadius: wp(18),
  },

  dateText: {
    fontSize: wp(14),
    fontWeight: '500',
  },

  arrowIcon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
    marginTop: hp(32), // ← 화살표 높이 조절
  },

  /* ===================================================
     복용 예정 카드
  =================================================== */

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(16),
  },

  sectionTitle: {
    fontSize: wp(18),
    fontWeight: '700',
    color: '#1E1E1E',
    marginRight: wp(8),
  },

  pillCount: {
    fontSize: wp(14),
    color: '#409CFF',
    fontWeight: '600',
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
    marginBottom: hp(12),
  },

  pillInfo: {
    gap: hp(4),
  },

  pillTime: {
    fontSize: wp(12),
    color: '#767676',
  },

  pillName: {
    fontSize: wp(16),
    fontWeight: '600',
    color: '#1E1E1E',
  },

  checkIcon: {
    width: wp(32),
    height: wp(32),
    resizeMode: 'contain',
  },

  /* ===================================================
     추가 버튼 (스크롤 하단 여백 포함)
  =================================================== */

  addButton: {
    width: '100%',
    height: hp(42),
    backgroundColor: '#0068FF',
    borderRadius: wp(93),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(10),
    marginBottom: hp(120), // 🔥 하단 잘림 방지 여백
  },

  addButtonText: {
    color: '#FFF',
    fontSize: wp(13),
    fontWeight: '600',
  },

  /* ===================================================
     캘린더 팝업
  =================================================== */

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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: wp(2), height: hp(16) },
        shadowOpacity: 0.09,
        shadowRadius: wp(19),
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
    letterSpacing: wp(1.5),
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

  /* ===== 새 카드 UI ===== */

  scheduleCard: {
    width: '100%',
    borderRadius: wp(14),
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: '#F8F9FA',
    marginBottom: hp(16),
    overflow: 'hidden',

    position: 'relative', // ⭐ 중요
  },

  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(14),
    paddingVertical: hp(10),
    backgroundColor: '#F1F3F5',
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },

  scheduleTime: {
    fontSize: wp(22),
    fontWeight: '700',
    color: '#1E1E1E',
  },

  scheduleAmPm: {
    fontSize: wp(12),
    marginLeft: wp(6),
    color: '#3b3b3b',
    marginTop: wp(6),
  },

  scheduleState: {
    fontSize: wp(12),
    marginLeft: wp(6),
    color: '#B0B0B0',
  },

  takeBtn: {
    fontSize: wp(13),
    color: '#0068FF',
    fontWeight: '600',
  },

  scheduleBody: {
    padding: wp(14),
  },

  medicineTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(8),
  },

  medicineTitle: {
    fontSize: wp(16),
    fontWeight: '700',
    color: '#1E1E1E',
  },

  menuIconSmall: {
    width: wp(20),
    height: wp(20),
    tintColor: '#767676',
  },

  scheduleText: {
    fontSize: wp(12),
    color: '#767676',
    marginBottom: hp(4),
  },

  statusOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusModal: {
    width: wp(300),
    backgroundColor: '#fff',
    borderRadius: wp(16),
    padding: wp(20),
    alignItems: 'center',
  },

  statusTitle: {
    fontSize: wp(16),
    fontWeight: '600',
    marginBottom: hp(20),
  },

  statusRow: {
    flexDirection: 'row',
    gap: wp(10),
    marginBottom: hp(20),
  },

  statusBtn: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(8),
    borderRadius: wp(20),
    backgroundColor: '#eee',
  },

  statusBtnActiveBlue: { backgroundColor: '#c6f0c5' },
  statusBtnActiveGray: { backgroundColor: '#b9ecf4' },
  statusBtnActivePink: { backgroundColor: '#FFD6E5' },

  statusText: {
    fontSize: wp(12),
    fontWeight: '600',
  },

  statusHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  statusIcon: {
    width: wp(32),
    height: wp(32),
  },

  statusClose: {
    width: wp(20),
    height: wp(20),
  },

  confirmBtn: {
    width: '100%',
    backgroundColor: '#1E88E5',
    paddingVertical: hp(12),
    borderRadius: wp(10),
    alignItems: 'center',
    marginBottom: hp(10),
  },

  cancelText: {
    color: '#888',
    fontSize: wp(14),
    marginTop: wp(7),
  },

  cardMenu: {
    position: 'absolute',
    right: wp(12),
    top: hp(38),

    width: wp(90),
    backgroundColor: '#F5F5F5',
    borderRadius: wp(10),
    paddingVertical: hp(6),

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(2) },
    elevation: 10,
  },

  cardMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(10),
    paddingHorizontal: wp(14),
  },

  cardMenuIcon: {
    width: wp(18),
    height: wp(18),
    marginRight: wp(10),
    resizeMode: 'contain',
    tintColor: '#888',
  },

  cardMenuText: {
    fontSize: wp(14),
    color: '#333',
    fontWeight: '500',
  },

  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmBox: {
    width: wp(300),
    backgroundColor: '#fff',
    borderRadius: wp(20),
    padding: wp(20),
    alignItems: 'center',
  },

  confirmTitle: {
    fontSize: wp(16),
    fontWeight: '600',
    marginBottom: hp(40),
    textAlign: 'center',
  },

  confirmMainBtn: {
    width: '100%',
    backgroundColor: '#FF3B30',
    paddingVertical: hp(12),
    borderRadius: wp(10),
    alignItems: 'center',
    marginBottom: hp(10),
  },

  confirmMainText: {
    color: '#fff',
    fontWeight: '600',
  },

  confirmCancelBtn: {
    width: '100%',
    paddingVertical: hp(12),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },

  confirmCancelText: {
    color: '#555',
    fontWeight: '500',
  },

  confirmHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  confirmIcon: {
    width: wp(36),
    height: wp(36),
  },

  confirmClose: {
    width: wp(20),
    height: wp(20),
  },
});
