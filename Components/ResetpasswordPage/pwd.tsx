//반응형 유틸리티(wp, hp)**와 **중앙 정렬 레이아웃(contentWrapper)**이 아주 잘 구현
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// 393x852 피그마 기준 반응형 함수
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * SCREEN_HEIGHT;

type Props = NativeStackScreenProps<any, 'pwd'>;

export default function Pwd({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 영역 - 피그마 top 70px, 72px 기준 */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={wp(24)} color="#1E1E1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>비밀번호 재설정</Text>
      </View>

      {/* 중앙 정렬 컨텐츠 영역 */}
      <View style={styles.contentWrapper}>
        <Text style={styles.mainTitle}>비밀번호가 변경되었어요</Text>
        <Text style={styles.subTitle}>비밀번호가 성공적으로 변경되었습니다.</Text>

        {/* 버튼 영역 - 피그마 width 177px, top 438px 기준 */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => navigation.navigate('LoginPage')}
        >
          <Text style={styles.submitBtnText}>로그인하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: hp(100), // 헤더 높이 확보
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    left: wp(20),
    top: hp(70), // 피그마 top: 70px
  },
  headerTitle: {
    position: 'absolute',
    top: hp(72), // 피그마 top: 72px
    fontSize: wp(17),
    fontWeight: '600',
    color: '#1E1E1E',
    textAlign: 'center',
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    // 피그마에서 텍스트 시작점이 top 364px이므로 
    // 헤더(100px)를 제외한 여백을 padding으로 조절
    paddingTop: hp(264), 
  },
  mainTitle: {
    fontSize: wp(19), // 피그마 font-size: 19px
    fontWeight: '600',
    color: '#1E1E1E',
    lineHeight: 22,
    marginBottom: hp(10),
  },
  subTitle: {
    fontSize: wp(14), // 피그마 font-size: 14px
    fontWeight: '500',
    color: '#979797',
    lineHeight: 22,
    marginBottom: hp(20),
  },
  submitBtn: {
    width: wp(177), // 피그마 width: 177px
    height: hp(50),  // 피그마 height: 50px
    backgroundColor: '#0068FF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(22), // 396px(subTitle)와 438px(button) 사이 간격 반영
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: wp(14), // 피그마 font-size: 14px
    fontWeight: '600',
    textAlign: 'center',
  },
});