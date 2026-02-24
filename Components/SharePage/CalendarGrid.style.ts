import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * SCREEN_HEIGHT;

export const styles = StyleSheet.create({
  container: {
    paddingTop: 3,
  },

  /* 요일 헤더 */
  dayRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E5E9',
    paddingVertical: hp(6),
  },

  dayCorner: {
    width: wp(45),
    backgroundColor: '#FFFFFF',
  },

  dayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: wp(12),
    fontWeight: '600',
    color: '#444',
  },

  /* 시간표 */
  row: {
    flexDirection: 'row',
    height: hp(40),
  },

  timeText: {
    width: wp(45),
    textAlign: 'center',
    fontSize: wp(10),
    color: '#5b5f67',
    paddingTop: hp(4),
  },

  cell: {
    flex: 1,
    borderWidth: 0.3,
    borderColor: '#E2E5E9',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cellIcon: {
    width: wp(16),
    height: wp(16),
    resizeMode: 'contain',
  },

  /* 주말 */
  weekendCell: {
    backgroundColor: '#F1F3F5',
  },

  /* 선택된 칸 */
  activeCell: {
    backgroundColor: '#19C2B3',
    borderRadius: 2,
  },
});
