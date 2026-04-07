export const DAYS: string[] = ['일', '월', '화', '수', '목', '금', '토'];

const fullHours = Array.from({ length: 24 }, (_, i) => {
  const hour12 = i % 12 === 0 ? 12 : i % 12;
  const period = i < 12 ? 'AM' : 'PM';
  return `${hour12}${period}`;
});

// 7AM index = 7
export const HOURS = [
  ...fullHours.slice(7), // 7AM ~ 11PM
  ...fullHours.slice(0, 7), // 12AM ~ 6AM (맨 아래로 이동)
];
