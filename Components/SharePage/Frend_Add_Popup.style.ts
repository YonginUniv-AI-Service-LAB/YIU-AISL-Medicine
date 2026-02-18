import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * SCREEN_HEIGHT;

export const styles = StyleSheet.create({
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
    position: 'relative',
  },

  closeButton: {
    position: 'absolute',
    right: wp(16),
    top: hp(16),
    zIndex: 10,
  },

  /* 입력 화면 전용 */
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

  title: {
    fontSize: wp(20),
    fontWeight: '700',
    textAlign: 'left',
    marginBottom: hp(24),
    color: '#1E1E1E',
  },

  inputContainer: {
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

  /* 성공 화면 전용 (Figma 가이드 수치 반영) */
  successContainer: {
    alignItems: 'center',
    width: '100%',
    paddingTop: hp(20),
  },

  successContent: {
    width: wp(288),
    height: hp(64),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(24),
  },

  successMessage: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: wp(17), 
    lineHeight: wp(22),
    textAlign: 'center',
    color: '#000000',
  },

  modalActions: {
    width: '100%',
    marginTop: hp(8),
  },

  confirmButton: {
    width: '100%',
    height: hp(44),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5D7DA', 
    borderRadius: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  confirmButtonText: {
    fontFamily: 'Inter',
    fontSize: wp(16), 
    fontWeight: '600',
    color: '#414651', 
  },
});