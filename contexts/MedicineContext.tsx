import React, { createContext, useContext, useState } from 'react';

export type MedicineStatus = 'before' | 'done' | 'missed';

export interface MedicineSchedule {
  id: string;
  name: string;
  category?: string;
  count?: number;
  times: string[];
  days?: string[];
  period?: number;
  remain?: number;
  memo?: string;
  date: string;
  status: MedicineStatus;
}

interface MedicineContextType {
  medicines: MedicineSchedule[];
  addMedicine: (item: MedicineSchedule) => void;
  updateStatus: (id: string, status: MedicineStatus) => void;
  removeMedicine: (id: string) => void;
}

const MedicineContext = createContext<MedicineContextType | null>(null);

export const MedicineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [medicines, setMedicines] = useState<MedicineSchedule[]>([]);

  const addMedicine = (item: MedicineSchedule) => {
    setMedicines((prev) => [...prev, item]);
  };

  const updateStatus = (id: string, status: MedicineStatus) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m)),
    );
  };

  const removeMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <MedicineContext.Provider
      value={{ medicines, addMedicine, updateStatus, removeMedicine }}
    >
      {children}
    </MedicineContext.Provider>
  );
};

export const useMedicine = () => {
  const context = useContext(MedicineContext);
  if (!context) throw new Error('MedicineProvider 안에서 사용해야 합니다');
  return context;
};
