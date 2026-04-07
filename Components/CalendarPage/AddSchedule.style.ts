import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ⭐ 기준 : iPhone 14 (393 x 852)
const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * SCREEN_HEIGHT;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* ===== 헤더 ===== */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(16),
    paddingTop: hp(30),
    paddingBottom: hp(15),
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  left: {
    alignItems: 'flex-start',
    paddingRight: wp(18),
  },

  center: {
    flex: 1,
    alignItems: 'flex-start',
  },

  right: {
    width: wp(80),
    alignItems: 'flex-end',
  },

  close: {
    fontSize: wp(20),
  },

  title: {
    fontSize: wp(16),
    fontWeight: '600',
    transform: [{ translateY: hp(-1) }],
  },

  doneBtn: {
    backgroundColor: '#2F80FF',
    paddingHorizontal: wp(14),
    paddingVertical: hp(6),
    borderRadius: wp(20),
  },

  doneText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp(13),
  },

  /* ===== 요일 ===== */
  dayRow: {
    flexDirection: 'row',
    paddingVertical: hp(10),
  },

  corner: { width: wp(50) },

  dayText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '500',
    color: '#555',
    fontSize: wp(13),
  },

  /* ===== 시간표 ===== */
  row: {
    flexDirection: 'row',
    height: hp(48),
  },

  time: {
    width: wp(50),
    textAlign: 'center',
    color: '#8A94A6',
    paddingTop: hp(5),
    fontSize: wp(11),
  },

  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    aspectRatio: 1, // ⭐ 핵심! 정사각형 유지
  },

  cellIcon: {
    width: wp(20), // ⭐ 반응형 적용
    height: wp(20),
    resizeMode: 'contain',
  },

  activeCell: {
    backgroundColor: '#19C2B3',
  },

  tableArea: {
    height: hp(320),
  },

  /* ===== 입력 폼 ===== */
  form: {
    paddingHorizontal: wp(20),
    marginTop: hp(20),
  },

  label: {
    marginTop: hp(18),
    marginBottom: hp(6),
    color: '#444',
    fontSize: wp(13),
  },

  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: hp(8),
    fontSize: wp(14),
  },

  /* ===== 드롭다운 ===== */
  dropdownBlock: {
    marginTop: hp(18),
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: hp(12),
    marginTop: hp(-7),
  },

  dropdownBtn: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    height: hp(34),
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },

  dropdownIcon: {
    width: wp(16),
    height: wp(16),
    resizeMode: 'contain',
    tintColor: '#666',
    transform: [{ translateY: hp(6) }],
  },

  dropdownText: {
    color: '#999',
    fontSize: wp(14),
  },
});
