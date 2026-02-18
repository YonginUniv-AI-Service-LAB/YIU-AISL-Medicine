export type MedicineSchedule = {
  id: string;
  name: string;
  category: string;
  count: number;
  times: string[];
  days: string[];
  period?: number;
  remain?: number;
  memo?: string;
  date: string;

  // 🔥 기존 taken 삭제
  status: 'before' | 'done' | 'missed';
};
