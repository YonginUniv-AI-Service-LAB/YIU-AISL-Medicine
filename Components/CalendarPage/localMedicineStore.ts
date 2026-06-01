import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'localMedicines';

export type LocalMedicine = {
  id: number;
  name: string;
  startDate?: string;
  endDate?: string;
  schedules: { dayOfWeek: number; intakeTime: string }[];
  category?: string;
  caution?: string;
  dailyDoseCount?: number;
  durationDays?: number;
  totalQuantity?: number;
};

let store: LocalMedicine[] = [];

const persist = async (medicines: LocalMedicine[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
  } catch (e) {
    console.log('[LocalStore] 저장 실패', e);
  }
};

export const loadLocalMedicines = async (): Promise<void> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      store = JSON.parse(raw);
      console.log('[LocalStore] 불러옴:', store.length, '개', store.map(m => m.name));
    }
  } catch (e) {
    console.log('[LocalStore] 불러오기 실패', e);
  }
};

export const addLocalMedicine = (med: LocalMedicine) => {
  store = [...store.filter((m) => m.id !== med.id), med];
  console.log('[LocalStore] 저장:', med.name, 'id:', med.id, '| 전체:', store.length, '개');
  persist(store);
};

export const removeLocalMedicine = (id: number) => {
  store = store.filter((m) => m.id !== id);
  persist(store);
};

export const getLocalMedicines = () => store;
