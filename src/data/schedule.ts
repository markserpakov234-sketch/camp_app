export type ScheduleEvent = {
  time: string;
  title: string;
  squads: string[]; // для каких отрядов
};

export const schedule: ScheduleEvent[] = [
  {
    time: '09:00',
    title: 'Завтрак',
    squads: ['11', '12', '21', '22'],
  },
  {
    time: '10:00',
    title: 'Экскурсия',
    squads: ['11'],
  },
  {
    time: '10:00',
    title: 'Игры на улице',
    squads: ['12', '21'],
  },
  {
    time: '11:30',
    title: 'Бассейн',
    squads: ['11', '12'],
  },
];
