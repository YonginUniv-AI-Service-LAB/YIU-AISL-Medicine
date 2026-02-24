import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import styles from './AddSchedule.style';
import { DAYS, HOURS } from './calendarData';

const numbers = Array.from({ length: 12 }, (_, i) => i + 1);
const doseCountNumbers = [1, 2, 3];
const hours24 = Array.from({ length: 24 }, (_, i) => i + 1);

const weekDays = [
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
  '일요일',
];

/* 라디오 */
const Radio = ({ active }: { active: boolean }) => (
  <Image
    source={
      active
        ? require('../../assets/images/calendar/off.png')
        : require('../../assets/images/calendar/on.png')
    }
    style={{ width: 10, height: 10, marginRight: 6 }}
  />
);

/* 박스 */
const OptionBox = ({ title, children }: any) => (
  <View
    style={{
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 12,
      padding: 14,
      marginBottom: 14,
    }}
  >
    <Text style={{ fontWeight: '600', marginBottom: 10 }}>{title}</Text>
    {children}
  </View>
);

const MedicineDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { width } = useWindowDimensions();

  const data = route.params?.medicine;
  const [modalVisible, setModalVisible] = useState(false);

  const timeWidth = 40;
  const cellSize = (width - timeWidth) / 7;

  const periodNum = Number(data.period);
  const remainNum = Number(data.remain);

  /* 데이터 없을 때 */
  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={{ padding: 20 }}>데이터가 없습니다</Text>
      </View>
    );
  }

  /* 캘린더 표시 */
  const selectedCells: string[] = [];

  data.days?.forEach((day: string) => {
    const dayIndex = DAYS.findIndex((d) => d === day);

    data.times?.forEach((time: string) => {
      const hour = parseInt(time.split(':')[0], 10);
      const hourIndex = (hour - 7 + 24) % 24;

      selectedCells.push(`${dayIndex}-${hourIndex}`);
    });
  });

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/images/x-close.png')}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>

        <Text style={[styles.title, { marginLeft: 10 }]}>약 상세 정보</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* 시간표 */}
      <View style={styles.tableArea}>
        <ScrollView>
          <View style={styles.dayRow}>
            <View style={{ width: timeWidth }} />
            {DAYS.map((d) => (
              <Text key={d} style={[styles.dayText, { width: cellSize }]}>
                {d}
              </Text>
            ))}
          </View>

          {HOURS.map((hour, hourIndex) => (
            <View key={hourIndex} style={styles.row}>
              <Text style={[styles.time, { width: timeWidth }]}>{hour}</Text>

              {DAYS.map((day, dayIndex) => {
                const key = `${dayIndex}-${hourIndex}`;
                const isSelected = selectedCells.includes(key);

                return (
                  <View
                    key={key}
                    style={[
                      styles.cell,
                      { width: cellSize, height: cellSize },
                      isSelected && styles.activeCell,
                    ]}
                  >
                    {isSelected && (
                      <Image
                        source={require('../../assets/images/calendar/medicine_on.png')}
                        style={{
                          width: cellSize * 0.4,
                          height: cellSize * 0.4,
                        }}
                        resizeMode="contain"
                      />
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 정보 */}
      <View style={styles.form}>
        <Text style={styles.label}>약 이름:</Text>
        <Text style={styles.input}>{data.name}</Text>

        <Text style={styles.label}>카테고리:</Text>
        <Text style={styles.input}>{data.category}</Text>

        <TouchableOpacity
          style={styles.labelRow}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.label}>복용</Text>
          <Image
            source={require('../../assets/images/calendar/under.png')}
            style={styles.dropdownIcon}
          />
        </TouchableOpacity>

        <Text style={styles.label}>주의 사항:</Text>
        <Text style={styles.input}>{data.memo}</Text>
      </View>

      {/* 모달 */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={{
              marginTop: 'auto',
              maxHeight: '87%',
              backgroundColor: '#fff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingTop: 20,
              paddingHorizontal: 20,
              paddingBottom: insets.bottom + 20, // ⭐ 핵심
            }}
          >
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {/* 복용 횟수 */}
              <OptionBox title="하루 복용 횟수">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {doseCountNumbers.map((n) => (
                    <View
                      key={n}
                      style={{
                        width: '16.66%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Radio active={data.count === n} />
                      <Text>{n}</Text>
                    </View>
                  ))}
                </View>

                {/* ⭐ 직접 입력 값 표시 */}
                {data.count && !doseCountNumbers.includes(data.count) && (
                  <Text style={{ marginTop: 10, color: '#6B7280' }}>
                    직접 입력: 하루 {data.count}회
                  </Text>
                )}
              </OptionBox>

              {/* 복용 시간 */}
              <OptionBox title="복용 시간">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {hours24.map((n) => (
                    <View
                      key={n}
                      style={{
                        width: '12.5%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Radio
                        active={data.times?.some(
                          (t: string) => parseInt(t) === n,
                        )}
                      />
                      <Text>{n}</Text>
                    </View>
                  ))}
                </View>
              </OptionBox>

              {/* 복용 간격 */}
              <OptionBox title="복용 간격">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {weekDays.map((d) => (
                    <View
                      key={d}
                      style={{
                        width: '25%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Radio active={data.days?.includes(d[0])} />
                      <Text>{d}</Text>
                    </View>
                  ))}
                </View>
              </OptionBox>

              {/* 복용 기간 */}
              <OptionBox title="복용 기간">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {numbers.map((n) => (
                    <View
                      key={n}
                      style={{
                        width: '16.66%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Radio active={Number(data.period) === n} />
                      <Text>{n}</Text>
                    </View>
                  ))}
                </View>

                {/* ⭐ 여기 중요 */}
                {data.period && (
                  <Text style={{ marginTop: 10, color: '#6B7280' }}>
                    직접 입력: {Number(data.period)}일
                  </Text>
                )}
              </OptionBox>

              {/* 남은 횟수 */}
              <OptionBox title="남은 복용 횟수">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {numbers.map((n) => (
                    <View
                      key={n}
                      style={{
                        width: '16.66%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Radio active={Number(data.remain) === n} />
                      <Text>{n}</Text>
                    </View>
                  ))}
                </View>

                {/* ⭐ 여기 중요 */}
                {data.remain && (
                  <Text style={{ marginTop: 10, color: '#6B7280' }}>
                    직접 입력: {Number(data.remain)}회
                  </Text>
                )}
              </OptionBox>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: '#2F80FF',
                  padding: 14,
                  borderRadius: 30,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>확인</Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default MedicineDetailScreen;
