type MedicineStatus = 'done' | 'before' | 'missed';

let store: { id: string; status: MedicineStatus }[] = [];
let storeDate = '';

export const setTodayMedicines = (
  meds: { id: any; status?: any }[],
  date: string,
) => {
  store = meds.map((m) => ({
    id: String(m.id),
    status: (m.status ?? 'before') as MedicineStatus,
  }));
  storeDate = date;
};

export const getTodayMedicineCounts = (date: string) => {
  if (storeDate !== date || store.length === 0) {
    return { taken: 0, missed: 0, before: 0, hasData: false };
  }
  let taken = 0, missed = 0, before = 0;
  store.forEach((m) => {
    if (m.status === 'done') taken++;
    else if (m.status === 'missed') missed++;
    else before++;
  });
  return { taken, missed, before, hasData: true };
};
