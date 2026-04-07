import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import styles from './MedicinePage.style';

interface CalendarPopupProps {
  isVisible: boolean;
  onClose: () => void;
  baseDate: Date;
  onDateSelect: (date: Date) => void;
}

const CalendarPopup: React.FC<CalendarPopupProps> = ({
  isVisible,
  onClose,
  baseDate,
  onDateSelect,
}) => {
  const [viewDate, setViewDate] = useState(new Date(baseDate));

  const today = new Date();

  useEffect(() => {
    if (isVisible) {
      setViewDate(new Date(baseDate));
    }
  }, [isVisible, baseDate]);

  const monthNames = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

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

    // 부모(MedicinePage)로 날짜 전달
    onDateSelect(selectedDate);

    onClose();
  };

  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0,
  ).getDate();

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.calendarPopup}>
              <View style={styles.popupHeader}>
                <TouchableOpacity onPress={handlePrevMonth}>
                  <Image
                    source={require('../../assets/images/Medicine/left.png')}
                    style={styles.popupArrow}
                  />
                </TouchableOpacity>

                <Text style={styles.popupMonthText}>
                  {displayYear}년 {displayMonth}
                </Text>

                <TouchableOpacity onPress={handleNextMonth}>
                  <Image
                    source={require('../../assets/images/Medicine/right.png')}
                    style={styles.popupArrow}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.popupDayRow}>
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <Text
                    key={day}
                    style={[
                      styles.popupDayLabel,
                      day === '일' && { color: '#D32F2F' },
                      day === '토' && { color: '#409CFF' },
                    ]}
                  >
                    {day}
                  </Text>
                ))}
              </View>

              <View style={styles.dateGrid}>
                {[...Array(daysInMonth)].map((_, i) => {
                  const dayNum = i + 1;

                  const isSelected =
                    dayNum === baseDate.getDate() &&
                    viewDate.getMonth() === baseDate.getMonth() &&
                    viewDate.getFullYear() === baseDate.getFullYear();

                  const isToday =
                    dayNum === today.getDate() &&
                    viewDate.getMonth() === today.getMonth() &&
                    viewDate.getFullYear() === today.getFullYear();

                  return (
                    <TouchableOpacity
                      key={dayNum}
                      style={[
                        styles.popupDateItem,
                        isSelected && styles.popupDateActive,
                      ]}
                      onPress={() => handleDayPress(dayNum)}
                    >
                      <Text
                        style={[
                          styles.popupDateText,
                          isToday && { color: '#0088FF', fontWeight: '800' },
                          isSelected && styles.popupDateTextActive,
                        ]}
                      >
                        {dayNum}
                      </Text>
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
