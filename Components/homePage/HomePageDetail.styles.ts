////반응형 유틸리티(wp, hp)**와 **중앙 정렬 레이아웃(contentWrapper)**이 아주 잘 구현
import { StyleSheet, Dimensions } from 'react-native';

// 1. 반응형 기준 정의 (iPhone 14/15 393x852 기준)
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * SCREEN_HEIGHT;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // 헤더 영역 (SignUpPage 등과 높이/패딩 통일)
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
    resizeMode: 'contain' 
  },
  headerRight: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  userName: { 
    fontFamily: 'Inter', 
    fontWeight: '600', 
    fontSize: wp(17), 
    color: '#000000' 
  },
  dividerText: { 
    fontSize: wp(17), 
    color: '#000000', 
    marginHorizontal: wp(8) 
  },
  menuIcon: { 
    width: wp(24), 
    height: wp(24) 
  },

  // 스크롤 및 중앙 정렬 컨테이너 (다른 페이지와 일관성 유지)
  scrollContent: { 
    paddingBottom: hp(50) 
  },
  contentWrapper: { 
    paddingHorizontal: wp(20), // 프로젝트 공통 여백
    paddingTop: hp(20) 
  },

  titleSection: { 
    marginBottom: hp(30) 
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
    color: '#1E1E1E' 
  },
  
  // 차트 카드 섹션
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(24),
    paddingVertical: hp(24),
    // 그림자 스타일 통일
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
  },
  chartPercentText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: wp(15),
    lineHeight: hp(19),
    textAlign: 'center',
    color: '#1E1E1E',
  },

  // 범례(Legend) 섹션
  legendContainer: { 
    paddingHorizontal: wp(20), 
    marginTop: hp(20) 
  },
  legendItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    height: hp(44) 
  },
  dot: { 
    width: wp(8), 
    height: wp(8), 
    borderRadius: wp(4), 
    marginRight: wp(10) 
  },
  legendLabel: { 
    fontFamily: 'Inter', 
    fontSize: wp(13), 
    color: '#1E1E1E', 
    marginRight: wp(8) 
  },
  legendValue: { 
    fontFamily: 'Inter', 
    fontSize: wp(13), 
    color: '#979797' 
  },
  legendDetail: { 
    fontFamily: 'Inter', 
    fontSize: wp(13), 
    color: '#1E1E1E' 
  },
  bottomSpacer: { 
    height: hp(100) 
  },
});