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
  // API에서 불러온 약 일정 전체를 덮어쓸 때 사용 (MedicinePage → CalendarPage 동기화)
  syncSchedules: (newSchedules: Schedule[]) => void;
};

const ScheduleContext = createContext<ScheduleContextType>({
  schedules: [],
  addSchedules: () => {},
  removeSchedulesByMedicineId: () => {},
  syncSchedules: () => {},
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

  // API 약 목록을 불러올 때 캘린더 일정 전체를 덮어씀 (MedicinePage에서 호출)
  const syncSchedules = (newSchedules: Schedule[]) => {
    setSchedules(newSchedules);
  };

  return (
    <ScheduleContext.Provider
      value={{ schedules, addSchedules, removeSchedulesByMedicineId, syncSchedules }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => useContext(ScheduleContext);
