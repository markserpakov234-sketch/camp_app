import type { ChecklistSection } from '../types';

const day: ChecklistSection = {
  id: 'day',
  title: 'Чеклист дня',
  subtitle: 'Основные действия в течение дня',
  checklists: [
    {
      id: 'morning',
      title: 'Утро',
      description: 'Подготовка к началу дня',
      items: [
        'Проверить внешний вид',
        'Проверить план дня',
        'Настроиться на работу с детьми',
      ],
    },
  ],
};

export default day;
