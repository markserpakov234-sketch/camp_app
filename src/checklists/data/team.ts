import type { ChecklistSection } from '../types';

const team: ChecklistSection = {
  id: 'team',
  title: 'Команда',
  subtitle: 'Взаимодействие с коллегами',
  checklists: [
    {
      id: 'interaction',
      title: 'Работа в команде',
      items: [
        'Договориться о ролях',
        'Поддерживать коллег',
        'Обсуждать сложности сразу',
      ],
    },
  ],
};

export default team;
