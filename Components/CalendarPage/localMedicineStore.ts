// 서버 GET 버그 우회용 메모리 캐시
// — POST 성공 후 즉시 저장, 앱 재시작 전까지 유지
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

export const addLocalMedicine = (med: LocalMedicine) => {
  store = [...store.filter((m) => m.id !== med.id), med];
  console.log('[LocalStore] 저장:', med.name, 'id:', med.id, '| 전체:', store.length, '개');
};

export const removeLocalMedicine = (id: number) => {
  store = store.filter((m) => m.id !== id);
};

export const getLocalMedicines = () => store;
