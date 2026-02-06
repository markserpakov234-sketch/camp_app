import type { ChecklistSection } from '../types';

const state: ChecklistSection = {
  id: 'state',
  title: 'Состояние вожатого',
  subtitle: 'Внутренний фокус и контроль',
  checklists: [
    {
      id: 'self-check',
      title: 'Самопроверка',
      items: [
        'Я спокоен',
        'Я внимателен к детям',
        'Я держу границы',
      ],
    },
  ],
};

export default state;
