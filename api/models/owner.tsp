model Owner {
  id: string;
  email: string;
  username: string;
  description?: string | null;
  workTimeStart: Time;
  workTimeEnd: Time;
  workDays: DayOfWeek[];
}