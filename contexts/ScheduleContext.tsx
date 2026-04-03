import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

export type Schedule = {
  medicineId: string;
  dayIndex: number;
  hourIndex: number;
};

type ScheduleContextType = {
  schedules: Schedule[];
  addSchedules: (newSchedules: Schedule[]) => void;
  removeSchedulesByMedicineId: (medicineId: string) => void;
  fetchWeeklyCalendar: (userId: number, date?: string) => Promise<void>;
};

const ScheduleContext = createContext<ScheduleContextType>({
  schedules: [],
  addSchedules: () => {},
  removeSchedulesByMedicineId: () => {},
  fetchWeeklyCalendar: async () => {},
});

export const ScheduleProvider = ({ children }: any) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const fetchWeeklyCalendar = async (userId: number, date?: string) => {
    try {
      let url = `http://localhost:8080/users/${userId}/calendar/weekly`;
      if (date) {
        url += `?date=${date}`;
      }

      const response = await axios.get(url);
      const responseData = response.data.data;

      if (!responseData || !responseData.calendar) {
        return;
      }

      const mappedSchedules: Schedule[] = [];

      responseData.calendar.forEach((day: any) => {
        const dateObj = new Date(day.date);
        const dayIndex = dateObj.getDay();

        day.medicines.forEach((medicine: any) => {
          const medicineId = String(medicine.medicineId);

          medicine.intakeTimes.forEach((timeStr: string) => {
            const hourIndex = parseInt(timeStr.split(':')[0], 10);

            if (hourIndex >= 7 && hourIndex <= 21) {
              mappedSchedules.push({
                medicineId,
                dayIndex,
                hourIndex
              });
            }
          });
        });
      });

      setSchedules(mappedSchedules);

    } catch (error) {
      console.error(error);
    }
  };

  const addSchedules = (newSchedules: Schedule[]) => {
    setSchedules((prev) => {
      const merged = [...prev, ...newSchedules];
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

  const removeSchedulesByMedicineId = (medicineId: string) => {
    setSchedules((prev) => prev.filter((s) => s.medicineId !== medicineId));
  };

  return (
    <ScheduleContext.Provider
      value={{ schedules, addSchedules, removeSchedulesByMedicineId, fetchWeeklyCalendar }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => useContext(ScheduleContext);

