import React, { createContext, useContext, useState } from 'react';

export type Schedule = {
  medicineId: string; // ⭐ 약과 연결
  dayIndex: number;
  hourIndex: number;
};

type ScheduleContextType = {
  schedules: Schedule[];
  addSchedules: (newSchedules: Schedule[]) => void;
  removeSchedulesByMedicineId: (medicineId: string) => void; // ⭐ 삭제용
};

const ScheduleContext = createContext<ScheduleContextType>({
  schedules: [],
  addSchedules: () => {},
  removeSchedulesByMedicineId: () => {},
});

export const ScheduleProvider = ({ children }: any) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // 일정 추가
  const addSchedules = (newSchedules: Schedule[]) => {
    setSchedules((prev) => {
      const merged = [...prev, ...newSchedules];

      // 중복 제거
      const unique = merged.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (s) =>
              s.dayIndex === item.dayIndex &&
              s.hourIndex === item.hourIndex &&
              s.medicineId === item.medicineId,
          ),
      );

      return unique;
    });
  };

  // ⭐ 약 삭제시 캘린더도 삭제
  const removeSchedulesByMedicineId = (medicineId: string) => {
    setSchedules((prev) => prev.filter((s) => s.medicineId !== medicineId));
  };

  return (
    <ScheduleContext.Provider
      value={{ schedules, addSchedules, removeSchedulesByMedicineId }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => useContext(ScheduleContext);
