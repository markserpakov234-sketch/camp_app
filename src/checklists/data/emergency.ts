import type { ChecklistSection } from '../types';

const emergency: ChecklistSection = {
  id: 'emergency',
  title: 'Экстренные ситуации',
  subtitle: 'Когда что-то пошло не так',
  checklists: [
    {
      id: 'critical',
      title: 'Критическая ситуация',
      items: [
        'Обеспечить безопасность детей',
        'Сообщить старшему',
        'Следовать инструкции',
      ],
    },
  ],
};

export default emergency;
