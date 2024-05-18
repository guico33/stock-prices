import dayjs, { Dayjs } from 'dayjs';

export const formatDateApi = (date: Date | Dayjs | string | number) =>
  dayjs(date).format('YYYY-MM-DD');

export const formatDateReadable = (date: Date | Dayjs | string | number) =>
  dayjs(date).format('DD/MM/YYYY');

export const getDiffDays = (
  date1: Date | Dayjs | string | number,
  date2: Date | Dayjs | string | number,
) => {
  const date1Obj = dayjs(date1);
  const date2Obj = dayjs(date2);
  const earlierDate = date1Obj.isBefore(date2Obj) ? date1Obj : date2Obj;
  const laterDate = date1Obj.isBefore(date2Obj) ? date2Obj : date1Obj;
  return laterDate.diff(earlierDate, 'day');
};
