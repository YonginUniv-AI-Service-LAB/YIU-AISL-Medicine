import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 반응형 수치 계산 함수
const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * SCREEN_HEIGHT;

export const styles = StyleSheet.create({
  /* ... (overlay, modalContainer, closeButton, iconBox 등 앞부분은 동일) ... */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp(353),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(16),
    padding: wp(20),
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(10) },
    shadowOpacity: 0.1,
    shadowRadius: wp(20),
  },
  closeButton: {
    position: 'absolute',
    right: wp(16),
    top: hp(16),
  },
  iconBox: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: '#E9EAEB',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: hp(10),
    marginBottom: hp(20),
  },

  /* 🔹 에러 발생했던 제목 스타일 수정 */
  title: {
    fontSize: wp(18),
    fontWeight: '700',
    textAlign: 'left', // 👈 'flex-start'를 'left'로 수정했습니다!
    alignSelf: 'flex-start',
    marginBottom: hp(20),
    color: '#1E1E1E',
  },

  /* 🔹 리스트 관련 스타일 (정상 유지) */
  friendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: hp(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  avatarLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textGroup: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  friendName: {
    fontSize: wp(14),
    fontWeight: '600',
    color: '#414651',
  },
  friendEmail: {
    fontSize: wp(14),
    fontWeight: '400',
    color: '#535862',
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: wp(14),
    fontWeight: '600',
    color: '#B42318',
    marginLeft: wp(8),
  },

  /* 🔹 기존 입력 영역 스타일 (유지) */
  inputContainer: {
    marginTop: hp(10),
    marginBottom: hp(20),
  },
  label: {
    fontSize: wp(14),
    fontWeight: '500',
    marginBottom: hp(8),
    color: '#414651',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(44),
    borderWidth: 1,
    borderColor: '#D5D7DA',
    borderRadius: wp(8),
    paddingHorizontal: wp(14),
    backgroundColor: '#FFFFFF',
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    width: wp(20),
    height: wp(20),
    marginRight: wp(8),
  },
  input: {
    flex: 1,
    fontSize: wp(16),
    color: '#000000',
  },
  addButton: {
    height: hp(48),
    backgroundColor: '#1C7ED6',
    borderRadius: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(10),
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: wp(16),
  },
});