import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * SCREEN_HEIGHT;

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 13, 18, 0.1)', // Shadow/xl 배경 느낌
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
  },
  
  /* 단계 1 전용 컨테이너 */
  modalStep1: {
    width: wp(343),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(16),
    padding: wp(20),
    position: 'relative',
  },
  step1Content: {
    marginTop: hp(40),
    alignItems: 'center',
  },

  /* 단계 2 전용 컨테이너 (가이드 수치 반영) */
  modalStep2: {
    width: wp(343),
    height: hp(450),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(16),
    // Shadow/xl
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: hp(20) },
    shadowOpacity: 0.1,
    shadowRadius: wp(24),
    elevation: 10,
  },

  modalHeader: {
    width: wp(343),
    height: hp(88), // 가이드 Header 높이
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: wp(16),
    borderTopRightRadius: wp(16),
  },

  closeXAbsolute: {
    position: 'absolute',
    width: wp(44),
    height: wp(44),
    right: wp(12),
    top: hp(12),
    justifyContent: 'center',
    alignItems: 'center',
  },

  xIcon: {
    width: wp(24),
    height: wp(24),
    tintColor: '#717680',
  },

  closeX: {
    position: 'absolute',
    right: wp(16),
    top: hp(16),
  },

  xText: {
    fontSize: wp(24),
    color: '#999',
  },

  formContainer: {
    paddingHorizontal: wp(16),
    width: '100%',
  },

  dateRow: {
    width: wp(311),
    height: hp(22),
    alignItems: 'flex-start', // 👈 'center'에서 'flex-start'로 변경 (왼쪽 정렬
    marginBottom: hp(16),
  },

  dateText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: wp(17),
    color: '#000000',
  },

  inputField: {
    width: wp(311),
    height: hp(70),
    marginBottom: hp(16),
    gap: hp(6),
  },

  label: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: wp(14),
    color: '#414651',
  },

  inputWrapper: {
    flexDirection: 'row',
    width: wp(311),
    height: hp(44),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5D7DA',
    borderRadius: wp(8),
  },

  addOn: {
    width: wp(71),
    height: hp(44),
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#D5D7DA',
  },

  addOnText: {
    fontFamily: 'Inter',
    fontSize: wp(16),
    color: '#535862',
  },

  textInputBox: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: wp(14),
  },

  targetName: {
    fontFamily: 'Inter',
    fontSize: wp(16),
    color: '#181D27',
  },

  textareaField: {
    width: wp(311),
    height: hp(152),
    marginBottom: hp(16),
    gap: hp(6),
  },

  textareaInput: {
    width: wp(311),
    height: hp(126),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5D7DA',
    borderRadius: wp(8),
    padding: wp(14),
  },

  mainInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: wp(16),
    color: '#181D27',
  },

  submitButton: {
    width: wp(311),
    height: hp(44),
    backgroundColor: '#0088FF',
    borderWidth: 1,
    borderColor: '#0088FF',
    borderRadius: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  submitButtonText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: wp(16),
    color: '#FFFFFF',
  },

  /* 단계 1 스타일 보조 */
  writeButton: {
    width: '100%',
    height: hp(50),
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(12),
  },
  writeText: {
    fontSize: wp(17),
    fontWeight: '700',
    color: '#000',
  },
  closeButton: {
    width: '100%',
    height: hp(50),
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: wp(17),
    fontWeight: '700',
    color: '#000',
  },
});