import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 피그마 기준 해상도 (393x852) 대비 비율 계산 함수
const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * SCREEN_HEIGHT;

interface Props {
  data: {
    id: string;
    date: string;
    senderEmail: string;
    message: string;
  };
  showDelete?: boolean; // 내 페이지(Me)일 때만 true
  onDelete?: (id: string) => void;
}

export default function GuestBookCard({ data, showDelete, onDelete }: Props) {
  return (
    <View style={cardStyles.modalContainer}>
      {/* Header 영역: 날짜와 X 버튼 (피그마: width 311px, height 22px) */}
      <View style={cardStyles.headerRow}>
        <Text style={cardStyles.dateText}>{data.date}</Text>
        
        {showDelete && (
          <TouchableOpacity 
            onPress={() => onDelete?.(data.id)} 
            style={cardStyles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // 터치 영역 확장
          >
            <View style={cardStyles.xIcon}>
               {/* 피그마 x-close (24x24) */}
               <Text style={{ color: '#717680', fontSize: wp(20), fontWeight: '300' }}>✕</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* From 섹션 (피그마: Gap 6px) */}
      <View style={cardStyles.fieldSection}>
        <Text style={cardStyles.label}>From</Text>
        <View style={cardStyles.inputRow}>
          <View style={cardStyles.addOn}>
            <Text style={cardStyles.addOnText}>보낸 이</Text>
          </View>
          <View style={cardStyles.textInput}>
            <Text style={cardStyles.inputText} numberOfLines={1}>{data.senderEmail}</Text>
          </View>
        </View>
      </View>

      {/* 메시지 섹션 (피그마: Gap 6px) */}
      <View style={cardStyles.fieldSection}>
        <Text style={cardStyles.label}>메시지</Text>
        <View style={cardStyles.textarea}>
          <Text style={cardStyles.messageText}>{data.message}</Text>
        </View>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  modalContainer: {
    width: wp(343),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(16),
    paddingHorizontal: wp(16),
    paddingVertical: hp(20),
    marginBottom: hp(16),
    alignSelf: 'center', // 중앙 정렬 유지
    
    // 피그마 Shadow/xl 반영
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: hp(8) },
    shadowOpacity: 0.1,
    shadowRadius: wp(24),
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(16),
    height: hp(24),
  },
  dateText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: wp(17), // 17px 반응형
    lineHeight: hp(22),
    color: '#000000',
  },
  closeButton: {
    width: wp(24),
    height: wp(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  xIcon: {
    width: wp(24),
    height: wp(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldSection: {
    marginBottom: hp(16),
  },
  label: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: wp(14), // 14px 반응형
    lineHeight: hp(20),
    color: '#414651',
    marginBottom: hp(6), // Gap 6px
  },
  inputRow: {
    flexDirection: 'row',
    height: hp(44), // 높이 44px 반응형
    borderWidth: 1,
    borderColor: '#D5D7DA',
    borderRadius: wp(8),
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  addOn: {
    width: wp(75), // 너비 75px 반응형
    justifyContent: 'center',
    paddingHorizontal: wp(12),
    borderRightWidth: 1,
    borderRightColor: '#D5D7DA',
  },
  addOnText: {
    fontFamily: 'Inter',
    fontSize: wp(16),
    color: '#535862',
  },
  textInput: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: wp(14),
  },
  inputText: {
    fontFamily: 'Inter',
    fontSize: wp(16),
    color: '#181D27',
  },
  textarea: {
    minHeight: hp(126), // 피그마 수치 126px 반영
    borderWidth: 1,
    borderColor: '#D5D7DA',
    borderRadius: wp(8),
    padding: wp(14),
    backgroundColor: '#FFFFFF',
  },
  messageText: {
    fontFamily: 'Inter',
    fontSize: wp(16),
    color: '#717680',
    lineHeight: hp(24), // 행간 24px 반응형
  },
});
// 데이터 저장의 분리: 내가 친구에게 쓴 방명록은 친구의 페이지에 남는 것이므로, 다시 Me(내 페이지)로 돌아오면 보이지 않아야 합니다.

// 삭제 권한(X 표시):

// 내 페이지(Me): 다른 사람들이 내게 남긴 방명록 카드들이 보이며, 주인인 나는 이를 삭제할 수 있는 'X' 버튼이 카드에 있어야 합니다.

// 친구 페이지: 내가 친구에게 방명록을 쓸 때는 내가 쓴 글이라도 남의 집(친구 페이지)이므로 마음대로 삭제하는 'X' 버튼이 보이지 않습니다.