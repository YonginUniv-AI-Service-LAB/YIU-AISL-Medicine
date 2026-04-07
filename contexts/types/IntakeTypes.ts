import { BackendMedicineStatus } from './MedicineDailyItem';

export interface IndividualIntake {
  intakeId: number;
  medicineId: number;
  medicineName: string;
  category: string;
  scheduledTime: string; // "09:00"
  status: BackendMedicineStatus; // "TAKEN" | "BEFORE" | "NOT_TAKEN"
}

export interface IntakeSummaryResponse {
  date: string; // "2026-02-12"
  totalCount: number;
  takenCount: number;
  missedCount: number;
  beforeCount: number;
  takenRate: number; // 0 ~ 100
  missedRate: number; // 0 ~ 100
  beforeRate: number; // 0 ~ 100
  intakes: IndividualIntake[];
}
