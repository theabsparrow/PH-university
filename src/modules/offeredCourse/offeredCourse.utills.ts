import { TSchedule } from './offeredCourse.interface';

export const hasTimeConflict = (
  assignedSchedule: TSchedule[],
  newSchedule: TSchedule
) => {
  for (const schedule of assignedSchedule) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const currentStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const currentEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);
    if (
      currentStartTime < existingEndTime &&
      currentEndTime > existingStartTime
    ) {
      return true;
    }
    return false;
  }
};
