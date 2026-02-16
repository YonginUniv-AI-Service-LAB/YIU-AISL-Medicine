import React, { createContext, useContext, useState } from 'react';

type Schedule = {
  dayIndex: number;
  hourIndex: number;
};

type ScheduleContextType = {
  schedules: Schedule[];
  addSchedules: (newSchedules: Schedule[]) => void;
};

const ScheduleContext = createContext<ScheduleContextType>({
  schedules: [],
  addSchedules: () => {},
});

export const ScheduleProvider = ({ children }: any) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // ⭐ 여러개 추가 (덮어쓰기 아님, 누적)
  const addSchedules = (newSchedules: Schedule[]) => {
    setSchedules((prev) => {
      const merged = [...prev, ...newSchedules];

      // 중복 제거
      const unique = merged.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (s) =>
              s.dayIndex === item.dayIndex && s.hourIndex === item.hourIndex,
          ),
      );

      return unique;
    });
  };

  return (
    <ScheduleContext.Provider value={{ schedules, addSchedules }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => useContext(ScheduleContext);
