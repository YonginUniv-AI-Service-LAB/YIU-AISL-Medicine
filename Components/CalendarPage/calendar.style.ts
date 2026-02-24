import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const wp = (size: number) => (size / 393) * SCREEN_WIDTH;
const hp = (size: number) => (size / 852) * SCREEN_HEIGHT;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: hp(81),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    marginBottom: hp(20),
  },

  logo: {
    width: wp(100),
    height: hp(40),
    resizeMode: 'contain',
  },

  addBtn: {
    paddingHorizontal: wp(12),
    marginTop: hp(-6),
  },

  plus: {
    fontSize: wp(28),
    fontWeight: '300',
    color: '#111',
  },

  /* 요일 헤더 */
  dayRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E5E9',
    paddingVertical: hp(10),
  },

  timeHeader: {
    width: wp(55),
    backgroundColor: '#EEF1F4',
  },

  dayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: wp(14),
    fontWeight: '600',
    color: '#444',
  },

  dayCorner: {
    width: wp(55),
    backgroundColor: '#FFFFFF',
    borderRightWidth: 0.5,
    borderColor: '#ffffff',
  },

  /* 시간표 */
  row: {
    flexDirection: 'row',
    height: hp(50),
  },

  timeText: {
    width: wp(55),
    textAlign: 'center',
    fontSize: wp(11),
    color: '#5b5f67',
    paddingTop: hp(6),
    backgroundColor: '#ffffff',
  },

  cell: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 0.3,
    borderColor: '#E2E5E9',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cellIcon: {
    width: wp(20),
    height: wp(20),
    resizeMode: 'contain',
  },

  /* 주말 컬럼 회색 */
  weekendCell: {
    backgroundColor: '#F1F3F5',
  },

  activeCell: {
    backgroundColor: '#19C2B3',
  },

  plusIcon: {
    width: wp(16),
    height: wp(16),
    resizeMode: 'contain',
  },
});

export default styles;
