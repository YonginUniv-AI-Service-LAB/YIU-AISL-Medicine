import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import styles from './MedicinePage.style';

interface CalendarPopupProps {
  isVisible: boolean;
  onClose: () => void;
  baseDate: Date;
  onDateSelect: (date: Date) => void;
}

const CalendarPopup: React.FC<CalendarPopupProps> = ({ isVisible, onClose, baseDate, onDateSelect }) => {
  const [viewDate, setViewDate] = useState(new Date(baseDate));
  
  // 💡 진짜 '오늘' 날짜 정보 가져오기
  const today = new Date();

  useEffect(() => {
    if (isVisible) {
      setViewDate(new Date(baseDate));
    }
  }, [isVisible, baseDate]);

  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const displayMonth = monthNames[viewDate.getMonth()];
  const displayYear = viewDate.getFullYear();

  const handlePrevMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(viewDate.getMonth() - 1);
    setViewDate(newDate); 
  };

  const handleNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(viewDate.getMonth() + 1);
    setViewDate(newDate);
  };

  const handleDayPress = (day: number) => {
    const selectedDate = new Date(viewDate);
    selectedDate.setDate(day);
    onDateSelect(selectedDate);
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.calendarPopup}>
              
              <View style={styles.popupHeader}>
                <TouchableOpacity onPress={handlePrevMonth}>
                  <Image source={require('../../assets/images/Medicine/left.png')} style={styles.popupArrow} />
                </TouchableOpacity>
                <Text style={styles.popupMonthText}>{`${displayYear}년 ${displayMonth}`}</Text>
                <TouchableOpacity onPress={handleNextMonth}>
                  <Image source={require('../../assets/images/Medicine/right.png')} style={styles.popupArrow} />
                </TouchableOpacity>
              </View>

              <View style={styles.popupDayRow}>
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <Text key={day} style={[
                    styles.popupDayLabel, 
                    day === '일' && { color: '#D32F2F' },
                    day === '토' && { color: '#409CFF' }
                  ]}>
                    {day}
                  </Text>
                ))}
              </View>

              <View style={styles.dateGrid}>
                {[...Array(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate())].map((_, i) => {
                  const dayNum = i + 1;
                  
                  // 1. 선택된 날짜인지 확인 (배경 파란색)
                  const isSelected = 
                    dayNum === baseDate.getDate() && 
                    viewDate.getMonth() === baseDate.getMonth() &&
                    viewDate.getFullYear() === baseDate.getFullYear();

                  // 2. 💡 진짜 오늘인지 확인 (글자 파란색)
                  const isToday = 
                    dayNum === today.getDate() &&
                    viewDate.getMonth() === today.getMonth() &&
                    viewDate.getFullYear() === today.getFullYear();
                  
                  return (
                    <TouchableOpacity 
                      key={dayNum} 
                      style={[
                        styles.popupDateItem, 
                        isSelected && styles.popupDateActive // 선택된 날 배경색
                      ]}
                      onPress={() => handleDayPress(dayNum)}
                    >
                      <Text style={[
                        styles.popupDateText,
                        isToday && { color: '#0088FF', fontWeight: '800' }, // 오늘 날짜 글자 강조
                        isSelected && styles.popupDateTextActive // 선택된 날 글자 흰색
                      ]}>
                        {dayNum}
                      </Text>
                      {/* 오늘임을 나타내는 작은 점을 추가하고 싶다면 여기에 View를 넣을 수 있습니다 */}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CalendarPopup;