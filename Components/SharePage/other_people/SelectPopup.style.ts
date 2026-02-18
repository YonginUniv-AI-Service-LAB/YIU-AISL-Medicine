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
    width: wp(343), // Figma 가이드 너비
    backgroundColor: '#FFFFFF',
    borderRadius: wp(16),
    paddingTop: hp(24),
    paddingBottom: hp(16),
    paddingHorizontal: wp(16),
    alignItems: 'center',
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    right: wp(16),
    top: hp(16),
    zIndex: 10,
  },
  closeIconText: {
    fontSize: wp(20),
    color: '#717680',
  },
  iconBox: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: '#E9EAEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(16),
  },
  /* 메시지 영역 */
  successContent: {
    width: '100%',
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
  /* 버튼 영역 */
  modalActions: {
    width: '100%',
    gap: hp(12), // 버튼 사이 간격
  },
  // 수락 버튼 (Figma: #0088FF)
  acceptButton: {
    width: '100%',
    height: hp(44),
    backgroundColor: '#0088FF',
    borderRadius: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  acceptButtonText: {
    fontFamily: 'Inter',
    fontSize: wp(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // 거절/확인 버튼 (Figma: White BG, Gray Border)
  confirmButton: {
    width: '100%',
    height: hp(44),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5D7DA',
    borderRadius: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontFamily: 'Inter',
    fontSize: wp(16),
    fontWeight: '600',
    color: '#414651',
  },
  successContainer: {
    width: '100%',
    alignItems: 'center',
  }
});