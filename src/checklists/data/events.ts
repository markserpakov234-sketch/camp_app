import type { ChecklistSection } from '../types';

const events: ChecklistSection = {
  id: 'events',
  title: 'Мероприятия',
  subtitle: 'Подготовка и проведение',
  checklists: [
    {
      id: 'before-event',
      title: 'Перед мероприятием',
      items: [
        'Понять цель мероприятия',
        'Подготовить реквизит',
        'Проверить место проведения',
      ],
    },
  ],
};

export default events;
