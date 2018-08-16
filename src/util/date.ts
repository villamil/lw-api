export class DateUtil {

  static addDaysTo(date: Date, days: number): Date {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }
}