export interface MedicineInfo {
  id: number;
  name: string;
  category: string;
  dailyDoseCount: number;
  startDate: string; // yyyy-MM-dd
  endDate: string; // yyyy-MM-dd
  daysOfWeek: number[]; // [1, 3, 5]
  caution: string;
}

export type BackendMedicineStatus = 'BEFORE' | 'TAKEN' | 'NOT_TAKEN';
export type FrontendMedicineStatus = 'before' | 'done' | 'missed';

export interface DailyMedicineResponse {
  scheduleId: number;
  intakeId?: number; // Backend may provide intakeId for status updates
  scheduledTime: string; // "07:00"
  status: BackendMedicineStatus;
  takenAt: string | null; // "2026-02-12T07:03:22"
  medicine: MedicineInfo;
}

export interface MappedMedicineItem {
  scheduleId: number;
  intakeId?: number; // Consistent with the response
  scheduledTime: string;
  status: FrontendMedicineStatus;
  takenAt: string | null;
  medicine: MedicineInfo;
}
